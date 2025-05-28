// Test du site quelleheureestil.fr pour récupérer l'heure
import { chromium } from 'playwright';

async function exploreTimeWebsite() {
  console.log('🕒 Exploration du site quelleheureestil.fr...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();
    
    console.log('📊 Navigation vers quelleheureestil.fr...');
    await page.goto('https://quelleheureestil.fr/', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Attendre un peu pour que la page se charge
    await page.waitForTimeout(2000);
    
    // Explorer les éléments de temps sur la page
    console.log('🔍 Recherche des éléments de temps...');
    
    // Essayer différents sélecteurs possibles
    const timeSelectors = [
      '#time',
      '.time',
      '[data-time]',
      '.clock',
      '#clock',
      '.current-time',
      'time'
    ];
    
    for (const selector of timeSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await element.textContent();
          console.log(`✅ Trouvé avec "${selector}": ${text}`);
        }
      } catch (e) {
        // Ignorer les erreurs
      }
    }
    
    // Récupérer le titre de la page
    const title = await page.title();
    console.log(`📄 Titre de la page: ${title}`);
    
    // Récupérer tout le texte visible
    const bodyText = await page.textContent('body');
    console.log('📝 Contenu de la page (premiers 500 caractères):');
    console.log(bodyText?.substring(0, 500) + '...');
    
    // Essayer de trouver des patterns d'heure dans le texte
    const timePattern = /\d{1,2}:\d{2}(?::\d{2})?/g;
    const times = bodyText?.match(timePattern);
    if (times) {
      console.log('🕐 Heures trouvées dans le texte:', times);
    }
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'quelleheureestil-screenshot.png' });
    console.log('📸 Capture d\'écran sauvegardée: quelleheureestil-screenshot.png');
    
    await browser.close();
    console.log('✅ Exploration terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exploration:', error.message);
    await browser.close();
  }
}

// Lancer l'exploration
exploreTimeWebsite().catch(console.error);
