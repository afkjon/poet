import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { type Document } from '../types/document'
import { useParams } from 'react-router-dom'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Loading from './ui/Loading'
import { useEditorStore } from '../stores/editorStore'
import TiptapEditor from './ui/TiptapEditor'
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
  const { content, setDocumentId, saveContent, editor, isLoading, error, lastSaved } = useEditorStore()

  // Get the document from the database
  useEffect(() => {
    if (id) {
      setDocumentId(id)
    }
  }, [])

  // Save the document
  const saveDocument = async () => {
    if (!document) {
      throw new Error('Document not found')
    }

    if (!editor) {
      throw new Error('Editor not found')
    }

    setSaveState(SaveState.IS_SAVING)
    const newContent = editor.getHTML()
    try {
      await saveContent()
      setSaveState(SaveState.SAVED)
    } catch (error) {
      setSaveState(SaveState.ERROR)
    }
  }
  

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
                onBlur={saveDocument}
              />
            ) : (
              <h1 className="text-2xl font-bold m-2 w-full">{documentName}</h1>
            )}
          </div>
          <div className="flex flex-row mx-auto m-2">
            <p className="text-gray-500 text-sm">
              Last Updated: {formatTimestamp(lastSaved || Timestamp.now())}
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
