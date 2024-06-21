import React, { useState, useEffect } from 'react';
import './Mission.css';
import { useSpace } from '../App';
import { Button, Card, ListGroup, ButtonGroup } from 'react-bootstrap';

const tasks = [
    'Observation',
    'Equipment Repair',
    'Surface Test',
    'Collect Debris',
    'Alien Contact'
];

const equipment = [
    'Night Vision Goggles',
    'Universal Translator Radio',
    'Laser',
    'Shovels',
    'Sample Containers',
    'Cameras',
    'Grab Poles',
    'Collection Nets',
    'Beakers',
    'Toolbox',
    'Gift Offerings'
];

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

const Mission = () => {
    const [missions, setMissions] = useState(() => {
        const saved = localStorage.getItem("missions");
        return saved ? JSON.parse(saved) : initialMissions;
    });
    const [selectedMissionId, setSelectedMissionId] = useState(() => {
        const saved = localStorage.getItem("selectedMissionId");
        return saved ? JSON.parse(saved) : null;
    });
    const [expandedMissionId, setExpandedMissionId] = useState(null);
    const [availableTasks, setAvailableTasks] = useState(() => {
        const saved = localStorage.getItem("availableTasks");
        return saved ? JSON.parse(saved) : {};
    });
    const [availableEquipment, setAvailableEquipment] = useState(() => {
        const saved = localStorage.getItem("availableEquipment");
        return saved ? JSON.parse(saved) : {};
    });
    const [selectedTasks, setSelectedTasks] = useState(() => {
        const saved = localStorage.getItem("selectedTasks");
        return saved ? JSON.parse(saved) : {};
    });
    const [selectedEquipment, setSelectedEquipment] = useState(() => {
        const saved = localStorage.getItem("selectedEquipment");
        return saved ? JSON.parse(saved) : {};
    });
    const { celestialBodies, totalDistance, destinations } = useSpace();
    const [form, setForm] = useState({ name: '', description: '', imageurl: '' });

    useEffect(() => {
        if (missions.length > 0) {
            const initTasks = {};
            const initEquipment = {};
            missions.forEach(mission => {
                if (!availableTasks[mission.id]) {
                    initTasks[mission.id] = ["Observation", "Equipment Repair", "Surface Test", "Collect Debris", "Alien Contact"];
                }
                if (!availableEquipment[mission.id]) {
                    initEquipment[mission.id] = ["Night Vision Goggles", "Universal Translator Radio", "Laser", "Shovels", "Sample Containers", "Cameras", "Grab Poles", "Collection Nets", "Beakers", "Toolbox", "Gift Offerings"];
                }
            });
            setAvailableTasks(prev => ({ ...prev, ...initTasks }));
            setAvailableEquipment(prev => ({ ...prev, ...initEquipment }));
        }
    }, [missions, availableTasks, availableEquipment]);

    useEffect(() => {
        localStorage.setItem("availableTasks", JSON.stringify(availableTasks));
    }, [availableTasks]);

    useEffect(() => {
        localStorage.setItem("availableEquipment", JSON.stringify(availableEquipment));
    }, [availableEquipment]);

    useEffect(() => {
        localStorage.setItem("selectedTasks", JSON.stringify(selectedTasks));
    }, [selectedTasks]);

    useEffect(() => {
        localStorage.setItem("selectedEquipment", JSON.stringify(selectedEquipment));
    }, [selectedEquipment]);

    const handleMissionSelect = id => {
        setSelectedMissionId(id);
        setExpandedMissionId(null);
        localStorage.setItem("selectedMissionId", JSON.stringify(id));
    };

    const handleMissionDeselect = () => {
        setSelectedMissionId(null);
        setExpandedMissionId(null);
        localStorage.removeItem("selectedMissionId");
    };

    const toggleTask = (missionId, task) => {
        if (selectedTasks[missionId]?.includes(task)) {
            setAvailableTasks({
                ...availableTasks,
                [missionId]: [...availableTasks[missionId], task]
            });
            setSelectedTasks({
                ...selectedTasks,
                [missionId]: selectedTasks[missionId].filter(t => t !== task)
            });
        } else {
            setAvailableTasks({
                ...availableTasks,
                [missionId]: availableTasks[missionId].filter(t => t !== task)
            });
            setSelectedTasks({
                ...selectedTasks,
                [missionId]: [...(selectedTasks[missionId] || []), task]
            });
        }
    };

    const toggleEquipment = (missionId, equipmentItem) => {
        if (selectedEquipment[missionId]?.includes(equipmentItem)) {
            setAvailableEquipment({
                ...availableEquipment,
                [missionId]: [...availableEquipment[missionId], equipmentItem]
            });
            setSelectedEquipment({
                ...selectedEquipment,
                [missionId]: selectedEquipment[missionId].filter(e => e !== equipmentItem)
            });
        } else {
            setAvailableEquipment({
                ...availableEquipment,
                [missionId]: availableEquipment[missionId].filter(e => e !== equipmentItem)
            });
            setSelectedEquipment({
                ...selectedEquipment,
                [missionId]: [...(selectedEquipment[missionId] || []), equipmentItem]
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMission = {
            id: missions.length + 1,
            name: form.name,
            description: form.description,
            imageurl: form.imageurl,
            isNew: true
        };
        setMissions(prevData => {
            const updatedData = [...prevData, newMission];
            localStorage.setItem("missions", JSON.stringify(updatedData));
            return updatedData;
        });
        setForm({ name: '', description: '', imageurl: '' });
    };

    const handleDelete = (id) => {
        setMissions(prevData => {
            const newData = prevData.filter(mission => mission.id !== id);
            localStorage.setItem("missions", JSON.stringify(newData));
            return newData;
        });
        if (selectedMissionId === id) {
            handleMissionDeselect();
        }
    };

    useEffect(() => {
        localStorage.setItem("missions", JSON.stringify(missions));
    }, [missions]);

    return (
        <div className="container">
            <h1 className="mission-title my-3"><span className="emoji">🛰️</span> Missions <span className="emoji">🛰️</span></h1>
            <div className="row">
                {selectedMissionId ? (
                    <>
                        <div className="col-md-8">
                            <Card className="mission-card">
                                <Card.Img variant="top" src={missions.find(m => m.id === selectedMissionId).imageurl} />
                                <Card.Body>
                                    <Card.Title className="card-title">💫 {missions.find(m => m.id === selectedMissionId).name} 💫</Card.Title>
                                    <Card.Text className="card-section">👽 {missions.find(m => m.id === selectedMissionId).description} </Card.Text>
                                    <p className="card-section"><strong>Distance:</strong> {totalDistance} light years</p>
                                    <p className="card-section"><strong>Destination:</strong> {destinations}</p>
                                    <div className="card-section">
                                        <strong>Tasks:</strong>
                                        <ListGroup>
                                            {selectedTasks[selectedMissionId]?.map(task => (
                                                <ListGroup.Item key={task} onClick={() => toggleTask(selectedMissionId, task)} className="clickable-item">{task}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                    <div className="card-section">
                                        <strong>Equipment:</strong>
                                        <ListGroup>
                                            {selectedEquipment[selectedMissionId]?.map(equipment => (
                                                <ListGroup.Item key={equipment} onClick={() => toggleEquipment(selectedMissionId, equipment)} className="clickable-item">{equipment}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                    <ButtonGroup vertical>
                                        <Button variant="primary" onClick={handleMissionDeselect}>Unselect Mission</Button>
                                        {missions.find(m => m.id === selectedMissionId).isNew && (
                                            <Button variant="danger" className="mt-2" onClick={() => handleDelete(selectedMissionId)}>Delete Mission</Button>
                                        )}
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <div className="task-equipment-container">
                                <Card className="task-card mb-3">
                                    <Card.Body>
                                        <h4>Tasks</h4>
                                        <ListGroup variant="flush">
                                            {availableTasks[selectedMissionId]?.map(task => (
                                                <ListGroup.Item key={task} onClick={() => toggleTask(selectedMissionId, task)} className="clickable-item">{task}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                                <Card className="equipment-card">
                                    <Card.Body>
                                        <h4>Equipment</h4>
                                        <ListGroup variant="flush">
                                            {availableEquipment[selectedMissionId]?.map(item => (
                                                <ListGroup.Item key={item} onClick={() => toggleEquipment(selectedMissionId, item)} className="clickable-item">{item}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </>
                ) : (
                    missions.map(mission => (
                        <div key={mission.id} className="col-md-4 mb-3">
                            <Card className="mission-card" onClick={() => setExpandedMissionId(expandedMissionId === mission.id ? null : mission.id)}>
                                <Card.Img variant="top" src={mission.imageurl} />
                                <Card.Body>
                                    <Card.Title className="card-title">💫 {mission.name} 💫</Card.Title>
                                    {expandedMissionId === mission.id && (
                                        <>
                                            <Card.Text className="card-section">👽 {mission.description} </Card.Text>
                                            <ButtonGroup vertical>
                                                <Button variant="primary" onClick={() => handleMissionSelect(mission.id)}>Select Mission</Button>
                                                {mission.isNew && (
                                                    <Button variant="danger" className="mt-2" onClick={() => handleDelete(mission.id)}>Delete Mission</Button>
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
            <div className="add-mission-form-container">
                <h3>🛰️ Add A Mission 🛰️</h3>
                <form className="add-mission-form" onSubmit={handleSubmit}>
                    <input type="text" className="form-control" placeholder="Name" name="name" value={form.name} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Image URL" name="imageurl" value={form.imageurl} onChange={handleChange} />
                    <button type="submit" className="btn btn-primary mt-2">Add</button>
                </form>
            </div>
        </div>
    );
};

export default Mission;



