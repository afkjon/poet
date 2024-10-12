import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { UserSchema } from '../types/user'
import { userApi as api } from '../services/userApi'

const UserStoreSchema = z.object({
  user: UserSchema.nullable(),
})

type UserStore = z.infer<typeof UserStoreSchema> & {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (username: string, password: string) => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (username: string, password: string) => {
        const user = await api.login(username, password)
        const validatedUser = UserSchema.parse(user)
        set({ user: validatedUser })
      },
      logout: async () => {
        await api.logout()
        set({ user: null })
      },
      register: async (username: string, password: string) => {
        const user = await api.register(username, password)
        const validatedUser = UserSchema.parse(user)
        set({ user: validatedUser })
      },
    }),
    {
      name: 'user-storage',
    },
  ),
)
