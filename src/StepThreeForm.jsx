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

export default function StepThreeForm({ portfolioData, setPortfolioData, onBack, onNext }) {
  const textAreaRef = useRef(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (isEditorOpen && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.getEditor().focus();
      }, 100);
    }
  }, [isEditorOpen]);

  const updateContact = (field, value) => {
    setPortfolioData({
      ...portfolioData,
      contact: {
        ...portfolioData.contact,
        [field]: value
      }
    });
  };

  const { contact } = portfolioData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h2>Step 3: Contact Page</h2>
        <p style={{ color: 'var(--text-muted)' }}>Let visitors know how to reach you.</p>
      </div>

      {/* 1. Introduction Text */}
      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Introduction Message</label>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>A short message (e.g. "I am currently accepting freelance projects...")</p>
        <div
          onClick={() => setIsEditorOpen(true)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '1rem',
            cursor: 'pointer',
            color: contact.text ? 'var(--text-main)' : 'var(--text-muted)',
            backgroundColor: 'var(--bg-card)',
            minHeight: '60px',
            boxSizing: 'border-box'
          }}
        >
          {contact.text ? 'Edit your message...' : 'Click me and start typing...'}
        </div>
      </div>

      <hr style={{ border: '1px solid var(--border-color)' }} />

      {/* 2. Contact Form Toggle */}
      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Contact Form</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-main)' }}>
          <input 
            type="checkbox" 
            checked={contact.if_message}
            onChange={(e) => updateContact('if_message', e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '1.05rem' }}>Include a direct message form</span>
        </label>
      </div>

      <hr style={{ border: '1px solid var(--border-color)' }} />

      {/* 3. Contact Details */}
      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '15px' }}>Contact Details (All Optional)</label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="jane@example.com" 
              value={contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="modern-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Phone Number</label>
            <input 
              type="tel" 
              placeholder="+1 234 567 890" 
              value={contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="modern-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>LinkedIn URL</label>
            <input 
              type="url" 
              placeholder="https://linkedin.com/in/..." 
              value={contact.linkedin}
              onChange={(e) => updateContact('linkedin', e.target.value)}
              className="modern-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>GitHub URL</label>
            <input 
              type="url" 
              placeholder="https://github.com/..." 
              value={contact.github}
              onChange={(e) => updateContact('github', e.target.value)}
              className="modern-input"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button onClick={onBack} className="add-btn" style={{ padding: '10px 20px', backgroundColor: 'var(--bg-elevated)' }}>
          ← Back to Pages
        </button>
        <button onClick={onNext} className="save-button" style={{ padding: '15px 30px', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)' }}>
          Finish Portfolio 🎉
        </button>
      </div>

      {/* --- TEXT EDITOR POP-UP (MODAL) --- */}
      {isEditorOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)', width: '90%', maxWidth: '1200px', height: '90%',
            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)'
          }}>
            <div className='navbar-text-editor'>
              <h2 style={{ margin: 0 }} className='editor-title'>Text Editor</h2>
              <div className="button-group">
                <button
                  onClick={() => {
                    updateContact('text', '');
                    setIsEditorOpen(false);
                  }}
                  className='delete-button'
                >
                  Clear Text X
                </button>
                <button
                  onClick={() => setIsEditorOpen(false)}
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
              value={contact.text}
              onChange={(content) => updateContact('text', content)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
