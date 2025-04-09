import { Spinner, Link } from '@nextui-org/react';
import {
  MessagePayload,
  StreamMessage,
  ToolCallComponents,
} from '@openassistant/core';
import { MarkdownContent, PartComponent } from './message-toolcall';

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
    <div style={{ paddingRight: '30px' }}>
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
        {message?.parts?.map((part, i) => (
          <PartComponent
            key={`${part.type}-${i}`}
            part={part}
            components={components}
            useMarkdown={useMarkdown}
          />
        ))}

        {/* show markdown message */}
        {!message?.parts &&
          message?.text &&
          (useMarkdown ? (
            <MarkdownContent text={message.text} />
          ) : (
            <div>{message.text}</div>
          ))}
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
    </div>
  );
}
