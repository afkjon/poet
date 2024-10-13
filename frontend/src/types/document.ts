import { z } from 'zod'
import { Timestamp } from 'firebase/firestore'
const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
})

export type Document = z.infer<typeof DocumentSchema>
