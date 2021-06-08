<template>
  <RetractableDisplayComp class="mp-paylist-detail-dia-table"
    :widthObj='widthObj' :onWidthChange='onWidthChange' :titleList='titleList'
    >
      <ProductItem
        v-for="item in tableData.PackageList" :key='item.ID'
        :data='item' :widthObj='widthObj' />
  </RetractableDisplayComp>
</template>

<script>
import RetractableDisplayComp from '@/components/common/RetractableDisplayComp/Index.vue';
import ProductItem from './ProductItem.vue';

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
        w1: 145,
        w2: 90,
        w3: 85,
        w4: 82,
        w5: 345,
      },
      titleList: ['产品', '数量', '成交价', '定金', '文件内容'],
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
  }
  > main {
    padding: 0 10px;
    height: 354px;
  }
}

</style>
