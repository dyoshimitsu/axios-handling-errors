import axios from 'axios';

async function fetchWithAxios() {
  const connectController = new AbortController();
  // const connectionTimeout = setTimeout(() => connectController.abort(), 400);
  const connectionTimeout = setTimeout(() => {
    connectController.abort();
    console.log('Connection timeout');
  }, 500);

  axios.get("http://localhost:3000/slow", {
    signal: connectController.signal,
    timeout: 1000,
    onDownloadProgress: (progressEvent) => {
      console.log(progressEvent.loaded);
      clearTimeout(connectionTimeout); // 接続が確立したら接続タイムアウトをクリア
    }
  }).then(function (response) {
    console.log(response.status);
  })
    .catch(function (error) {
      console.log(error.code)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
      }
      // console.log(error.config);
    });
}

axios();
