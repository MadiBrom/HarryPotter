import React, { useState, useEffect } from 'react';
import { fetchActivities } from '../API/api';

const UserFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities().then(data => {
      setActivities(data);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Activity Feed</h1>
      {activities.length > 0 ? (
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              {activity.user.username}: {activity.content} at {new Date(activity.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : <p>No activities found</p>}
    </div>
  );
};

export default UserFeed;
