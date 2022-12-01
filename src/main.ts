import Vue from 'vue';
import api from '@/api/index';
import utils from '@/assets/js/utils/util';
import Clickoutside from 'element-ui/lib/utils/clickoutside';
import { PiniaVuePlugin, pinia } from './pinia/pinia';
import validateCheck from './assets/js/validator/validateCheck';
import '@/assets/js/utils/loadElement'; // element组件按需引入文件
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/js/directive';
import './assets/css/summary.scss';
import './assets/css/common/clientType.scss';
import './assets/css/common/common.scss';
import './assets/js/utils/message';
import './assets/js/filters/filters';
import './packages/commonFilters';
import './packages/directive';
import './api/mock';

Vue.directive('clickoutside', Clickoutside); // EpCascader等使用 可选更优引入与注册方式

Vue.prototype.api = api;
Vue.prototype.$utils = utils;
Vue.prototype.check = validateCheck;

Vue.use(PiniaVuePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
