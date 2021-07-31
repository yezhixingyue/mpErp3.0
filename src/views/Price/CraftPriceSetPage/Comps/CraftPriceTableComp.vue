<template>
  <section class="mp-erp-price-module-craft-price-list-page-table-comp-container">
    <header>
      <span class="mp-common-title-wrap">{{itemData.Name}}工艺费</span>
    </header>
    <main>
      <div v-for="item in itemData.CraftList" :key="item.ID">
        <span class="craft-name">{{item.Name}}</span>
        <span class="cost" :title="item._PriceSolutionShowCentent">{{item._PriceSolutionShowCentent}}</span>
        <span class="all-cost">总费用</span>
        <CtrlMenus :showList="['setupCost', 'allCost']" @setupCost='onSetupCostClick(item)' @allCost='onSetupAllCostClick(item)' />
      </div>
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
  },
  data() {
    return {
    };
  },
  methods: {
    getSubmitData(Craft) {
      const { ProductID, PartID } = this.itemData;
      return {
        ProductID,
        PartID,
        Craft,
      };
    },
    onSetupCostClick(item) { // 设置费用组成
      const temp = this.getSubmitData(item);
      this.$emit('setupCost', temp);
    },
    onSetupAllCostClick(item) { // 设置总费用
      const temp = this.getSubmitData(item);
      this.$emit('allCost', temp);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-craft-price-list-page-table-comp-container {
  margin-bottom: 40px;
  > header {
    padding-bottom: 10px;
    line-height: 28px;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    > .mp-common-title-wrap {
      font-size: 15px;
      color: #444;
      min-width: 12em;
      margin-right: 1em;
      &::before {
        height: 16px;
      }
    }
  }
  > main {
    > div {
      display: flex;
      align-items: center;
      height: 45px;
      box-sizing: border-box;
      border: 1px solid #eee;
      font-size: 14px;
      color: #585858;
      transition: 0.1s ease-in-out;
      &:not(:last-of-type) {
        border-bottom: none;
      }
      > .craft-name {
        flex: none;
        width: 15em;
        padding: 0 25px;
        line-height: 20px;
      }
      > .cost {
        flex: 1;
        padding: 0px 25px;
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 10em;
      }
      > .all-cost {
        width: 240px;
        min-width: 200px;
        padding-left: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
      }
      > .ctrl-menus-container {
        width: 270px;
        min-width: 150px;
        flex: none;
        > span + span {
          margin-left: 25px;
        }
      }
      &:hover {
        border-color: #ccc;
        background-color: #f8f8f8;
        & + div {
          border-top-color: #ccc;
        }
      }
    }
  }
}
</style>
