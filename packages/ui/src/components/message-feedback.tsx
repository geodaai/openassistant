// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

export const AttemptsNavigation = ({
  currentAttempt,
  attempts,
  onAttemptChange,
}: {
  currentAttempt: number;
  attempts: number;
  onAttemptChange?: (attempt: number) => void;
}) => (
  <div className="flex w-full items-center justify-end">
    <Button
      onPress={() =>
        onAttemptChange?.(currentAttempt > 1 ? currentAttempt - 1 : 1)
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
);

export const AttemptFeedback = ({
  onAttemptFeedback,
  attemptFeedback,
}: {
  onAttemptFeedback: (feedback: 'like' | 'dislike' | 'same') => void;
  attemptFeedback?: 'like' | 'dislike' | 'same';
}) => (
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
          onPress={() => onAttemptFeedback('like')}
          data-testid="better-button"
        >
          {attemptFeedback === 'like' ? (
            <Icon className="text-primary" icon="gravity-ui:thumbs-up-fill" />
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
          onPress={() => onAttemptFeedback('dislike')}
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
          onPress={() => onAttemptFeedback('same')}
        >
          {attemptFeedback === 'same' ? (
            <Icon className="text-danger" icon="gravity-ui:face-sad" />
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
);
