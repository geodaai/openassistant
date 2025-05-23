import { Icon } from '@iconify/react';
import { EditorState } from 'lexical';
import { Layout } from 'react-grid-layout';
import { CustomLexicalEditor } from '../lexical/lexical-editor';
import {
  ScatterplotOutputData,
  ScatterplotComponent,
  HistogramComponent,
  HistogramOutputData,
} from 'packages/tools/plots/dist';
import {
  KeplerGlComponentWithProvider,
  CreateMapOutputData,
} from 'packages/components/keplergl/dist';
import {
  QueryDuckDBComponent,
  QueryDuckDBOutputData,
} from 'packages/tools/duckdb/dist';

export type BoardItemProps = {
  id: string;
  type: 'text' | 'query' | 'scatterplot' | 'histogram' | 'map' | 'boxplot';
  content: unknown;
};

type TextItemProps = BoardItemProps & {
  type: 'text';
  content: EditorState | string;
};

type ScatterPlotItemProps = BoardItemProps & {
  type: 'scatterplot';
  content: ScatterplotOutputData;
};

function BoardItem({ item }: { item: BoardItemProps }) {
  const { id, type, content } = item;

  switch (type) {
    case 'text':
      return (
        <CustomLexicalEditor
          id={id}
          mode="edit"
          theme="light"
          initialState={content as EditorState}
        />
      );
    case 'query':
      return (
        <QueryDuckDBComponent
          {...(content as QueryDuckDBOutputData)}
        />
      );
    case 'scatterplot':
      return (
        <ScatterplotComponent
          {...(content as ScatterplotOutputData)}
          theme="light"
        />
      );
    case 'histogram':
      return (
        <HistogramComponent
          {...(content as HistogramOutputData)}
          theme="light"
        />
      );
    case 'map':
      return (
        <KeplerGlComponentWithProvider
          {...(content as CreateMapOutputData)}
          theme="light"
        />
      );
    default:
      return null;
  }
}

export default function BoardItemContainer({
  gridLayout,
  setGridLayout,
  item,
  gridItems,
  setGridItems,
}: {
  gridLayout: Layout[];
  setGridLayout: (layout: Layout[]) => void;
  item: BoardItemProps;
  gridItems: BoardItemProps[];
  setGridItems: (items: BoardItemProps[]) => void;
}) {
  const { id } = item;

  const onClickUp = () => {
    // put the selected grid item to the top by moving it to the first position in the gridLayout array
    if (gridLayout) {
      const item = gridLayout.find((item) => item.i === id);
      if (item) {
        setGridLayout([...gridLayout.filter((item) => item.i !== id), item]);
      }
    }
  };

  const onClickClose = () => {
    setGridLayout(gridLayout.filter((item) => item.i !== id));
    setGridItems(gridItems.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-black">
      <div className="z-50 flex h-5 w-full flex-none cursor-pointer flex-row bg-gray-200 dark:bg-gray-600">
        <div className="react-grid-dragHandle flex-grow"></div>
        <div className="absolute right-0 top-0 z-50 m-1 flex flex-none cursor-pointer flex-row gap-1">
          <Icon
            icon="mdi:arrow-up"
            width={14}
            height={14}
            onClick={onClickUp}
          />
          <Icon
            icon="material-symbols:close"
            width={14}
            height={14}
            onClick={onClickClose}
          />
        </div>
      </div>
      <div className="w-full flex-grow overflow-auto p-2">
        <BoardItem item={item} />
      </div>
      <div className="h-2 w-full flex-none"></div>
    </div>
  );
}
