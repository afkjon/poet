import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isLoading, hasSession } = useAuthStore()

  // Placeholder Image
  const heroImage = 'http://via.placeholder.com/1600x400'

  const handleDemoClick = () => {
    navigate('/documents')
  }

  // Check if user is authenticated
  useEffect(() => {
    if (hasSession) {
      navigate('/documents')
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <section
        className="flex h-screen bg-cover bg-center max-h-[400px]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="flex flex-col h-screen mx-auto max-h-inherit mt-32">
          <h1 className="text-4xl font-bold">Welcome to Poet</h1>
          <p className="text-lg mt-4">
            Poet is a collaborative writing tool for poets.
          </p>
          <button
            className="bg-stone-800 text-white p-2 rounded-md mt-4"
            onClick={handleDemoClick}
          >
            Get Started
          </button>
        </div>
      </section>
      <section className="flex flex-col mx-auto">
        <h2 className="text-2xl font-bold">Features</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">Feature 1</h3>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">Feature 2</h3>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">Feature 3</h3>
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
