import axios from 'axios';
import { IMPAxiosInstance } from '../types/type';
import { getInstanceWithIntercept } from '../getInstanceWithIntercept';

const instance: IMPAxiosInstance = axios.create({ baseURL: 'http://192.168.3.139:8002/' });

export default getInstanceWithIntercept(instance);
