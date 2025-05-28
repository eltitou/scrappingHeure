// Test simple de la fonction d'heure améliorée
import { chromium } from 'playwright';

async function testImprovedTimeFunction() {
  console.log('🕐 Test de la fonction d\'heure améliorée...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // Essayer d'abord time.is/fr
    console.log('🌐 Tentative avec time.is/fr...');
    await page.goto('https://time.is/fr', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    await page.waitForTimeout(3000);

    // Chercher l'heure sur time.is
    try {
      const timeElement = await page.$('#time');
      if (timeElement) {
        const timeText = await timeElement.textContent();
        if (timeText && /\d{1,2}:\d{2}:\d{2}/.test(timeText)) {
          console.log('✅ Heure trouvée sur time.is/fr:', timeText.trim());
          const currentDate = new Date().toLocaleDateString('fr-FR');
          console.log(`📅 Date: ${currentDate}`);
          console.log(`⏰ Heure: ${timeText.trim()}`);
          console.log(`🌐 Source: time.is/fr`);
          await browser.close();
          return;
        }
      }
    } catch (e) {
      console.log('⚠️ Élément #time non trouvé, recherche dans le texte...');
    }

    // Plan B: Chercher dans tout le texte
    const bodyText = await page.textContent('body') || '';
    const timePattern = /(\d{1,2}:\d{2}:\d{2})/;
    const timeMatch = bodyText.match(timePattern);
    
    if (timeMatch) {
      console.log('✅ Heure trouvée dans le texte:', timeMatch[1]);
      const currentDate = new Date().toLocaleDateString('fr-FR');
      console.log(`📅 Date: ${currentDate}`);
      console.log(`⏰ Heure: ${timeMatch[1]}`);
      console.log(`🌐 Source: time.is/fr (texte)`);
      await browser.close();
      return;
    }

  } catch (webError) {
    console.log('⚠️ Erreur web scraping:', webError.message);
  }

  await browser.close();

  // Plan C: Utiliser l'heure système
  console.log('🕐 Utilisation de l\'heure système...');
  const now = new Date();
  const currentTime = now.toLocaleTimeString('fr-FR', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const currentDate = now.toLocaleDateString('fr-FR');

  console.log('✅ Heure système récupérée:');
  console.log(`📅 Date: ${currentDate}`);
  console.log(`⏰ Heure: ${currentTime}`);
  console.log(`🌐 Source: Heure système locale`);

  console.log('\n📊 Données qui seraient ajoutées à Google Sheets:');
  console.log(`   Colonne A: ${currentDate}`);
  console.log(`   Colonne B: ${currentTime}`);
  console.log(`   Colonne C: Heure système locale`);
}

testImprovedTimeFunction().catch(console.error);
