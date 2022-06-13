<template>
  <ul class="order-list-express-progress-wrap">
    <template v-if="list.length > 0">
      <MiniProgressItem v-for="(item,i) in list" :key='item.Status + "-" + i' :data='item' />
    </template>
    <li v-else class="no-info-box">
      暂无配送进度信息
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import MiniProgressItem from '@/components/common/MiniProgressItem.vue';

export default {
  components: {
    MiniProgressItem,
  },
  computed: {
    ...mapState('orderModule', ['expressProgressData', 'OrderStatusList']),
    list() {
      if (!this.expressProgressData) return [];
      const arr = [];
      this.expressProgressData.forEach((it, i) => {
        const obj = {};
        if (it.Status && it.Status !== 0) obj.title = this.getStatusText(it.Status);
        if (it.Operator) obj.operator = it.Operator;
        obj.showLine = true;
        if (i === 0) obj.showLine = false;
        if (i === this.expressProgressData.length - 1) obj.isNewest = true;
        if (it.Description) obj.expressDetail = it.Description;
        if (it.OperateTime) {
          const [year, afterTime] = it.OperateTime.split('T');
          obj.afterTime = afterTime;
          obj.year = year;
        }
        arr.push(obj);
      });
      const newArr = arr.map((item, index) => {
        const temp = item;
        if (index < arr.length - 1 && temp.year === arr[index + 1].year) temp.year = '';
        return temp;
      }).reverse();
      return newArr;
    },
  },
  methods: {
    getStatusText(status) {
      return this.$utils.getStatusString(status, this.OrderStatusList);
    },
  },
};
</script>

<style lang='scss'>
// @import "@/assets/css/var.scss";
  .order-list-express-progress-wrap{
    padding-top: 40px;
    height: 645px;
    > .no-info-box {
      text-align: center;
      font-size: 13px;
      margin-top: 100px;
    }
  }
</style>
