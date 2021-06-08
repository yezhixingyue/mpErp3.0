/*
 * @Author: your name
 * @Date: 2020-03-12 10:09:36
 * @LastEditTime: 2020-09-08 14:26:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/main.js
 */
import Vue from 'vue';
import api from '@/api/index';
import utils from '@/assets/js/utils/util';
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
// import 'animate.css';

Vue.prototype.api = api;
Vue.prototype.$utils = utils;
Vue.prototype.check = validateCheck;

Vue.prototype.closeGLoading = () => {
  setTimeout(() => {
    const dom = document.getElementsByClassName('mp-general-loading-box')[0];
    if (dom && dom.style) dom.style.display = 'none';
  }, 0);
};

Vue.prototype.openGLoading = () => {
  const dom = document.getElementsByClassName('mp-general-loading-box')[0];
  if (dom.style) dom.style.display = '';
};


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
