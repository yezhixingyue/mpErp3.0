/*
 * @Author: your name
 * @Date: 2020-03-12 10:09:36
 * @LastEditTime: 2022-09-30 17:18:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/main.js
 */
import Vue from 'vue';
// import mpLib from 'mpzj-comp-lib';
// import 'mpzj-comp-lib/lib/ep.css';
import api from '@/api/index';
import utils from '@/assets/js/utils/util';
import Clickoutside from 'element-ui/lib/utils/clickoutside';
// import 'mpzj-sell-lib/dist/css/index.css';
import validateCheck from './assets/js/validator/validateCheck';
import '@/assets/js/utils/loadElement'; // element组件按需引入文件
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/js/utils/dialogDrag';
import './assets/css/summary.scss';
import './assets/css/common/clientType.scss';
import './assets/css/common/common.scss';
import './assets/js/utils/message';
import './assets/js/filters/filters';
import './packages/commonFilters';
import './packages/directive';
// import 'animate.css';
import './api/mock';


Vue.directive('clickoutside', Clickoutside); // EpCascader等使用 可选更优引入与注册方式

Vue.prototype.api = api;
Vue.prototype.$utils = utils;
Vue.prototype.check = validateCheck;

// Vue.use(mpLib);


Vue.directive('loadmore', { // 自定义指令： 用于表格下拉到底加载更多事件
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper');
    selectWrap.addEventListener('scroll', function listenScroll() {
      const sign = 50;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      if (scrollDistance <= sign) {
        binding.value();
      }
    });
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
