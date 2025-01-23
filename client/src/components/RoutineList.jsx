import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RoutineCard from './RoutineCard.jsx';

const RoutineList = ({ routines, handleRoutineDelete }) => {
    return (
        <Container>
            <Row>
                {routines && routines.map((routine) => 
                    <Col key={routine.id} xs={4}>
                        <RoutineCard routine={routine} handleRoutineDelete={handleRoutineDelete} />
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default RoutineList;