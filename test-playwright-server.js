// Test simple du serveur MCP Playwright
const { spawn } = require('child_process');

console.log('🧪 Test du serveur MCP Playwright...');

// Démarrer le serveur
const server = spawn('node', ['build/index.js'], { 
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('📤 Sortie:', data.toString().trim());
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('🚨 Erreur:', data.toString().trim());
});

// Test de l'outil scrape-title
setTimeout(() => {
  console.log('\n🌐 Test de scraping de titre...');
  
  const testRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "scrape-title",
      arguments: {
        url: "https://example.com"
      }
    }
  };

  server.stdin.write(JSON.stringify(testRequest) + '\n');
}, 2000);

// Arrêter après 10 secondes
setTimeout(() => {
  console.log('\n⏹️ Arrêt du test...');
  server.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('\n📊 Résumé du test:');
    console.log('- Sortie reçue:', output.length > 0 ? '✅' : '❌');
    console.log('- Erreurs:', errorOutput.includes('Erreur fatale') ? '❌' : '✅');
    console.log('- Serveur démarré:', errorOutput.includes('démarré') ? '✅' : '❌');
    process.exit(0);
  }, 1000);
}, 10000);

server.on('close', (code) => {
  console.log(`\n🔚 Serveur fermé avec le code: ${code}`);
});

server.on('error', (err) => {
  console.error('❌ Erreur de démarrage:', err);
  process.exit(1);
});
