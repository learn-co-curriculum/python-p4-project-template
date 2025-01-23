import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import ActionButton from './ActionButton.jsx';
import '../assets/css/theme.css';

const ExerciseCard = ({ exercise, userData }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        fetch('api/routines', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id:parseInt(userData.id),
                                exercise_id:exercise.id,
                                initial_weight:1,
                                current_weight:1,
                                initial_reps:1,
                                current_reps:1,
                                initial_sets:1,
                                current_sets:1,
                                priority:1,
                                day_of_the_week:1
                            }),
          })
        .then((response) => {
            if (response.status === 201) {
                return response.json()
            }
        })
        .then((data) => {
            navigate('/edit-routine/'+data.id)
        })
    };

    return (
        <Card className="exercise-card mb-3" style={{ width: '18rem' }}>
            {exercise.image ? (
                <Card.Img variant="top" src={exercise.image} alt={`${exercise.name} image`} />
            ) : null}
            <Card.Body>
                <Card.Title>{exercise.name || "Exercise_Name"}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {exercise.muscle_group}
                </Card.Subtitle>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">Difficulty Level</div>
                        <Badge bg="danger" pill>
                            {exercise.difficulty_level || "N/A"}
                        </Badge>
                    </ListGroup.Item>
                </ListGroup>
                <Card.Text className="d-flex justify-content-center mt-3">
                    <ActionButton style={{ backgroundColor: 'var(--primary-color)', color: 'white' }} title="Add to Routine" onClick={()=>handleButtonClick()}/>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ExerciseCard;