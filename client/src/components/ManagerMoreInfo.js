import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ManagerMoreInfo() {
  const params = useParams();
  const [manager, setManager] = useState()

  useEffect(() => {
      fetch(`http://localhost:4000/managers/${params.id}`)
        .then(res => res.json())
        .then(active_manager => setManager(active_manager))
  }, [params.id])

  if (!manager) {
    return <div>Loading...</div>;
  }

  return (
      <div className='card' key={manager.id}>
          <h1>{manager.name}</h1>
          {manager.employees.map((employee) => (
            <h4 key={employee}><li>{employee}</li></h4>
          ))}
      </div>
    )
}

export default ManagerMoreInfo