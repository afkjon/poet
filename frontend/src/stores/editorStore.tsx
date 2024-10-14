import { create } from 'zustand'
import { Editor, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface EditorStore {
  // Tiptap Editor items
  editor: Editor | null
  content: JSONContent | null
  isEditable: boolean
  isFocused: boolean
  selectedText: string
  wordCount: number
  characterCount: number
  lastSaved: Date | null
  isLoading: boolean
  error: string | null
  initEditor: () => void
  destroyEditor: () => void
  setContent: (content: JSONContent) => void
  toggleEditable: () => void
  updateWordCount: () => void
  updateCharacterCount: () => void
  onBlur: () => void
  onUpdate: () => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  editor: null,
  content: null,
  isEditable: true,
  isFocused: false,
  selectedText: '',
  wordCount: 0,
  characterCount: 0,
  lastSaved: null,
  isLoading: false,
  error: null,

  initEditor: () => {
    const newEditor = new Editor({
      extensions: [
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false, 
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false, 
          },
        }),
      ],
      onUpdate: ({ editor }) => {
        set({ content: editor.getJSON() })
        get().updateWordCount()
        get().updateCharacterCount()
      },
      onSelectionUpdate: ({ editor }) => {
        set({ selectedText: editor.state.selection.content().content.textBetween(0, 1000, ' ') })
      },
      onFocus: () => set({ isFocused: true }),
      onBlur: () => set({ isFocused: false }),
    })
    set({ editor: newEditor })
  },

  destroyEditor: () => {
    set((state) => {
      if (state.editor) {
        state.editor.destroy()
      }
      return { editor: null }
    })
  },

  setContent: (content) => {
    set({ content })
    get().editor?.commands.setContent(content)
    get().updateWordCount()
    get().updateCharacterCount()
  },

  toggleEditable: () => {
    set((state) => {
      const newIsEditable = !state.isEditable
      state.editor?.setEditable(newIsEditable)
      return { isEditable: newIsEditable }
    })
  },

  updateWordCount: () => {
    const wordCount = get().editor?.storage.characterCount.words() ?? 0
    set({ wordCount })
  },

  updateCharacterCount: () => {
    const characterCount = get().editor?.storage.characterCount.characters() ?? 0
    set({ characterCount })
  },

  setSelectedText: (text: string) => {
    set({ selectedText: text })
  },

  onBlur: () => {
    set({ content: get().editor?.getJSON() })
    set({ wordCount: get().editor?.storage.characterCount.words() ?? 0 })
    set({ characterCount: get().editor?.storage.characterCount.characters() ?? 0 })
  },

  onUpdate: () => {
    set({ content: get().editor?.getJSON() })
    set({ wordCount: get().editor?.storage.characterCount.words() ?? 0 })
    set({ characterCount: get().editor?.storage.characterCount.characters() ?? 0 })
  },
}))

