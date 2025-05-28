// Test simple du serveur MCP pour les fonctionnalités d'heure
const { spawn } = require('child_process');

console.log('🕐 Test MCP - Récupération d\'heure avec horlogeparlante.com\n');

// Démarrer le serveur MCP
const server = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

server.stderr.on('data', (data) => {
  console.log('🚀 Serveur:', data.toString().trim());
});

// Fonction pour envoyer une requête JSON-RPC
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: method,
    params: params
  };
  
  console.log(`📥 Envoi: ${method}`);
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Écouter les réponses
server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response.result && response.result.content) {
      console.log('✅ Réponse reçue:');
      response.result.content.forEach(item => {
        console.log('   ', item.text);
      });
    }
  } catch (e) {
    console.log('📤 Données brutes:', data.toString().trim());
  }
});

// Séquence de test
setTimeout(() => {
  sendRequest('initialize', {
    clientInfo: { name: "test-time", version: "1.0.0" },
    capabilities: {}
  });
}, 1000);

setTimeout(() => {
  sendRequest('tools/call', {
    name: 'scrape-time',
    arguments: {}
  });
}, 3000);

// Fermer après le test
setTimeout(() => {
  console.log('\n🏁 Test terminé');
  server.kill('SIGTERM');
  process.exit(0);
}, 8000);
