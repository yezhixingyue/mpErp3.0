<template>
  <section class="mp-erp-product-module-craft-set-page-right-content-wrap">
    <div class="display-hidden">
      <span class="mp-common-title-wrap is-black">客户界面隐藏</span>
      <span class="blue-span is-font-size-13"
       :class="usableCraftList && usableCraftList.length > 0 ? '' : 'disabled'" @click="DisplayHiddenVisible = true">设置隐藏</span>
      <span class="hide-text" :title="HiddenCraftTextList">{{HiddenCraftTextList}}</span>
    </div>
    <div class="display-grouping">
      <p>
        <span class="mp-common-title-wrap is-black">显示分组</span>
        <span class="blue-span is-font-size-13" :class="usableCraftList && usableCraftList.length > 0 ? '' : 'disabled'"
          >设置分组</span>
      </p>
    </div>
    <DisplayHiddenCraftSetDialog v-model="curHiddenCraftData" :visible.sync='DisplayHiddenVisible' />
    <DisplayCraftGroupingSetDialog :visible.sync='DisplayHiddenVisible' />
  </section>
</template>

<script>
import DisplayHiddenCraftSetDialog from './DisplayHiddenCraftSetDialog.vue';
import DisplayCraftGroupingSetDialog from './DisplayCraftGroupingSetDialog.vue';

export default {
  props: {
    usableCraftList: {
      type: Array,
      default: null,
    },
  },
  components: {
    DisplayHiddenCraftSetDialog,
    DisplayCraftGroupingSetDialog,
  },
  data() {
    return {
      DisplayHiddenVisible: false,
      DisplayGroupingVisible: false,
    };
  },
  computed: {
    curHiddenCraftData: {
      get() {
        return this.usableCraftList;
      },
      set(val) {
        this.$emit('setHiddenCraftList', val);
      },
    },
    HiddenCraftTextList() {
      if (!this.usableCraftList || this.usableCraftList.length === 0) return [];
      return this.usableCraftList.filter(it => it.HiddenToCustomer).map(it => it.Name).join('、');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-craft-set-page-right-content-wrap {
  padding-left: 40px;
  > div {
    .mp-common-title-wrap {
      margin-right: 25px;
    }
    &.display-hidden {
      padding-bottom: 35px;
      display: flex;
      align-items: flex-start;
      > span {
        line-height: 20px;
        flex: none;
        &.hide-text {
          font-size: 12px;
          color: #999;
          margin-left: 20px;
          margin-bottom: 8px;
          flex: 1;
          min-width: 120px;
        }
      }
    }
  }

}
</style>
