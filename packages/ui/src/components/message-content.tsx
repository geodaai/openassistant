import { Spinner, Spacer, Link } from '@nextui-org/react';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import {
  MessagePayload,
  StreamMessage,
  ToolCallComponents,
} from '@openassistant/core';
import { ToolCallComponent } from './message-toolcall';

const FailedMessage = ({ githubIssueLink }: { githubIssueLink?: string }) => (
  <p className="mb-2" data-testid="failed-message">
    Sorry, something went wrong. If the issue persists please contact us through
    &nbsp;
    <Link target="_blank" href={githubIssueLink} size="sm">
      Github
    </Link>
  </p>
);

const ScreenshotImage = ({ customMessage }: { customMessage: string }) => (
  <img
    className="h-14 w-14 rounded-small border-small border-default-200/50 object-cover"
    src={customMessage}
    alt="screenshot"
  />
);

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

type MessageContentProps = {
  customMessage?: MessagePayload;
  hasFailed: boolean;
  githubIssueLink?: string;
  message?: StreamMessage;
  status?: 'success' | 'failed' | 'pending';
  useMarkdown?: boolean;
  components?: ToolCallComponents;
};

export function MessageContent({
  customMessage,
  hasFailed,
  githubIssueLink,
  message,
  status,
  useMarkdown,
  components,
}: MessageContentProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* show screenshot image */}
        {customMessage &&
          typeof customMessage === 'string' &&
          customMessage.startsWith('data:image') && (
            <ScreenshotImage customMessage={customMessage} />
          )}

        {/* show error message if any */}
        {hasFailed && <FailedMessage githubIssueLink={githubIssueLink} />}

        {/* show tool call messages */}
        {message?.toolCallMessages?.map((toolCallMessage, i) => (
          <ToolCallComponent
            key={`${toolCallMessage.toolCallId}-${i}`}
            toolCallMessage={toolCallMessage}
            components={components}
          />
        ))}

        {/* show markdown message */}
        {useMarkdown ? <MarkdownContent text={message?.text} /> : message?.text}
      </div>

      {/* show loading spinner */}
      {status === 'pending' && (
        <Spinner
          color="default"
          size="sm"
          className="p-2"
          data-testid="spinner-icon"
        />
      )}
    </>
  );
}
