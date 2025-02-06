import React, { useState, useEffect } from 'react';
import { postToFeed, fetchPosts } from '../API/api'; // Import functions

const ForYou = ({ userId, token }) => {
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [posts, setPosts] = useState([]); // State for storing posts

  // Fetch posts when the component mounts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Adjust fetchPosts to pass the token if required by your API
        const postsData = await fetchPosts(token); 
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    loadPosts();
  }, [token]); // Include token in dependency array if its change should re-trigger this effect

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.trim() || !userId) return; // Check for userId as well

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const result = await postToFeed(post, userId, token); // Pass both post content and userId, and token if necessary
      setSuccessMessage('Post successfully uploaded!');
      setPost('');

      // Optionally pass token to fetchPosts if needed
      const updatedPosts = await fetchPosts(token);
      setPosts(updatedPosts);
    } catch (err) {
      setError('Failed to post. Please try again.');
      console.error('Posting error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Share Your Thoughts</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write something..."
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <div>
        <h2>Comments Feed:</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="comment">
              <p>{post.content}</p>
              <small>Posted by {post.user.username}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ForYou;
