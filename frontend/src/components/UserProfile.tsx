import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../services/userApi'
import { type GetUserResponse } from '../services/userApi'
import { toast } from 'react-hot-toast'
import Loading from './ui/Loading'
const UserProfile: React.FC = () => {
  const [user, setUser] = useState<GetUserResponse | null>(null)
  const { hasSession, user_id, isLoading, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  if (!hasSession) {
    navigate('/login')
    return <Loading />
  }

  if (isLoading) {
    return <Loading />
  }

  // Render once user is loaded
  useEffect(() => {
    checkAuth().then(() => {
      if (user_id) {
        userApi.getUser(user_id).then((res) => {
          setUser(res)
        }).catch((err) => {
          toast.error('Failed to fetch user')
        })
      }
    })
  }, [])

  return (
    <div>
      <h1>Profile</h1>
      <div>User Profile</div>
      <div>{user?.username}</div>
      <div>Email: {user?.email}</div>
    </div>
  )
}

export default UserProfile
