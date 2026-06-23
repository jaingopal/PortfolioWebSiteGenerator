# Portfolio Website Generator

A React-based web application that allows users to easily build and generate their own portfolio websites through a simple, multi-step form. 

## Features

- **Multi-Step Builder**: A streamlined 4-step process to input your details, configure pages, and design sections.
- **Live Preview**: See your portfolio update in real-time within an interactive modal before finalizing.
- **Customizable Sections**: Add and customize different sections like About, Projects, and Contact.
- **Export to ZIP**: Once you are happy with the preview, the app generates static HTML/CSS files and packages them into a `.zip` file for easy deployment anywhere.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with custom properties for theming
- **Rich Text Editing**: `react-quill-new` for editing section content
- **File Generation**: `jszip` and `file-saver` for packaging and downloading the generated site

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd portfolio_website_gen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## Usage

1. **Step 1**: Enter basic information like your name and a hero text/tagline.
2. **Step 2**: Configure the pages of your portfolio and manage navigation.
3. **Step 3**: Add and customize specific sections for each page.
4. **Final Step**: Review your portfolio using the "Open Live Preview" button and download your generated static files as a ZIP archive.
