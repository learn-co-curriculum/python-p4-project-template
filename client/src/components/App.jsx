import React, { useContext, useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from '../pages/HomePage';
import BookClub from './Books/BookClub';
import ProfilePage from '../pages/ProfilePage';
import Login from './User/LogIn';
import Signup from './User/Signup';
import { UserContext } from '../context/UserContext';
import About from '../components/About'; // Update the import path if necessary

function PrivateRoute({ children, ...rest }) {
    const { user } = useContext(UserContext);
    return (
        <Route
            {...rest}
            render={() => {
                return user !== null ? (
                    children
                ) : (
                    <Redirect to="/login" />
                );
            }}
        />
    );
}

function App() {
    const { user, setUser } = useContext(UserContext);
    const [bookClubs, setBookClubs] = useState([]);
    const [books, setBooks] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [userMemberships, setUserMemberships] = useState([]);

    useEffect(() => {
        // Fetch data for bookClubs, books, assignments, and userMemberships
        fetch('/book_clubs')
            .then(res => res.json())
            .then(data => setBookClubs(data))
            .catch(error => console.error('Error fetching book clubs:', error));

        fetch('/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));

        fetch('/assignments')
            .then(res => res.json())
            .then(data => setAssignments(data))
            .catch(error => console.error('Error fetching assignments:', error));

        if (user) {
            fetch(`/user_memberships/${user.id}`)
                .then(res => res.json())
                .then(data => setUserMemberships(data))
                .catch(error => console.error('Error fetching user memberships:', error));
        }
    }, [user]);

    return (
        <div>
            <NavBar />
            <Switch>
                <PrivateRoute exact path="/">
                    <HomePage />
                </PrivateRoute>
                <PrivateRoute path="/book-club">
                    <BookClub />
                </PrivateRoute>
                <PrivateRoute path="/profile">
                    <ProfilePage
                        user={user}
                        bookClubs={bookClubs}
                        books={books}
                        assignments={assignments}
                        setBookClubs={setBookClubs}
                        setBooks={setBooks}
                        userMemberships={userMemberships}
                    />
                </PrivateRoute>
                <Route path="/about" component={About} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route
                    path="/signup"
                    render={(props) => <Signup {...props} setUser={setUser} user={user} />}
                />
            </Switch>
        </div>
    );
}

export default App;
