import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Loading from './ui/Loading'
const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isLoading, hasSession } = useAuthStore()

  const handleGetStarted = () => {
    navigate('/documents')
  }

  // Check if user is authenticated
  useEffect(() => {
    if (hasSession) {
      navigate('/documents')
    }
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white transition duration-300 ease-in-out">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Poet</h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Unleash your creativity with Poet, the ultimate collaborative writing tool for poets.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg transition duration-300 ease-in-out hover:bg-blue-100 hover:shadow-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Collaborative Editing", description: "Work together in real-time with poets from around the world." },
              { title: "Verse Analysis", description: "Get instant feedback on your poem's structure and rhythm." },
              { title: "Inspiration Tools", description: "Access a vast library of prompts and resources to spark your creativity." }
            ].map((feature, index) => (
              <div key={index} className="bg-stone-800 rounded-lg p-8 shadow-md transition duration-300 ease-in-out hover:shadow-xl">
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">What collaborators are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: "Emily W.", quote: "Poet has revolutionized the way I collaborate with other writers. It's an indispensable tool for modern poets." },
              { name: "Michael R.", quote: "The verse analysis feature has helped me improve my craft immensely. I can't imagine writing without Poet now." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-stone-800 rounded-lg p-8 shadow-md">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Poetic Journey?</h2>
          <button
            onClick={handleGetStarted}
            className="bg-stone-800 text-blue-600 px-8 py-3 rounded-full font-bold text-lg transition duration-300 ease-in-out hover:bg-blue-100 hover:shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
