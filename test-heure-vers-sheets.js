// Test complet : Récupération d'heure + Sauvegarde dans Google Sheets
const { spawn } = require('child_process');

console.log('🎯 TEST COMPLET : Heure → Google Sheets');
console.log('='​.repeat(50));

// URL de votre feuille Google Sheets
const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16ld2Skv7L8umCKP6TVH36QlU78HQupdJ0Vk5ZxTXdSs/edit?gid=0#gid=0';

// Démarrer le serveur MCP
const server = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let responseCount = 0;

server.stderr.on('data', (data) => {
  console.log('🚀 Serveur MCP démarré:', data.toString().trim());
});

server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    responseCount++;
    
    if (response.result && response.result.content) {
      console.log(`\n📥 Réponse ${responseCount}:`);
      response.result.content.forEach(item => {
        console.log('   ', item.text);
      });
    }
  } catch (e) {
    // Ignorer les données non-JSON
  }
});

function sendMCPRequest(method, params = {}) {
  const request = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: method,
    params: params
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Séquence d'actions
console.log('\n1️⃣ Initialisation du serveur MCP...');
setTimeout(() => {
  sendMCPRequest('initialize', {
    clientInfo: { name: "time-to-sheets", version: "1.0.0" },
    capabilities: {}
  });
}, 1000);

console.log('\n2️⃣ Récupération de l\'heure depuis horlogeparlante.com...');
setTimeout(() => {
  sendMCPRequest('tools/call', {
    name: 'scrape-time',
    arguments: {}
  });
}, 3000);

console.log('\n3️⃣ Sauvegarde automatique dans Google Sheets...');
setTimeout(() => {
  sendMCPRequest('tools/call', {
    name: 'save-time-to-sheet',
    arguments: {
      spreadsheetUrl: spreadsheetUrl
    }
  });
}, 6000);

// Fermeture propre
setTimeout(() => {
  console.log('\n🏁 Test terminé - Vérifiez votre feuille Google Sheets !');
  console.log('🔗 URL:', spreadsheetUrl);
  server.kill('SIGTERM');
  process.exit(0);
}, 12000);
