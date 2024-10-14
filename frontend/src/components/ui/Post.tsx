import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapEditor from './TiptapEditor'

const Post: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  return (
    <div>
      {editor ? (
        <TiptapEditor editor={editor} />
      ) : (
        'Loading editor...'
      )}
    </div>
  )
}

export default Post
