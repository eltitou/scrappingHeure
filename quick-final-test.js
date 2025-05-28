// Test simple et rapide
import { PlaywrightServer } from './build/servers/playwright-server.js';

async function quickTest() {
  console.log('Test rapide du projet MCP simplifie');
  
  const server = new PlaywrightServer();
  
  try {
    const timeInfo = await server.scrapeCurrentTime();
    console.log('Heure recuperee:', timeInfo.time);
    console.log('Date:', timeInfo.date);
    console.log('Source:', timeInfo.source);
    console.log('TEST REUSSI !');
    
    await server.close();
  } catch (error) {
    console.error('Erreur:', error.message);
    await server.close();
  }
}

quickTest();
