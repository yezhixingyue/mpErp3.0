import router from '@/router';
import TokenClass from '../assets/js/utils/tokenManage';

export const logout = () => {
  TokenClass.removeToken();
  router.replace('/login');
};
