import { EditorState } from 'lexical';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { ToolbarPlugin } from './lexical-toobar-plugin';
import React, { FC, useEffect } from 'react';

import ImagesPlugin from './plugins/ImagesPlugin';
import './lexical.css';
import { ImageNode } from './nodes/ImageNode';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

const editorConfig = {
  namespace: 'React.js Demo',
  // custom nodes
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
  ],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme,
};

const Placeholder = () => {
  return <div className="editor-placeholder">Enter text here...</div>;
};

/**
 * When the content of the editor changes, we need to save the content to state
 *
 * @param id - the id of the editor
 * @returns null
 */
const OnChangePlugin = ({ id }: { id: string }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener((listener) => {
      const newContent = listener.editorState;
      console.log('newContent', newContent.toJSON());
      // can just save the newContent to state
      // (updateTextGridContent({ id, newContent: listener.editorState }));
    });
  }, [editor, id]);

  return null;
};

type LexicalEditorProps = {
  id: string;
  mode: 'edit' | 'display';
  theme: string;
  initialState: EditorState | string | null;
};

export const CustomLexicalEditor: FC<LexicalEditorProps> = ({
  id,
  mode,
  theme,
  initialState,
}) => {
  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        ...(initialState ? { editorState: initialState } : {}),
      }}
    >
      <div
        className={
          theme === 'light' ? 'editor-container' : 'editor-container-dark'
        }
      >
        {/* hide ToolbarPlugin in display mode */}
        {mode === 'edit' && <ToolbarPlugin />}
        <div
          className={theme === 'light' ? 'editor-inner' : 'editor-inner-dark'}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={
                  theme === 'light' ? 'editor-input' : 'editor-input-dark'
                }
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <ImagesPlugin />
          <OnChangePlugin id={id} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export function initEditorState(content: string) {
  const initState = {
    root: {
      children: [
        {
          children: [
            {
              children: [],
              direction: null,
              format: '',
              indent: 0,
              type: 'text',
              version: 1,
              text: content,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  };

  return JSON.stringify(initState);
}
