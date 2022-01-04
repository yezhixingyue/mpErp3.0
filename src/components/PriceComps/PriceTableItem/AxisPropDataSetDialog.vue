<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
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
    <OptionTypePropDataSetPanel v-if="(curPropType==='option'|| curPropType==='groupsize') && showPanel && Property" :SizeList='SizeList'
     :PropType='curPropType' :Property='Property' v-model="ruleForm.List" ref='oSizePanel' />
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
      SizeList: [],
      ruleForm: {
        InputContent: '',
        Operator: {
          First: 5,
          Second: 6,
        },
        List: [],
      },
    };
  },
  methods: {
    async onSubmit() { // 提交
      if (this.curPropType === 'groupsize') {
        const list = this.$refs.oSizePanel.getInputSizeList();
        if (!Array.isArray(list)) return;
        list.forEach(it => {
          this.ruleForm.List.push({ ID: this.$utils.getAUUID(), Values: it.List });
        });
      }
      // 选项值校验
      if (this.curPropType !== 'number') {
        if (this.ruleForm.List.length === 0) {
          this.messageBox.failSingleError('保存失败', '请添加内容');
          return;
        }
      } else { // 数字类型 输入框校验
        if (!this.ruleForm.InputContent) {
          this.messageBox.failSingleError('保存失败', '请添加内容');
          return;
        }
        const arr = this.ruleForm.InputContent.split(/,|，/).filter(it => it).map(it => it.split(' ').filter(_it => _it));
        let t = arr.find(it => it.length > 0);
        if (!t) {
          this.messageBox.failSingleError('保存失败', '请添加内容');
          return;
        }
        t = arr.find(it => it.length > 2);
        if (t) {
          this.messageBox.failSingleError('保存失败', '输入内容格式不正确');
          return;
        }
        const strArr = arr.map(it => JSON.stringify(it));
        if (strArr.length > [...new Set(strArr)].length) {
          this.messageBox.failSingleError('保存失败', '存在重复项');
          return;
        }
        const spreadArr = arr.reduce((prev, next) => [...prev, ...next], []);
        t = spreadArr.find(it => !this.$utils.getValueIsOrNotNumber(it));
        if (t) {
          this.messageBox.failSingleError('保存失败', '输入内容中存在非数字类型');
          return;
        }
        t = spreadArr.find(it => +it < 0 && it !== '-1');
        if (t) {
          this.messageBox.failSingleError('保存失败', '不能输入负数（-1除外）');
          return;
        }
        t = arr.filter(it => it.length === 2).find(([item1, item2]) => item1 === item2);
        if (t) {
          this.messageBox.failSingleError('保存失败', '同一个项目中前后2个数值不能相同');
          return;
        }
        t = arr.filter(it => it.length === 1).find(([item1]) => item1 === '-1');
        if (t) {
          this.messageBox.failSingleError('保存失败', '不能单独使用-1设置为一个项目');
          return;
        }
        let min = spreadArr[0];
        let isError = false;
        spreadArr.forEach((it, i) => {
          if (i > 0 && !isError) {
            if ((+it < +min || min === '-1') && it !== '-1') isError = true;
            else min = it;
          }
        });
        if (isError) {
          this.messageBox.failSingleError('保存失败', '数字排序应按照从小到大顺序排列');
          return;
        }
        let last = null;
        arr.forEach(it => {
          if (isError) return;
          if (last) {
            if (last.length === 1) {
              isError = it[0] === last[0] && this.ruleForm.Operator.First === 6;
            } else if (it[0] === last[1] && this.ruleForm.Operator.Second === 6) {
              isError = it.length === 1 || (it.length > 1 && this.ruleForm.Operator.First === 6);
            }
          }
          last = it;
        });
        if (isError) {
          this.messageBox.failSingleError('保存失败', '存在相同数字且导致区间重叠');
          return;
        }
        this.ruleForm.List = arr.map(list => ({ ID: this.$utils.getAUUID(), Value: list.join(' ') }));
      }
      this.$emit('submit', this.ruleForm, this.type);
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
      if (this.type === 'X') {
        prop = this.saveData.XAxis;
        this.title = '设置横轴数据';
      }
      if (this.type === 'Y') {
        prop = this.saveData.YAxis;
        this.title = '设置竖轴数据';
      }
      if (prop) {
        this.Property = prop.Property;
        this.ruleForm.InputContent = prop.InputContent;
        this.ruleForm.Operator = { ...prop.Operator };
        this.ruleForm.List = Array.isArray(prop.List) ? JSON.parse(JSON.stringify(prop.List.filter(it => it.Value))) : []; // 复选框选中的尺寸组选项ID
        // 手动添加的尺寸条目信息
        this.SizeList = Array.isArray(prop.List)
          ? JSON.parse(JSON.stringify(
            prop.List.filter(it => !it.Value && it.Values && it.Values.length > 0).map(it => ({ List: it.Values, ID: it.ID })),
          ))
          : [];
      } else {
        this.Property = null;
        this.ruleForm.InputContent = '';
        this.ruleForm.Operator = { First: 5, Second: 6 };
        this.ruleForm.List = [];
        this.SizeList = [];
      }
      this.showPanel = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-item-axis-prop-data-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    // padding-right: 50px;
    padding-bottom: 20px;
    padding-top: 30px;
    max-height: 600px;
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
  .el-dialog__footer {
    padding-top: 16px;
  }
}
</style>
