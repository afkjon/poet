import { z } from 'zod'

const SessionSchema = z.object({
  createdAt: z.date(),
  expiresAt: z.date(),
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type Session = z.infer<typeof SessionSchema>
