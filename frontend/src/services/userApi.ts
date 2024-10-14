import { AxiosError } from 'axios'
import apiClient from './apiClient'
import { z } from 'zod'
import { toast } from 'react-hot-toast'

const LoginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
})

const RegisterResponseSchema = LoginResponseSchema
const GetCurrentUserResponseSchema = LoginResponseSchema
const GetUserResponseSchema = z.object({
  id: z.number(),
  username: z.string().optional(),
  email: z.string(),
})

type LoginResponse = z.infer<typeof LoginResponseSchema>
type RegisterResponse = z.infer<typeof RegisterResponseSchema>
type GetCurrentUserResponse = z.infer<typeof GetCurrentUserResponseSchema>
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>

export const userApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post(
        '/auth/login/',
        { email, password },
        { withCredentials: true },
      )
      if (response.status === 200) {
        return {
          access: response.data.access,
          refresh: response.data.refresh,
        }
      }
      throw new Error('Invalid username or password')
    } catch (error) {
      throw error as AxiosError
    }
  },
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout/', { withCredentials: true })
      toast.success('Logged out successfully')
    } catch (error) {
      throw error as AxiosError
    }
  },
  register: async (
    email: string,
    password: string,
  ): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post(
        '/auth/register/',
        { email, password },
        { withCredentials: true },
      )
      if (response.status === 201) {
        return {
          access: response.data.access,
          refresh: response.data.refresh,
        }
      }
      throw new Error('Failed to register')
    } catch (error) {
      throw error as AxiosError
    }
  },
  checkAuth: async (): Promise<GetCurrentUserResponse> => {
    try {
      const response = await apiClient.get('/auth/me/', {
        withCredentials: true,
      })
      if (response.status === 200) {
        return {
          access: response.data.access,
          refresh: response.data.refresh,
        }
      }
      throw new Error('Failed to get current user')
    } catch (error) {
      throw error as AxiosError
    }
  },

  getUser: async (user_id: number): Promise<GetUserResponse> => {
    try {
      const response = await apiClient.get(`/auth/profile/${user_id}/`, {
        withCredentials: true,
      })
      if (response.status === 200) {
        return response.data
      }
      throw new Error('Failed to get user')
    } catch (error) {
      throw error as AxiosError
    }
  },
}
