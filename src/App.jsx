import { useState, useEffect } from 'react';
import './App.css';
import StepOneForm from './StepOneForm';
import StepTwoForm from './StepTwoForm';
import StepThreeForm from './StepThreeForm';
import FinalBuild from './FinalBuild';
import { generatePreviewPages } from './htmlGenerator';
import styleCss from './style.css?raw';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioData, setPortfolioData] = useState({
  name: '',
  heroText: '',
  pages: ['Contact'], 
  sections: [], 
  pageSections: {}, 
  contact: {
    text: '',
    if_message: true,
    email: '',
    phone: '',
    linkedin: '',
    github: ''
  }
});


  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState('index.html');

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'NAVIGATE') {
        setPreviewPage(e.data.page);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-main)' }}>

      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>Portfolio Builder</h2>
          
          <button
            onClick={() => setShowPreview(true)}
            style={{ padding: '12px 24px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: '1px solid var(--border-color)' }} 
          >
            Open Live Preview
          </button>
        </div>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
            {currentStep === 1 && (
              <StepOneForm 
                portfolioData={portfolioData} 
                setPortfolioData={setPortfolioData} 
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <StepTwoForm 
                portfolioData={portfolioData} 
                setPortfolioData={setPortfolioData} 
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <StepThreeForm 
                portfolioData={portfolioData} 
                setPortfolioData={setPortfolioData} 
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 4 && (
              <FinalBuild 
                portfolioData={portfolioData} 
                onBack={() => setCurrentStep(3)}
              />
            )}
        </div>
      </div>

      {/* --- THE POP-UP MODAL: Conditionally Rendered --- */}
      {/* React only renders this chunk if showPreview is TRUE */}
      {showPreview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          
          {/* The Actual White Pop-up Window */}
          <div style={{
            backgroundColor: 'var(--bg-card)', width: '90%', maxWidth: '1200px', height: '90%',
            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)'
          }}>
            
            {/* Pop-up Header with Close Button */}
            <div style={{ padding: '15px 25px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Live Preview</h3>
              
              {/* This button changes the state back to FALSE, closing the pop-up */}
              <button
                onClick={() => setShowPreview(false)}
                className="delete-button"
              >
                Close Preview X
              </button>
            </div>

            {/* Pop-up Content (The actual preview) */}
            <div style={{ flex: 1, padding: '0', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
              <iframe 
                srcDoc={generatePreviewPages(portfolioData, styleCss)[previewPage] || '<div style="padding: 20px; text-align: center; font-family: sans-serif;">Page not found</div>'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#fff'
                }}
                title="Live Preview"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}