import React from 'react'
import AllUsers from './AllUsers'
import RegisterAdmin from "./RegisterAdmin";


const AdminDashboard = ({token, setToken, setUser}) => {
  return (
    <div>
      <AllUsers token={token} />
      <RegisterAdmin setToken={setToken} setUser={setUser} />
    </div>
  )
}

export default AdminDashboard
