// Function to generate the Navbar HTML
const generateNavbar = (userData) => {
  const safeLinks = userData.links || [];
  const linksHtml = safeLinks.map(link => {
    return `<li><a href="${link.url}">${link.label}</a></li>`;
  }).join('\n      ');

  const statusText = userData.is_avail ? "Available for work" : "Not available";
  const statusClass = userData.is_avail ? "status-available" : "status-unavailable";

  return `
  <nav class="navbar">
    <a class="nav-name" href = ./index.html>${userData.name}</a>
    
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

const generateMainContent = (sections) => {
  // console.log(sections);
  const htmlBlocks = sections.map(section => {
    
    const tag = section.url ? 'a' : 'div';
    const hrefAttr = section.url ? ` href="${section.url}" target="_blank"` : '';
    const clickableClass = section.url ? ' clickable-card' : '';

    if (section.type === 'text-only') {
      if(section.tags){
        const tagsHtml= section.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n');
        return `
          <${tag}${hrefAttr} class="text-block size-${section.size}${clickableClass}">
            ${section.text}
            <div class="showcase-tags">${tagsHtml}</div>
          </${tag}>`;
      }
      return `
      <${tag}${hrefAttr} class="text-block size-${section.size}${clickableClass}">
        ${section.text}
      </${tag}>`;
    } 
    
    if (section.type === 'text-and-image') {
      const layoutClasses = `desktop-img-${section.desktopImg} mobile-img-${section.mobileImg}`;
      if(section.tags){
        const tagsHtml= section.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n');
        return `
          <${tag}${hrefAttr} class="flex-block ${layoutClasses}${clickableClass}">
            <img src="${section.imageUrl}" alt="Portfolio Image" class="block-image" />
            <div class="block-text">
              ${section.text}
              <div class="showcase-tags">${tagsHtml}</div>
            </div>
          </${tag}>`;
      }     
      return `
      <${tag}${hrefAttr} class="flex-block ${layoutClasses}${clickableClass}">
        <img src="${section.imageUrl}" alt="Portfolio Image" class="block-image" />
        <div class="block-text">
          ${section.text}
        </div>
      </${tag}>`;
    }

    if (section.type === 'project-showcase') {
      const listHtml = section.highlights.map(item => `<li>${item}</li>`).join('\n');
      if(section.tags){
        const tagsHtml= section.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n');
        return `
          <${tag}${hrefAttr} class="project-showcase-block${clickableClass}">
            <div class="showcase-image-container">
              <img src="${section.imageUrl}" alt="${section.title}" class="showcase-img" />
            </div>
            <div class="showcase-text-container">
              <h2 class="showcase-title">${section.title}</h2>
              <h3 class="showcase-label">OBJECTIVE</h3>
              <p class="showcase-paragraph">${section.objective}</p>
              <h3 class="showcase-label">ENGINEERING HIGHLIGHTS</h3>
              <ul class="showcase-list">${listHtml}</ul>
              <div class="showcase-tags">${tagsHtml}</div>
            </div>
          </${tag}>`;
      }
      return `
      <${tag}${hrefAttr} class="project-showcase-block${clickableClass}">
        <div class="showcase-image-container">
          <img src="${section.imageUrl}" alt="${section.title}" class="showcase-img" />
        </div>
        <div class="showcase-text-container">
          <h2 class="showcase-title">${section.title}</h2>
          <h3 class="showcase-label">OBJECTIVE</h3>
          <p class="showcase-paragraph">${section.objective}</p>
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
const generateFooter = (userData) => {
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
const buildFullPage = (sections,navbarHtml,footerHtml,title) => {
  

  const pageContentHtml = generateMainContent(sections);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${title}</title>
  <link rel="stylesheet" href="./style.css">
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

</body>
</html>
  `;
};

const fs = require('fs');


// 2. The data for the user
const userData = {
  name: "Jane Doe",
  is_avail: true, // For the green/red navbar badge
  
  // 1. The Navbar Links (This was missing!)
  links: [
    { label: "Work", url: "./work.html" },
    { label: "About", url: "./about.html" },
    { label: "Contact", url: "./contact.html" }
  ],
  
  // 2. The Main Content Sections
  sections: [
    { 
      type: 'text-only', 
      text: 'Welcome to my portfolio!', 
      size: 'large' ,
      tags: ['PYTHON', 'NEXTJS']
    },
    { 
      type: 'text-and-image', 
      text: 'I am a passionate web developer with 5 years of experience.', 
      imageUrl: 'images/profile.jpg',
      desktopImg: 'right', 
      mobileImg: 'top'    ,
      tags: ['PYTHON', 'NEXTJS']
    },
    { 
      type: 'text-and-image', 
      text: 'I am a passionate web developer with 5 years of experience.', 
      imageUrl: 'images/profile.jpg',
      desktopImg: 'left', 
      mobileImg: 'top'    ,
      tags: ['PYTHON', 'NEXTJS']
    },
    {
      type: 'project-showcase',
      title: 'ASRMA',
      imageUrl: 'images/asrma-mockup.png', // The image on the left
      objective: 'Automate end-to-end literature review workflows by orchestrating LLM-driven agents...',
      highlights: [
        'Agent-driven pipeline integrating fetchers for PubMed, IEEE...',
        'RAG + vector-store pipeline enabling semantic full-text retrieval.',
        'Modular LLM provider and streaming chat support.'
      ],
      tags: ['PYTHON', 'FASTAPI', 'RAG', 'LANGCHAIN', 'NEXTJS']
    },
    { 
      type: 'text-and-image', 
      text: 'Check out my latest e-commerce build.', 
      imageUrl: 'images/profile.jpg',
      desktopImg: 'left', 
      mobileImg: 'top',
      url: 'https://example.com', // If this exists, the whole card becomes a link!,
      tags: ['PYTHON', 'NEXTJS']
    }
  ]
};



const worksData = [
  { type: 'text-only', text: 'My Projects', size: 'large' },
  { 
    type: 'project-showcase', 
    title: 'ASRMA',
    imageUrl: 'images/asrma-mockup.png',
    objective: 'Automate literature review workflows...',
    highlights: ['Agent-driven pipeline', 'RAG + vector-store'],
    tags: ['PYTHON', 'NEXTJS']
  }
];
const contactData = [
  { 
    type: 'contact-page',
    // Optional header text at the top
    text: 'I am currently accepting freelance projects. Feel free to reach out!',
    
    // Titles for the two sides of the layout
    formTitle: 'Send me a message',
    infoTitle: 'My Details',
    if_message: true,
    
    // Optional contact information (all will be rendered as functional links)
    email: 'jane@example.com',
    phone: '+1 234 567 890',
    linkedin: 'https://linkedin.com/in/janedoe',
    github: 'https://github.com/janedoe'
  }
];

const navbarHtml = generateNavbar(userData);
const footerHtml = generateFooter(userData);

const writeInHtml = (navbarHtml,footerHtml,sections,title,filename) =>{
  htmlCode = buildFullPage(sections,navbarHtml,footerHtml,title)
  fs.writeFile(filename, htmlCode, (err) => {
  if (err) {
    console.error("Oops! Something went wrong:", err);
  } else {
    console.log("Success! The " + filename + " file has been automatically generated.");
  }
});
}

writeInHtml(navbarHtml,footerHtml,userData.sections,userData.name+"'s Portfolio","index.html")
writeInHtml(navbarHtml,footerHtml,worksData,"Work","work.html")
writeInHtml(navbarHtml,footerHtml,contactData,"Contact","contact.html")
