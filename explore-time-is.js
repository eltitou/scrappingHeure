// Test pour explorer le site time.is et récupérer l'heure
const { chromium } = require('playwright');

async function exploreTimeIs() {
  console.log('🕐 Exploration du site time.is...');
  
  const browser = await chromium.launch({ headless: false });
  
  try {
    const page = await browser.newPage();
    
    console.log('📍 Navigation vers time.is/fr/...');
    await page.goto('https://time.is/fr/', { waitUntil: 'networkidle' });
    
    // Attendre un peu que la page se charge complètement
    await page.waitForTimeout(3000);
    
    // Chercher les éléments qui contiennent l'heure
    const timeInfo = await page.evaluate(() => {
      const results = [];
      
      // Chercher différents sélecteurs possibles
      const selectors = [
        '#time_section',
        '.time',
        '#clock',
        '.clock',
        '[id*="time"]',
        '[class*="time"]',
        '[id*="clock"]',
        '[class*="clock"]'
      ];
      
      selectors.forEach(sel => {
        try {
          const el = document.querySelector(sel);
          if (el && el.textContent.trim()) {
            results.push({ 
              selector: sel, 
              text: el.textContent.trim(),
              innerHTML: el.innerHTML
            });
          }
        } catch (e) {
          // Ignorer les erreurs de sélecteur
        }
      });
      
      // Chercher aussi tous les éléments qui pourraient contenir une heure
      const allElements = document.querySelectorAll('*');
      for (let el of allElements) {
        const text = el.textContent;
        if (text && /\d{1,2}:\d{2}/.test(text) && text.length < 50) {
          results.push({
            selector: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/ /g, '.') : ''),
            text: text.trim(),
            tagName: el.tagName
          });
        }
      }
      
      return results;
    });
    
    console.log('🔍 Éléments trouvés contenant l\'heure:');
    timeInfo.forEach((item, index) => {
      console.log(`${index + 1}. ${item.selector}: "${item.text}"`);
    });
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'time-is-screenshot.png' });
    console.log('📸 Capture d\'écran sauvegardée: time-is-screenshot.png');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    await browser.close();
  }
}

exploreTimeIs().catch(console.error);
