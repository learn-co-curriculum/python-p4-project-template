import React, { useState, useEffect } from 'react';
import './ProfileForms.css';



const ProfileForms = ({
    bookClubs,
    setBookClubs,
    books,
    setBooks,
}) => {
    const [newClubName, setNewClubName] = useState('');
    const [newClubDescription, setNewClubDescription] = useState('');
    const [newBookTitle, setNewBookTitle] = useState('');
    const [newBookAuthor, setNewBookAuthor] = useState('');
    const [newBookDescription, setNewBookDescription] = useState('');
    const [newBookImageUrl, setNewBookImageUrl] = useState('');

    const [memberships, setMemberships] = useState([]);
    const [myBooks, setMyBooks] = useState([]);

    const [editingClubId, setEditingClubId] = useState(null);
    const [editingBookId, setEditingBookId] = useState(null);

    useEffect(() => {
        fetchMemberships();
    }, []);

    useEffect(() => {
        fetchMyBooks();
    }, [memberships]);

    const fetchMemberships = () => {
        fetch('/memberships')
            .then(response => response.json())
            .then(data => setMemberships(data))
            .catch(error => console.error('Error fetching memberships:', error));
    };

    const fetchMyBooks = () => {
        const myClubIds = memberships.map(membership => membership.book_club_id);
        fetch('/assignments')
            .then(response => response.json())
            .then(assignments => {
                const myAssignments = assignments.filter(assignment => myClubIds.includes(assignment.book_club_id));
                const bookIds = myAssignments.map(assignment => assignment.book_id);
                fetch('/books')
                    .then(response => response.json())
                    .then(allBooks => {
                        const filteredBooks = allBooks.filter(book => bookIds.includes(book.id));
                        setMyBooks(filteredBooks);
                    })
                    .catch(error => console.error('Error fetching books:', error));
            })
            .catch(error => console.error('Error fetching assignments:', error));
    };

    const handleAddBookClub = () => {
        fetch('/book_clubs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClubName, description: newClubDescription }),
        })
            .then(response => response.json())
            .then(newClub => {
                setBookClubs(prevClubs => [...prevClubs, newClub]);
                setNewClubName('');
                setNewClubDescription('');
            })
            .catch(error => console.error('Error adding book club:', error));
    };

    const handleAddBook = () => {
        fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newBookTitle,
                author: newBookAuthor,
                description: newBookDescription,
                image_url: newBookImageUrl,
            }),
        })
            .then(response => response.json())
            .then(newBook => {
                setBooks(prevBooks => [...prevBooks, newBook]);
                setNewBookTitle('');
                setNewBookAuthor('');
                setNewBookDescription('');
                setNewBookImageUrl('');
            })
            .catch(error => console.error('Error adding book:', error));
    };

    const handleDeleteBookClub = (clubId) => {
        fetch(`/book_clubs/${clubId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setBookClubs(prevClubs => prevClubs.filter(club => club.id !== clubId));
                } else {
                    console.error('Failed to delete book club');
                }
            })
            .catch(error => console.error('Error deleting book club:', error));
    };

    const startEditingClub = (club) => {
        setEditingClubId(club.id);
        setNewClubName(club.name);
        setNewClubDescription(club.description);
    };

    const handleEditClub = (clubId) => {
        const updatedClub = { id: clubId, name: newClubName, description: newClubDescription };
        fetch(`/book_clubs/${clubId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedClub),
        })
            .then(response => response.json())
            .then(updatedClub => {
                setBookClubs(prevClubs =>
                    prevClubs.map(club => (club.id === updatedClub.id ? updatedClub : club))
                );
                setEditingClubId(null);
                setNewClubName('');
                setNewClubDescription('');
            })
            .catch(error => console.error('Error updating club:', error));
    };

    const startEditingBook = (book) => {
        setEditingBookId(book.id);
        setNewBookTitle(book.title);
        setNewBookAuthor(book.author);
        setNewBookDescription(book.description);
        setNewBookImageUrl(book.image_url);
    };

    const handleEditBook = (bookId) => {
        const updatedBook = {
            id: bookId,
            title: newBookTitle,
            author: newBookAuthor,
            description: newBookDescription,
            image_url: newBookImageUrl,
        };
        fetch(`/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBook),
        })
            .then(response => response.json())
            .then(updatedBook => {
                setBooks(prevBooks =>
                    prevBooks.map(book => (book.id === updatedBook.id ? updatedBook : book))
                );
                setEditingBookId(null);
                setNewBookTitle('');
                setNewBookAuthor('');
                setNewBookDescription('');
                setNewBookImageUrl('');
            })
            .catch(error => console.error('Error updating book:', error));
    };

    const handleRemoveFromClub = (assignmentId) => {
        fetch(`/assignments/${assignmentId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setMyBooks(prevBooks =>
                    prevBooks.map(book => ({
                        ...book,
                        assignments: book.assignments.filter(a => a.id !== assignmentId)
                    }))
                );
            } else {
                console.error('Failed to remove book from club');
            }
        })
        .catch(error => console.error('Error removing book from club:', error));
    };
    
    const leaveBookClub = (clubId) => {
        fetch(`/memberships/${clubId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setMemberships(prevMemberships => prevMemberships.filter(membership => membership.book_club_id !== clubId));
            } else {
                console.error('Failed to leave book club');
            }
        })
        .catch(error => console.error('Error leaving book club:', error));
    };

    return (
        <div className="profile-forms">
            <div className="form-container">
                <h3>Create a New Book Club</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newClubDescription}
                    onChange={(e) => setNewClubDescription(e.target.value)}
                />
                <button onClick={handleAddBookClub}>Add Book Club</button>
            </div>

            <div className="form-container">
                <h3>Create a New Book</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newBookDescription}
                    onChange={(e) => setNewBookDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={newBookImageUrl}
                    onChange={(e) => setNewBookImageUrl(e.target.value)}
                />
                <button onClick={handleAddBook}>Add Book</button>
            </div>

            <div className="form-container">
                <h3>Book Clubs</h3>
                <ul className="profile-list">
                    {memberships.map(membership => {
                        const club = bookClubs.find(club => club.id === membership.book_club_id);
                        if (!club) return null;
                        return (
                            <li key={club.id}>
                                {editingClubId === club.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={newClubName}
                                            onChange={(e) => setNewClubName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={newClubDescription}
                                            onChange={(e) => setNewClubDescription(e.target.value)}
                                        />
                                        <button onClick={() => handleEditClub(club.id)}>Save</button>
                                        <button onClick={() => setEditingClubId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{club.name}</span>
                                        <span>{club.description}</span>
                                        <button onClick={() => leaveBookClub(club.id)}>Leave</button>
                                        <button onClick={() => startEditingClub(club)}>Edit</button>
                                        <button onClick={() => handleDeleteBookClub(club.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="form-container">
                <h3>My Books</h3>
                <ul className="profile-list">
                    {myBooks.map(book => (
                        <li key={book.id}>
                            {editingBookId === book.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={newBookTitle}
                                        onChange={(e) => setNewBookTitle(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={newBookAuthor}
                                        onChange={(e) => setNewBookAuthor(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={newBookDescription}
                                        onChange={(e) => setNewBookDescription(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={newBookImageUrl}
                                        onChange={(e) => setNewBookImageUrl(e.target.value)}
                                    />
                                    <button onClick={() => handleEditBook(book.id)}>Save</button>
                                    <button onClick={() => setEditingBookId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <h4>{book.title}</h4>
                                    <span>Author: {book.author}</span>
                                    <span>Description: {book.description}</span>
                                    <img src={book.image_url} alt={book.title} style={{ maxWidth: '100px' }} />
                                    <div>
                                        <h4>Associated Clubs:</h4>
                                        <div>
                                            {book.assignments.map(a => (
                                                <div key={a.id}>
                                                    <p>Assigned to: {bookClubs.find(club => club.id === a.book_club_id)?.name}</p>
                                                    <button onClick={() => handleRemoveFromClub(a.id)}>Remove from Club</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => startEditingBook(book)}>Edit</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProfileForms;
