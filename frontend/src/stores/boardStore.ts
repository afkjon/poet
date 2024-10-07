import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Board } from '../types/board'

// Define the type for the board state
interface BoardState {
  localBoards: Board[]
  addLocalBoard: (board: Board) => void
  // Add other actions as needed
}

// Create the board store
const useBoardStore = create(
  persist<BoardState>(
    (set, get) => ({
      localBoards: get()?.localBoards || [],
      addLocalBoard: (board) =>
        set((state) => ({ localBoards: [...state.localBoards, board] })),
      // Implement other actions here
    }),
    {
      name: 'board-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useBoardStore
