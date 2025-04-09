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
import { Icon } from '@iconify/react';

const MarkdownContent = ({
  text,
  showMarkdown = true,
}: {
  text?: string;
  showMarkdown?: boolean;
}) => {
  if (!showMarkdown) {
    return (
      <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words line-[0.5]">
        {text}
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre className="max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
              {children}
            </pre>
          ),
          code: ({ children }) => (
            <code className="max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm">
              {children}
            </code>
          ),
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold my-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold my-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold my-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol
              className="pl-6 ps-4 my-0 mb-5 flex flex-col gap-4"
              style={{ listStyleType: 'decimal', paddingLeft: '16px' }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className="m-0 ps-0 flex items-start relative"
              style={{ paddingLeft: '16px' }}
            >
              <span className="absolute left-0 top-0">•</span>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <table className="w-full border-collapse my-4">{children}</table>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
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
              title={`> ${toolName}`}
              startContent={
                !isCompleted && (
                  <Icon icon="svg-spinners:clock" width="12" height="12" />
                )
              }
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
