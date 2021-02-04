import axios from 'axios';

const BASE_URL = 'http://localhost:3333/todos';

const instance = axios.create();
instance.interceptors.request.use(async (config) => {
  config.baseURL = BASE_URL;
  return config;
});
export default instance;
