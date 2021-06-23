<template>
  <LRWidthDragAutoChangeComp leftWidth='450px' class="mp-erp-new-comps-condtion-set-common-comp-wrap">
    <template v-slot:left>
      <section class="left-content">
        <header>
          <span class="label">优先级：</span>
          <el-input v-model.trim.number="Priority" maxlength="15" size="small"></el-input>
          <span class="tips-box">
            <i class="el-icon-warning"></i> 注：数字越小优先级越高
          </span>
        </header>
        <main>
          <p class="section-title">
            <span class="mp-common-title-wrap">如果</span>
            <span class="blue-span" @click="visible=true">+ 添加条件</span>
          </p>
          <ul>
            <!-- 条件区域 -->
            <li></li>
          </ul>
          <el-radio-group v-model="FilterType" size="small" class="mp-common-tab-radio-box">
            <el-radio-button :label="1">满足所有条件</el-radio-button>
            <el-radio-button :label="2">满足任一条件</el-radio-button>
          </el-radio-group>
          <FormulaPanelElementSelectDialog :visible.sync='visible' :list='PropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs' />
        </main>
      </section>
    </template>
    <template v-slot:right>
      <div class="right-content">
        <slot></slot>
      </div>
    </template>
  </LRWidthDragAutoChangeComp>
</template>

<script>
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaComps/FormulaPanelElementSelectDialog.vue';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

export default {
  props: {
    PositionID: {
      type: String,
      default: '',
    },
    moduleIndex: {
      type: Number,
      default: 0,
    },
  },
  components: {
    LRWidthDragAutoChangeComp,
    FormulaPanelElementSelectDialog, // 选择元素弹窗
  },
  data() {
    return {
      Priority: '', // 优先级
      FilterType: 1,
      visible: false,
      PropertyList: [],
      selectedElementIDs: [],
      isWatching: true,
    };
  },
  methods: {
    onElementSelect(Element) {
      console.log('onElementSelect', Element);
    },
    async getPropertyList() {
      const propertyList = await PropertyClass.getPropertyList(this.PositionID, this.moduleIndex);
      if (propertyList) {
        this.PropertyList = propertyList;
        // this.initPropertyListReplaceHelper();
      }
    },
    initPropertyListReplaceHelper() { // 获取可用属性列表并转换完成后，对编辑数据时初始的PropertyList的数据进行修改操作（以获取到的可用属性为准）
      if (!this.FormulaData || this.FormulaData.PropertyList.length === 0) return;
      this.FormulaData.PropertyList = this.FormulaData.PropertyList.map(it => {
        const t = this.PropertyList.find(_it => _it.Element.ID === it.Element.ID && it.FixedType === _it.FixedType);
        if (t) return { ...t, DefaultValue: it.DefaultValue };
        return null;
      }).filter(it => it);
    },
  },
  watch: {
    PositionID(val) {
      if (this.isWatching && val) {
        this.getPropertyList();
        this.isWatching = false;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-wrap {
  > .left {
    > .left-content {
      height: 100%;
      > header {
        white-space: nowrap;
        padding: 20px 0;
        .el-input {
          width: 110px;
          margin-right: 20px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
        }
        .tips-box {
          padding-left: 16px;
          display: inline-block;
          min-width: 220px;
          width: calc(100% - 195px);
          max-width: 400px;
        }
      }
      > main {
        min-height: calc(100% - 72px);
        display: flex;
        flex-direction: column;
        > p.section-title {
          padding: 15px 0;
          padding-bottom: 30px;
          flex: none;
          .mp-common-title-wrap {
            color: #444;
          }
          .blue-span {
            font-size: 13px;
            margin-left: 15px;
          }
        }
        > ul {
          flex: 1;
        }
        > .el-radio-group {
          width: 100%;
          padding: 18px 0;
          flex: none;
          text-align: center;
          white-space: nowrap;
          > label {
            .el-radio-button__inner {
              padding: 9px 34px;
            }
          }
        }
      }
    }
  }
  > .right {
    > .right-content {
      padding-left: 5vw;
    }
  }
  span.label {
    font-size: 14px;
    color: #888E99;
  }
}
</style>
