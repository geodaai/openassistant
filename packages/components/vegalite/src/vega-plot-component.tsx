// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { VegaLite } from 'react-vega';

export type VegaLitePlotAdditionalData = {
  vegaLiteSpec: string;
  datasetName: string;
  variableNames: string[];
  plotType: string;
};

export type VegaLiteOutputData = VegaLitePlotAdditionalData & {
  id?: string;
  theme?: string;
  showMore?: boolean;
  isExpanded?: boolean;
  isDraggable?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
  height?: number;
  width?: number;
};

export function isVegaLiteOutputData(
  data: unknown
): data is VegaLiteOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'vegaLiteSpec' in data &&
    'datasetName' in data &&
    'variableNames' in data
  );
}

// export function VegaPlotComponentContainer(props: VegaLiteOutputData) {
//   const [isExpanded, setIsExpanded] = useState(props.isExpanded);

//   const id = props.id || generateId();

//   const onDragStart = useDraggable({
//     id,
//     type: 'vega-lite',
//     data: props,
//   });

//   const onExpanded = (flag: boolean) => {
//     setIsExpanded(flag);
//   };

//   return (
//     <ExpandableContainer
//       defaultWidth={isExpanded ? 600 : undefined}
//       defaultHeight={isExpanded ? 600 : 400}
//       draggable={props.isDraggable || false}
//       onDragStart={onDragStart}
//       onExpanded={onExpanded}
//     >
//       <VegaPlotComponent {...props} />
//     </ExpandableContainer>
//   );
// }

export function VegaPlotComponent(props: VegaLiteOutputData) {
  const spec = props.vegaLiteSpec ? JSON.parse(props.vegaLiteSpec) : {};

  const containerStyle = {
    height: '100%',
    width: '100%',
    color: '#111827', // text-gray-900
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div
      style={{
        resize: 'both',
        overflow: 'auto',
        width: '100%',
        height: '300px',
      }}
    >
      <div style={containerStyle}>
        <VegaLite
          spec={{
            ...spec,
            width: 'container',
            height: 'container',
            autosize: {
              type: 'fit',
              contains: 'padding',
            },
          }}
          theme={
            (props.theme || 'ggplot2') as
              | 'dark'
              | 'excel'
              | 'fivethirtyeight'
              | 'ggplot2'
              | 'latimes'
              | 'quartz'
              | 'vox'
              | 'urbaninstitute'
              | 'googlecharts'
              | 'powerbi'
              | 'carbonwhite'
              | 'carbong10'
              | 'carbong90'
              | 'carbong100'
          }
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
