import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { useFirebase } from '../providers/FirebaseProvider'
import { type Document } from '../types/document'
import { useParams } from 'react-router-dom'
import { FaSpinner, FaCheck, FaTimes } from 'react-icons/fa'

// Tiptap Editor Imports 
import TiptapEditor from './ui/TiptapEditor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// Save Status type
const SaveState = {
  IS_SAVING: 'isSaving',
  NOT_SAVED: 'notSaved',
  SAVED: 'saved',
  ERROR: 'error',
}
type DocumentSaveState = (typeof SaveState)[keyof typeof SaveState]

const DocumentDetails: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [saveState, setSaveState] = useState<DocumentSaveState>(SaveState.NOT_SAVED)
  const { id } = useParams<{ id: string }>()
  const { db } = useFirebase()
  // Editor Properties
  const EDITOR_FOCUS_DELAY = 100
  const extensions = [StarterKit]

  // Get the document from the database
  const {
    data: document,
    isLoading,
    error,
  } = useQuery<Document>({
    queryKey: ['document', id],
    queryFn: async () => {
      const docRef = doc(db, 'documents', id as string)
      const snapshot = await getDoc(docRef)

      return snapshot.data() as Document
    },
    refetchInterval: false,
  })

  // Toggle Edit mode
  const toggleEditMode = async () => {
    // Get Document lock
    const docRef = doc(db, 'documents', id as string)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setIsEditMode(true)
    }
  }

  // Save the document
  const saveDocument = async () => {
    if (!document) {
      throw new Error('Document not found')
    }

    if (!editor) {
      throw new Error('Editor not found')
    }

    setSaveState(SaveState.IS_SAVING)
    const docRef = doc(db, 'documents', id as string)
    const newContent = editor.getHTML()
    try {
      await updateDoc(docRef, { content: newContent, updatedAt: new Date() })
      setSaveState(SaveState.SAVED)
    } catch (error) {
      setSaveState(SaveState.ERROR)
    }
  }

  // Handle the blur event
  const handleBlur = () => {
    saveDocument()
  }

  // Handle the save event
  const handleSave = () => {
    saveDocument()
    setIsEditMode(false)
  }

  // Handle the edit event
  const handleEdit = () => {
    toggleEditMode()
    if (document?.content == '<p></p>') {
      editor?.commands.setContent('')
    }

    setTimeout(() => {
      editor?.commands.focus('end')
    }, EDITOR_FOCUS_DELAY)
  }

  // Create the tiptap editor
  const editor = useEditor({
    extensions: extensions,
    content: document?.content || '',
    onBlur: handleBlur,
    editable: isEditMode,
    autofocus: true,

    onUpdate: ({ editor }) => {
      if (document) {
        if (editor.getHTML() !== document.content) {
          setSaveState(SaveState.NOT_SAVED)
        }
        const newContent = editor.getHTML()
        updateDoc(doc(db, 'documents', id as string), {
          content: newContent,
          updatedAt: new Date(),
        })
      }
    },
  })

  // Set the content of the editor
  useEffect(() => {
    if (document) {
      editor?.commands.setContent(document.content)
    }
  }, [document, editor])

  // Format the timestamp to a readable date string
  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return ''
    return timestamp.toDate().toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })
  }

  // Show loading message
  if (isLoading) return <div>Loading...</div>
  // Show error message
  if (error || !document) return <div>Error loading document</div>

  return (
    <>
      <div className="flex flex-col">
        {/* Save and Edit buttons */}
        <div className="flex flex-row justify-start p-4">
          {/* Show Save button if in Edit mode */}
          {isEditMode && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
          )}
          {/* Show Edit button if not in Edit mode */}
          {!isEditMode && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>

        {/* Document Details */}
        <div className="flex flex-col">
          <div className="flex flex-row mx-auto">
            <h1 className="text-2xl font-bold m-2">{document.name}</h1>
          </div>
          <div className="flex flex-row mx-auto m-2">
            <p className="text-gray-500 text-sm">
              Last Updated: {formatTimestamp(document.updatedAt)}
            </p>
            {saveState === SaveState.IS_SAVING && (
              <FaSpinner className="animate-spin ml-2" />
            )}
            {saveState === SaveState.SAVED && (
              <FaCheck className="text-green-500 ml-2" />
            )}
            {saveState === SaveState.ERROR && (
              <FaTimes className="text-red-500 ml-2" />
            )}
          </div>
        </div>
      </div>
      {/* Tiptap Editor */}
      <div className="overflow-auto text-left bg-stone-900">
        {editor && (
          <TiptapEditor
            editor={editor}
            className="text-white h-[calc(100vh-400px)] 
              prose-stone prose-p:text-left prose-headings:text-left max-w-8xl
              my-8 mx-12 max-h-screen max-y-screen
              blinking-cursor"
          />
        )}
      </div>
    </>
  )
}

export default DocumentDetails
