import axios from 'axios';
import { IMPAxiosInstance } from '../types/type';
import { getInstanceWithIntercept } from '../getInstanceWithIntercept';

export const docBaseURL = 'http://192.168.2.214:8002';

export const docClientURL = process.env.NODE_ENV === 'development' ? 'http://192.168.2.237:5173/doc' : 'http://192.168.1.92:8060/openPlatform/doc';

const instance: IMPAxiosInstance = axios.create({ baseURL: docBaseURL });

export default getInstanceWithIntercept(instance);
