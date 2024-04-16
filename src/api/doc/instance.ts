import axios from 'axios';
import { IMPAxiosInstance } from '../types/type';
import { getInstanceWithIntercept } from '../getInstanceWithIntercept';

const instance: IMPAxiosInstance = axios.create({ baseURL: 'http://192.168.2.214:8002/' });

export default getInstanceWithIntercept(instance);
