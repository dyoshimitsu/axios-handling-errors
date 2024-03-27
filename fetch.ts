const connectionTimeout = 50;
const responseTimeout = 5000; // 4 seconds response timeout

async function fetchDataWithSeparateTimeouts() {
  const controller = new AbortController();
  const connectionTimeoutId = setTimeout(() => controller.abort(), connectionTimeout);

  try {
    // const responsePromise = fetch("http://localhost:3000/slow", { signal: controller.signal });
    const responsePromise = fetch("http://10.255.255.1", { signal: controller.signal });
    clearTimeout(connectionTimeoutId);

    const response = await Promise.race([
      responsePromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Response timeout')), responseTimeout)
      )
    ]);

    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Connection timeout');
    }
    throw error;
  }
}

fetchDataWithSeparateTimeouts()
  .then(response => console.log(response))
  .catch(error => console.log(error.message));