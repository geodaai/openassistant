import React from 'react';
import { KeplerMapContainer } from '@sqlrooms/kepler';

type KeplerMapContainerProps = React.ComponentProps<typeof KeplerMapContainer>;

/**
 * Wrapper around `KeplerMapContainer` that:
 * - has default height of 300px
 * - takes full available width (`w-full`)
 * - is vertically resizable by the user
 */
export function ResizableKeplerMapContainer(props: KeplerMapContainerProps) {
  return (
    <div className="w-full h-[300px] min-h-[300px] resize-y overflow-hidden">
      <KeplerMapContainer {...props} />
    </div>
  );
}


