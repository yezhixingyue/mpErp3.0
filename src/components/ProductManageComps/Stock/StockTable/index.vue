<template>
  <section class="mp-erp-product-module-stock-page-list-table-comp-container">
    <header>
      <span class="mp-common-title-wrap">{{title}}库存</span>
      <span class="blue-span" @click="onSpecificationAddClick">+ 添加规格</span>
      <span class="blue-span">设置库存预警</span>
      <span class="intro">库存数量 ≤ 500个时预警，短信预警手机号：13512341234</span>
    </header>
    <main>
      <ul v-if="itemData">
        <li v-for="it in itemData.StockList" :key="it.ID">
          <span>规格</span>
          <span>核减数量：</span>
          <span>当前库存</span>
          <div>
            <span>修改库存</span>
            <span>删除</span>
          </div>
        </li>
        <li class="empty">
          <span>暂无条目</span>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '产品',
    },
    itemData: {
      type: Object,
      default: null,
    },
  },
  methods: {
    onSpecificationAddClick() {
      this.$emit('add');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-stock-page-list-table-comp-container {
  > header {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    .mp-common-title-wrap {
      font-size: 15px;
      color: #444;
      min-width: 6em;
      &::before {
        height: 16px;
      }
    }
    .blue-span {
      margin: 0 25px;
      & + .blue-span {
        margin-left: 35px;
        margin-right: 30px;
      }
    }
    .intro {
      font-size: 12px;
      color: #999;
    }
  }
  > main {
    > ul {
      min-height: 135px;
      border: 1px solid #eee;
      > li {
        border-bottom: 1px solid #eee;
        height: 24px;
        line-height: 24px;
        padding: 10px 0;
        &:last-of-type {
          border-color: #fff;
        }
        &:first-of-type:not(.empty) {
          border-color: #eee;
        }
        &.empty {
          font-size: 12px;
          color: #a2a2a2;
          padding: 55px 0;
          text-align: center;
          padding-right: 200px;
        }
      }
    }
  }
}
</style>
