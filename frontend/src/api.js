/* axios nterceptor ile her requestimizde check edecek access var mı diye
 */

import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  /*     env variable ile urli load ve change etmek easy
   */
});

//autherization token automatically will ve added for us böylece
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
