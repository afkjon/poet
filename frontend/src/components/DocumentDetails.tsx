import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { useFirebase } from '../providers/FirebaseProvider'
import { type Document } from '../types/document'
import { useParams } from 'react-router-dom'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Loading from './ui/Loading'

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
  const [documentName, setDocumentName] = useState<string>('')
  const [saveState, setSaveState] = useState<DocumentSaveState>(
    SaveState.NOT_SAVED,
  )
  const { id } = useParams<{ id: string }>()
  const { db } = useFirebase()

  // Editor Properties
  const extensions =  [
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
  ]

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
    onSuccess: (data) => {
      setDocumentName(data?.name || '')
      editor?.commands.setContent(data?.content || '')
    },
  })

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
      await updateDoc(docRef, {
        name: documentName,
        content: newContent,
        updatedAt: new Date(),
      })
      setSaveState(SaveState.SAVED)
    } catch (error) {
      setSaveState(SaveState.ERROR)
    }
  }

  // Handle the blur event
  const handleBlur = () => {
    saveDocument()
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
          name: documentName,
          content: newContent,
          updatedAt: new Date(),
        })
      }
    },
  })

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
  if (isLoading) return <Loading />
  // Show error message
  if (error || !document) return <div>Error loading document</div>

  return (
    <>
      <div className="flex flex-col">
        {/* Document Details */}
        <div className="flex flex-col w-full px-4">
          <div className="mx-auto w-full">
            {isEditMode ? (
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="text-2xl w-full font-bold m-2 p-2 
                  border-none shadow-md rounded-md focus:outline-none 
                  bg-stone-650 text-center"
                onBlur={handleBlur}
              />
            ) : (
              <h1 className="text-2xl font-bold m-2 w-full">{documentName}</h1>
            )}
          </div>
          <div className="flex flex-row mx-auto m-2">
            <p className="text-gray-500 text-sm">
              Last Updated: {formatTimestamp(document.updatedAt)}
            </p>
            {saveState === SaveState.IS_SAVING && (
              <Loading />
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
      <div
        className="overflow-auto text-left bg-stone-900"
        onClick={() => {
          setIsEditMode(true)
          editor?.commands.focus('end')
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsEditMode(false)
          }
        }}
      >
        {editor && (
          <TiptapEditor
            editor={editor}
            className="text-white h-[calc(100vh-400px)] 
              prose-stone prose-p:text-left prose-headings:text-left max-w-8xl
              my-8 mx-12 max-h-screen max-y-screen focus-visible:outline-none focus-visible:ring-0 
              focus:outline-none focus:ring-0 blinking-cursor p-10 outline-none border-none"
          />
        )}
      </div>
      <div>
        {/* Check if Mobile */}
        {window.innerWidth < 768 && isEditMode && (
          <button
            className="text-white text-sm"
            onClick={saveDocument}
          >
            Save
          </button>
        )}
      </div>
    </>
  )
}

export default DocumentDetails
