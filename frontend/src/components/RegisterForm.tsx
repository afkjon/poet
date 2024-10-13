import React from 'react'
import { useState } from 'react'
import { userApi as api } from '../services/userApi'

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    try {
      api.register(email, password)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center my-10 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold">Register</h1>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="text"
            name="email"
            className="border border-gray-300 rounded-md p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="border border-gray-300 rounded-md p-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default RegisterForm
