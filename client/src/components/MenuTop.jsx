import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../assets/css/theme.css';

const MenuTop = ({name, username}) => {
    return (
        <div>
            <Container fluid>
                <Row className="pb-2 justify-content-between">
                    <Col xs={8}>
                        <span className="text-box h4">
                            Welcome, {name}!
                        </span>
                    </Col>
                    <Col xs={2} className="text-box h4">{username}</Col>
                </Row>
            </Container>
        </div>
    );
}

export default MenuTop;
