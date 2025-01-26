import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import BoardItemContainer, { BoardItemProps } from './board-item';
import { initEditorState } from '../lexical/lexical-editor';
import { useState } from 'react';
import { DroppedItem, isDroppedMessage } from './dropped-item';
import { EditorState } from 'lexical';
import { ScatterplotOutputData } from '@openassistant/echarts';

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
          content: initEditorState(droppedItem.message as string),
        },
      ]);
    } else if (droppedItem.type === 'scatterplot') {
      setGridItems([
        ...gridItems,
        {
          id: droppedItem.id,
          type: 'scatterplot',
          content: droppedItem.message as ScatterplotOutputData,
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
