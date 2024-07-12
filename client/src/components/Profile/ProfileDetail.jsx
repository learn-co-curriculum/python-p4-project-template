import React from 'react';

const ProfileDetail = ({ user, books, bookClubs, userMemberships, assignments }) => {
    const userBookClubs = bookClubs.filter(club => userMemberships.includes(club.id));

    return (
        <div>
            <h1>{user ? ` ${user.username}` : null}'s Profile!</h1>
            {/* Book Clubs Section */}
            <div className="book-clubs-section">
                <ul>
                    {userBookClubs.map(club => (
                        <li key={club.id}>
                            <h4>{club.name}</h4>
                            <p>{club.description}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Books Section */}
            <div className="books-section">
                <ul>
                    {books.map(book => {
                        const bookAssignments = assignments.filter(a => a.book_id === book.id && userMemberships.includes(a.club_id));
                        if (bookAssignments.length > 0) {
                            return (
                                <li key={book.id}>
                                    <div>
                                        <h4>{book.title}</h4>
                                        <p>{book.author}</p>
                                        <p>{book.description}</p>
                                        {bookAssignments.map(a => {
                                            const assignedClub = bookClubs.find(club => club.id === a.club_id);
                                            return assignedClub ? (
                                                <div key={a.id}>
                                                    <p>Assigned to: {assignedClub.name}</p>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ProfileDetail;