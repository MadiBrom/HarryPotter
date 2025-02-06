import React from 'react';
import AllUsers from './AllUsers';
import RegisterAdmin from "./RegisterAdmin";
import PromoteAdmin from './PromoteAdmin';
import "./css/dash.css";

const AdminDashboard = ({ token, setToken, setUser, isAdmin }) => {
  return (
    <div className='admin-dashboard'>
      <div className='all-users-container'>
        <AllUsers token={token} />
      </div>
      <div className='register-admin-form'>
        <RegisterAdmin setToken={setToken} setUser={setUser} />
      </div>
      <div className='promote-admin'>
        <PromoteAdmin authToken={token} isAdmin={isAdmin} />
      </div>
    </div>
  );
}

export default AdminDashboard;
