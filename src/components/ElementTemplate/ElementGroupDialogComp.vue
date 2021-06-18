<template>
  <CommonDialogComp
    width="850px"
    top='10vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-element-template-element-group-dialog-comp-wrap"
  >
    <el-form
      :model="ruleGroupForm"
      :rules="rules"
      ref="ruleGroupForm"
      label-width="100px"
      class="element-group-ruleGroupForm"
      size='mini'
      v-if="ruleGroupForm"
    >
      <el-form-item label="名称：" prop="Name" key="GroupName">
        <div class="element-name-box">
          <div>
            <el-input style="width:350px" v-model.trim="ruleGroupForm.Name" placeholder="请输入元素组名称" maxlength="6" show-word-limit></el-input>
          </div>
          <div class="checked-box">
            <el-checkbox class="checked-item" v-model="ruleGroupForm.IsNameHidden">界面隐藏名称</el-checkbox>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="元素：" prop="ElementList" class="element-box" key="GroupElementList">
        <ul>
          <li v-for="it of ruleGroupForm.ElementList" :key="it.ID">
            <el-checkbox v-model="it.Checked" class="element-item" :disabled='it.Disabled'>
              {{it.Name}}
            </el-checkbox>
            <el-checkbox v-show="it.Checked" v-model="it.ForbidRepeat">禁止重复</el-checkbox>
          </li>
          <li v-if="ElementList.length === 0" style="width:520px" class="is-pink is-font-size-12">注：[ 当前尚无可用元素，请确保元素已添加，或元素数据已成功获取（未获取成功可刷新尝试） ]</li>
        </ul>
      </el-form-item>
      <el-form-item label="使用次数：" prop="UseTimes" class="use-times-box" key="GroupUseTimes">
        <el-input style='width:110px' v-model.number.trim="ruleGroupForm.UseTimes.MinValue" maxlength="15"></el-input>
        <span>≤ 次数 ≤</span>
        <el-input style='width:110px' v-model.number.trim="ruleGroupForm.UseTimes.MaxValue" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="排列方式：" prop="Arrange" class="arrange-box" key="GroupArrange">
        <el-radio-group v-model="ruleGroupForm.IsHorizontalDisplay">
          <el-radio :label="true">横排</el-radio>
          <el-radio :label="false">竖排</el-radio>
        </el-radio-group>
        <p>
          <el-checkbox v-model="ruleGroupForm.HiddenToCustomer">客户界面隐藏</el-checkbox>
        </p>
      </el-form-item>
    </el-form>
    <p class="tips-box"><i class="el-icon-warning"></i> 注：“禁止重复”指元素组多次使用时，任意一组该元素的值不能和其他组相同</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import ElementGroup from '@/assets/js/TypeClass/ElementGroupClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
    ElementList: {
      type: Array,
      default: () => [],
    },
    PositionID: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加界面元素组',
      ruleGroupForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入元素组名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' },
        ],
        ElementList: [
          { validator: this.checkElementList, trigger: 'change' },
        ],
        UseTimes: [
          { validator: this.checkUseTimes, trigger: 'change' },
        ],
        Arrange: [
          { validator: this.checkArrange, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() { // 提交  在此完成数据格式转换
      const validateBool = await this.$refs.ruleGroupForm.validate().catch(() => {});
      if (validateBool) {
        const _data = ElementGroup.formatSubmitData(this.ruleGroupForm); // 提交数据转换
        this.$emit('submit', _data);
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    initEditData() { // 数据初始化方法
      this.ruleGroupForm = new ElementGroup(this.curData, this.ElementList);
      if (this.PositionID) this.ruleGroupForm.PositionID = this.PositionID;
      if (this.curData) this.title = '编辑界面元素组';
      else this.title = '添加界面元素组';
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleGroupForm = null;
      if (this.$refs.ruleGroupForm) this.$refs.ruleGroupForm.resetFields();
    },
    checkElementList(rule, value, callback) { // 元素选择校验规则
      const checkedList = this.ruleGroupForm.ElementList.filter(it => it.Checked && !it.Disabled);
      if (checkedList.length === 0) {
        callback(new Error('请选择元素'));
        return;
      }
      callback();
    },
    checkUseTimes(rule, value, callback) { // 使用次数校验规则
      if (!value) {
        callback(new Error('未获取到使用次数填写数值'));
        return;
      }
      const { MinValue, MaxValue } = value;
      // 1. 必填   2. 可以为0 但不能同时为0  3. 最大值必须大于等于最小值  4. 不能为负，最大不可设为-1  5. 可以均不填写 代表不限制 (不行 取消该条)
      if ((!MinValue && MinValue !== 0) || (!MaxValue && MaxValue !== 0)) {
        callback(new Error('请填写和补充最大最小值'));
        return;
      }
      if (!this.$utils.getValueIsOrNotNumber(MinValue, true) || !this.$utils.getValueIsOrNotNumber(MaxValue, true)) {
        callback(new Error('使用次数最小和最大值都应为整数类型'));
        return;
      }
      if (MinValue === 0 && MaxValue === 0) {
        callback(new Error('最大最小值不能同时为0'));
        return;
      }
      if (MinValue < 0 || MaxValue < 0) {
        callback(new Error('输入值不能为负，最大值不可设为-1'));
        return;
      }
      if (MaxValue < MinValue) {
        callback(new Error('使用最大值不能小于最小值，请检查'));
        return;
      }
      callback();
    },
    checkArrange(rule, value, callback) { // 排列方式和客户界面隐藏校验规则
      // 一. 横排竖排不限制
      // 二. 客户界面隐藏限制：
      // 1. 元素组隐藏优先级大于其包含元素的隐藏设置，即元素组隐藏时，其中元素全部隐藏
      // 2. 元素组显示时，根据元素设置来决定显示还是隐藏
      // 3. 所有元素客户界面都不显示的话，则提示错误： 所选元素客户界面均不显示，请勾选“客户界面隐藏” --- 此项需要检查及报错限制
      if (!this.ruleGroupForm.HiddenToCustomer) { // 当不隐藏的时候开始判断
        const _list = this.ruleGroupForm.ElementList.filter(it => it.Checked && !it.Disabled && !it.HiddenToCustomer); // 已勾选且不对客户隐藏的元素数组
        if (_list.length === 0) { // 所选元素客户界面均不显示
          callback(new Error('所选元素客户界面均不显示，请勾选“客户界面隐藏”'));
          return;
        }
      }
      callback();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-element-template-element-group-dialog-comp-wrap {
  .el-dialog__body {
    .element-group-ruleGroupForm {
      .use-times-box {
        .el-form-item__content {
          > span {
            font-size: 14px;
            margin: 0 10px;
            color: #a2a2a2;
          }
        }
      }
      .element-box {
        .el-form-item__content {
          > ul {
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 4px;
            max-height: 270px;
            overflow-y: auto;
            > li {
              width: 210px;
              margin-right: 15px;
              padding-bottom: 2px;
              > .el-checkbox {
                margin-right: 5px;
                &.element-item {
                  max-width: 128px;
                  > .el-checkbox__label {
                    max-width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }

      .el-checkbox {
        > .el-checkbox__label {
          font-size: 12px;
          color: #585858;
          .mp-common-tip-span-btn-box {
            color: #585858 !important;
          }
        }
      }
      .el-form-item__label {
        color: #888E99;
        &::before {
          display: none;
        }
      }
      .el-radio-group {
        .el-radio__label {
          font-size: 12px;
          color: #585858;
        }
      }
    }
    .tips-box {
      width:550px;
      background: #FFFBF6;
      border-radius: 3px;
      height: 28px;
      color:rgba(244,163,7, 0.7);
      font-size:12px;
      padding-left:16px;
      margin-left: 100px;
      margin-top: 32px;
      line-height: 26px;
      margin-bottom: 20px;
      i {
        font-size: 14px;
        position: relative;
        top: 1px;
        margin-right: 10px;
      }
    }
  }
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
          color: #428dfa;
        }
      }
      &.el-button--primary {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        &:hover {
          opacity: 0.88;
        }
        &:active {
          background: linear-gradient(to right, #428dfa, #26bcf9);
        }
      }
    }
  }
}
</style>
