// Test ultra-simple des serveurs
import { PlaywrightServer } from './build/servers/playwright-server.js';

console.log('🚀 Test rapide des serveurs MCP...\n');

const playwright = new PlaywrightServer();

try {
    console.log('📄 Test: récupération du titre de example.com');
    const title = await playwright.scrapePageTitle('https://example.com');
    console.log('✅ Résultat:', title);
    console.log('\n🎉 Serveur Playwright opérationnel !');
    console.log('✅ Prêt pour utilisation MCP');
} catch (error) {
    console.error('❌ Erreur:', error.message);
} finally {
    await playwright.close();
}