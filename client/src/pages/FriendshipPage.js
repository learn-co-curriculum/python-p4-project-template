import React, { useState, useEffect } from 'react';

function FriendshipPage({ currentUser }) {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchFriends = () => {
    fetch('/api/friends')
      .then(res => res.json())
      .then(data => setFriends(data));
  };

  const fetchFriendRequests = () => {
    fetch('/api/friend-requests')
      .then(res => res.json())
      .then(data => setFriendRequests(data));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`/api/users/search?q=${searchTerm}`)
      .then(res => res.json())
      .then(data => setSearchResults(data));
  };

  const handleAddFriend = (userId) => {
    fetch('/api/friend-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then(() => {
        setSearchResults(prevResults =>
          prevResults.map(user =>
            user.id === userId ? { ...user, requestSent: true } : user
          )
        );
      });
  };

  const handleAcceptRequest = (requestId) => {
    fetch(`/api/friend-requests/${requestId}/accept`, { method: 'POST' })
      .then(() => {
        fetchFriends();
        fetchFriendRequests();
      });
  };

  const handleRejectRequest = (requestId) => {
    fetch(`/api/friend-requests/${requestId}/reject`, { method: 'POST' })
      .then(() => fetchFriendRequests());
  };

  const handleDeleteFriend = (friendId) => {
    fetch(`/api/friends/${friendId}`, { method: 'DELETE' })
      .then(() => fetchFriends());
  };

  return (
    <div>
      <h2>Friendship Management</h2>

      <div>
        <h3>Your Friends</h3>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              {friend.username}
              <button onClick={() => handleDeleteFriend(friend.id)}>Remove Friend</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Friend Requests</h3>
        <ul>
          {friendRequests.map(request => (
            <li key={request.id}>
              {request.sender.username} wants to be your friend
              <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
              <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Search Users</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
          />
          <button type="submit">Search</button>
        </form>
        <ul>
          {searchResults.map(user => (
            <li key={user.id}>
              {user.username}
              {!user.isFriend && !user.requestSent && (
                <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
              )}
              {user.requestSent && <span>Friend request sent</span>}
              {user.isFriend && <span>Already friends</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FriendshipPage;