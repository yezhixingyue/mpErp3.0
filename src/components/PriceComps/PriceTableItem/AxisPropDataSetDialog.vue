<template>
  <CommonDialogComp
    width="800px"
    top='13vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    submitText='确定'
    class="mp-erp-comps-price-module-price-table-item-axis-prop-data-set-dialog-comp-wrap"
  >
    <p>
      <span class="label">当前设置{{curAxisName}}</span>
      <span class="name">{{PropertyName}}</span>
    </p>
    <!-- 数值类型 -->
    <NumberTypePropDataSetPanel v-if="curPropType==='number'" v-model="ruleForm.InputContent" :Operator.sync='ruleForm.Operator' :Property='Property' />
    <!-- 选项 与尺寸组 类型 -->
    <OptionTypePropDataSetPanel v-if="curPropType==='option'||(curPropType==='groupsize'&&showPanel)"
     :PropType='curPropType' :Property='Property' v-model="ruleForm.List" />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import NumberTypePropDataSetPanel from './NumberTypePropDataSetPanel.vue';
import OptionTypePropDataSetPanel from './OptionTypePropDataSetPanel.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    saveData: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
    NumberTypePropDataSetPanel,
    OptionTypePropDataSetPanel,
  },
  computed: {
    curAxisName() {
      if (this.type === 'X') return '横轴';
      if (this.type === 'Y') return '竖轴';
      return '未知';
    },
    PropertyName() {
      if (this.Property) {
        const { DisplayContent, Unit } = this.Property;
        const _name = DisplayContent.replace(/\[|\]/g, '');
        const _unit = Unit ? `（单位：${Unit}）` : '';
        return `${_name}${_unit}`;
      }
      return '';
    },
    curPropType() {
      if (!this.Property) return '';
      if (this.Property.ValueType === 0) return 'number'; // 数值类型
      if (this.Property.FixedType === 7) return 'groupsize'; // 尺寸组 groupsize
      return 'option'; // 其它为选项类型 option
    },
  },
  data() {
    return {
      title: '设置费用',
      showPanel: false,
      Property: null,
      ruleForm: {
        InputContent: '',
        Operator: {
          First: 6,
          Second: 6,
        },
        List: [],
      },
    };
  },
  methods: {
    async onSubmit() { // 提交
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      // this.Property = null;
      this.showPanel = false;
    },
    initEditData() { // 数据初始化方法
      let prop;
      if (this.type === 'X') prop = this.saveData.XAxis;
      if (this.type === 'Y') prop = this.saveData.YAxis;
      if (prop) {
        this.Property = prop.Property;
        this.ruleForm.InputContent = prop.InputContent;
        this.ruleForm.Operator = { ...prop.Operator };
        this.ruleForm.List = Array.isArray(prop.List) ? JSON.parse(JSON.stringify(prop.List)) : [];
      } else {
        this.Property = null;
        this.ruleForm.InputContent = '';
        this.ruleForm.Operator = { First: 6, Second: 6 };
        this.ruleForm.List = [];
      }
      console.log(this.Property);
      this.showPanel = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-item-axis-prop-data-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 10px;
    padding-top: 30px;
    min-height: 440px;
    overflow-y: auto;
    > p {
      color: #888E99;
      font-size: 14px;
      padding-bottom: 25px;
      .label {
        margin-right: 20px;
      }
    }
  }
}
</style>
