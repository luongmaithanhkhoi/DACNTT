// "use client";

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import { Bold, Italic, List, ListOrdered, Strikethrough, Undo, Redo } from 'lucide-react';

// interface RichTextEditorProps {
//   content: string;
//   onChange: (content: string) => void;
//   placeholder?: string;
// }

// export default function RichTextEditor({ content, onChange, placeholder = "Nhập mô tả công việc..." }: RichTextEditorProps) {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [
//       StarterKit.configure({
//         bulletList: {
//           keepMarks: true,
//           keepAttributes: false,
//         },
//         orderedList: {
//           keepMarks: true,
//           keepAttributes: false,
//         },
//       }),
//       Placeholder.configure({
//         placeholder,
//       }),
//     ],
//     content,
//     editorProps: {
//       attributes: {
//         class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="border border-gray-300 rounded-lg overflow-hidden">
//       {/* Toolbar */}
//       <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
//         >
//           <Bold className="w-4 h-4" />
//         </button>
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
//         >
//           <Italic className="w-4 h-4" />
//         </button>
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
//         >
//           <Strikethrough className="w-4 h-4" />
//         </button>
//         <div className="w-px bg-gray-400 mx-1" />
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
//         >
//           <List className="w-4 h-4" />
//         </button>
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
//         >
//           <ListOrdered className="w-4 h-4" />
//         </button>
//         <div className="w-px bg-gray-400 mx-1" />
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={!editor.can().undo()}
//           className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
//         >
//           <Undo className="w-4 h-4" />
//         </button>
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={!editor.can().redo()}
//           className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
//         >
//           <Redo className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Editor */}
//       <EditorContent editor={editor} className="bg-white" />
//     </div>
//   );
// }

"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size'; // Cần cài thêm package này
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Undo, 
  Redo, 
  Type, 
  Heading1, 
  Heading2, 
  Heading3,
  Text,
  Minus,
  Plus
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Nhập nội dung..." 
}: RichTextEditorProps) {
  const editor = useEditor({
     immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // Chỉ cho phép H1, H2, H3
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      FontSize, // Extension cho phép thay đổi cỡ chữ
    ],
    content,
    editorProps: {
      attributes: {
        class: 'ProseMirror focus:outline-none min-h-[200px] p-4 bg-white',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  },
 []
);

  if (!editor) {
    return null;
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const increaseFontSize = () => {
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
    const sizeNum = parseInt(currentSize.replace('px', ''));
    editor.chain().focus().setFontSize(`${sizeNum + 2}px`).run();
  };

  const decreaseFontSize = () => {
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
    const sizeNum = parseInt(currentSize.replace('px', ''));
    if (sizeNum > 12) { // Giới hạn tối thiểu
      editor.chain().focus().setFontSize(`${sizeNum - 2}px`).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2 items-center">
        {/* Heading */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => toggleHeading(1)}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(2)}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(3)}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
            title="Heading 3"
          >
            <Heading3 className="w-5 h-5" />
          </button>
        </div>

        {/* Font Size */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={decreaseFontSize}
            className="p-2 rounded hover:bg-gray-200"
            title="Giảm cỡ chữ"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={increaseFontSize}
            className="p-2 rounded hover:bg-gray-200"
            title="Tăng cỡ chữ"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Text formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}