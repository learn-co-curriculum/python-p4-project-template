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
    fetch('/friends')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch friends');
        return res.json();
      })
      .then(data => setFriends(data))
      .catch(error => console.error('Error fetching friends:', error));
  };

  const fetchFriendRequests = () => {
    fetch('/friend_requests')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch friend requests');
        return res.json();
      })
      .then(data => setFriendRequests(data))
      .catch(error => console.error('Error fetching friend requests:', error));
  };

  const handleAddFriend = (receiver_id) => {
    console.log(JSON.stringify({ receiver_id }));
    fetch('/friend_requests', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
      },
      body: JSON.stringify( {receiver_id} ),
    })
      .then(res => {
        console.log(res);
        if (!res.ok) throw new Error('Failed to send friend request');
        return res.json();
      })
      .then(() => {
        setSearchResults(prevResults =>
          prevResults.map(user =>
            user.id === receiver_id ? { ...user, requestSent: true } : user
          )
        );
      })
      .catch(error => console.error('Error sending friend request:', error));
  };

  const handleAcceptRequest = (requestId) => {console.log(JSON.stringify({action: 'accept'}));
    fetch(`/friend_request/${requestId}`, { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({action : 'accept'})
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to accept friend request');
      return res.json();
    })
    .then(() => {
      fetchFriends();
      fetchFriendRequests();
    })
    .catch(error => console.error('Error accepting friend request:', error));
  };

  const handleRejectRequest = (requestId) => {
    fetch(`/friend_request/${requestId}`, { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({action : 'reject'})
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to reject friend request');
      return res.json();
    })
    .then(() => {
      fetchFriends();
      fetchFriendRequests();
    })
    .catch(error => console.error('Error rejecting friend request:', error));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`/users`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to search users');
        return res.json();
      })
      .then(data => setSearchResults(data.filter(user=>user.username.toLowerCase()==searchTerm.toLowerCase())
        
      ))
      .catch(error => console.error('Error searching users:', error));
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
              {/* <button onClick={() => handleDeleteFriend(friend.id)}>Remove Friend</button> */}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Friend Requests</h3>
        <ul>
          {friendRequests.map(request => (
            <li key={request.id}>
              {request.invitor_id} wants to be your friend
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