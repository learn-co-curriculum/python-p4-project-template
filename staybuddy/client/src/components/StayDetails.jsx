import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const StayDetails = () => {
  const { id } = useParams();
  const [stay, setStay] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/stays/${id}`)
      .then(res => res.json())
      .then(data => setStay(data));
  }, [id]);

  if (!stay) return <p>Loading...</p>;

  return (
    <div>
      <h2>{stay.title}</h2>
      <p><strong>Location:</strong> {stay.location}</p>
      <p><strong>Price:</strong> ${stay.price}/night</p>
      <p>{stay.description}</p>
    </div>
  );
};

export default StayDetails;