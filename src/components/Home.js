import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const shoes = [
  { id: 1, name: 'Mens Shoes', path: '/mens-shoes' },
  { id: 2, name: 'Womens Shoes', path: '/womens-shoes' },
  { id: 3, name: 'Kids Shoes', path: '/kids-shoes' },
];

function Home() {
  return (
    <div>
      <header className="App-header">
        <h1>Welcome to ShoeGalore</h1>
        <p>Your one-stop shop for good quality shoes!</p>
      </header>
      <main>
        <h2>Our Collection</h2>
        <div className="shoe-grid">
          {shoes.map(shoe => (
            <Link key={shoe.id} to={shoe.path} className="shoe-card">
              <h3>{shoe.name}</h3>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
