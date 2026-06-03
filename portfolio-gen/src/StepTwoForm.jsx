import React, { useState } from 'react';
import SectionBuilder from './SectionBuilder';

export default function StepTwoForm({ portfolioData, setPortfolioData, onBack, onNext }) {
  const [newPageName, setNewPageName] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);

  const handleAddPage = () => {
    if (newPageName.trim() !== '') {
      setPortfolioData({
        ...portfolioData,
        pages: [...portfolioData.pages, newPageName]
      });
      setNewPageName(''); 
    }
  };

  const handleDeletePage = (pageIndex) => {
    const updatedPages = portfolioData.pages.filter((_, i) => i !== pageIndex);
    setPortfolioData({
      ...portfolioData,
      pages: updatedPages
    });
    if (selectedPage === pageIndex) {
      setSelectedPage(null);
    } else if (selectedPage > pageIndex) {
      setSelectedPage(selectedPage - 1);
    }
  };

  const handlePageKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPage();
    }
  };

  if (selectedPage !== null) {
    const pageName = portfolioData.pages[selectedPage];
    const pageSections = portfolioData.pageSections[pageName] || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <h2>Editing Page: {pageName}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Add the content and components for this page below.</p>
        </div>

        <SectionBuilder 
          sections={pageSections}
          onChange={(newSections) => {
            setPortfolioData({
              ...portfolioData,
              pageSections: {
                ...portfolioData.pageSections,
                [pageName]: newSections
              }
            });
          }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
          <button onClick={() => setSelectedPage(null)} className="add-btn" style={{ padding: '10px 20px', backgroundColor: 'var(--bg-elevated)' }}>
            ← Back to Pages List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h2>Step 2: Customize Pages</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Select a page below to start customizing its content, or add new pages.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginTop: 0 }}>
          * Note: Your Contact page is automatically generated and will be customized in Step 3.
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input 
            type="text" 
            value={newPageName} 
            onChange={(e) => setNewPageName(e.target.value)} 
            onKeyDown={handlePageKeyDown}
            placeholder="New Page Name..." 
            className="modern-input"
            style={{ marginBottom: 0, width: '300px' }}
          />
          <button onClick={handleAddPage} className="add-btn">
            + Add Page
          </button>
        </div>

        {portfolioData.pages && portfolioData.pages.length > 0 ? (
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {portfolioData.pages.map((page, index) => (
              page === 'Contact' ? null : (
              <div 
                key={index} 
                className="page-chip" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 24px', fontSize: '1.05rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
                onClick={() => setSelectedPage(index)}
              >
                {page}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening the page
                    handleDeletePage(index);
                  }} 
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '1.2rem', color: '#dc2626', lineHeight: 1, marginLeft: '8px' }}
                >
                  &times;
                </button>
              </div>
              )
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No pages created yet. Add one above!</p>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button onClick={onBack} className="add-btn" style={{ padding: '10px 20px', backgroundColor: 'var(--bg-elevated)' }}>
          ← Back to Main Page
        </button>
        <button onClick={onNext} className="save-button" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
          Go to Contact Page →
        </button>
      </div>
    </div>
  );
}
