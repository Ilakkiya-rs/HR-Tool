import axios from 'axios';

const ApiClient = axios.create({
  baseURL: `https://lambdaapi.iysskillstech.com/staging/dev-api/`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    if (res.status === 429) {
      window.location.href = '/rate-limit-exceed';
    }
    console.error(`Looks like there was a problem.Status Code: ${res.status}`);
    return Promise.reject(error);
  }
);

export default ApiClient;
