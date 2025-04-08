'use client';

import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { cn } from '@nextui-org/react';
import { useClipboard } from '@nextui-org/use-clipboard';
import {
  MessagePayload,
  StreamMessage,
  ToolCallComponents,
} from '@openassistant/core';
import { AvatarBadge } from './avatar-badge';
import { MessageContent } from './message-content';
import { MessageActions } from './message-action';
import { AttemptsNavigation, AttemptFeedback } from './message-feedback';
// local css for markdown
import './assistant.css';

export type MessageCardProps = HTMLAttributes<HTMLDivElement> & {
  index: number;
  avatar?: ReactNode | string;
  showFeedback?: boolean;
  message?: StreamMessage;
  components?: ToolCallComponents;
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
  useMarkdown?: boolean;
};

const MessageCard = forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      index,
      avatar,
      message,
      components,
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
      useMarkdown = true,
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

    return (
      <div {...props} ref={ref} className="flex gap-3">
        <div className="relative flex-none">
          <AvatarBadge avatar={avatar} hasFailed={hasFailed} />
        </div>
        <div className="flex w-full flex-col gap-4 overflow-x-auto relative">
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
              <MessageContent
                customMessage={customMessage}
                hasFailed={hasFailed}
                githubIssueLink={githubIssueLink}
                message={message}
                components={components}
                status={status}
                useMarkdown={useMarkdown}
              />
            </div>
            <div
              className={
                'opacity-0 group-hover:opacity-100 absolute right-2 top-1 flex rounded-full shadow-small bg-content2'
              }
            >
              {showFeedback && !hasFailed && status !== 'pending' && (
                <MessageActions
                  isMessageDraggable={isMessageDraggable}
                  index={index}
                  message={message}
                  handleCopy={handleCopy}
                  handleFeedback={handleFeedback}
                  copied={copied}
                  feedback={feedback}
                />
              )}
            </div>
            {attempts > 1 && !hasFailed && (
              <AttemptsNavigation
                currentAttempt={currentAttempt}
                attempts={attempts}
                onAttemptChange={onAttemptChange}
              />
            )}
          </div>
          {showFeedback && attempts > 1 && (
            <AttemptFeedback
              onAttemptFeedback={handleAttemptFeedback}
              attemptFeedback={attemptFeedback}
            />
          )}
        </div>
      </div>
    );
  }
);

export default MessageCard;

MessageCard.displayName = 'MessageCard';
