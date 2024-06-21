import React, { useState, useEffect } from 'react';
import './Mission.css';
import { useSpace } from '../App';
import { Button, Card, ListGroup, ButtonGroup, ListGroupItem } from 'react-bootstrap';

const initialMissions = [
    {
        id: 1,
        name: "Space Quest: Echoes of an Ancient Civilization",
        description: "A long-lost civilization's secrets lie buried beneath the sands of a desolate planet. Your mission: observe the intricate ruins, decipher cryptic symbols, and collect artifacts for analysis. Uncover the truth behind their sudden disappearance and piece together the fragments of their history!",
        imageurl: "https://cdn.mos.cms.futurecdn.net/cf3j6AWGEfJ8LKfTDSekEY.jpg"
    },
    {
        id: 2,
        name: "Stardust Voyage: Cosmic Timeshift",
        description: "A mysterious rift in spacetime threatens to unravel the fabric of reality. Your mission: venture to the edge of the anomaly and conduct surface tests to understand its nature and origin! Can you stabilize the rift before it tears the universe apart?",
        imageurl: "https://www.ingenieur.de/wp-content/uploads/2017/11/2014/1555_Der-Marsrover-Opportunity.jpg"
    },
    {
        id: 3,
        name: "Cosmic Expedition: Is This Life?",
        description: "A dying star system is on the brink of collapse, but rumors of habitable planets persist. Your mission: collect vital resources while conducting thorough surface tests to determine if life could survive in this harsh environment. The clock is ticking, and the fate of countless beings rests in your hands!",
        imageurl: "https://www.universetoday.com/wp-content/uploads/2020/05/RAT_rover_by_night_pillars-1920x1200.jpg"
    },
    {
        id: 4,
        name: "Nebula Nexus: Beacon of the Unknown",
        description: "A cryptic signal from a previously unknown alien species has been intercepted. Your mission: establish alien contact and decipher their complex communication patterns. Are they friend, foe, or something in between? Tread carefully, as the fate of humanity could hang in the balance of this first encounter!",
        imageurl: "https://cdn.images.express.co.uk/img/dynamic/151/590x/Radio-signals-from-space-SETI-Institute-alien-origin-Fast-Radio-Bursts-FRBs-space-news-1168650.jpg?r=1566891356657"
    },
    {
        id: 5,
        name: "Void Voyager: Operation Salvage",
        description: "A vital satellite orbiting a gas giant has malfunctioned, leaving a crucial scientific mission in jeopardy. Your mission: dock with the damaged satellite, conduct equipment repairs, and restore its functionality. The clock is ticking, and the data it holds could unlock the secrets of the universe!",
        imageurl: "https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2000/09/claude_nicollier_repairing_hubble/9233215-7-eng-GB/Claude_Nicollier_repairing_Hubble_pillars.jpg"
    }
];
const initialPlayer = [
    {
        id: 1,
        name: "Astronaut",
        description: "You have trained many years for this moment. Blood, sweat, and tears have been shed just to get to this point. As you look outward towards the stars, you can't help but acknowledge how beautiful this all is. Now it's time to forward humanity!",
        imageurl: "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/03/Astronaut.jpeg?size=*:900",
        age: 41,
        origin: "Earth"
    },
    {
        id: 2,
        name: "Alien",
        description: "As you glide through the cosmos, you marvel at the kaleidoscope of stars and galaxies swirling around your ship, as you have many times before. Your life mission was clear: to observe and understand the matters of every celestial body and being you come across. You wonder, in your quest for knowledge, if a being like yourself exists. Finding one being your ultimate goal!",
        imageurl: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2017_31/2091096/170801-alien-extraterrestrial-mn-1210.jpg",
        age: 743,
        origin: "Unknown"
    },
    {
        id: 3,
        name: "Robonaut 57",
        description: "The latest unveiled project of NASA, Robonaut 57 is the most successful retrieval bot ever manufactured. For decades, \"Jeffrey\", as 57 is known as, has been the main force towards gaining knowledge about space! Commanding Jeffrey has been pass down through the ages...And now it's finally your turn!",
        imageurl: "https://scitechdaily.com/images/Robot-Thinking-Colorful.jpg",
        age: 157,
        origin: "Earth"
    }
];


const Player = () => {
    
    

    const [players, setPlayers] = useState(() => {
        const saved = localStorage.getItem("players");
        return saved ? JSON.parse(saved) : initialPlayer; //Set to initial player
    });
    const [playerId, setplayerId] = useState(() => {
        const saved = localStorage.getItem("playerId");
        return saved ? JSON.parse(saved) : null; //Set to null
    });
    const [expandedMissionId, setExpandedMissionId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', imageurl: '', age: '', origin: '' });

    // useEffect(() => {
        
    // }, [players]); use for missions

    const handleMissionSelect = id => {
        setplayerId(id);
        setExpandedMissionId(null);
        localStorage.setItem("playerId", JSON.stringify(id));
    };

    const handleMissionDeselect = () => {
        setplayerId(null);
        setExpandedMissionId(null);
        localStorage.removeItem("playerId");
    };

    

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMission = {
            id: players.length + 1,
            name: form.name,
            description: form.description,
            imageurl: form.imageurl,
            age: form.age,
            origin: form.origin,
            isNew: true
        };
        setPlayers(prevData => {
            const updatedData = [...prevData, newMission];
            localStorage.setItem("players", JSON.stringify(updatedData));
            return updatedData;
        });
        setForm({ name: '', description: '', imageurl: '' });
    };
    
    const handleDelete = (id) => {
        setPlayers(prevData => {
            const newData = prevData.filter(mission => mission.id !== id);
            localStorage.setItem("players", JSON.stringify(newData));
            return newData;
        });
        if (playerId === id) {
            handleMissionDeselect();
        }
    };

    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
    }, [players]);

    return (
        <div className="container">
            <h1 className="mission-title my-3"><span className="emoji">🛰️</span> Player <span className="emoji">🛰️</span></h1>
            <div className="row">
                {playerId ? (
                    <>
                        <div className="col-md-8">
                            <Card className="mission-card">
                                <Card.Img variant="top" src={players.find(m => m.id === playerId).imageurl} />
                                <Card.Body>
                                    <Card.Title className="card-title">💫 {players.find(m => m.id === playerId).name} 💫</Card.Title>
                                    <Card.Text className="card-section">🚀 {players.find(m => m.id === playerId).description} </Card.Text>
                                    <p className="card-section"><strong>Age:</strong> {players.find(m => m.id === playerId).age} Years Old</p>
                                    <p className="card-section"><strong>Origin:</strong> {players.find(m => m.id === playerId).origin}</p>
                                    <div className="card-section">

                                        
                                    </div>
                                    <div className="card-section">
                                        
                                    </div>
                                    <ButtonGroup vertical>
                                        <Button variant="primary" onClick={handleMissionDeselect}>Unselect Player</Button>
                                        {players.find(m => m.id === playerId).isNew && (
                                            <Button variant="danger" className="mt-2" onClick={() => handleDelete(playerId)}>Delete Player</Button>
                                        )}
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <div className="task-equipment-container">
                                <Card className="task-card mb-3">
                                    <Card.Body>
                                        <h4>Missions</h4>
                                        <ListGroup variant="flush">
                                        {initialMissions?.map(mission => (
                                                <ListGroup.Item key={mission.name} className="clickable-item">{mission.name}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                                
                            </div>
                        </div>
                    </>
                ) : (
                    players.map(mission => (
                        <div key={mission.id} className="col-md-4 mb-3">
                            <Card className="mission-card" onClick={() => setExpandedMissionId(expandedMissionId === mission.id ? null : mission.id)}>
                                <Card.Img variant="top" src={mission.imageurl} />
                                <Card.Body>
                                    <Card.Title className="card-title">💫 {mission.name} 💫</Card.Title>
                                    {expandedMissionId === mission.id && (
                                        <>
                                            <Card.Text className="card-section">🚀 {mission.description} </Card.Text>
                                            <ButtonGroup vertical>
                                                <Button variant="primary" onClick={() => handleMissionSelect(mission.id)}>Select Player</Button>
                                                {mission.isNew && (
                                                    <Button variant="danger" className="mt-2" onClick={() => handleDelete(mission.id)}>Delete Player</Button>
                                                )}
                                            </ButtonGroup>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                )}
            </div>
            <div className="add-player-form-container">
                <h3>🛰️ Explorer 🛰️</h3>
                <form className="add-mission-form" onSubmit={handleSubmit}>
                    <input type="text" className="form-control" placeholder="Name" name="name" value={form.name} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Image URL" name="imageurl" value={form.imageurl} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Age" name="age" value={form.age} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Origin" name="origin" value={form.origin} onChange={handleChange} />
                    <button type="submit" className="btn btn-primary mt-2">Add</button>
                </form>
            </div>
        </div>
    );
};

export default Player;