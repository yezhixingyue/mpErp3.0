import axios from 'axios';
import { IMPAxiosInstance } from '../types/type';
import { getInstanceWithIntercept } from '../getInstanceWithIntercept';
import { docBaseURL } from '@/config';

const instance: IMPAxiosInstance = axios.create({ baseURL: docBaseURL });

export default getInstanceWithIntercept(instance);
