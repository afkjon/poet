import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { userApi as api } from '../services/userApi'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'

const UserIdSchema = z.object({
  user_id: z.number(),
})

const AuthStoreSchema = z.object({
  user_id: z.number().nullable(),
  access: z.string().nullable(),
  refresh: z.string().nullable(),
  loading: z.boolean(),
  hasSession: z.boolean(),
})

type AuthState = z.infer<typeof AuthStoreSchema> & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user_id: null,
      access: null,
      refresh: null,
      hasSession: false,
      loading: false,
      login: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const response = await api.login(email, password)
          const payload = UserIdSchema.parse(jwtDecode(response.access))
          set({
            user_id: payload.user_id,
            access: response.access,
            refresh: response.refresh,
            hasSession: true,
            loading: false,
          })
        } catch (error) {
          console.log(error)
          if (error instanceof AxiosError) {
            set({ loading: false, hasSession: false })
          }
        }
      },
      logout: async () => {
        set({ loading: true })
        await api.logout()
        set({
          user_id: null,
          access: null,
          refresh: null,
          hasSession: false,
          loading: false,
        })
      },
      register: async (email: string, password: string) => {
        set({ loading: true })
        const response = await api.register(email, password)
        const payload = UserIdSchema.parse(jwtDecode(response.access))
        set({
          user_id: payload.user_id,
          access: response.access,
          refresh: response.refresh,
          hasSession: true,
          loading: false,
        })
      },
      checkAuth: async () => {
        if (get().hasSession || get().loading) return
        set({ loading: true })
        try {
          const response = await api.checkAuth()
          const payload = UserIdSchema.parse(jwtDecode(response.access))
          set({
            user_id: payload.user_id,
            access: response.access,
            refresh: response.refresh,
            hasSession: true,
            loading: false,
          })
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ loading: false, hasSession: false })
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user_id: state.user_id,
        access: state.access,
        refresh: state.refresh,
        hasSession: state.hasSession,
      }),
    },
  ),
)
