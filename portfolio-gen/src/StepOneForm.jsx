import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};




import SectionBuilder from './SectionBuilder';

export default function DynamicBuilderForm({ portfolioData, setPortfolioData, onNext }) {

  const textAreaRef = useRef(null);

  const [activeEditor, setActiveEditor] = useState(null); // null or 'hero'
  useEffect(() => {
    if (activeEditor === 'hero' && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.getEditor().focus();
      }, 100);
    }
  }, [activeEditor]);

  const [newPageName, setNewPageName] = useState('');


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
  };

  const handlePageKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPage();
    }
  };

  const handleCloseEditor = () => {
    if (activeEditor === 'hero') {
      setPortfolioData({ ...portfolioData, heroText: '' });
    }
    setActiveEditor(null);
  }

  const handleSaveEditor = () => {
    setActiveEditor(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>


      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Start of your Main Page</label>
        <div
          onClick={() => setActiveEditor('hero')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '1rem',
            cursor: 'pointer',
            color: portfolioData.heroText ? 'var(--text-main)' : 'var(--text-muted)',
            backgroundColor: 'var(--bg-card)',
            minHeight: '60px',
            boxSizing: 'border-box'
          }}
        >
          {portfolioData.heroText ? 'Edit your main page content...' : 'Click me and start typing...'}
        </div>
      </div>

      <hr style={{ border: '1px solid var(--border-color)' }} />

      {/* 2. DYNAMIC PAGES BUILDER */}
      <div className="pages-container">
        <label className="section-label">Your Pages</label>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>
          <em>* Note: The Contact page is automatically included and will be customized in Step 3.</em>
        </p>

        <ul className="pages-list">
          {portfolioData.pages.map((page, index) => (
            <li key={index} className="page-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {page}
              {page !== 'Contact' && (
                <button onClick={() => handleDeletePage(index)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '1rem', color: 'inherit', lineHeight: 1 }}>&times;</button>
              )}
            </li>
          ))}
        </ul>

        <div className="add-page-wrapper">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={handlePageKeyDown}
            placeholder="e.g. About Me"
            className="page-input"
          />
          <button onClick={handleAddPage} className="add-btn">
            + Add Page
          </button>
        </div>
      </div>

      <hr style={{ border: '1px solid var(--border-color)' }} />

      {/* 3. DYNAMIC SECTIONS BUILDER */}
      <SectionBuilder 
        sections={portfolioData.sections}
        onChange={(newSections) => setPortfolioData({...portfolioData, sections: newSections})}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <button onClick={onNext} className="save-button" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
          Go to Pages →
        </button>
      </div>

      {activeEditor !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>

          {/* The Actual White Pop-up Window */}
          <div style={{
            backgroundColor: 'var(--bg-card)', width: '90%', maxWidth: '1200px', height: '90%',
            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)'
          }}>

            {/* Pop-up Header with Close Button */}
            <div className='navbar-text-editor'>
              <h2 style={{ margin: 0 }} className='editor-title'>Text Editor</h2>

              {/* This button changes the state back to null, closing the pop-up */}
              <div className="button-group">
                <button
                  onClick={() => handleCloseEditor()}
                  className='delete-button'
                >
                  Delete Text X
                </button>
                <button
                  onClick={() => handleSaveEditor()}
                  className='save-button'
                >
                  Save Text
                </button>
              </div>
            </div>

            <ReactQuill
              ref={textAreaRef}
              theme="snow"
              modules={quillModules}
              value={activeEditor === 'hero' ? portfolioData.heroText : ''}
              onChange={(content) => {
                if (activeEditor === 'hero') {
                  setPortfolioData({ ...portfolioData, heroText: content });
                }
              }} >
            </ReactQuill>

          </div>
        </div>
      )}

    </div>
  );
}