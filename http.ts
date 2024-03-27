import * as http from 'http';
import { IncomingMessage } from 'http';

http.get('http://www.google.com', (res: IncomingMessage) => {
  let body: string = '';

  res.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  res.on('end', () => {
    console.log(body);
  });

}).on('error', (e: Error) => {
  console.error(`Got error: ${e.message}`);
});
