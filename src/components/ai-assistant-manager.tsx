import React from 'react';
import {RoomStateProvider} from '@sqlrooms/room-store';
import {TooltipProvider} from '@sqlrooms/ui';

import {AiAssistantComponent} from './ai-assistant-component';
import {BrushLinkProvider, BrushLinkCallback} from './echarts-renderers';

export type AiAssistantPanelProps = {
  roomStore: any;
  onSelected?: BrushLinkCallback;
};

export function AiAssistantPanel({
  roomStore,
  onSelected
}: AiAssistantPanelProps) {
  return (
    <RoomStateProvider roomStore={roomStore}>
      <TooltipProvider>
        <BrushLinkProvider value={onSelected}>
          <div className="ai-assistant-manager pointer-events-none flex h-full w-full grow flex-col justify-between overflow-hidden [&>*]:pointer-events-auto">
            <div className="top-0 flex grow flex-col overflow-hidden bg-[var(--side-panel-bg,#29323c)]">
              <div className="border-b border-[var(--border-color,#3a414c)] px-4 pb-1 pt-4 text-[var(--subtext-color-active,#c3c8d0)]">
                <span className="text-sm font-bold uppercase tracking-wide">
                  AI Assistant
                </span>
              </div>
              <div className="flex h-full flex-col overflow-y-auto px-0 py-2.5 text-[var(--subtext-color-active,#c3c8d0)]">
                <AiAssistantComponent />
              </div>
            </div>
          </div>
        </BrushLinkProvider>
      </TooltipProvider>
    </RoomStateProvider>
  );
}
