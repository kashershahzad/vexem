import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { endPoints } from './ENV';

const Headers = {
  Header: {
    'Content-Type': 'application/json',
  },
  Header2: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
};

// Chat-only REST client (get/post/put) — NOT for login/signup/home
const createApi = () => {
  const instance = axios.create({
    baseURL: endPoints.CHAT_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('chatToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });

  const get = url => {
    return instance.get(url);
  };

  const post = (url, data) => {
    return instance.post(url, data);
  };
  const put = (url, data) => {
    return instance.put(url, data);
  };

  return { get, post, put };
};

// Main app APIs — login, signup, home, ads, upload, etc.
const ApiRequest = async data => {
  const result = await axios.post(endPoints.BASE_URL, data, {
    headers: Headers.Header2,
  });
  return result;
};

export const { get, post, put } = createApi();
export default ApiRequest;
