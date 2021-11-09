<template>
  <section class="mp-erp-product-module-interaction-compare-panel-container">
    <ul>
      <li v-for="(it, i) in localList" :key="it.key || it.ID">
        <div>
          <span class="blue-span" @click="onLeftClick(i)">选择数值</span>
          <span class="selected-title" :title="it.Property ? (it.Property.TipsContent || it.Property.DisplayContent.replace(/\[|\]/g, '')) : ''">
            {{ it.Property ? it.Property.DisplayContent.replace(/\[|\]/g, '') : '' }}
          </span>
          <el-select v-model="it.Operator" :disabled='!it.Property' no-data-text='请先左侧选择数值' size="small" popper-class='compare-operator'>
            <el-option
              v-for="item in getOperatorOptions(it)"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
          <span class="blue-span is-font-size-12" @click="onRightClick(i)" :class="{'disabled': !it.Property}">选择对比数值</span>
          <el-input
           size="small"
           class="selected-input"
           v-if="!it.CompareProperty || !it.CompareProperty.DisplayContent"
           maxlength="9"
           v-model.trim="it.DefaultValue">
           </el-input>
          <span v-else class="selected-title" :title="it.CompareProperty ? it.CompareProperty.DisplayContent.replace(/\[|\]/g, '') : ''">
            {{ it.CompareProperty ? it.CompareProperty.DisplayContent.replace(/\[|\]/g, '') : '' }}
          </span>
        </div>
        <div>
          <span class="label">错误提示：</span>
          <el-input size="small" maxlength="70" v-model.trim="it.FailTips" show-word-limit></el-input>
          <span class="del" @click="onItemRemoveClick(i)">
            <img src="@/assets/images/del.png" alt="">
            <i>删除</i>
          </span>
        </div>
      </li>
    </ul>
    <FormulaPanelElementSelectDialog key="l" :visible.sync='leftVisible' :list='leftPropertyList' @submit='onLeftSelected' :selectedElementIDs='lSelectedIDs'/>
    <FormulaPanelElementSelectDialog showConstant freeText='常数'
     :visible.sync='rightVisible' :list='rightPropertyList' @submit='onRightSelected' :selectedElementIDs='rSelectedIDs'/>
    <!-- 右侧说明抽屉面板 -->
    <el-drawer :visible.sync="drawer" size='470px' :show-close='false'>
      <template slot='title'>
        <span class="drawer-title" @click="drawer=false"> <i class="el-icon-arrow-right"></i> 说明</span>
      </template>
      <div class="drawer-content">
        <div>设置时请注意逻辑悖论，例如：</div>
        <p>如果 A > B 则必须满足 A &lt;= B；</p>
        <p>如果 A &lt;= B 则必须满足 A > B；</p>
        <p style="margin: 15px 0">那么将一直提示错误，无法下单。再如：</p>
        <p>如果 A > B 则必须满足 C > D；</p>
        <p>如果 A &lt;= B 则必须满足 C &lt;= D；</p>
        <p>如果 C > D 则必须满足 A &lt; B；</p>
        <p>如果 C &lt;= D 则必须满足 A > B；</p>
        <p>那么这个产品将无法下单，循环提示错误。</p>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';
import PropertyClass, { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';

export default {
  props: {
    drawerVisible: {
      type: Boolean,
      default: false,
    },
    leftPropertyList: {
      type: Array,
      default: () => [],
    },
    rightPropertyList: {
      type: Array,
      default: () => [],
    },
    initData: {
      type: Object,
      default: null,
    },
  },
  components: {
    FormulaPanelElementSelectDialog,
  },
  computed: {
    drawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit('update:drawerVisible', val);
      },
    },
    lSelectedIDs() {
      if ((this.leftIndex || this.leftIndex === 0) && this.localList[this.leftIndex] && this.localList[this.leftIndex].Property) {
        return [this.localList[this.leftIndex].Property.StoredContent];
      }
      return [];
    },
    rSelectedIDs() {
      if ((this.rightIndex || this.rightIndex === 0) && this.localList[this.rightIndex] && this.localList[this.rightIndex].Property) {
        return [this.localList[this.rightIndex].Property.StoredContent];
      }
      return [];
    },
  },
  data() {
    return {
      localList: [],
      listItem: {
        ID: '',
        ControlID: '',
        Property: null,
        Operator: '',
        CompareProperty: null,
        FailTips: '',
        key: '',
        DefaultValue: '',
      },
      leftVisible: false,
      rightVisible: false,
      leftIndex: '',
      rightIndex: '',
    };
  },
  methods: {
    onItemAddClick() { // 添加条目
      const key = Math.random().toString(16).slice(-8);
      this.localList.push({ ...this.listItem, key });
    },
    onItemRemoveClick(i) { // 删除条目
      this.localList.splice(i, 1);
    },
    onLeftClick(i) { // 左侧选择数值点击事件
      this.leftIndex = i;
      this.leftVisible = true;
    },
    onRightClick(i) { // 右侧选择数值点击事件
      this.rightIndex = i;
      this.rightVisible = true;
    },
    onLeftSelected(e) { // 左侧选中属性处理事件
      if (!e || (!this.leftIndex && this.leftIndex !== 0)) return;
      this.localList[this.leftIndex].Property = e;
      this.localList[this.leftIndex].CompareProperty = null; // 是否清空？
      // 自动设置关系值为第一项
      const operator = e.OperatorList && e.OperatorList.length > 0 ? e.OperatorList[0] : '';
      if (operator || operator === 0) this.localList[this.leftIndex].Operator = operator;
    },
    onRightSelected(e) { // 右侧选中属性处理事件
      if (!this.rightIndex && this.rightIndex !== 0) return;
      this.localList[this.rightIndex].CompareProperty = e;
    },
    getOperatorOptions(it) { // 获取关系列表
      if (!it) return [];
      const { Property } = it;
      if (!Property) return [];
      const { OperatorList } = Property;
      if (!Array.isArray(OperatorList) || OperatorList.length === 0) return [];
      return AllOperatorList.filter(_it => OperatorList.includes(_it.ID));
    },
    getSubmitInfo() {
      const bool = this.getCheckResult();
      if (bool) return { List: this.localList.map(it => ({ ...it, DefaultValue: it.CompareProperty ? null : +it.DefaultValue })) };
      return null;
    },
    getCheckResult() {
      if (this.localList.length === 0) {
        this.messageBox.failSingleError('保存失败', '对比结果为空，请添加右侧对比条目');
        return false;
      }
      for (let i = 0; i < this.localList.length; i += 1) {
        const it = this.localList[i];
        if (!it.FailTips || !it.Property) {
          this.messageBox.failSingleError('保存失败', `第${i + 1}行信息不完整，请检查数值、对比数值及错误提示`);
          return false;
        }
        if (!it.CompareProperty) {
          if (!it.DefaultValue && it.DefaultValue !== 0) {
            this.messageBox.failSingleError('保存失败', `第${i + 1}行未填写对比数值，请输入数字值`);
            return false;
          }
          if (!this.$utils.getValueIsOrNotNumber(it.DefaultValue)) {
            this.messageBox.failSingleError('保存失败', `第${i + 1}行对比数值输入类型不正确，请输入数字值`);
            return false;
          }
        }
      }
      return true;
    },
  },
  mounted() {
    if (this.initData && Array.isArray(this.initData.List)) { // 编辑时还原数据
      const list = this.initData.List.map(it => {
        const CompareProperty = PropertyClass.getPerfectPropertyByImperfectProperty(it.CompareProperty, this.rightPropertyList) || null;
        const Property = PropertyClass.getPerfectPropertyByImperfectProperty(it.Property, this.leftPropertyList) || null;
        return { ...it, Property, CompareProperty };
      });
      this.localList = list;
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-interaction-compare-panel-container {
  > ul {
    padding-top: 10px;
    > li {
      margin-bottom: 24px;
      > div {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        > span {
          flex: 0 0 auto;
          &.blue-span {
            margin-right: 14px;
          }
          &.selected-title {
            flex: 1 0 auto;
            font-size: 12px;
            color: #888E99;
            min-width: 200px;
            max-width: 240px;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 12px;
            box-sizing: border-box;
            &:last-of-type {
              text-align: left;
            }
          }
          &.del {
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-left: 15px;
            color: #A2A2A2;
            transition: color 0.1s ease-in-out;
            user-select: none;
            &:hover {
              color: #444;
            }
            > img {
              margin-right: 6px;
            }
          }
        }
        > div {
          flex: 0 0 auto;
          &.el-select {
            margin-right: 15px;
            width: 100px;
            .el-input__inner {
              font-size: 12px;
              // padding-left: 10px;
              // padding-right: 20px;
            }
            // .el-input__suffix {
            //   right: 0;
            // }
          }
          &.el-input {
            max-width: 600px;
            min-width: 460px;
            flex: 1 1 auto;
            .el-input__inner {
              padding-right: 50px;
            }
          }
          &.selected-input {
            width: 100px;
            flex: 0 0 auto;
            max-width: 100px;
            min-width: 100px;
            .el-input__inner {
              padding: 0 15px;
            }
          }
        }
      }
    }
  }
}
.compare-operator {
  .el-select-dropdown__empty {
    font-size: 12px;
    color: #888E99;
    padding: 10px;
  }
}
</style>
