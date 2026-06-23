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

export default function SectionBuilder({ sections, onChange }) {
  const textAreaRef = useRef(null);
  const [activeEditor, setActiveEditor] = useState(null); // null or section index
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagText, setNewTagText] = useState({});
  const [newHighlightText, setNewHighlightText] = useState({});

  useEffect(() => {
    if (activeEditor !== null && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.getEditor().focus();
      }, 100);
    }
  }, [activeEditor]);

  const handleCloseEditor = () => {
    updateSection(activeEditor, 'content', '');
    setActiveEditor(null);
  }

  const handleSaveEditor = () => {
    setActiveEditor(null);
  }

  const handleAddSection = (type) => {
    const newSection = {
      id: Date.now(),
      type: type,
      content: '',
      image: null,
      title: '',
      link: '',
      objectives: '',
      highlights: [],
      tags: []
    };
    onChange([...sections, newSection]);
    setIsModalOpen(false);
  };

  const handleDeleteSection = (indexToRemove) => {
    const updatedSections = sections.filter((_, index) => index !== indexToRemove);
    onChange(updatedSections);
  };

  const updateSection = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    onChange(updatedSections);
  };

  const handleAddTag = (sectionIndex) => {
    const text = newTagText[sectionIndex] || '';
    if (text.trim() !== '') {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].tags.push(text);
      onChange(updatedSections);
      setNewTagText({ ...newTagText, [sectionIndex]: '' });
    }
  };

  const handleDeleteTag = (sectionIndex, tagIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].tags = updatedSections[sectionIndex].tags.filter((_, i) => i !== tagIndex);
    onChange(updatedSections);
  };

  const handleTagKeyDown = (e, sectionIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(sectionIndex);
    }
  };

  const handleAddHighlight = (sectionIndex) => {
    const text = newHighlightText[sectionIndex] || '';
    if (text.trim() !== '') {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].highlights.push(text);
      onChange(updatedSections);
      setNewHighlightText({ ...newHighlightText, [sectionIndex]: '' });
    }
  };

  const handleDeleteHighlight = (sectionIndex, highlightIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].highlights = updatedSections[sectionIndex].highlights.filter((_, i) => i !== highlightIndex);
    onChange(updatedSections);
  };

  const handleHighlightKeyDown = (e, sectionIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHighlight(sectionIndex);
    }
  };

  const updateHighlight = (sectionIndex, highlightIndex, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].highlights[highlightIndex] = value;
    onChange(updatedSections);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <label style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Your Sections</label>
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          + Add Section
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {sections.map((section, index) => (
          <div key={section.id} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span className="section-title-label" style={{ marginBottom: 0 }}>{section.type.replace('-', ' ')}</span>
              <button onClick={() => handleDeleteSection(index)} className="delete-button" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Delete Section
              </button>
            </div>
            
            {section.type === 'project' && (
              <input
                type="text"
                placeholder="Project Title"
                value={section.title}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                className="modern-input"
              />
            )}

            <input
              type="text"
              placeholder="External Link (Optional)"
              value={section.link || ''}
              onChange={(e) => updateSection(index, 'link', e.target.value)}
              className="modern-input"
            />

            <div style={{ marginBottom: '20px' }}>
              <div
                onClick={() => setActiveEditor(index)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: section.content ? 'var(--text-main)' : 'var(--text-muted)',
                  backgroundColor: 'var(--bg-main)',
                  minHeight: '60px',
                  boxSizing: 'border-box'
                }}
              >
                {section.content ? 'Edit your content...' : 'Click me and start typing...'}
              </div>
            </div>

            {(section.type === 'text-image' || section.type === 'project') && (
              <div style={{ marginBottom: '20px' }}>
                <label className="section-title-label">Upload Image</label>
                <input type="file" onChange={(e) => updateSection(index, 'image', e.target.files[0])} />
              </div>
            )}

            {section.type === 'project' && (
              <div className="highlight-container">
                <label className="section-title-label" style={{ marginBottom: '10px' }}>Highlights</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {section.highlights.map((high, hIndex) => (
                    <span key={hIndex} className="highlight-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {high}
                      <button onClick={() => handleDeleteHighlight(index, hIndex)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '1rem', color: 'inherit', lineHeight: 1 }}>&times;</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input className="modern-input" style={{ marginBottom: 0 }} placeholder="New highlight..." value={newHighlightText[index] || ''} onChange={(e) => setNewHighlightText({ ...newHighlightText, [index]: e.target.value })} onKeyDown={(e) => handleHighlightKeyDown(e, index)} />
                  <button onClick={() => handleAddHighlight(index)} className="add-btn">Add</button>
                </div>
              </div>
            )}

            <div className="tag-container">
              <label className="section-title-label" style={{ marginBottom: '10px' }}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {section.tags.map((tag, tIndex) => (
                  <span key={tIndex} className="tag-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {tag}
                    <button onClick={() => handleDeleteTag(index, tIndex)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '1rem', color: 'inherit', lineHeight: 1 }}>&times;</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input className="modern-input" style={{ marginBottom: 0 }} placeholder="New tag..." value={newTagText[index] || ''} onChange={(e) => setNewTagText({ ...newTagText, [index]: e.target.value })} onKeyDown={(e) => handleTagKeyDown(e, index)} />
                <button onClick={() => handleAddTag(index)} className="add-btn">Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '400px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-main)', marginBottom: '25px' }}>Choose a Section Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button onClick={() => handleAddSection('text-only')} className="modal-option-btn">Text Only</button>
              <button onClick={() => handleAddSection('text-image')} className="modal-option-btn">Text & Image</button>
              <button onClick={() => handleAddSection('project')} className="modal-option-btn">Project Showcase</button>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="modal-cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {activeEditor !== null && (
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
              value={sections[activeEditor]?.content || ''}
              onChange={(content) => {
                updateSection(activeEditor, 'content', content);
              }} >
            </ReactQuill>
          </div>
        </div>
      )}
    </div>
  );
}
