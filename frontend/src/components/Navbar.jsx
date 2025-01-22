import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/houses')}>Houses</button>
      <button onClick={() => navigate('/register')}>Register</button>

    </div>
  )
}

export default Navbar
