<template>
  <tbody class="mp-erp-review-statistics-list-page-table-group-item-wrap">
    <!-- 组名称 与 汇总数据 -->
    <tr v-for="it in list" :key="it.ID" :class="{'g-header': it.isGroup, active:activeId&&activeId===it.key}" @click="onRowClick(it.key)">
      <td class="label">{{it.Name}}</td>
      <td class="item" v-for="(d, i) in it.DataList" :key="d.StaffID + '' + i">
        <span :class="{hide: !(typeof d.OrderCount === 'number' && condition.ShowOrderCount)}">{{d.OrderCount}}单</span>
        <span :class="{hide: !(typeof d.KindCount === 'number' && condition.ShowKind)}">{{d.KindCount}}款</span>
        <span class="p" :class="{hide: !(typeof d.TotalAmount === 'number' && condition.ShowAmount)}">{{d.TotalAmount}}元</span>
      </td>
    </tr>
  </tbody>
</template>

<script>
import TableBodyItemClass from './TableBodyItemClass';

export default {
  props: {
    // curGroup: {
    //   type: Object,
    //   default: () => ({}),
    // },
    condition: {
      type: Object,
      default: () => ({}),
    },
    datas: {
      type: Object,
      default: () => ({}),
    },
    onRowClick: {
      type: Function,
      default: () => {},
    },
    activeId: {},
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    getGroupDataList() {
      // const temp = new TableBodyItemClass(this.curGroup, this.datas);
      const temp = new TableBodyItemClass(this.datas);
      if (temp) {
        this.list = temp.List || [];
      }
    },
  },
  mounted() {
    this.getGroupDataList();
  },
};
</script>
<style lang='scss'>
</style>
