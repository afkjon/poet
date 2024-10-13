import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useFirebase } from '../providers/FirebaseProvider'
import { collection, getDocs, onSnapshot, addDoc } from 'firebase/firestore'
import { Board, Column } from '../types/board'
//import useBoardStore from '../stores/boardStore';

const BoardList: React.FC = () => {
  //const { localBoards, addLocalBoard } = useBoardStore()
  const [boardName, setBoardName] = useState('')
  const queryClient = useQueryClient()
  const { db } = useFirebase()

  const {
    data: boards,
    isLoading,
    error,
  } = useQuery<Board[], Error>({
    queryKey: ['boards'],
    queryFn: async () => {
      const boardsCollection = collection(db, 'boards')
      const snapshot = await getDocs(boardsCollection)
      return snapshot.docs.map<Board>((doc) => ({
        id: doc.id,
        name: doc.data().name,
        columns: doc.data().columns || [],
      }))
    },
    refetchInterval: false,
    onSuccess: () => {
      // Setup real-time listener
      const unsubscribe = onSnapshot(collection(db, 'boards'), (snapshot) => {
        const updatedBoards = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          columns: doc.data().columns || [],
        }))
        queryClient.setQueryData(['boards'], updatedBoards)
      })
      return () => unsubscribe()
    },
  })

  const createBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (boardName.trim() === '') return
    const boardCollection = collection(db, 'boards')
    addDoc(boardCollection, { name: boardName })
    //addLocalBoard({ id: '', name: boardName, columns: [] });
    setBoardName('')
  }

  if (isLoading) return <div>Loading...</div>
  if (error || !boards) return <div>Error loading board</div>

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none p-4 shadow-md">
        <h1 className="text-2xl font-bold">View All Boards</h1>
        <form onSubmit={createBoard} className="mt-2">
          <input
            type="text"
            placeholder="New Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="m-2 bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors"
          >
            Create Board
          </button>
        </form>
      </div>

      {/* Boards */}
      <div className="flex-grow overflow-x-auto p-4">
        <div className="flex space-x-4">
          {boards?.map((board: Board) => (
            <div
              key={board.id}
              className="border-2 border-gray-300 flex-none w-72 rounded-md p-4"
            >
              <h2 className="text-xl font-semibold mb-4">{board.name}</h2>
              <div className="space-y-4">
                {board.columns.map((column: Column) => (
                  <div key={column.id} className="rounded-md p-3 shadow">
                    <h3 className="font-medium mb-2">{column.name}</h3>
                    <div className="space-y-2">
                      {/* Here you would map through the cards of each column */}
                      {/* For example: */}
                      {/* {column.cards.map((card: Card) => (
                        <div key={card.id} className="bg-gray-50 p-2 rounded">
                          <h4 className="font-medium">{card.title}</h4>
                          <p className="text-sm text-gray-600">{card.description}</p>
                        </div>
                      ))} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardList
