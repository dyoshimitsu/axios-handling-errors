const http = require('http');

const options = {
  hostname: '10.255.255.1',
  // hostname: 'localhost',
  port: 3000,
  path: '/slow',
  method: 'GET',
  timeout: 10000 // 10 seconds
};

const req = http.get(options, (res: any) => {
  console.log(`STATUS: ${res.statusCode}`);
  req.socket.setTimeout(0); // Disable the socket timeout when the request is successful
  req.removeListener('error', errorHandler); // Remove the error handler when the request is successful
  req.removeListener('timeout', timeoutHandler); // Remove the timeout handler when the request is successful

  res.on('end', () => {
    req.socket.end(); // Explicitly close the socket when the response is fully received
  });
});

const errorHandler = (e: any) => {
  if (e.code === "ECONNRESET") {
    console.log('Connection timeout1');
    req.socket.setTimeout(5000); // Set the socket timeout to 5000ms for ECONNRESET
  } else if (e.code === "ETIMEDOUT") {
    console.log('Connection timeout2');
    req.socket.setTimeout(500); // Set the socket timeout to 500ms for ETIMEDOUT
  } else {
    console.log(`problem with request: ${e.message}`);
  }
};

const timeoutHandler = () => {
  console.log('Connection timeout');
  req.destroy();
};

req.on('socket', (socket: any) => {
  socket.setTimeout(5000); // Initial socket timeout
  socket.on('timeout', function() {
    req.destroy();
  });
});

req.on('timeout', timeoutHandler);

req.on('error', errorHandler);

req.end();