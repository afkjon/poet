import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../services/userApi'
import { type GetUserResponse } from '../services/userApi'


const UserProfile: React.FC = () => {
  const [user, setUser] = useState<GetUserResponse | null>(null)
  const { hasSession, user_id, isLoading, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  if (!hasSession) {
    navigate('/login')
    return <></>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    checkAuth().then(() => {
      if (user_id) {
        userApi.getUser(user_id).then((res) => {
        setUser(res)
      }).catch((err) => {
        console.log(err)
      })
      }
    })
  }, [])

  return (
    <div>
      <h1>{user_id} Profile</h1>
      <div>User Profile</div>
      <div>Email: {user?.email}</div>
    </div>
  )
}

export default UserProfile
