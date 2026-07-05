import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';

function NgoDashboard() {
  // State to hold the array of tickets from PostgreSQL
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []); // The empty brackets mean "only run this once"

  // Read the database
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('ngoToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/view-pickups`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPickups(data.activePickups); // Save the DB rows into React memory.
      } else {
        console.error("Backend rejected us:", data.error);
      }
      
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  // The PATCH Route: Accept a ticket.
  const acceptPickup = async (id) => {
    try {
      const token = localStorage.getItem('ngoToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/accept-pickup/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // If successful, instantly re-fetch the tickets to update the screen
        fetchTickets(); 
      }
    } catch (error) {
      console.error("Failed to accept ticket:", error);
    }
  };

  // The UI.
  return (
    <div className='page-container'>
      <h2 style={{ color: '#1a4a38', marginBottom: '20px' }} >Green Earth Foundation: Active Requests</h2>
      
      {pickups.length === 0 ? (
        <p style={{ color: '#64748b' }}>No active pickups right now.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          
          {/* The Map: Pass the data into the Props! */}
          {pickups.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket}          // Passing the data
              onAccept={acceptPickup}  // Passing the engine function
            />
          ))}
          
        </div>
      )}
    </div>
  );
}

export default NgoDashboard;