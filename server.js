import uWS from 'uWebSockets.js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SRC_DIR = join(__dirname, 'src');

// Cache for files
const fileCache = new Map();

// MIME types for allowed files
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Pre-load and cache files on startup
function cacheFiles(directory) {
  try {
    const files = readdirSync(directory);
    files.forEach(file => {
      const fullPath = join(directory, file);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively cache files in subdirectories
        cacheFiles(fullPath);
      } else {
        const ext = extname(file);
        if (MIME_TYPES[ext]) {
          // Get relative path from SRC_DIR
          const relativePath = fullPath.substring(SRC_DIR.length);
          const urlPath = relativePath.replace(/\\/g, '/'); // Convert Windows paths to URL format
          
          try {
            const content = readFileSync(fullPath);
            fileCache.set(urlPath, {
              content,
              type: MIME_TYPES[ext]
            });
            console.log(`Cached: ${urlPath}`);
          } catch (err) {
            console.error(`Error reading file ${fullPath}:`, err);
          }
        }
      }
    });
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

// Initialize server
const app = uWS.App()
  .get('/*', (res, req) => {
    let url = req.getUrl();
    
    // Handle root path
    if (url === '/') {
      url = '/index.html';
    }

    // Try to serve from cache
    const cached = fileCache.get(url);
    if (cached) {
      res.writeHeader('Content-Type', cached.type);
      res.end(cached.content);
      return;
    }

    // If not in cache, return 404
    res.writeStatus('404').end('Not Found');
  });

// Cache files on startup
console.log('Caching files from:', SRC_DIR);
cacheFiles(SRC_DIR);
console.log('File caching complete');

// Start server
app.listen(53000, (token) => {
  if (token) {
    console.log('Server running on http://localhost:53000');
    console.log('Cached files:', Array.from(fileCache.keys()));
  } else {
    console.log('Failed to start server');
  }
});
