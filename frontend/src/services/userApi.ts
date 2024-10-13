import { AxiosError } from 'axios'
import apiClient from './apiClient'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
const UserIdSchema = z.object({
  user_id: z.number().nullable(),
})

type LoginResponse = { access: string; refresh: string }
type RegisterResponse = { access: string; refresh: string }
type GetCurrentUserResponse = { access: string; refresh: string }

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
}
