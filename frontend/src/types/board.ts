import { z } from 'zod'

const CardSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
})

const ColumnSchema = z.object({
  id: z.number(),
  name: z.string(),
  cards: z.array(CardSchema),
})

const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  columns: z.array(ColumnSchema),
})

type Board = z.infer<typeof BoardSchema>
type Column = z.infer<typeof ColumnSchema>
type Card = z.infer<typeof CardSchema>

export type { Board, Column, Card }
