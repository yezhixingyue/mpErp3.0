<template>
  <RetractableDisplayComp
    class="mp-unpay-order-list-table"
    :isScrollStyle="false"
    :widthObj="widthObj"
    :onWidthChange="onWidthChange"
    :titleList="titleList"
  >
    <template v-if="unPayTableData">
      <ItemListComp
        v-for="(value, key) in unPayTableData"
        :key="value.CustomerNo"
        :isDisabled="curSelectedList.length > 0 && curSelectedList[0].CustomerNo !== key"
        :CustomerNo="key"
        :data="value"
        :widthObj="widthObj"
      />
    </template>
    <div class="no-data-show is-gray" v-else>暂无数据</div>
  </RetractableDisplayComp>
</template>

<script>
import RetractableDisplayComp from '@/components/common/RetractableDisplayComp/Index.vue';
import { mapState, mapGetters } from 'vuex';
import ItemListComp from './ItemListComp.vue';

export default {
  components: {
    ItemListComp,
    RetractableDisplayComp,
  },
  data() {
    return {
      widthObj: {
        w1: 175,
        w2: 120,
        w3: 95,
        w4: 80,
        w5: 315,
        w6: 105,
        w7: 120,
        w8: 95,
        w9: 90,
        w10: 80,
        w11: 180,
        w12: 260,
      },
      titleList: [
        '产品',
        '数量',
        '成交价',
        '定金',
        '文件内容',
        '收货人',
        '收货人手机',
        '配送方式',
        '状态',
        '接单人',
        '下单时间',
        '操作',
      ],
    };
  },
  computed: {
    ...mapState('unpaylist', ['curSelectedList']),
    ...mapGetters('unpaylist', ['unPayTableData']),
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
.mp-unpay-order-list-table {
  height: 100%;
  padding-top: 8px;
  box-sizing: border-box;
  // overflow-y: auto;
  > header {
    height: 36px;
    border-top: 1px solid $--border-color-light;
    border-bottom: 1px solid $--border-color-light;
    background-color: $--bg-color-base;
    box-sizing: border-box;
    > div {
      line-height: 34px;
      height: 100%;
      color: $--color-text-primary;
      background-color: $--bg-color-base;
      font-weight: 600;
      &::after {
        background-color: rgba($color: $--color-text-secondary, $alpha: 0.6);
      }
      &:first-of-type {
        text-align: left;
        padding-left: 70px;
        box-sizing: border-box;
      }
    }
  }
  .no-data-show {
    text-align: center;
    font-size: 13px;
    margin-top: 20vh;
  }
  > main {
    height: calc(100% - 36px);
  }
}
</style>
