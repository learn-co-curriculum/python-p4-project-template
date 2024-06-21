import React, { useState, useEffect } from 'react';
import { useSpace } from '../App';
import './CelestialBody.css';

const CelestialBody = () => {
    const [visibleDetails, setVisibleDetails] = useState(() => {
        const saved = localStorage.getItem("visibleDetails");
        return saved ? JSON.parse(saved) : {};
    });

    const [form, setForm] = useState({
        name: '',
        description: '',
        type: '',
        distance: '',
        imageUrl: ''
    });

    const { celestialBodies, toggleCelestialBody } = useSpace();

    const initialCelestialBodies = [
        {
            id: 1,
            name: "Nibiru's Echo",
            description: "A mystical body rumored to have been the home of advanced ancient civilizations.",
            type: "planet",
            distance: "5 million light years",
            imageUrl: "https://t4.ftcdn.net/jpg/05/85/34/33/360_F_585343315_HzKX5Ur6xIY9XancV1FcG85zmhd2Xbku.jpg"
        },
        {
            id: 2,
            name: "Polaris Prime",
            description: "The brightest star in the constellation known as the North Star.",
            type: "star",
            distance: "433 light years",
            imageUrl: "https://storage.googleapis.com/pod_public/1300/154252.jpg"
        },
        {
            id: 3,
            name: "Stellar Whirlpool",
            description: "A mesmerizing galaxy with a prominent supermassive black hole at its center.",
            type: "galaxy",
            distance: "23 million light years",
            imageUrl: "https://as1.ftcdn.net/v2/jpg/05/41/11/68/1000_F_541116858_GaBIJxT4yF5uVcxfFib9imDfN4SzAFVO.jpg"
        }
    ];

    const [celestialBodiesData, setCelestialBodiesData] = useState(() => {
        const saved = localStorage.getItem("celestialBodies");
        return saved ? JSON.parse(saved) : initialCelestialBodies;
    });

    useEffect(() => {
        const saved = localStorage.getItem("celestialBodies");
        if (saved) {
            const savedData = JSON.parse(saved);
            const mergedData = [...initialCelestialBodies, ...savedData.filter(savedBody => !initialCelestialBodies.some(initialBody => initialBody.id === savedBody.id))];
            setCelestialBodiesData(mergedData);
        } else {
            setCelestialBodiesData(initialCelestialBodies);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("celestialBodies", JSON.stringify(celestialBodiesData));
    }, [celestialBodiesData]);

    useEffect(() => {
        localStorage.setItem("visibleDetails", JSON.stringify(visibleDetails));
    }, [visibleDetails]);

    const toggleDetails = id => {
        setVisibleDetails(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const isSelected = (id) => {
        return celestialBodies.some(body => body.id === id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBody = {
            id: celestialBodiesData.length + 1,
            name: form.name,
            description: form.description,
            type: form.type,
            distance: form.distance,
            imageUrl: form.imageUrl,
            isNew: true
        };
        setCelestialBodiesData(prevData => [...prevData, newBody]);
        setForm({ name: '', description: '', type: '', distance: '', imageUrl: '' });
    };

    const handleDelete = (id) => {
        setCelestialBodiesData(prevData => {
            const newData = prevData.filter(body => body.id !== id);
            localStorage.setItem("celestialBodies", JSON.stringify(newData));
            return newData;
        });
    };

    return (
        <div className="container celestial-container">
            <h1 className="celestial-title my-3"><span className="emoji">🌌</span> Destinations: Celestial Bodies <span className="emoji">🌌</span></h1>
            <div className="row">
                {celestialBodiesData.map((body) => (
                    <div key={body.id} className="col-md-4 mb-3">
                        <div className="card celestial-card" onClick={() => toggleDetails(body.id)}>
                            <img src={body.imageUrl} className="card-img-top" alt={body.name} />
                            <div className="card-body">
                                <h5 className="card-title">
                                    <span className="emoji">🪐</span>
                                    <strong>{body.name}</strong>
                                    <span className="emoji">🪐</span>
                                </h5>
                                {visibleDetails[body.id] && (
                                    <>
                                        <p className="card-text">{body.description}</p>
                                        <p className="card-text"><strong>🌠 Type:</strong> {body.type}</p>
                                        <p className="card-text"><strong>🌠 Distance:</strong> {body.distance}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCelestialBody(body);
                                            }}
                                        >
                                            {isSelected(body.id) ? 'Remove from Mission' : 'Add to Mission'}
                                        </button>
                                        {body.isNew && (
                                            <button
                                                className="btn btn-danger mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(body.id);
                                                }}
                                            >
                                                Delete Celestial Body
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="add-celestial-form-container">
                <h3>🌌 Add A Destination 🌌</h3>
                <form className="add-celestial-form" onSubmit={handleSubmit}>
                    <input type="text" className="form-control" placeholder="Name" name="name" value={form.name} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Type" name="type" value={form.type} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Distance" name="distance" value={form.distance} onChange={handleChange} />
                    <input type="text" className="form-control" placeholder="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                    <button type="submit" className="btn btn-primary mt-2">Add</button>
                </form>
            </div>
        </div>
    );
};

export default CelestialBody;