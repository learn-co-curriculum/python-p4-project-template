// components/Albums.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    genre: "",
    release_date: "",
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const response = await axios.get("/albums");
    setAlbums(response.data);
  };

  const handleChange = (e) => {
    setNewAlbum({ ...newAlbum, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/albums", newAlbum);
    fetchAlbums();
  };

  return (
    <div>
      <h1>Albums</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          onChange={handleChange}
        />
        <input
          type="date"
          name="release_date"
          placeholder="Release Date"
          onChange={handleChange}
        />
        <button type="submit">Add Album</button>
      </form>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            {album.title} by {album.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumList;
