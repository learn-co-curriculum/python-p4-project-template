// components/Members.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function Members() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const response = await axios.get("/members");
    setMembers(response.data);
  };

  const handleChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/members", newMember);
    fetchMembers();
  };

  return (
    <div>
      <h1>Members</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <button type="submit">Add Member</button>
      </form>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} ({member.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Members;
