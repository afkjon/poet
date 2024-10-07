import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirebase } from '../providers/FirebaseProvider'
import { type Document } from '../types/document'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// Get the document id from the URL
const DocumentDetails: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  // Get the document id from the URL
  const { id } = useParams<{ id: string }>()
  const { db } = useFirebase()

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
      setContent(data.content)
    },
  })

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
  })

  // Update the document in the database
  /*
  const updateDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (document) {
      const docRef = doc(db, 'documents', document.id)
      updateDoc(docRef, { content: document.content })
    }
  }
  */

  // Toggle Edit mode
  const toggleEditMode = async () => {
    // Get Document lock
    const docRef = doc(db, 'documents', id as string)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setIsEditMode(!isEditMode)
      setContent(docSnap.data().content)
    }
  }

  // Save the document
  const saveDocument = () => {
    if (!document) {
      throw new Error('Document not found')
    }

    try {
      const docRef = doc(db, 'documents', id as string)
      updateDoc(docRef, { content: content, updatedAt: new Date() })
      setIsEditMode(false)
      setContent(document.content)
      toast.success('Document saved')
    } catch (error) {
      toast.error('Error saving document')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error || !document) return <div>Error loading document</div>

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isEditMode ? (
        <div className="p-4">
          {/* Tiptap Editor */}
          <EditorContent
            editor={editor}
            onBlur={saveDocument}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : (
        <div className="p-4">
          <div className="flex flex-row justify-between">
            <p className="text-gray-500 text-sm ">
              Created:{' '}
              {document.createdAt.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-gray-500 text-sm">
              Updated:{' '}
              {document.updatedAt.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <h1 className="text-2xl font-bold">{document.name}</h1>
          <p>{document.content}</p>
        </div>
      )}

      <div className="flex justify-end">
        {/* Show Save button if in Edit mode */}
        {isEditMode && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={saveDocument}
          >
            Save
          </button>
        )}
        {/* Show Edit button if not in Edit mode */}
        {!isEditMode && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={toggleEditMode}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default DocumentDetails
