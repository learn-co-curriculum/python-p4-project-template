import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './HomePage.css';

const HomePage = ({ clubMembers }) => {
    const { user } = useContext(UserContext);
    const [booksRead, setBooksRead] = useState([]);
    const [recommendedBook, setRecommendedBook] = useState(null);
    const [bookClubs, setBookClubs] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const fetchBooksRead = async () => {
        try {
            if (user) {
                const response = await fetch('/assignments');
                if (!response.ok) {
                    throw new Error('Failed to fetch books read');
                }
                const assignments = await response.json();
                const bookIds = assignments.map(assignment => assignment.book_id);

                const booksResponse = await fetch('/books');
                if (!booksResponse.ok) {
                    throw new Error('Failed to fetch book details');
                }
                const books = await booksResponse.json();
                const filteredBooks = books.filter(book => bookIds.includes(book.id));
                setBooksRead(filteredBooks);
            }
        } catch (error) {
            console.error('Error fetching books read:', error);
        }
    };

    const fetchRecommendedBook = async () => {
        try {
            if (user) {
                const url = `/recommended-books/${user.id}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch recommended book');
                }
                const recommendedBookData = await response.json();
                setRecommendedBook(recommendedBookData);
            }
        } catch (error) {
            console.error('Error fetching recommended book:', error);
        }
    };

    const fetchBookClubs = async () => {
        try {
            const response = await fetch('/book_clubs');
            if (!response.ok) {
                throw new Error('Failed to fetch book clubs');
            }
            const data = await response.json();
            setBookClubs(data);
        } catch (error) {
            console.error('Error fetching book clubs:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch('/assignments');
            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    useEffect(() => {
        fetchBooksRead();
        fetchRecommendedBook();
        fetchBookClubs();
        fetchAssignments();
    }, [user]);

    const handleRefreshClick = async () => {
        await fetchRecommendedBook();
    };

    return (
        <div className="home-page-container">
            <h1 className="welcome-message">Welcome to Fireside Book~Nook!</h1>
            <div className="main-content">
                <div className="section-container books-section">
                    <h2>Books You've Read</h2>
                    <ul className="books-read-list">
                        {booksRead.map(book => (
                            <li key={book.id}>
                                <img src={book.image_url} alt={book.title} />
                                <div className="book-details">
                                    <h3>{book.title}</h3>
                                    <p>Author: {book.author}</p>
                                    <p>Description: {book.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="section-container recommended-section">
                    <h2>Recommended Book</h2>
                    {recommendedBook && (
                        <div className="recommended-book">
                            <img src={recommendedBook.image_url || ''} alt={recommendedBook.title} style={{ display: 'block', margin: '0 auto' }} />
                            <div className="book-details">
                                <h3>{recommendedBook.title}</h3>
                                <p>Author: {recommendedBook.authors ? recommendedBook.authors.join(', ') : 'Unknown'}</p>
                                <p>Description: {recommendedBook.description}</p>
                            </div>
                            <button onClick={handleRefreshClick} style={{ display: 'block', margin: '0 auto' }}>Generate Another Book</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;













// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from '../context/UserContext';
// import './HomePage.css';

// const HomePage = ({ clubMembers }) => {
//     const { user } = useContext(UserContext);
//     const [booksRead, setBooksRead] = useState([]);
//     const [recommendedBook, setRecommendedBook] = useState(null);
//     const [bookClubs, setBookClubs] = useState([]);
//     const [assignments, setAssignments] = useState([]);
//     const [selectedClubId, setSelectedClubId] = useState(null);

//     const fetchBooksRead = async () => {
//         try {
//             if (user) {
//                 const response = await fetch('/assignments');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch books read');
//                 }
//                 const assignments = await response.json();
//                 const bookIds = assignments.map(assignment => assignment.book_id);

//                 const booksResponse = await fetch('/books');
//                 if (!booksResponse.ok) {
//                     throw new Error('Failed to fetch book details');
//                 }
//                 const books = await booksResponse.json();
//                 const filteredBooks = books.filter(book => bookIds.includes(book.id));
//                 setBooksRead(filteredBooks);
//             }
//         } catch (error) {
//             console.error('Error fetching books read:', error);
//         }
//     };

//     const fetchRecommendedBook = async () => {
//         try {
//             if (user) {
//                 const url = `/recommended-books/${user.id}`;
//                 const response = await fetch(url);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch recommended book');
//                 }
//                 const recommendedBookData = await response.json();
//                 setRecommendedBook(recommendedBookData);
//             }
//         } catch (error) {
//             console.error('Error fetching recommended book:', error);
//         }
//     };

//     const fetchBookClubs = async () => {
//         try {
//             const response = await fetch('/book_clubs');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch book clubs');
//             }
//             const data = await response.json();
//             setBookClubs(data);
//         } catch (error) {
//             console.error('Error fetching book clubs:', error);
//         }
//     };

//     const fetchAssignments = async () => {
//         try {
//             const response = await fetch('/assignments');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch assignments');
//             }
//             const data = await response.json();
//             setAssignments(data);
//         } catch (error) {
//             console.error('Error fetching assignments:', error);
//         }
//     };

//     useEffect(() => {
//         fetchBooksRead();
//         fetchRecommendedBook();
//         fetchBookClubs();
//         fetchAssignments();
//     }, [user]);

//     const addToClub = async () => {
//         if (!selectedClubId) {
//             alert("Please select a book club first.");
//             return;
//         }

//         if (!recommendedBook || !recommendedBook.id) {
//             alert("No recommended book selected.");
//             return;
//         }

//         const isMember = bookClubs.some(club => club.id === selectedClubId);
//         if (!isMember) {
//             alert("You cannot add a recommended book to a club you are not a member of.");
//             return;
//         }

//         const existingAssignment = assignments.find(a => a.book_id === recommendedBook.id && a.book_club_id === selectedClubId);
//         if (existingAssignment) {
//             alert("This book is already assigned to this club.");
//             return;
//         }

//         try {
//             const requestBody = {
//                 book_id: recommendedBook.id,
//                 club_id: selectedClubId
//             };

//             const response = await fetch('/assignments', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(requestBody),
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to add book to club: ${errorText}`);
//             }

//             const newAssignment = await response.json();
//             setAssignments(prev => [...prev, newAssignment]);

//             alert("Book added to your club successfully!");

//         } catch (error) {
//             console.error('Error adding book to club:', error.message);
//             alert(error.message);
//         }
//     };

//     const handleRefreshClick = async () => {
//         await fetchRecommendedBook();
//     };

//     return (
//         <div className="home-page-container">
//             <h1 className="welcome-message">Welcome to Fireside Book~Nook!</h1>
//             <div className="main-content">
//                 <div className="section-container books-section">
//                     <h2>Books You've Read</h2>
//                     <ul className="books-read-list">
//                         {booksRead.map(book => (
//                             <li key={book.id}>
//                                 <img src={book.image_url} alt={book.title} />
//                                 <div className="book-details">
//                                     <h3>{book.title}</h3>
//                                     <p>Author: {book.author}</p>
//                                     <p>Description: {book.description}</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//                 <div className="section-container recommended-section">
//                     <h2>Recommended Book</h2>
//                     {recommendedBook && (
//                         <div className="recommended-book">
//                             <img src={recommendedBook.image_url || ''} alt={recommendedBook.title} style={{ display: 'block', margin: '0 auto' }} />
//                             <div className="book-details">
//                                 <h3>{recommendedBook.title}</h3>
//                                 <p>Author: {recommendedBook.authors ? recommendedBook.authors.join(', ') : 'Unknown'}</p>
//                                 <p>Description: {recommendedBook.description}</p>
//                             </div>
//                             <div className="add-to-club">
//                                 <select onChange={(e) => setSelectedClubId(e.target.value)}>
//                                     <option value="">Select Book Club</option>
//                                     {bookClubs.map(club => (
//                                         <option key={club.id} value={club.id}>{club.name}</option>
//                                     ))}
//                                 </select>
//                                 <button onClick={addToClub}>Add to Club</button>
//                             </div>
//                             <button onClick={handleRefreshClick} style={{ display: 'block', margin: '0 auto' }}>Generate Another Book</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomePage;







