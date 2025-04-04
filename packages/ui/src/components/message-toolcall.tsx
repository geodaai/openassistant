import {
  ToolCallMessage,
  ToolCallComponents,
  StreamMessagePart,
} from '@openassistant/core';
import React, { ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import {
  Accordion,
  AccordionItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableColumn,
  Card,
  CardBody,
} from '@nextui-org/react';

const MarkdownContent = ({
  text,
  showMarkdown = true,
}: {
  text?: string;
  showMarkdown?: boolean;
}) => {
  if (!showMarkdown) {
    return (
      <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words">
        {text}
      </div>
    );
  }

  return (
    <div className="markdown-body max-w-full overflow-hidden whitespace-pre-wrap break-words">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre className="max-w-full overflow-x-auto">{children}</pre>
          ),
          code: ({ children }) => (
            <code className="max-w-full overflow-x-auto">{children}</code>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
};

class ToolCallErrorBoundary extends React.Component<
  { children: ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Tool call component error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-sm text-danger">
          Failed to render tool component. Please try again or contact support.
        </div>
      );
    }

    return this.props.children;
  }
}

export function PartComponent({
  part,
  components,
  useMarkdown,
}: {
  part: StreamMessagePart;
  components?: ToolCallComponents;
  useMarkdown?: boolean;
}) {
  if (part.type === 'text') {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm">
          {useMarkdown ? <MarkdownContent text={part.text} /> : part.text}
        </div>
      </div>
    );
  } else if (part.type === 'tool') {
    return (
      <>
        {part.toolCallMessages.map((toolCallMessage) => (
          <ToolCallComponent
            key={toolCallMessage.toolCallId}
            toolCallMessage={toolCallMessage}
            components={components}
          />
        ))}
      </>
    );
  }
  return null;
}

export function ToolCallComponent({
  toolCallMessage,
  components,
}: {
  toolCallMessage: ToolCallMessage;
  components?: ToolCallComponents;
}) {
  const { toolName, additionalData, text, args, llmResult, isCompleted } =
    toolCallMessage;

  const Component = components?.find(
    (component) => component.toolName === toolName
  )?.component;

  // check if toolCallMessage.args has a property called 'reason'
  const reason = toolCallMessage.args?.reason as string;
  const llmResultTable = llmResult as Record<string, unknown> | undefined;
  const tableItems = llmResultTable
    ? Object.entries(llmResultTable).map(([key, value]) => ({
        key,
        value:
          typeof value === 'object' ? JSON.stringify(value) : String(value),
      }))
    : [];

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardBody>
          <Accordion
            variant="light"
            isCompact={true}
            itemClasses={{
              title: 'text-tiny',
              content: 'text-tiny',
            }}
          >
            <AccordionItem
              key="1"
              aria-label={toolName}
              title={`> call ${toolName} ${isCompleted ? '✅' : '⏳'}`}
            >
              <div className="flex flex-col gap-1 p-4">
                <div className="text-tiny font-bold">function call:</div>
                <div className="font-mono text-tiny pl-4">
                  <span>{toolName}</span>
                  <span>(</span>
                  {Object.entries(args).map(([key, value], index, array) => (
                    <span key={key}>
                      <span className="text-blue-600">{key}</span>
                      <span>: </span>
                      <span>
                        {typeof value === 'object' && value !== null
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                      {index < array.length - 1 && (
                        <span className="text-gray-400">, </span>
                      )}
                    </span>
                  ))}
                  <span className="text-gray-400">)</span>
                </div>
              </div>
              {llmResultTable && (
                <div className="flex flex-col gap-1 p-4">
                  <div className="text-tiny font-bold">result:</div>
                  <Table aria-label="LLM result table" hideHeader isCompact>
                    <TableHeader>
                      <TableColumn>Key</TableColumn>
                      <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody items={tableItems}>
                      {(item) => (
                        <TableRow key={item.key}>
                          <TableCell>{item.key}</TableCell>
                          <TableCell>{item.value}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              {text}
              {reason && <span>{reason}</span>}
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
      {Component && (
        <ToolCallErrorBoundary>
          {typeof Component === 'function' ? (
            <Component {...(additionalData as Record<string, unknown>)} />
          ) : (
            Component
          )}
        </ToolCallErrorBoundary>
      )}
    </div>
  );
}
