import React from 'react';

// The function to run when the button is clicked
function TicketCard({ ticket, onAccept }) {
  
  const isAccepted = ticket.status === 'Accepted by NGO';

  return (
    <div style={{ 
      border: '1px solid #e2e8f0', 
      padding: '20px', 
      borderRadius: '10px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
      backgroundColor: isAccepted ? '#f0fdf4' : 'white' // Turns light green if accepted
    }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{ticket.user_name}</p>
      <p style={{ margin: '5px 0', color: '#475569' }}><strong>Item:</strong> {ticket.item_description}</p>
      <p style={{ margin: '5px 0', color: '#475569' }}>
        <strong>Status:</strong> 
        <span style={{ 
          color: isAccepted ? '#16a34a' : '#d97706',
          fontWeight: 'bold',
          marginLeft: '5px'
        }}>
          {ticket.status || 'Pending'}
        </span>
      </p>
      
      {!isAccepted && (
        <button onClick={() => onAccept(ticket.id)} className="btn-primary" style={{ width: '100%', marginTop: '15px' }}>
          Accept Pickup
        </button>
      )}
    </div>
  );
}

export default TicketCard;