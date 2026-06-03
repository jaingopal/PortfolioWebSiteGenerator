// Function to generate the Navbar HTML
export const generateNavbar = (userData) => {
  const safeLinks = userData.links || [];
  const linksHtml = safeLinks.map(link => {
    return `<li><a href="${link.url}">${link.label}</a></li>`;
  }).join('\n      ');

  const statusText = userData.is_avail ? "Available for work" : "Not available";
  const statusClass = userData.is_avail ? "status-available" : "status-unavailable";

  return `
  <nav class="navbar">
    <a class="nav-name" href="./index.html">${userData.name}</a>
    
    <div class="hamburger" id="hamburger">
      <span></span><span></span><span></span>
    </div>

    <div class="nav-menu" id="nav-menu">
      <ul class="nav-links">
        ${linksHtml}
      </ul>
      <div class="nav-availability ${statusClass}">
        <span class="status-dot"></span>
        ${statusText}
      </div>
    </div>
  </nav>
  `;
};

const getContactInfo = (section) =>{
  if (section.email || section.phone || section.linkedin || section.github) {
    return `
    <div class="contact-info-wrapper">
      <h2>${section.infoTitle || "Get in Touch"}</h2>
      <div class="contact-info-list">
        ${section.email ? `
          <a href="mailto:${section.email}">
          <div class="contact-card">
            <span class="card-label">EMAIL</span>
            ${section.email} ↗
          </div></a>` : ''}
        ${section.github ? `
          <a href="${section.github}" target="_blank">
          <div class="contact-card">
            <span class="card-label">GITHUB</span>
            github.com/${section.github.split('/').pop()} ↗
          </div></a>` : ''}
        ${section.linkedin ? `
          <a href= "${section.linkedin}" target = "_blank">
          <div class="contact-card">
            <span class="card-label">LINKEDIN</span>
            linkedin.com/in/${section.linkedin.split('/').pop()} ↗
            </div></a>` : ''}
        ${section.phone ? `
          <a href="tel:${section.phone}">
          <div class="contact-card">
            <span class="card-label">PHONE</span>
            ${section.phone} ↗
            </div></a>` : ''}
      </div>
    </div>`;
  }
  return ``;
}

const getMessage = (section) =>{
  if(section.if_message){
    return `<div class="contact-form-wrapper">
            <h2>${section.formTitle || "Send me a message"}</h2>
            <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="text" name="subject" placeholder="Subject" required />
              <textarea name="message" placeholder="Your Message" required></textarea>
              <button type="submit" class="contact-btn">Send Message</button>
            </form>
          </div>
          `
  }
  return ``;
}

export const generateMainContent = (sections, isPreview = false) => {
  const htmlBlocks = sections.map(section => {
    
    const tag = section.link ? 'a' : 'div';
    const hrefAttr = section.link ? ` href="${section.link}" target="_blank"` : '';
    const clickableClass = section.link ? ' clickable-card' : '';

    if (section.type === 'text-only') {
      if(section.tags && section.tags.length > 0){
        const tagsHtml= section.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n');
        return `
          <${tag}${hrefAttr} class="text-block size-${section.size || 'large'}${clickableClass}">
            ${section.content}
            <div class="showcase-tags">${tagsHtml}</div>
          </${tag}>`;
      }
      return `
      <${tag}${hrefAttr} class="text-block size-${section.size || 'large'}${clickableClass}">
        ${section.content}
      </${tag}>`;
    } 
    
    if (section.type === 'text-image') {
      const layoutClasses = `desktop-img-top mobile-img-top`; // Simplify layout for now
      if(section.tags && section.tags.length > 0){
        const tagsHtml= section.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n');
        return `
          <${tag}${hrefAttr} class="flex-block ${layoutClasses}${clickableClass}">
            <img src="${section.image ? (isPreview ? URL.createObjectURL(section.image) : 'images/' + section.image.name) : 'placeholder.jpg'}" alt="Portfolio Image" class="block-image" />
            <div class="block-text">
              ${section.content}
              <div class="showcase-tags">${tagsHtml}</div>
            </div>
          </${tag}>`;
      }     
      return `
      <${tag}${hrefAttr} class="flex-block ${layoutClasses}${clickableClass}">
        <img src="${section.image ? (isPreview ? URL.createObjectURL(section.image) : 'images/' + section.image.name) : 'placeholder.jpg'}" alt="Portfolio Image" class="block-image" />
        <div class="block-text">
          ${section.content}
        </div>
      </${tag}>`;
    }

    if (section.type === 'project') {
      const listHtml = section.highlights ? section.highlights.map(item => `<li>${item}</li>`).join('\n') : '';
      if(section.tags && section.tags.length > 0){
        const tagsHtml= section.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n');
        return `
          <${tag}${hrefAttr} class="project-showcase-block${clickableClass}">
            <div class="showcase-image-container">
              <img src="${section.image ? (isPreview ? URL.createObjectURL(section.image) : 'images/' + section.image.name) : 'placeholder.jpg'}" alt="${section.title}" class="showcase-img" />
            </div>
            <div class="showcase-text-container">
              <h2 class="showcase-title">${section.title}</h2>
              <h3 class="showcase-label">OBJECTIVE</h3>
              <div class="showcase-paragraph">${section.content}</div>
              <h3 class="showcase-label">ENGINEERING HIGHLIGHTS</h3>
              <ul class="showcase-list">${listHtml}</ul>
              <div class="showcase-tags">${tagsHtml}</div>
            </div>
          </${tag}>`;
      }
      return `
      <${tag}${hrefAttr} class="project-showcase-block${clickableClass}">
        <div class="showcase-image-container">
          <img src="${section.image ? (isPreview ? URL.createObjectURL(section.image) : 'images/' + section.image.name) : 'placeholder.jpg'}" alt="${section.title}" class="showcase-img" />
        </div>
        <div class="showcase-text-container">
          <h2 class="showcase-title">${section.title}</h2>
          <h3 class="showcase-label">OBJECTIVE</h3>
          <div class="showcase-paragraph">${section.content}</div>
          <h3 class="showcase-label">ENGINEERING HIGHLIGHTS</h3>
          <ul class="showcase-list">${listHtml}</ul>
        </div>
      </${tag}>`;
      
    }

    if (section.type === 'contact-page') {
      return `
      <div class="contact-section">
        ${section.text ? `<div class="contact-header">${section.text}</div>` : ''}
        <div class="contact-page-container">
        `+getMessage(section)+getContactInfo(section)+
        `</div>
      </div>`;
    }
  });

  return htmlBlocks.join('\n');
};

// Function to generate the Footer HTML
export const generateFooter = (userData) => {
  const currentYear = new Date().getFullYear();

  return `
  <footer class="footer">
    <div class="footer-name">
      © ${currentYear} ${userData.name}
    </div>

    <div class="footer-contact">
      <a href="./contact.html" class="contact-btn">Contact Me</a>
    </div>
  </footer>
  `;
};


// The Master Function that builds the complete HTML file
export const buildFullPage = (sections,navbarHtml,footerHtml,title, isPreview = false, rawCss = '') => {
  
  let pageContentHtml = '';
  if (sections && sections.length > 0) {
    pageContentHtml = generateMainContent(sections, isPreview);
  }

  const cssTag = isPreview && rawCss 
    ? `<style>${rawCss}</style>` 
    : '<link rel="stylesheet" href="./style.css">';

  const previewScript = isPreview ? `
  <script>
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html')) {
          e.preventDefault();
          const pageName = href.replace('./', '');
          window.parent.postMessage({ type: 'NAVIGATE', page: pageName }, '*');
        }
      }
    });
  </script>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${title}</title>
  ${cssTag}
</head>
<body>

${navbarHtml}

  <main class="content">
    ${pageContentHtml}
  </main>

${footerHtml}

  <script>
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  </script>
${previewScript}
</body>
</html>
  `;
};

export const generatePreviewPages = (portfolioData, styleCss) => {
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
  const pages = {};

  const indexSections = [];
  if (portfolioData.heroText) indexSections.push({ type: 'text-only', content: portfolioData.heroText });
  indexSections.push(...portfolioData.sections);
  
  pages['index.html'] = buildFullPage(indexSections, navbarHtml, footerHtml, `${userData.name} - Home`, true, styleCss);

  portfolioData.pages.forEach(pageName => {
    if (pageName === 'Contact') return;
    const sections = portfolioData.pageSections[pageName] || [];
    pages[`${pageName.toLowerCase().replace(/\s+/g, '-')}.html`] = buildFullPage(sections, navbarHtml, footerHtml, `${userData.name} - ${pageName}`, true, styleCss);
  });

  if (portfolioData.pages.includes('Contact')) {
    pages['contact.html'] = buildFullPage([{ type: 'contact-page', ...portfolioData.contact }], navbarHtml, footerHtml, `${userData.name} - Contact`, true, styleCss);
  }
  pages['style.css'] = styleCss;
  return pages;
};

export const generateExportPages = (portfolioData, styleCss) => {
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
  const pages = {};

  const indexSections = [];
  if (portfolioData.heroText) indexSections.push({ type: 'text-only', content: portfolioData.heroText });
  indexSections.push(...portfolioData.sections);
  
  pages['index.html'] = buildFullPage(indexSections, navbarHtml, footerHtml, `${userData.name} - Home`, false);

  portfolioData.pages.forEach(pageName => {
    if (pageName === 'Contact') return;
    const sections = portfolioData.pageSections[pageName] || [];
    pages[`${pageName.toLowerCase().replace(/\s+/g, '-')}.html`] = buildFullPage(sections, navbarHtml, footerHtml, `${userData.name} - ${pageName}`, false);
  });

  if (portfolioData.pages.includes('Contact')) {
    pages['contact.html'] = buildFullPage([{ type: 'contact-page', ...portfolioData.contact }], navbarHtml, footerHtml, `${userData.name} - Contact`, false);
  }
  pages['style.css'] = styleCss;
  return pages;
};
