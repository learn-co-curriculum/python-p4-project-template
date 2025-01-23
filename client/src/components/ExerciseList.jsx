import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ExerciseList = ({ exercises, userData }) => {
    return (
        <Container>
            <Row>
                {exercises && exercises.map((exercise) => 
                    <Col key={exercise.id} xs={4}>
                        <ExerciseCard exercise={exercise} userData={userData}/>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default ExerciseList;