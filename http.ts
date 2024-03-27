import * as https from 'http';
import { IncomingMessage } from 'http';

const options = {
  hostname: 'localhost',
  // hostname: '10.255.255.1',
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
    clearTimeout(timeout);
    console.log(body);
    console.timeEnd();
  });
});

const timeout = setTimeout(() => {
  console.error('Response did not end within 2 seconds');
  req.destroy();
}, 2000);

req.on('socket', (socket) => {
  const timeout = setTimeout(() => {
    console.error('Socket connection could not be established within 500ms');
    req.destroy();
  }, 500);
  socket.on('connect', () => {
    clearTimeout(timeout);
  });
});

req.on('error', (e: Error) => {
  console.error(`Got error: ${e.message}`);
  console.timeEnd();
});

req.end();
