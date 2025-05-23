import type { TextAreaProps } from '@heroui/react';
import React from 'react';
import { Textarea } from '@heroui/react';

const PromptInput = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ classNames = {}, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        aria-label="Prompt"
        className="min-h-[40px]"
        classNames={{
          ...classNames,
          label: ['hidden', classNames?.label].filter(Boolean).join(' '),
          input: ['py-0', classNames?.input].filter(Boolean).join(' '),
        }}
        minRows={1}
        placeholder="Enter a prompt here"
        radius="lg"
        variant="bordered"
        {...props}
      />
    );
  }
);

export default PromptInput;

PromptInput.displayName = 'PromptInput';
