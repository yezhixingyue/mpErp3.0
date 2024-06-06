/* eslint-disable max-len */
import axios from 'axios';
import { IMPAxiosInstance } from './types/type';
import { getInstanceWithIntercept } from './getInstanceWithIntercept';

const instance: IMPAxiosInstance = axios.create({});

export default getInstanceWithIntercept(instance);
