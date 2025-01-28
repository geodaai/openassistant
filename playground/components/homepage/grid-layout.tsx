import { Layout } from 'react-grid-layout';
import { BoardItemProps } from '../whiteboard/board-item';
import { INTRODUCTION_LEXICAL } from '../whiteboard/constant';
import WhiteBoard from '../whiteboard/board';

export default function GridLayout() {
  const defaultLayout: Layout[] = [{ i: 'i-welcome', x: 0, y: 0, w: 18, h: 16 }];

  const defaultItems: BoardItemProps[] = [
    {
      id: 'i-welcome',
      type: 'text',
      content: JSON.stringify(INTRODUCTION_LEXICAL),
    },
  ];

  return (
    <WhiteBoard defaultLayout={defaultLayout} defaultItems={defaultItems} />
  );
}
