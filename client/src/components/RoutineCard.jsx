import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import ActionButton from './ActionButton.jsx';
import '../assets/css/theme.css';

const RoutineCard = ({ routine, handleRoutineDelete }) => {
    const days = ["","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

    return (
        <Card className="routine-card mb-3" style={{ width: '18rem' }}>
            {routine.exercise.image ? (
                <Card.Img variant="top" src={routine.exercise.image} alt={`${routine.exercise.name} image`} />
            ) : null}
            <Card.Body>
                <Card.Title>{routine.exercise.name || "Exercise_Name"}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {routine.exercise.muscle_group} ({days[routine.day_of_the_week]})
                </Card.Subtitle>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">Difficulty Level</div>
                        <Badge bg="danger" pill>
                            {routine.exercise.difficulty_level || "N/A"}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">Priority</div>
                        <Badge bg="warning" pill>
                            {routine.priority}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">Weight</div>
                        <Badge bg="success" pill>
                            {routine.current_weight}
                        </Badge>
                        &nbsp;
                        <Badge bg="primary" pill>
                            {routine.initial_weight}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">Reps</div>
                        <Badge bg="success" pill>
                            {routine.current_reps}
                        </Badge>
                        &nbsp;
                        <Badge bg="primary" pill>
                            {routine.initial_reps}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">Sets</div>
                        <Badge bg="success" pill>
                            {routine.current_sets}
                        </Badge>
                        &nbsp;
                        <Badge bg="primary" pill>
                            {routine.initial_sets}
                        </Badge>
                    </ListGroup.Item>
                </ListGroup>
                <Card.Text className="d-flex justify-content-center mt-3">
                    <ActionButton style={{ backgroundColor: 'var(--primary-color)', color: 'white' }} title="Edit Exercise" href={"edit-routine/"+routine.id} />
                    &nbsp;&nbsp;&nbsp;
                    <ActionButton style={{ backgroundColor: 'var(--primary-color)', color: 'white' }} title="Remove" onClick={()=>handleRoutineDelete(routine.id)}/>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default RoutineCard;