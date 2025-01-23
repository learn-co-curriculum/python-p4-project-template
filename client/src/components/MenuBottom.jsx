import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../assets/css/theme.css';

const MenuBottom = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/" className="text-white">
                    <Button variant="outline-light" className="menu-btn">Home</Button>
                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link href="/exercises">
                        <Button variant="outline-light" className="menu-btn">View All Exercises</Button>
                    </Nav.Link>
                    <Nav.Link href="/account">
                        <Button variant="outline-light" className="menu-btn">Edit Account Info</Button>
                    </Nav.Link>
                    <Nav.Link href="/logout">
                        <Button variant="outline-light" className="menu-btn">Logout</Button>
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default MenuBottom;