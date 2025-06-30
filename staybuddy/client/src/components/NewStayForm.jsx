import { useState } from 'react';
import { postWithToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

function NewStayForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newStay = { title, location, price: parseFloat(price) };
    const data = await postWithToken('http://localhost:5000/stays', newStay);

    if (data.id) {
      alert('Stay created!');
      navigate('/stays');
    } else {
      alert(data.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Stay</h2>
      <label>Title:</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Location:</label>
      <input value={location} onChange={(e) => setLocation(e.target.value)} required />

      <label>Price per Night:</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        step="0.01"
        required
      />

      <button type="submit">Create Stay</button>
    </form>
  );
}

export default NewStayForm;
