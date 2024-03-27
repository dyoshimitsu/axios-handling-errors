const timeout = 4000; // 1 second timeout

async function fetchDataWithTimeout() {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await Promise.race([
    fetch("http://localhost:3000/slow", { signal: controller.signal }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    )
  ]);

  clearTimeout(id);

  return response;
}

fetchDataWithTimeout()
  .then(response => console.log(response))
  .catch(error => console.log(error));
