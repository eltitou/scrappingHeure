// Exemple d'utilisation du serveur MCP pour scraper et sauvegarder
const { spawn } = require('child_process');

console.log('🚀 Exemple d\'utilisation du serveur MCP Playwright');
console.log('📊 Feuille cible: https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0');

// URL de votre feuille Google Sheets
const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';

// Démarrer le serveur MCP
console.log('\n🔧 Démarrage du serveur MCP...');
const server = spawn('node', ['build/index.js'], { 
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let requestId = 1;

server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    console.log('📤', output);
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString().trim();
  if (error && !error.includes('démarré')) {
    console.log('🚨', error);
  } else if (error.includes('démarré')) {
    console.log('✅', error);
    // Démarrer les tests une fois le serveur prêt
    setTimeout(runTests, 2000);
  }
});

function sendRequest(method, params) {
  const request = {
    jsonrpc: "2.0",
    id: requestId++,
    method: method,
    params: params
  };
  
  console.log(`\n📨 Envoi de la requête: ${method}`);
  server.stdin.write(JSON.stringify(request) + '\n');
}

async function runTests() {
  console.log('\n🧪 === DÉBUT DES TESTS ===\n');
  
  // Test 1: Lister les outils disponibles
  console.log('1️⃣ Test: Lister les outils disponibles');
  sendRequest('tools/list', {});
  
  setTimeout(() => {
    // Test 2: Scraper le titre d'une page
    console.log('\n2️⃣ Test: Scraper le titre d\'une page');
    sendRequest('tools/call', {
      name: 'scrape-title',
      arguments: {
        url: 'https://example.com'
      }
    });
  }, 3000);
  
  setTimeout(() => {
    // Test 3: Ajouter une ligne de test dans Google Sheets
    console.log('\n3️⃣ Test: Ajouter une ligne de test dans Google Sheets');
    const timestamp = new Date().toLocaleString('fr-FR');
    sendRequest('tools/call', {
      name: 'append-to-sheet',
      arguments: {
        spreadsheetUrl: spreadsheetUrl,
        data: [timestamp, 'Test MCP', 'Ligne de test ajoutée automatiquement']
      }
    });
  }, 6000);
  
  setTimeout(() => {
    // Test 4: Scraper et sauvegarder automatiquement
    console.log('\n4️⃣ Test: Scraper et sauvegarder automatiquement');
    sendRequest('tools/call', {
      name: 'scrape-and-save',
      arguments: {
        url: 'https://github.com',
        spreadsheetUrl: spreadsheetUrl
      }
    });
  }, 12000);
  
  // Arrêter après tous les tests
  setTimeout(() => {
    console.log('\n🏁 === FIN DES TESTS ===');
    console.log('\n📋 Vérifiez votre feuille Google Sheets pour voir les résultats:');
    console.log('🔗', spreadsheetUrl);
    
    server.kill('SIGTERM');
    setTimeout(() => process.exit(0), 2000);
  }, 20000);
}

server.on('close', (code) => {
  console.log(`\n🔚 Serveur fermé avec le code: ${code}`);
});

server.on('error', (err) => {
  console.error('❌ Erreur de démarrage du serveur:', err);
  process.exit(1);
});
