'use client';

import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Avatar,
  Badge,
  Button,
  Link,
  Tooltip,
  Spinner,
  cn,
} from '@nextui-org/react';
import { useClipboard } from '@nextui-org/use-clipboard';
import { Icon } from '@iconify/react';
import { MessagePayload, StreamMessage } from '@openassistant/core';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MessageCardProps = HTMLAttributes<HTMLDivElement> & {
  index: number;
  avatar?: ReactNode | string;
  showFeedback?: boolean;
  message?: StreamMessage;
  customMessage?: MessagePayload;
  currentAttempt?: number;
  status?: 'success' | 'failed' | 'pending';
  attempts?: number;
  messageClassName?: string;
  botMessageBackground?: string;
  onAttemptChange?: (attempt: number) => void;
  onMessageCopy?: (content: string | string[]) => void;
  onFeedback?: (index: number) => void;
  onAttemptFeedback?: (feedback: 'like' | 'dislike' | 'same') => void;
  githubIssueLink?: string;
  isMessageDraggable?: boolean;
};

const AvatarBadge = ({
  avatar,
  hasFailed,
}: {
  avatar: ReactNode | string;
  hasFailed: boolean;
}) => (
  <Badge
    isOneChar
    color="danger"
    content={
      <Icon
        className="text-background"
        icon="gravity-ui:circle-exclamation-fill"
      />
    }
    isInvisible={!hasFailed}
    placement="bottom-right"
    shape="circle"
  >
    {typeof avatar === 'string' ? (
      <Avatar showFallback src={avatar} />
    ) : (
      <Avatar showFallback icon={avatar} />
    )}
  </Badge>
);

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

const MarkdownContent = ({ text, showMarkdown = true }: { text?: string; showMarkdown?: boolean }) => {
  if (!showMarkdown) {
    return <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words">{text}</div>;
  }

  return (
    <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words">
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

const MessageCard = forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      index,
      avatar,
      message,
      customMessage,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      status,
      onMessageCopy,
      onAttemptChange,
      onFeedback,
      onAttemptFeedback,
      messageClassName,
      githubIssueLink,
      isMessageDraggable = false,
      ...props
    },
    ref
  ) => {
    const [feedback, setFeedback] = useState<'like' | 'dislike'>();
    const [attemptFeedback, setAttemptFeedback] = useState<
      'like' | 'dislike' | 'same'
    >();

    const messageRef = useRef<HTMLDivElement>(null);

    const { copied, copy } = useClipboard();

    const failedMessageClassName =
      status === 'failed'
        ? 'bg-danger-100/50 border border-danger-100 text-foreground'
        : '';

    const hasFailed = status === 'failed';

    const handleCopy = useCallback(() => {
      let stringValue = '';

      if (typeof message === 'string') {
        stringValue = message;
      } else if (Array.isArray(message)) {
        message.forEach((child) => {
          const childString =
            typeof child === 'string'
              ? child
              : child?.props?.children?.toString();

          if (childString) {
            stringValue += childString + '\n';
          }
        });
      }

      const valueToCopy = stringValue || messageRef.current?.textContent || '';

      copy(valueToCopy);

      onMessageCopy?.(valueToCopy);
    }, [copy, message, onMessageCopy]);

    const handleFeedback = useCallback(
      (index: number, liked: boolean) => {
        setFeedback(liked ? 'like' : 'dislike');
        if (liked === false) {
          onFeedback?.(index);
        }
      },
      [onFeedback]
    );

    const handleAttemptFeedback = useCallback(
      (feedback: 'like' | 'dislike' | 'same') => {
        setAttemptFeedback(feedback);

        onAttemptFeedback?.(feedback);
      },
      [onAttemptFeedback]
    );

    const onMessageDragStart = (
      e: React.DragEvent<HTMLButtonElement>,
      index: number,
      message?: StreamMessage
    ) => {
      // when message is string
      if (typeof message === 'string') {
        e.dataTransfer.setData(
          'text/plain',
          JSON.stringify({
            id: `message-${index}`,
            type: 'text',
            data: message,
          })
        );
      }
    };

    return (
      <div {...props} ref={ref} className="flex gap-3">
        <div className="relative flex-none">
          <AvatarBadge avatar={avatar} hasFailed={hasFailed} />
        </div>
        <div className="flex w-full flex-col gap-4 overflow-x-auto">
          <div
            className={cn(
              'group relative w-full rounded-medium px-4 py-3',
              failedMessageClassName,
              messageClassName
            )}
          >
            <div
              ref={messageRef}
              className="min-h-8 whitespace-pre-line max-w-full"
            >
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
                <div
                  className="flex flex-col gap-2"
                  key={`${toolCallMessage.toolCallId}-${i}`}
                >
                  <div className="text-sm text-gray-500">
                    {toolCallMessage.text}
                    {toolCallMessage.reason}
                  </div>
                  <div>{toolCallMessage.element}</div>
                </div>
              ))}
              <MarkdownContent text={message?.text} />
              {/* show custom message */}
              {/* {customMessage && isValidElement(customMessage) && (
                <>{customMessage}</>
              )} */}
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
            <div
              className={`opacity-0 group-hover:opacity-100 absolute right-2 top-2 flex rounded-full shadow-small bg-content2`}
            >
              {showFeedback && !hasFailed && status !== 'pending' && (
                <div className="">
                  <Tooltip content="Drag to move">
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      data-testid="drag-button"
                      draggable={isMessageDraggable}
                      onDragStart={(e) => onMessageDragStart(e, index, message)}
                    >
                      <Icon
                        className="text-gray-600 dark:text-gray-400"
                        icon="basil:move-outline"
                      />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Copy Text">
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={handleCopy}
                      data-testid="copytext-button"
                    >
                      {copied ? (
                        <Icon
                          className="text-gray-600 dark:text-gray-400"
                          icon="gravity-ui:check"
                        />
                      ) : (
                        <Icon
                          className="text-gray-600 dark:text-gray-400"
                          icon="gravity-ui:copy"
                        />
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip content="Feedback">
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => handleFeedback(index, false)}
                      data-testid="feedback-button"
                    >
                      {feedback === 'dislike' ? (
                        <Icon
                          className="text-gray-600 dark:text-gray-400"
                          icon="gravity-ui:thumbs-down-fill"
                        />
                      ) : (
                        <Icon
                          className="text-gray-600 dark:text-gray-400"
                          icon="gravity-ui:thumbs-down"
                        />
                      )}
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
            {attempts > 1 && !hasFailed && (
              <div className="flex w-full items-center justify-end">
                <Button
                  onPress={() =>
                    onAttemptChange?.(
                      currentAttempt > 1 ? currentAttempt - 1 : 1
                    )
                  }
                  data-testid="previous-button"
                >
                  <Icon
                    className="cursor-pointer text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500"
                    icon="gravity-ui:circle-arrow-left"
                  />
                </Button>
                <Button
                  onPress={() =>
                    onAttemptChange?.(
                      currentAttempt < attempts ? currentAttempt + 1 : attempts
                    )
                  }
                  data-testid="next-button"
                >
                  <Icon
                    className="cursor-pointer text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500"
                    icon="gravity-ui:circle-arrow-right"
                  />
                </Button>
                <p className="px-1 text-tiny font-medium text-gray-500 dark:text-gray-400">
                  {currentAttempt}/{attempts}
                </p>
              </div>
            )}
          </div>
          {showFeedback && attempts > 1 && (
            <div className="flex items-center justify-between rounded-medium border-small border-default-100 px-4 py-3 shadow-small">
              <p className="text-tiny text-gray-600 dark:text-gray-400">
                Was this response better or worse?
              </p>
              <div className="flex gap-1">
                <Tooltip content="Better">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback('like')}
                    data-testid="better-button"
                  >
                    {attemptFeedback === 'like' ? (
                      <Icon
                        className="text-primary"
                        icon="gravity-ui:thumbs-up-fill"
                      />
                    ) : (
                      <Icon
                        className="text-gray-600 dark:text-gray-400"
                        icon="gravity-ui:thumbs-up"
                      />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Worse">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback('dislike')}
                  >
                    {attemptFeedback === 'dislike' ? (
                      <Icon
                        className="text-gray-600 dark:text-gray-400"
                        icon="gravity-ui:thumbs-down-fill"
                      />
                    ) : (
                      <Icon
                        className="text-gray-600 dark:text-gray-400"
                        icon="gravity-ui:thumbs-down"
                      />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Same">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback('same')}
                  >
                    {attemptFeedback === 'same' ? (
                      <Icon
                        className="text-danger"
                        icon="gravity-ui:face-sad"
                      />
                    ) : (
                      <Icon
                        className="text-gray-600 dark:text-gray-400"
                        icon="gravity-ui:face-sad"
                      />
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MessageCard;

MessageCard.displayName = 'MessageCard';
