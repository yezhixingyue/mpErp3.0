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
        <span
        class="blue-span is-font-size-13"
        :class="usableCraftList && usableCraftList.length > 0 ? '' : 'disabled'"
        @click="DisplayGroupingVisible = true"
          >设置分组</span>
      </p>
      <div v-for="it in CraftGroupList" :key='it.key || it.ID'>
        <span>{{it.Name}} <i :class="{'is-success':!it.IsNameHidden}">（{{it.IsNameHidden?'隐藏名称':'显示名称'}}）</i> </span>
        <span class="list-name" :title="getItemNames(it.List)">{{getItemNames(it.List)}}</span>
      </div>
      <div class="empty is-pink" v-if="usableCraftList && usableCraftList.length > 0 && CraftGroupList && CraftGroupList.length === 0">
        显示分组未设置 ！
      </div>
    </div>
    <DisplayHiddenCraftSetDialog v-model="curHiddenCraftData" :visible.sync='DisplayHiddenVisible' />
    <DisplayCraftGroupingSetDialog :visible.sync='DisplayGroupingVisible' :usableCraftList='usableCraftList' v-model="curGroupCraftData" />
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
    CraftGroupList: {
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
      if (!this.usableCraftList || this.usableCraftList.length === 0) return '';
      return this.usableCraftList.filter(it => it.HiddenToCustomer).map(it => it.Name).join('、');
    },
    curGroupCraftData: {
      get() {
        return this.CraftGroupList;
      },
      set(val) {
        this.$emit('setGroupCraftList', val);
      },
    },
  },
  methods: {
    getItemNames(list) {
      if (!list || list.length === 0) return '';
      return list.map(it => {
        const t = this.usableCraftList.find(_it => _it.ID === it);
        return t ? t.Name : '';
      }).filter(it => it).join('、');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-craft-set-page-right-content-wrap {
  padding-left: 40px;
  min-width: 550px;
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
    &.display-grouping {
      > p {
        padding-bottom: 30px;
      }
      padding-right: 60px;
      > div {
        height: 20px;
        padding: 11px 30px;
        line-height: 24px;
        font-size: 12px;
        color: #585858;
        border-bottom: 1px solid #eee;
        white-space: nowrap;
        > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          &:first-of-type {
            width: 220px;
            margin-right: 20px;
          }
          &:last-of-type {
            width: calc(100% - 240px);
          }
        }
        &.empty {
          border: none;
          padding-left: 12px;
          color: #cbcbcb;
        }
      }
    }
  }

}
</style>
