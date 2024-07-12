import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import './BookClub.css'; 

const BookClub = () => {
    const { user } = useContext(UserContext);
    const [bookClubs, setBookClubs] = useState([]);
    const [books, setBooks] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [clubMembers, setClubMembers] = useState({});
    const [selectedClubId, setSelectedClubId] = useState(null);

    useEffect(() => {
        fetchBookClubs();
        fetchBooks();
        fetchAssignments();
    }, []);

    const fetchBookClubs = () => {
        fetch('/book_clubs')
            .then(response => response.json())
            .then(data => {
                setBookClubs(data);
                data.forEach(club => fetchClubMembers(club.id));
            })
            .catch(error => console.error('Error fetching book clubs:', error));
    };

    const fetchBooks = () => {
        fetch('/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    };

    const fetchAssignments = () => {
        fetch('/assignments')
            .then(response => response.json())
            .then(data => setAssignments(data))
            .catch(error => console.error('Error fetching assignments:', error));
    };

    const fetchClubMembers = (clubId) => {
        fetch(`/book_clubs/${clubId}`)
            .then(response => response.json())
            .then(data => {
                setClubMembers(prevMembers => ({
                    ...prevMembers,
                    [clubId]: data.memberships.map(m => m.user),
                }));
            })
            .catch(error => {
                console.error(`Error fetching members for club ${clubId}:`, error);
                setClubMembers(prevMembers => ({
                    ...prevMembers,
                    [clubId]: [],
                }));
            });
    };

    const joinBookClub = (clubId) => {
        fetch('/memberships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, club_id: clubId }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to join book club');
                setClubMembers(prev => ({ ...prev, [clubId]: [...prev[clubId], user] }));
            })
            .catch(error => console.error('Error joining book club:', error));
    };

    const leaveBookClub = (clubId) => {
        fetch(`/memberships/${clubId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to leave book club');
                setClubMembers(prev => ({ ...prev, [clubId]: prev[clubId].filter(u => u.id !== user.id) }));
            })
            .catch(error => console.error('Error leaving book club:', error));
    };

    const addToClub = (bookId) => {
        if (!selectedClubId) {
            alert("Please select a book club first.");
            return;
        }
    
        const isMember = clubMembers[selectedClubId]?.some(member => member.id === user.id);
        if (!isMember) {
            alert("You must be a member of the selected book club to add a book.");
            return;
        }
    
        const existingAssignment = assignments.find(a => a.book_id === bookId && a.book_club_id === selectedClubId);
        if (existingAssignment) {
            alert("This book is already assigned to this club.");
            return;
        }
    
        fetch('/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id: bookId, club_id: selectedClubId }),
        })
            .then(res => res.json())
            .then(response => {
                setAssignments(prev => [...prev, response]);
            })
            .catch(error => {
                console.error('Error adding book to club:', error.message);
                alert(error.message); 
            });
    };
    const removeFromClub = (assignmentId) => {
        fetch(`/assignments/${assignmentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to remove book from club');
                setAssignments(prev => prev.filter(a => a.id !== assignmentId));
            })
            .catch(error => console.error('Error removing book from club:', error));
    };

    return (
        <div className="book-club-container">
            <h1>Book ~ Nook</h1>

            {/* Book Clubs Section */}
            <div className="book-clubs-section">
                <h2> All Book Clubs</h2>
                <div className="club-container">
                    {bookClubs.map(club => (
                        <div key={club.id} className="book-club-item">
                            <h4>{club.name}</h4>
                            <p>{club.description}</p>
                            <div className="book-club-section">
                                <div className="associated-books">
                                    <h4>Associated Books:</h4>
                                    <ul>
                                        {assignments
                                            .filter(a => a.book_club_id === club.id)
                                            .map(a => {
                                                const book = books.find(book => book.id === a.book_id);
                                                return book ? (
                                                    <li key={a.id}>{book.title}</li>
                                                ) : null;
                                            })}
                                    </ul>
                                </div>
                                <div className="members">
                                    <h4>Members:</h4>
                                    <ul>
                                        {clubMembers[club.id]?.map(member => (
                                            <li key={member.id}>{member.username}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="actions">
                                    {!clubMembers[club.id]?.some(member => member.id === user.id) ? (
                                        <button onClick={() => joinBookClub(club.id)}>Join</button>
                                    ) : (
                                        <button onClick={() => leaveBookClub(club.id)}>Leave</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* All Books Section */}
            <div className="books-section">
                <h2>All Books</h2>
                <div className="book-container">
                    {books.map(book => (
                        <div key={book.id} className="book-item">
                            <h4 style={{ textAlign: 'center' }}>{book.title}</h4>
                            <p>Author: {book.author}</p>
                            <p>Description: {book.description}</p>
                            <img src={book.image_url} alt={book.title} style={{ maxWidth: '200px' }} />
                            <div>
                                <h4>Associated Clubs:</h4>
                                <ul>
                                    {assignments
                                        .filter(a => a.book_id === book.id)
                                        .map(a => (
                                            <li key={a.id}>{bookClubs.find(club => club.id === a.book_club_id)?.name}</li>
                                        ))}
                                </ul>
                            </div>
                            <select onChange={(e) => setSelectedClubId(e.target.value)}>
                                <option value="">Select Book Club</option>
                                {bookClubs.map(club => (
                                    <option key={club.id} value={club.id}>{club.name}</option>
                                ))}
                            </select>
                            <button onClick={() => addToClub(book.id)}>Add to Club</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookClub;
