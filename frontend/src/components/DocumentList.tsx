import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useFirebase } from '../providers/FirebaseProvider'
import { collection, getDocs, onSnapshot, addDoc } from 'firebase/firestore'
import { type Document } from '../types/document'
import { Link } from 'react-router-dom'

// TODO: Add a search bar to the document list
const DocumentList: React.FC = () => {
  const [documentName, setDocumentName] = useState('')
  const queryClient = useQueryClient()
  const { db } = useFirebase()

  // Get all documents from firebase
  const {
    data: documents,
    isLoading,
    error,
  } = useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: async () => {
      const documentsCollection = collection(db, 'documents')
      const snapshot = await getDocs(documentsCollection)
      return snapshot.docs.map<Document>((doc) => ({
        id: doc.id,
        name: doc.data().name,
        content: doc.data().content,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }))
    },
    refetchInterval: false,
    onSuccess: () => {
      const unsubscribe = onSnapshot(
        collection(db, 'documents'),
        (snapshot) => {
          const updatedDocuments = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
          }))
          queryClient.setQueryData(['documents'], updatedDocuments)
        },
      )
      return () => unsubscribe()
    },
  })

  // Create a new document
  const createDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (documentName.trim() === '') return
    const documentsCollection = collection(db, 'documents')
    const now = new Date()
    addDoc(documentsCollection, {
      name: documentName,
      content: '',
      createdAt: now,
      updatedAt: now,
    })
    setDocumentName('')
  }

  if (isLoading) return <div>Loading...</div>
  if (error || !documents) return <div>Error loading documents</div>

  // Render the document list
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none p-4 shadow-md">
        <h1 className="text-2xl font-bold">Documents</h1>
        <form onSubmit={createDocument} className="mt-2">
          <input
            type="text"
            placeholder="New Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="m-2 bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors"
          >
            Create Document
          </button>
        </form>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <ul className="space-y-4">
          {documents.map((document) => (
            <li key={document.id} className="border rounded-md p-4 shadow-sm">
              <Link to={`/documents/${document.id}`}>
                <h2 className="text-xl font-semibold">{document.name}</h2>
              </Link>
              <p className="text-sm text-gray-500">
                Created: {document.createdAt.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {document.updatedAt.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DocumentList
