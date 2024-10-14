import React from 'react'
import { Link } from 'react-router-dom'
// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-center items-center h-10 mx-auto">
      <div className="w-full flex justify-center">
          <hr className="w-1/2 border-t border-gray-500 m-2 drop-shadow-lg" />
      </div>
      <div className="w-full mx-auto">
        <p className="text-sm text-grey-300 p-4">
          <Link to="https://github.com/afkjon">afkjon</Link> @ 2024
        </p>
      </div>
    </footer>
  )
}

export default Footer
