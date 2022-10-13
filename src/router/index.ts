import Vue from 'vue';
import VueRouter from 'vue-router';
import routeConfig from './routes';

import handleRouterEach from './handleRouterEach';

export const { routes } = routeConfig;

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

handleRouterEach(router);

export function useRouter() {
  return router;
}

export function useRoute() {
  return router.currentRoute;
}

export default router;
