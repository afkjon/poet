import React from 'react'
import { FloatingMenu, BubbleMenu, EditorContent, Editor } from '@tiptap/react'

type TiptapEditorProps = {
  editor: Editor | null
  className?: string
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ editor, className }) => {
  if (!editor) {
    return <div>No editor found</div>
  }

  return (
    <>
      <EditorContent editor={editor} className={className} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  )
}

export default TiptapEditor
