import { useEditor } from '@tiptap/react'
import { Extension } from '@tiptap/core'

type UseBlockEditorProps = {
    immediatelyRender?: boolean,
    shouldRerenderOnTransaction?: boolean,
    autofocus?: boolean,
    extensions: Extension[],
    content?: string
}

// Todo: Refactor to useBlockEditor using more extensions
const useBlockEditor = ({
    immediatelyRender = true,
    shouldRerenderOnTransaction = false,
    autofocus = true,
    extensions,
    content
}: UseBlockEditorProps) => {
    
    const editor = useEditor({
        extensions,
        content,
        autofocus,
        immediatelyRender,
        shouldRerenderOnTransaction
    })

    return editor
}