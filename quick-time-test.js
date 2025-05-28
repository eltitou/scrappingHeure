// Test rapide pour explorer horlogeparlante.com en mode headless
import { chromium } from 'playwright';

async function quickTimeTest() {
  const browser = await chromium.launch({ headless: true });
  
  try {
    const page = await browser.newPage();
    console.log('🌐 Test du site horlogeparlante.com...');
    await page.goto('https://www.horlogeparlante.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Attendre que la page se charge
    await page.waitForTimeout(2000);
    
    // Récupérer le titre de la page pour commencer
    const title = await page.title();
    console.log('Titre de la page:', title);
    
    // Chercher des éléments avec des patterns d'heure
    const timeContent = await page.evaluate(() => {
      const body = document.body.innerText;
      const timeRegex = /\d{1,2}:\d{2}(:\d{2})?/g;
      const matches = body.match(timeRegex);
      return {
        pageText: body.substring(0, 500), // Premier bout de texte
        timeMatches: matches
      };
    });
    
    console.log('Contenu de la page (début):', timeContent.pageText);
    console.log('Heures trouvées:', timeContent.timeMatches);
    
    await browser.close();
    
  } catch (error) {
    console.error('Erreur:', error.message);
    await browser.close();
  }
}

quickTimeTest();
