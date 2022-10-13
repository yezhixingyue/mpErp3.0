import Vue from 'vue';
import { PiniaVuePlugin, pinia } from './store/pinia';
import App from './App.vue';
import router from './router';

import './assets/js/loadElement';
import './assets/js/directive';

import './registerServiceWorker';

import './assets/css/index.scss';

Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
