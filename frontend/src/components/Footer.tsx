import React from 'react'
import { Link } from 'react-router-dom'
// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="flex justify-center items-center h-10">
      <p>
        <Link to="https://github.com/afkjon">afkjon</Link> @ 2024
      </p>
    </footer>
  )
}

export default Footer
