import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import React, { useState } from 'react';

// 1. The Form Component
// This is the sidebar menu where users will type their name and job title.
function FormComponent({ portfolioData, setPortfolioData }) {
  
  const handleInputChange = (event) => {
    // This instantly updates the state as the user types
    setPortfolioData({
      ...portfolioData,
      [event.target.name]: event.target.value
    });
  };

  return (
    <div style={{ width: '300px', padding: '20px', borderRight: '2px solid #ddd' }}>
      <h3>Portfolio Details</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label><strong>Name:</strong></label><br />
        <input 
          type="text" 
          name="name" 
          placeholder="e.g. Jane Doe"
          value={portfolioData.name} 
          onChange={handleInputChange} 
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label><strong>Job Title:</strong></label><br />
        <input 
          type="text" 
          name="jobTitle" 
          placeholder="e.g. Web Developer"
          value={portfolioData.jobTitle} 
          onChange={handleInputChange} 
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
    </div>
  );
}

// 2. The Preview Component
// This is the live-updating window that displays what the actual portfolio looks like.
function PreviewComponent({ portfolioData }) {
  return (
    <div style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
      <h3>Live Preview</h3>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '50px', 
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {/* These elements update instantly when state changes */}
        <h1 style={{ margin: '0 0 10px 0' }}>
          {portfolioData.name || "Your Name Here"}
        </h1>
        <h2 style={{ color: '#555', margin: 0 }}>
          {portfolioData.jobTitle || "Your Job Title Here"}
        </h2>
      </div>
    </div>
  );
}

// 3. The App Component
// The main container that holds everything together.
export default function App() {
  // We use `useState` to tell React to save the data and instantly send it to the Preview Component.
  const [portfolioData, setPortfolioData] = useState({
    name: '',
    jobTitle: ''
  });

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <FormComponent 
        portfolioData={portfolioData} 
        setPortfolioData={setPortfolioData} 
      />
      <PreviewComponent 
        portfolioData={portfolioData} 
      />
    </div>
  );
}