<template>
  <section class="mp-erp-price-module-number-swap-setup-right-panel-wrap">
    <header>
      <span class="blue-span" @click="onAddClick">+ 添加转换</span>
    </header>
    <main>
      <ul>
        <li v-for="(it, i) in List" :key="it.key">
          <div class="content">
            <span
             class="prop"
             :title="it.MasterProperty.DisplayContent.replace(/\[|\]/g, '')"
             >{{it.MasterProperty.DisplayContent.replace(/\[|\]/g, '')}}</span>
            <span class="operator">等于</span>
            <span
             class="prop"
             :title="it.SlaveProperty ? it.SlaveProperty.DisplayContent.replace(/\[|\]/g, '') : ''"
             >{{it.SlaveProperty ? it.SlaveProperty.DisplayContent.replace(/\[|\]/g, '') : ''}}</span>
          </div>
          <CtrlMenus :showList="['setup', 'del']" setupCostText='设置' @setup='onSetupClick(i)' @remove='onRemoveClick(i)' />
        </li>
      </ul>
      <div class="tips-box">
        <aside> <i class="el-icon-warning"></i> 注： </aside>
        <div class="r">
          <p>同一条数据包含多个转换时同时运算，没有先后顺序</p>
          <p>例如：设置“如果 产品:数量 > 50 时，产品:长度 等于 产品:宽度，产品:宽度 等于 产品:长度” ，</p>
          <p>则长度和宽度进行互换，而不是长度和宽度都等于宽度。</p>
        </div>
      </div>
      <FormulaPanelElementSelectDialog :visible.sync='leftVisible' :selectedElementIDs='leftSelectedIDs' :list='leftPropList' @submit='onLeftPropSelect' />
      <FormulaPanelElementSelectDialog  :visible.sync='rightVisible' :selectedElementIDs='rightSelectedIDs' :list='rightPropList' @submit='onRightPropSelect' />
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { FormulaPanelElementSelectDialog } from '@/components/common/mpzj-sell-lib/lib';

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
    curEditData: {
      type: Object,
      default: null,
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
      this.List.push(temp);
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
    getPanelSetup() {
      const bool = this.checker();
      if (!bool) return null;
      return { List: this.List };
    },
    checker() {
      if (this.List.length === 0) {
        this.messageBox.failSingleError('保存失败', '未设置数值转换');
        return false;
      }
      const i = this.List.findIndex(it => !it.SlaveProperty);
      if (i > -1) {
        this.messageBox.failSingleError('保存失败', `第${i + 1}行未设置右侧对比属性`);
        return false;
      }
      const list = this.List.map(({ MasterProperty, SlaveProperty }) => MasterProperty.StoredContent + SlaveProperty.StoredContent);
      const len1 = list.length;
      const len2 = [...new Set(list)].length;
      if (len1 > len2) {
        this.messageBox.failSingleError('保存失败', '存在重复配置项');
        return false;
      }
      return true;
    },
  },
  mounted() {
    if (this.curEditData && Array.isArray(this.curEditData.List)) {
      this.List = this.curEditData.List.map(it => ({ ...it, key: Math.random().toString(36).slice(-8) })).filter(it => it.MasterProperty && it.SlaveProperty);
    }
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
      min-height: 240px;
      padding-bottom: 30px;
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
          overflow: hidden;
          > span {
            font-size: 13px;
            color: #585858;
            flex: none;
            // flex: 1;
            &.operator {
              margin: 0 15px;
            }
            &.prop {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              max-width: 260px;
              &:last-of-type {
                flex: 1;
              }
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
    > .tips-box {
      height: 90px;
      width: 700px;
      display: flex;
      padding-top: 4px;
      padding-left: 18px;
      > .r {
        letter-spacing: 0.5px;
        > p {
          &:last-of-type {
            text-indent: 3.5em;
          }
        }
      }
    }
  }
}
</style>
