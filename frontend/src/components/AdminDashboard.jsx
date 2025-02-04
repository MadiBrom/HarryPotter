import React from 'react'
import AllUsers from './AllUsers'
import RegisterAdmin from "./RegisterAdmin";
import PromoteAdmin from './PromoteAdmin';
import "./dash.css"

const AdminDashboard = ({ token, setToken, setUser, isAdmin }) => {
  return (
    <div className='admin-dashboard'>
      <AllUsers token={token} />
      <RegisterAdmin setToken={setToken} setUser={setUser} />
      <PromoteAdmin authToken={token} isAdmin={isAdmin} />
    </div>
  )
}

export default AdminDashboard;
