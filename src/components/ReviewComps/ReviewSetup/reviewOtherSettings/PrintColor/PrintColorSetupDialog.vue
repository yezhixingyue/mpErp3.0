<template>
  <CommonDialogComp
    :width="width"
    :title="title"
    :visible.sync="localVisible"
    class="mp-erp-review-manage-list-page-comps-other-print-color-dialog-set-up-comp-wrap"
    :class="{isDefault:isDefault}"
    :disabled="level1Options.length === 0"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    :top="`${!isDefault ? '11vh' : '15vh'}`"
  >
    <template v-if="ruleForm">
      <template v-if="!isDefault">
        <p class="t">产品部件：<span class="is-gray" v-if="level1Options.length === 0">当前暂无可设置元素</span></p>
        <el-radio-group v-model="ruleForm.Part.ID" size="mini" @change="onLv1Change">
          <el-radio-button v-for="it in level1Options" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio-button>
        </el-radio-group>
        <p class="t" v-show="ruleForm.Part.ID">元素：</p>
        <el-radio-group v-show="ruleForm.Part.ID" v-model="ruleForm.Element.ID" size="mini" @change="onLv2Change">
          <el-radio-button v-for="it in level2Options" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio-button>
        </el-radio-group>
        <p class="t" v-show="ruleForm.Element.ID">元素选项：</p>
        <el-radio-group v-show="ruleForm.Element.ID" v-model="ruleForm.OptionList[0].ID" size="mini" @change="onLv3Change">
          <el-radio-button v-for="it in level3Options" :key="it.ID" :label="it.ID" :disabled="disabledOptionIds.includes(it.ID)">{{it.Name}}</el-radio-button>
        </el-radio-group>
        <p class="t" v-show="ruleForm.OptionList[0].ID">映射到以下印色：</p>
      </template>
      <el-checkbox-group v-model="ruleForm.ColorList" :class="{default:isDefault}" v-show="ruleForm.OptionList[0].ID || isDefault">
        <el-checkbox v-for="it in PrintColorTypeEnumList" :key="it.ID" :label="it.ID">{{it.Name}} ({{it.remark}})</el-checkbox>
      </el-checkbox-group>
    </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../../packages/CommonDialogComp';
import { PrintColorTypeEnumList } from '../../../../../store/review/reviewEnums';
import PrintColorItemClass from './PrintColorItemClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    elements: {
      type: Array,
      default: () => [],
    },
    Product: {
      type: Object,
      default: () => ({}),
    },
    PrintColorList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      if (this.isDefault) return '设置默认颜色';
      return this.item ? '修改印色设置' : '添加印色设置';
    },
    width() {
      return this.isDefault ? '600px' : '700px';
    },
    level1Options() {
      const parts = [];
      this.elements.forEach(it => {
        const partNames = parts.map(_it => _it.Name);
        const _part = it._Part || it._Product;
        if (!partNames.includes(_part.Name)) {
          parts.push(_part);
        }
      });
      return parts;
    },
    level2Options() {
      return this.elements.filter(it => {
        if (it._Part) {
          return it._Part.ID === this.ruleForm.Part.ID;
        }
        return it._Product.ID === this.ruleForm.Part.ID;
      });
    },
    level3Options() {
      if (this.ruleForm?.Element?.ID) {
        const el = this.level2Options.find(it => it.ID === this.ruleForm.Element.ID);
        const list = el?.OptionAttribute?.OptionList ? [...el.OptionAttribute.OptionList] : [];
        if (el?.OptionAttribute?.Allow === true) {
          list.push({
            ID: '00000000-0000-0000-0000-000000000000',
            Name: '自定义',
          });
        }
        return list;
      }
      return [];
    },
    localPrintColorList() {
      if (!this.ruleForm || (!this.ruleForm.ID && this.ruleForm.ID !== 0)) return this.PrintColorList;
      return this.PrintColorList.filter(it => it.ID !== this.ruleForm.ID);
    },
    disabledOptionIds() {
      const list = this.localPrintColorList
        .filter(it => (it.Part && it.Part.ID === this.ruleForm.Part.ID) || (!it.Part && this.ruleForm.Part.ID === this.Product.ID))
        .filter(it => (it.Group && it.Group.ID === this.ruleForm.Group.ID) || (!it.Group && !this.ruleForm.Group.ID))
        .filter(it => it.Element && it.Element.ID === this.ruleForm.Element.ID)
        .map(it => it.Option?.ID || '')
        .filter(id => id);

      return list;
    },
  },
  data() {
    return {
      ruleForm: null,
      PrintColorTypeEnumList,
    };
  },
  methods: {
    onOpen() {
      this.ruleForm = new PrintColorItemClass({ ...this.item, _IsDefault: this.isDefault }, this.Product);
    },
    submit() {
      const data = this.ruleForm.getInfo(this.Product);
      if (!data) return;
      this.$emit('submit', data);
    },
    cancel() {
      this.localVisible = false;
    },
    onLv1Change(e) {
      // 1. 为Part中Name赋值
      const t = this.level1Options.find(it => it.ID === e);
      if (t) {
        this.ruleForm.Part.Name = t.Name;
      }
      // 2. 清空Group、Element、Option、ColorList
      this.ruleForm.Group.ID = '';
      this.ruleForm.Group.Name = '';
      this.ruleForm.Element.ID = '';
      this.ruleForm.Element.Name = '';
      this.ruleForm.OptionList[0].ID = '';
      this.ruleForm.OptionList[0].Name = '';
      this.ruleForm.ColorList = [];
    },
    onLv2Change(e) {
      // 1. 为Element中Name赋值、为Group赋值
      const t = this.level2Options.find(it => it.ID === e);
      if (t) {
        const GroupID = t._Group ? t._Group.ID || '' : '';
        const GroupName = t._Group ? t._Group.Name || '' : '';
        const ElementName = t._Group && t._Group.Name ? t.Name.replace(`${t._Group.Name}:`, '') : t.Name;
        this.ruleForm.Group.ID = GroupID;
        this.ruleForm.Group.Name = GroupName;
        this.ruleForm.Element.Name = ElementName;
      }
      // 2. 清空Option、ColorList
      this.ruleForm.OptionList[0].ID = '';
      this.ruleForm.OptionList[0].Name = '';
      this.ruleForm.ColorList = [];
    },
    onLv3Change(e) {
      // 1. 为Option中Name赋值
      const t = this.level3Options.find(it => it.ID === e);
      if (t) {
        this.ruleForm.OptionList[0].Name = t.Name;
      }
      // 2. 清空ColorList
      this.ruleForm.ColorList = [];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-manage-list-page-comps-other-print-color-dialog-set-up-comp-wrap {
  .el-dialog__body {
    padding: 30px;
    min-height: 285px;
    p.t {
      color: #585858;
      // width: 8em;
      // text-align: right;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 10px;
      > span {
        font-weight: 400;
        margin-left: 6px;
      }
    }
    .el-radio-group {
      display: block;
      margin-bottom: 28px;
      margin-left: 30px;
      min-height: 28px;
      .el-radio-button__inner {
        border-radius: 0;
        box-shadow: none;
        min-width: 6em;
        border: 1px solid #DCDFE6;
      }
      .is-active .el-radio-button__inner {
        border-color: #26bcf9;
      }
    }
    .el-checkbox-group {
      margin-left: 30px;
      .el-checkbox {
        margin-right: 50px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
      }
      &.default {
        margin-top: 25px;
        text-align: center;
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px;
  }
  &.isDefault .el-dialog__body {
    min-height: 120px;
  }
}
</style>
