import * as https from 'http';
import { IncomingMessage } from 'http';

const options = {
  // hostname: 'localhost',
  hostname: '10.255.255.1',
  port: 3000,
  path: '/slow',
  method: 'GET',
};

console.time();

const req = https.request(options, (res: IncomingMessage) => {
  let body: string = '';

  res.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  res.on('end', () => {
    clearTimeout(dataReadTimeout);
    console.log(body);
    console.timeEnd();
  });
});

const dataReadTimeout = setTimeout(() => {
  const error = new Error('Response did not end within 2 seconds');
  error.name = 'DataReadTimeout';
  req.destroy(error);
}, 2000);

req.on('socket', (socket) => {
  const connectionTimeout = setTimeout(() => {
    const error = new Error('Socket connection could not be established within 500ms');
    error.name = 'ConnectionTimeout';
    req.destroy(error);
  }, 500);
  socket.on('connect', () => {
    clearTimeout(connectionTimeout);
  });
});

req.on('error', (e: Error) => {
  clearTimeout(dataReadTimeout);
  console.error(`Got error: ${e.name}`);
  console.timeEnd();
});

req.end();
