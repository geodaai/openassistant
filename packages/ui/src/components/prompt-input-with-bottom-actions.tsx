import React, { useCallback, useEffect, useState } from 'react';
import { Button, Tooltip, ScrollShadow, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';

import PromptInput from './prompt-input';
import VoiceChatButton from './voice-chat-button';

type PromptInputWithBottomActionsProps = {
  ideas?: {
    title: string;
    description: string;
    icon?: string;
    context?: string;
    callback?: () => void;
  }[];
  /**
   * Callback function triggered to refresh the list of ideas.
   */
  onRefreshIdeas?: () => void;
  onSendMessage: (message: string) => void;
  onVoiceMessage: (voice: Blob) => Promise<string>;
  enableVoice?: boolean;
  enableScreenCapture?: boolean;
  onScreenshotClick?: () => void;
  onRemoveScreenshot?: () => void;
  enableAttachFile?: boolean;
  screenCaptured?: string;
  defaultPromptText?: string;
  status?: 'success' | 'failed' | 'pending';
  onStopChat?: () => void;
  onRestartChat?: () => void;
  fontSize?: string;
};

export default function Component({
  ideas,
  onSendMessage,
  onVoiceMessage,
  enableVoice,
  enableScreenCapture,
  onScreenshotClick,
  onRemoveScreenshot,
  enableAttachFile,
  screenCaptured,
  defaultPromptText,
  status,
  onStopChat,
  onRestartChat,
  fontSize,
  onRefreshIdeas,
}: PromptInputWithBottomActionsProps) {
  const [prompt, setPrompt] = useState<string>('');

  const onSendClick = useCallback(() => {
    onSendMessage(prompt);
    setPrompt('');
  }, [prompt, onSendMessage]);

  const onStopClick = () => {
    onStopChat?.();
  };

  const onRestartChatClick = () => {
    onRestartChat?.();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      if (prompt.length > 0) {
        onSendClick();
      }
      // prevent new line
      event.preventDefault();
    }
  };

  const onClickIdea = (index: number) => {
    const idea = ideas?.[index];
    if (idea) {
      const content = `${idea.description}`;
      setPrompt(content);
      if (idea.callback) {
        idea.callback();
      }
    }
  };

  const onRecordingComplete = async (voiceBlob: Blob) => {
    const voice = await onVoiceMessage(voiceBlob);
    setPrompt(voice);
  };

  // if screenCaptured is not empty and defaultPromptText is empty, send it
  useEffect(() => {
    if (
      screenCaptured &&
      screenCaptured.length > 0 &&
      defaultPromptText &&
      defaultPromptText.length > 0
    ) {
      onSendMessage(defaultPromptText);
      onRemoveScreenshot?.();
    }
  }, [
    screenCaptured,
    defaultPromptText,
    onSendClick,
    onSendMessage,
    onRemoveScreenshot,
  ]);

  return (
    <div className="flex w-full flex-col gap-2">
      <ScrollShadow
        hideScrollBar
        className="flex flex-nowrap gap-2"
        orientation="horizontal"
      >
        <div className="flex gap-2 items-center">
          {ideas?.map(({ title, description, icon, context }, index) => (
            <Tooltip content={description} key={index} size="sm" radius="none">
              <Button
                onPress={() => onClickIdea(index)}
                className="flex h-14 flex-col items-start gap-0 max-w-60"
              >
                <div className="flex items-center gap-2 flex-row">
                  {icon && (
                    <Icon
                      icon={icon}
                      width={12}
                      className={`${context} ? 'animate-ping':''`}
                    />
                  )}
                  <span>{title}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {description}
                </span>
              </Button>
            </Tooltip>
          ))}
          {ideas && ideas.length > 0 && (
            <Tooltip content="Refresh ideas" size="sm" radius="none">
              <Button
                onPress={() => onRefreshIdeas?.()}
                isIconOnly
                variant="light"
                size="sm"
              >
                <Icon
                  icon="mingcute:refresh-4-ai-line"
                  width="18"
                  height="18"
                />
              </Button>
            </Tooltip>
          )}
        </div>
      </ScrollShadow>
      <form className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        <div className="group flex gap-2 px-4 pt-4">
          {screenCaptured && screenCaptured.length > 0 && (
            <Badge
              isOneChar
              className="opacity-0 group-hover:opacity-100"
              content={
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  data-testid="removescreenshot-button"
                  onPress={onRemoveScreenshot}
                >
                  <Icon
                    className="text-foreground"
                    icon="iconamoon:close-thin"
                    width={16}
                  />
                </Button>
              }
            >
              <img
                className="h-14 w-14 rounded-small border-small border-default-200/50 object-cover"
                src={screenCaptured}
              />
            </Badge>
          )}
        </div>
        <PromptInput
          classNames={{
            inputWrapper: '!bg-transparent shadow-none',
            innerWrapper: 'relative',
            input: `pt-1 pl-2 pb-6 !pr-10 ${fontSize ?? 'text-sm'}`,
          }}
          endContent={
            <div className="flex items-end gap-2">
              <Tooltip
                showArrow
                content={status === 'pending' ? 'Stop chat' : 'Send message'}
              >
                <Button
                  isIconOnly
                  color={prompt || status === 'pending' ? 'primary' : 'default'}
                  isDisabled={!prompt && status !== 'pending'}
                  radius="lg"
                  size="sm"
                  variant="solid"
                  data-testid={
                    status === 'pending' ? 'stop-button' : 'send-button'
                  }
                  onPress={status === 'pending' ? onStopClick : onSendClick}
                >
                  <Icon
                    className={
                      '[&>path]:stroke-[2px] ' +
                      (prompt || status === 'pending'
                        ? 'text-primary-foreground'
                        : 'text-gray-800 dark:text-gray-100')
                    }
                    icon={
                      status === 'pending'
                        ? 'gravity-ui:stop'
                        : 'solar:arrow-up-linear'
                    }
                    width={20}
                  />
                </Button>
              </Tooltip>
            </div>
          }
          minRows={3}
          radius="lg"
          value={prompt}
          variant="flat"
          onValueChange={setPrompt}
          onKeyDown={onKeyDown}
          disabled={status === 'pending'}
        />
        <div className="flex w-full items-center justify-between gap-2 overflow-scroll px-4 pb-4">
          <div className="flex w-full gap-1 md:gap-3">
            {enableScreenCapture && (
              <Button
                size="sm"
                startContent={
                  <Icon
                    className="text-gray-500 dark:text-gray-400 min-w-4"
                    icon="solar:gallery-minimalistic-linear"
                    width={18}
                  />
                }
                variant="flat"
                onPress={onScreenshotClick}
                data-testid="screenshot-button"
              >
                Screenshot to Ask
              </Button>
            )}
            {enableVoice && (
              <VoiceChatButton onRecordingComplete={onRecordingComplete} />
            )}
            {enableAttachFile && (
              <>
                <Button
                  size="sm"
                  startContent={
                    <Icon
                      className="text-gray-500 dark:text-gray-400"
                      icon="solar:paperclip-linear"
                      width={18}
                    />
                  }
                  variant="flat"
                >
                  Attach
                </Button>
              </>
            )}
            <Tooltip content="Restart chat">
              <Button
                isIconOnly
                radius="full"
                size="sm"
                variant="light"
                onPress={onRestartChatClick}
                data-testid="restart-button"
              >
                <Icon
                  className="text-gray-600 dark:text-gray-400"
                  icon="lucide:list-restart"
                />
              </Button>
            </Tooltip>
          </div>
          <p className="py-1 text-tiny text-gray-400 dark:text-gray-600">
            {prompt.length}/2000
          </p>
        </div>
      </form>
    </div>
  );
}
