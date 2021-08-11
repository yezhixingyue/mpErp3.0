<template>
  <section class="mp-erp-price-module-number-swap-setup-right-panel-wrap">
    <header>
      <span class="blue-span" @click="onAddClick">+ 添加转换</span>
    </header>
    <main>
      <ul>
        <li v-for="(it, i) in List" :key="it.key">
          <div class="content">
            <span class="prop">{{it.MasterProperty.DisplayContent.replace(/\[|\]/g, '')}}</span>
            <span class="operator">等于</span>
            <span class="prop">{{it.SlaveProperty ? it.SlaveProperty.DisplayContent.replace(/\[|\]/g, '') : ''}}</span>
          </div>
          <CtrlMenus :showList="['setup', 'del']" setupCostText='设置' @setup='onSetupClick(i)' @remove='onRemoveClick(i)' />
        </li>
      </ul>
      <FormulaPanelElementSelectDialog :visible.sync='leftVisible' :selectedElementIDs='leftSelectedIDs' :list='leftPropList' @submit='onLeftPropSelect' />
      <FormulaPanelElementSelectDialog  :visible.sync='rightVisible' :selectedElementIDs='rightSelectedIDs' :list='rightPropList' @submit='onRightPropSelect' />
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';

export default {
  props: {
    leftPropList: {
      type: Array,
      default: () => [],
    },
    rightPropList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    FormulaPanelElementSelectDialog,
    CtrlMenus,
  },
  data() {
    return {
      leftVisible: false,
      rightVisible: false,
      List: [],
      curIndex: '',
    };
  },
  computed: {
    leftSelectedIDs() {
      return [];
    },
    rightSelectedIDs() {
      if (this.$utils.getValueIsOrNotNumber(this.curIndex, true) && this.curIndex > -1) {
        const item = this.List[this.curIndex] ? this.List[this.curIndex].MasterProperty.StoredContent : '';
        return [item];
      }
      return [];
    },
  },
  methods: {
    onLeftPropSelect(e) {
      const temp = {
        MasterProperty: e,
        SlaveProperty: null,
        key: Math.random().toString(36).slice(-8),
      };
      this.List.unshift(temp);
    },
    onRightPropSelect(e) {
      this.List[this.curIndex].SlaveProperty = e;
    },
    onSetupClick(i) {
      this.curIndex = i;
      this.rightVisible = true;
    },
    onRemoveClick(i) {
      this.List.splice(i, 1);
    },
    onAddClick() {
      this.leftVisible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-number-swap-setup-right-panel-wrap {
  min-width: 600px;
  > header {
    padding-bottom: 15px;
  }
  > main {
    > ul {
      > li {
        display: flex;
        align-items: center;
        padding: 7px 0;
        > div.content {
          display: flex;
          width: 400px;
          line-height: 20px;
          height: 20px;
          // flex: 1;
          > span {
            font-size: 13px;
            color: #585858;
            flex: 1;
            &.operator {
              margin: 0 15px;
              flex: none;
            }
            &.prop {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        > div.ctrl-menus-container {
          margin-left: 30px;
          white-space: nowrap;
          flex: none;
          position: relative;
          top: -1px;
        }
      }
    }
  }
}
</style>
