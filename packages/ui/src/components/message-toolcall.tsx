import { ToolCallMessage, ToolCallComponents } from '@openassistant/core';
import React, { ReactNode } from 'react';

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

export function ToolCallComponent({
  toolCallMessage,
  components,
}: {
  toolCallMessage: ToolCallMessage;
  components?: ToolCallComponents;
}) {
  const toolName = toolCallMessage.toolName;
  const additionalData = toolCallMessage.additionalData;

  const Component = components?.find(
    (component) => component.toolName === toolName
  )?.component;

  // check if toolCallMessage.args has a property called 'reason'
  const reason = toolCallMessage.args?.reason as string;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-500">
        {toolCallMessage.text}
        {reason && <span>{reason}</span>}
      </div>
      {Component && (
        <ToolCallErrorBoundary>
          <Component {...(additionalData as Record<string, unknown>)} />
        </ToolCallErrorBoundary>
      )}
    </div>
  );
}
