/*
 * @Author: your name
 * @Date: 2020-05-23 09:50:59
 * @LastEditTime: 2020-05-28 09:32:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\assets\js\mixins\header\TimeSearchSelectorMixins.js
 */
import normalBtn from '@/components/common/normalBtn.vue';

export default {
  data() {
    return {
      beginTime: '',
      endTime: '',
      begin: '',
      end: '',
      key: false,
      visible: false,
    };
  },
  components: {
    normalBtn,
  },
  watch: {
    storeBeginTime(newVal) {
      if (!newVal) {
        this.key = false;
        this.beginTime = '';
        this.endTime = '';
        this.begin = '';
        this.end = '';
      }
    },
  },
};
