import React from 'react';

function TicketCard({ ticket, onAccept }) {
  return (
    <div style={{ 
      border: '1px solid #e2e8f0', 
      padding: '20px', 
      borderRadius: '12px', 
      background: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    }}>
      <h3 style={{ marginTop: '0', color: '#1e293b' }}>{ticket.item_type}</h3>
      <p style={{ color: '#475569', fontSize: '14px' }}><strong>Quantity:</strong> {ticket.quantity}</p>
      <p style={{ color: '#475569', fontSize: '14px' }}><strong>Address:</strong> {ticket.address}</p>
      
      {}
      <p style={{ fontSize: '14px' }}>
        <strong>Status: </strong> 
        <span style={{ 
          background: ticket.status === 'accepted' ? '#dcfce7' : '#fef3c7', 
          color: ticket.status === 'accepted' ? '#166534' : '#92400e',
          padding: '4px 8px',
          borderRadius: '999px',
          fontWeight: 'bold'
        }}>
          {ticket.status}
        </span>
      </p>

      {}
      {ticket.status !== 'accepted' && (
        <button 
          onClick={() => onAccept(ticket.id)} 
          style={{ 
            background: '#1a4a38', 
            color: '#fff', 
            padding: '10px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            border: 'none', 
            width: '100%', 
            marginTop: '15px',
            fontWeight: 'bold'
          }}
        >
          Accept Pickup
        </button>
      )}
    </div>
  );
}

export default TicketCard;