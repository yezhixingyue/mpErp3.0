<template>
  <RetractableDisplayComp class="mp-paylist-detail-dia-table"
    :widthObj='widthObj' :onWidthChange='onWidthChange' :titleList='titleList'
    >
      <ProductItem
        v-for="item in tableData.PackageList" :key='item.OrderID'
        :data='item' :widthObj='widthObj' />
  </RetractableDisplayComp>
</template>

<script>
import RetractableDisplayComp from '@/packages/RetractableDisplayComp';
import ProductItem from '../SmallComp/ProductItem.vue';

export default {
  components: {
    ProductItem,
    RetractableDisplayComp,
  },
  props: {
    /**
     * 需要渲染的列表数据
     */
    tableData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      widthObj: {
        w1: 98,
        w2: 122,
        w3: 90,
        w4: 70,
        w5: 70,
        w6: 300,
      },
      titleList: ['订单号', '产品', '数量', '成交价', '定金', '文件内容'],
    };
  },
  methods: {
    onWidthChange(newW, w) {
      this.widthObj[w] = newW;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-paylist-detail-dia-table {
  height: 400px;
  > header {
    padding: 0 10px;
    background-color: #79adfa;
    > div {
      background-color: #79adfa;
      color: #fff;
    }
    .mp-table-drag-cell:after {
      background-color: #96bffa;
    }
  }
  > main {
    padding: 0 10px;
    height: 354px;
  }
}

</style>
