import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { endPoints } from './ENV';

const baseURL = 'https://api.vexem.co/api.php';

const Headers = {
  Header: {
    'Content-Type': 'application/json',
  },
  Header2: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
};

const createApi = () => {
  const instance = axios.create({
    baseURL,
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

const ApiRequest = async data => {
  const result = await axios.post(endPoints.BASE_URL, data, {
    headers: Headers.Header2,
  });
  return result;
};

export const { get, post, put } = createApi();
export default ApiRequest;
