import Vue from 'vue';
import { PiniaVuePlugin, pinia } from './store/pinia';
import App from './App.vue';
import router from './router';

import './assets/js/loadElement';
import './assets/js/directive';
import './assets/js/filter';
import './registerServiceWorker';

import './assets/css/index.scss';

const infiniteScroll = require('vue-infinite-scroll');

Vue.use(infiniteScroll);

Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount('#app');

console.log(infiniteScroll, Vue, Vue.directive);
