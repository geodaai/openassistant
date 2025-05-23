import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import BoardItemContainer, { BoardItemProps } from './board-item';
import { initEditorState } from '../lexical/lexical-editor';
import { useState } from 'react';
import { DroppedItem } from './dropped-item';
import {
  ScatterplotOutputData,
  HistogramOutputData,
  BoxplotOutputData,
} from 'packages/tools/plots/dist';
import { CreateMapOutputData } from 'packages/components/keplergl/dist';
import { QueryDuckDBOutputData } from 'packages/tools/duckdb/dist';

const ReactGridLayout = WidthProvider(RGL) as any;

type WhiteBoardProps = {
  defaultLayout: Layout[];
  defaultItems: BoardItemProps[];
  className?: string;
  rowHeight?: number;
  width?: number;
  margin?: [number, number];
  allowOverlap?: boolean;
  cols?: number;
};

export default function WhiteBoard({
  defaultLayout,
  defaultItems,
  className = 'layout min-h-[800px]',
  rowHeight = 30,
  width = 1200,
  margin = [20, 20],
  allowOverlap = true,
  cols = 18,
}: WhiteBoardProps) {
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  const [gridItems, setGridItems] = useState<BoardItemProps[]>(defaultItems);

  // when layout changes, update redux state
  const onLayoutChange = (layout: Layout[]) => {
    setLayout(layout);
  };

  // when user drag an item from the chat to the board, we will add a new item to the board
  const onDrop = (layout: Layout[], layoutItem: Layout, _event: Event) => {
    let droppedItem: DroppedItem | null = null;
    try {
      // @ts-ignore event does not have dataTransfer by react-grid-layout
      droppedItem = JSON.parse(_event.dataTransfer.getData('text/plain'));
    } catch (e) {
      console.error('Error parsing dropped item', e);
      return;
    }
    if (droppedItem.type === 'text') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'text',
          content: initEditorState(droppedItem.data as string),
        },
      ]);
    } else if (droppedItem.type === 'scatterplot') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'scatterplot',
          content: droppedItem.data as ScatterplotOutputData,
        },
      ]);
    } else if (droppedItem.type === 'histogram') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'histogram',
          content: droppedItem.data as HistogramOutputData,
        },
      ]);
    } else if (droppedItem.type === 'boxplot') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'boxplot',
          content: droppedItem.data as BoxplotOutputData,
        },
      ]);
    } else if (droppedItem.type === 'map') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'map',
          content: droppedItem.data as CreateMapOutputData,
        },
      ]);
    } else if (droppedItem.type === 'query') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'query',
          content: droppedItem.data as QueryDuckDBOutputData,
        },
      ]);
    }
    // the last item in layout is the new item, update its id
    layout[layout.length - 1].i = droppedItem.id;
    setLayout(layout);
  };

  return (
    <ReactGridLayout
      className={className}
      layout={layout}
      rowHeight={rowHeight}
      width={width}
      margin={margin}
      allowOverlap={allowOverlap}
      cols={cols}
      onLayoutChange={onLayoutChange}
      draggableHandle=".react-grid-dragHandle"
      isDraggable={true}
      isResizable={true}
      isDroppable={true}
      onDrop={onDrop}
      droppingItem={{ w: 6, h: 6, i: 'dropping-item' }}
    >
      {gridItems.map((item) => (
        <div key={item.id} className="border-dashed border-2 border-gray-300">
          <BoardItemContainer
            item={item}
            gridItems={gridItems}
            gridLayout={layout}
            setGridLayout={setLayout}
            setGridItems={setGridItems}
          />
        </div>
      ))}
    </ReactGridLayout>
  );
}
