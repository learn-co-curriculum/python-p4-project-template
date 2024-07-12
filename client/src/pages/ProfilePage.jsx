import React from 'react';
import ProfileDetail from '../components/Profile/ProfileDetail';
import ProfileForms from '../components/Profile/ProfileForms';

const ProfilePage = ({ user, bookClubs, books, assignments, setBookClubs, setBooks, userMemberships }) => {
    return (
        <div>
            <ProfileDetail
                user={user} 
                books={books}
                bookClubs={bookClubs}
                userMemberships={userMemberships}
                assignments={assignments}
            />
            <ProfileForms
                user={user} 
                bookClubs={bookClubs}
                setBookClubs={setBookClubs}
                books={books}
                setBooks={setBooks}
            />
        </div>
    );
};

export default ProfilePage;