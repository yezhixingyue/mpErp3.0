<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="设置报价方式"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-is-own-price-set-dialog-comp-wrap"
  >
    <div class="header" v-if="curPrice">
      <p>
        <span class="label">产品名称：</span>
        <span>{{productTitle}}</span>
      </p>
      <p>
        <span class="label">价格名称：</span>
        <span>{{curPrice.Name}}</span>
      </p>
    </div>
    <el-radio-group v-if="curPrice" v-model="ruleForm.IsOwnPrice">
      <el-radio :label="true">单独设置</el-radio>
      <el-radio :label="false">按比列算价</el-radio>
    </el-radio-group>
    <div class="content" v-if="curPrice" v-show="!ruleForm.IsOwnPrice">
      <p class="mp-common-title-wrap">
        <span>选择基础价格</span>
      </p>
      <el-radio-group v-model="ruleForm.BasePriceID">
        <el-radio :label="it.ID" v-for="it in canSelectPriceList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <div v-if="canSelectPriceList.length === 0" class="none-list">
        <img src="@/assets/images/null.png" alt="">
        <span class="remark">暂无可用基础价格，无法选中及保存</span>
      </div>
      <template v-if="curSelectedPrice">
        <p class="mp-common-title-wrap" style="margin-top:25px">
          <span>设置比例</span>
        </p>
        <div class="result">
          <span class="remark" v-if="curSelectedPrice.SolutionList || curSelectedPrice.SolutionList.length === 0">
            选中的价格无可用报价方案，无法设置比例
          </span>
        </div>
      </template>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curPrice: {
      type: Object,
      default: null,
    },
    PriceList: {
      type: Array,
      default: () => [],
    },
    productTitle: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加价格',
      ruleForm: {
        ID: '',
        ProductID: '',
        IsOwnPrice: true,
        BasePriceID: '',
        ReferencePriceList: [],
      },
    };
  },
  computed: {
    curSelectedPrice() {
      if (!this.PriceList || this.PriceList.length === 0 || !this.ruleForm.BasePriceID) return null;
      const t = this.PriceList.find(it => it.ID === this.ruleForm.BasePriceID);
      if (!t) return null;
      return t;
    },
    canSelectPriceList() {
      if (!this.PriceList || this.PriceList.length === 0) return [];
      return this.PriceList.filter(it => it.IsOwnPrice && it.ID !== this.curPrice.ID);
    },
  },
  methods: {
    onSubmit() { // 提交
      const bool = this.formDataChecker();
      if (bool) {
        this.$emit('submit', this.ruleForm);
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      if (!this.curPrice) return;
      const { ID, ProductID, IsOwnPrice, BasePriceID, ReferencePriceList } = this.curPrice;
      this.ruleForm.ID = ID;
      this.ruleForm.ProductID = ProductID;
      this.ruleForm.IsOwnPrice = IsOwnPrice;
      this.ruleForm.BasePriceID = BasePriceID;
      this.ruleForm.ReferencePriceList = ReferencePriceList;
    },
    formDataChecker() {
      if (this.ruleForm.IsOwnPrice) return true;
      if (!this.ruleForm.BasePriceID) {
        this.messageBox.failSingleError('保存失败', '请选择基础价格');
        return false;
      }
      if (this.ruleForm.ReferencePriceList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请设置价格比例');
        return false;
      }
      // 对价格比例进行校验
      let t = this.ruleForm.ReferencePriceList.find(it => !this.$utils.getValueIsOrNotNumber(it.Percent));
      if (t) {
        this.messageBox.failSingleError('保存失败', '价格比例必须为数字');
        return false;
      }
      t = this.ruleForm.ReferencePriceList.find(it => it.Percent < 0);
      if (t) {
        this.messageBox.failSingleError('保存失败', '价格比例不能小于0');
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-is-own-price-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    padding-bottom: 10px;
    height: 580px;
    display: flex;
    flex-direction: column;
    > div.header {
      flex: none;
      > p {
        margin-bottom: 15px;
        line-height: 28px;
        display: flex;
        align-items: center;
        span {
          color: #888E99;
          font-size: 14px;
        }
        & + p {
          margin-bottom: 5px;
        }
      }
      span.label {
        margin-right: 2px;
      }
    }
    > .el-radio-group {
      padding: 25px 0;
      .el-radio {
        &:not(:last-of-type) {
          margin-right: 50px;
        }
      }
    }
    > .content {
      flex: 1;
      padding-top: 20px;
      overflow-y: auto;
      > .mp-common-title-wrap {
        color: #444;
        padding-bottom: 12px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .blue-span {
          font-weight: 400;
          margin-left: 35px;
        }
      }
      .el-radio-group {
        display: flex;
        flex-wrap: wrap;
        .el-radio {
          display: flex;
          align-items: center;
          .el-radio__label {
            line-height: 20px;
            max-width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .el-radio__input {
            position: relative;
            top: 1px;
          }
          margin-right: 0;
          margin-bottom: 10px;
          width: 140px;
        }
      }
      .result-none, .remark {
        font-size: 12px;
        color: #a2a2a2;
        margin-left: 1.5em;
      }
      .none-list {
        > span {
          position: relative;
          top: -5px;
        }
      }
    }
    .el-radio__label {
      font-size: 12px;
    }
  }

}
</style>
