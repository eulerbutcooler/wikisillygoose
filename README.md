# Wikisillygoose  

**Discover cool places around the globe with an interactive spin!**

## Overview  
**Wikisillygoose** is a playful geo-exploration web app built with Three.js. It lets users spin a globe, click any point on the map, and instantly discover an interesting place nearby. If the place has a Wikipedia entry, you can dive in directly for more info—making learning fun and interactive!

## Live Demo  
Check it out in action here:  
[https://wikisillygoose.eulerbutcooler.tech](https://wikisillygoose.eulerbutcooler.tech)

## Features  
- **Interactive 3D globe** — Easily pan, zoom, and rotate to explore the world.  
- **Click-to-discover** — Click anywhere to find an interesting location nearby.  
- **Powered by technology** — Built with **Three.js** for beautiful 3D visuals and integrated with the **Gemini API** to fetch information about cool places.

## Tech Stack  
- **Frontend:**  
  - Three.js for rendering the globe  
  - Next.js for UI and state management  
- **APIs:**  
  - Gemini API (or similar service) to query points of interest

## Installation & Setup  
1. Clone the repository:  
   ```bash
   git clone https://github.com/eulerbutcooler/wikisillygoose.git
   cd wikisillygoose
2. Install dependencies:
   ```bash
      npm install
3. Create a .env file in the project root and add your Gemini API key:
   ```bash
      GeminiAPI=yourgeminiapikey
4. Run the development server
    ```bash
      npm run dev
5. Open the browser and navigate to 
  ```bash
      http://localhost:3000/
