const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ equipamentos: [], historicoParadas: [] }, null, 2),
      'utf8'
    );
  }
}

function readState() {
  ensureDataFile();

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      equipamentos: Array.isArray(parsed.equipamentos) ? parsed.equipamentos : [],
      historicoParadas: Array.isArray(parsed.historicoParadas) ? parsed.historicoParadas : []
    };
  } catch (error) {
    return { equipamentos: [], historicoParadas: [] };
  }
}

function writeState(nextState) {
  ensureDataFile();
  const normalizedState = {
    equipamentos: Array.isArray(nextState.equipamentos) ? nextState.equipamentos : [],
    historicoParadas: Array.isArray(nextState.historicoParadas) ? nextState.historicoParadas : []
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(normalizedState, null, 2), 'utf8');
  return normalizedState;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': MIME_TYPES['.json']
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, 404, { error: 'Arquivo nao encontrado.' });
      return;
    }

    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content);
  });
}

function getStaticFilePath(urlPath) {
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const decodedPath = decodeURIComponent(requestedPath);
  const normalizedPath = path.normalize(decodedPath).replace(/^([.][.][\\/])+/, '');
  return path.join(ROOT_DIR, normalizedPath);
}

function handleApi(request, response) {
  if (request.method === 'GET' && request.url === '/api/state') {
    sendJson(response, 200, readState());
    return true;
  }

  if (request.method === 'PUT' && request.url === '/api/state') {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      try {
        const parsedBody = JSON.parse(body || '{}');
        const savedState = writeState(parsedBody);
        sendJson(response, 200, savedState);
      } catch (error) {
        sendJson(response, 400, { error: 'JSON invalido.' });
      }
    });

    return true;
  }

  return false;
}

const server = http.createServer((request, response) => {
  if (handleApi(request, response)) {
    return;
  }

  const filePath = getStaticFilePath(request.url);

  if (!filePath.startsWith(ROOT_DIR)) {
    sendJson(response, 403, { error: 'Acesso negado.' });
    return;
  }

  sendFile(response, filePath);
});

server.listen(PORT, HOST, () => {
  ensureDataFile();
  console.log('Servidor iniciado em http://' + HOST + ':' + PORT);
});