import React, { useMemo, useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateNavbar, generateFooter, buildFullPage } from './htmlGenerator';
import styleCss from './style.css?raw';

export default function FinalBuild({ portfolioData, onBack }) {
  const [activeTab, setActiveTab] = useState('index.html');
  const [viewMode, setViewMode] = useState('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'NAVIGATE') {
        setActiveTab(e.data.page);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const { pagesHtml, previewHtml } = useMemo(() => {
    // 1. Navbar & Footer
    const userData = {
      name: portfolioData.name || 'My Portfolio',
      is_avail: true,
      links: [
        { label: 'Home', url: './index.html' },
        ...portfolioData.pages.map(p => ({ label: p, url: `./${p.toLowerCase().replace(/\s+/g, '-')}.html` }))
      ]
    };

    const navbarHtml = generateNavbar(userData);
    const footerHtml = generateFooter(userData);

    const generatedPages = {};
    const previewPages = {};

    // 2. index.html
    const indexSections = [];
    if (portfolioData.heroText) {
      indexSections.push({ type: 'text-only', content: portfolioData.heroText });
    }
    indexSections.push(...portfolioData.sections);
    
    generatedPages['index.html'] = buildFullPage(
      indexSections,
      navbarHtml,
      footerHtml,
      `${userData.name} - Home`
    );
    previewPages['index.html'] = buildFullPage(
      indexSections,
      navbarHtml,
      footerHtml,
      `${userData.name} - Home`,
      true,
      styleCss
    );

    // 3. Custom Pages
    portfolioData.pages.forEach(pageName => {
      if (pageName === 'Contact') return;
      const sections = portfolioData.pageSections[pageName] || [];
      const fileName = `${pageName.toLowerCase().replace(/\s+/g, '-')}.html`;
      
      generatedPages[fileName] = buildFullPage(
        sections,
        navbarHtml,
        footerHtml,
        `${userData.name} - ${pageName}`
      );
      previewPages[fileName] = buildFullPage(
        sections,
        navbarHtml,
        footerHtml,
        `${userData.name} - ${pageName}`,
        true,
        styleCss
      );
    });

    // 4. Contact.html
    if (portfolioData.pages.includes('Contact')) {
      const contactSection = {
        type: 'contact-page',
        ...portfolioData.contact
      };
      generatedPages['contact.html'] = buildFullPage(
        [contactSection],
        navbarHtml,
        footerHtml,
        `${userData.name} - Contact`
      );
      previewPages['contact.html'] = buildFullPage(
        [contactSection],
        navbarHtml,
        footerHtml,
        `${userData.name} - Contact`,
        true,
        styleCss
      );
    }

    // 5. style.css
    generatedPages['style.css'] = styleCss;
    previewPages['style.css'] = styleCss;

    return { pagesHtml: generatedPages, previewHtml: previewPages };
  }, [portfolioData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pagesHtml[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    const zip = new JSZip();

    // 1. Add all HTML pages & CSS
    Object.keys(pagesHtml).forEach(filename => {
      zip.file(filename, pagesHtml[filename]);
    });

    // 2. Add images
    const imgFolder = zip.folder('images');
    
    // Check main sections
    portfolioData.sections.forEach(sec => {
      if (sec.image && sec.image.name) {
        imgFolder.file(sec.image.name, sec.image);
      }
    });

    // Check custom pages
    portfolioData.pages.forEach(pageName => {
      const pageSecs = portfolioData.pageSections[pageName] || [];
      pageSecs.forEach(sec => {
        if (sec.image && sec.image.name) {
          imgFolder.file(sec.image.name, sec.image);
        }
      });
    });

    // 3. Generate and download
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'portfolio.zip');
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Step 4: Your Generated Portfolio</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here is the raw HTML code for your website. Copy it or download the complete ZIP!</p>
        </div>
        <button 
          onClick={handleDownloadZip} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            fontSize: '1.05rem',
            fontWeight: '600',
            color: '#ffffff',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
            transition: 'transform 0.2s ease-in-out',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download ZIP
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', overflowX: 'auto' }}>
        {Object.keys(pagesHtml).map(filename => (
          <button
            key={filename}
            onClick={() => setActiveTab(filename)}
            style={{
              padding: '10px 20px',
              border: '1px solid var(--border-color)',
              background: activeTab === filename ? 'var(--accent)' : 'var(--bg-elevated)',
              color: activeTab === filename ? '#fff' : 'var(--text-main)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: activeTab === filename ? 'bold' : 'normal',
              whiteSpace: 'nowrap'
            }}
          >
            {filename}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('preview')}
            style={{
              padding: '8px 20px',
              border: 'none',
              backgroundColor: viewMode === 'preview' ? 'var(--bg-main)' : 'transparent',
              boxShadow: viewMode === 'preview' ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: viewMode === 'preview' ? 'bold' : 'normal',
              color: viewMode === 'preview' ? 'var(--text-main)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Live Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            style={{
              padding: '8px 20px',
              border: 'none',
              backgroundColor: viewMode === 'code' ? 'var(--bg-main)' : 'transparent',
              boxShadow: viewMode === 'code' ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: viewMode === 'code' ? 'bold' : 'normal',
              color: viewMode === 'code' ? 'var(--text-main)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Raw Code
          </button>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {viewMode === 'code' || activeTab === 'style.css' ? (
          <>
            <button 
              onClick={handleCopy}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '8px 16px',
                backgroundColor: copied ? 'var(--accent)' : 'var(--bg-elevated)',
                color: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <textarea
              readOnly
              value={pagesHtml[activeTab] || ''}
              style={{
                width: '100%',
                height: '500px',
                padding: '20px',
                paddingTop: '50px',
                backgroundColor: '#000000',
                color: 'var(--accent)',
                fontFamily: 'monospace',
                fontSize: '14px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </>
        ) : (
          <iframe 
            srcDoc={previewHtml[activeTab] || ''}
            style={{
              width: '100%',
              height: '600px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}
            title="Live Preview"
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
        <button onClick={onBack} className="add-btn" style={{ padding: '10px 20px', backgroundColor: '#6b7280' }}>
          ← Back to Contact Page
        </button>
      </div>
    </div>
  );
}
