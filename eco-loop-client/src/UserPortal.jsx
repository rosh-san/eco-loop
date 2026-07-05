import React, { use, useState } from 'react';

function UserPortal() {
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');
  const [item, setItem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRequest = async (e) => {
    e.preventDefault(); // Stops the page from automatically refreshing

    // Pack the data exactly how the backend expects it in req.body
    const ticketData = {
      user: userName,
      address: address,
      item: item
    };

    setIsSubmitting(true);

    try {
      // Send the POST request across the bridge to Port 3000
      const response = await fetch('https://python-practice-ttra.onrender.com/api/request-pickup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
      });
      if (!response.ok){
        throw new Error('Server rejected the request.')
      }
      const result = await response.json();

      setUserName('');
      setAddress('');
      setItem('');
      
      console.log("Success:", result);
      alert("Pickup Requested Successfully!"); // A simple popup for the user
      
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Error: Could not submit")
    } finally {
      setIsSubmitting(false);
    }
  };

  // THE UI
  return (
    <div className='page-container'>
      <h1 style={{ color: '#1a4a38', marginBottom: '10px' }} >Eco-Loop: Schedule a Pickup</h1>
      
      {/* When the form submits, it runs the Engine function above */}
      <form onSubmit={submitRequest} className='modern-form'>
        
        <input 
          type="text" 
          placeholder="Your Full Name" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)} 
          required 
        />
        
        <input 
          type="text" 
          placeholder="Pickup Address" 
          value={address}
          onChange={(e) => setAddress(e.target.value)} 
          required 
        />
        
        <input 
          type="text" 
          placeholder="What are you recycling?" 
          value={item}
          onChange={(e) => setItem(e.target.value)} 
          required 
        />
        
        <button type="submit" className='btn-primary' disabled={isSubmitting} style={{opacity: isSubmitting ? 0.7 : 1 }}
          > {isSubmitting ? 'Routing to NGO...' : 'Submit Request'} </button>
      </form>
    </div>
  );
}

export default UserPortal;