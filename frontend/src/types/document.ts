import { z } from 'zod'

const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Document = z.infer<typeof DocumentSchema>
