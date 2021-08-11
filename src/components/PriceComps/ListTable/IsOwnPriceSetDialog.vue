<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="设置报价方式"
    :visible.sync="visible"
    :disabled='disabled'
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
        <p class="tips-box remark is-pink"> <i class="el-icon-warning"></i> 无可用基础价格</p>
      </div>
      <template v-if="curSelectedPrice">
        <p class="mp-common-title-wrap" style="margin-top:25px">
          <span>设置比例</span>
        </p>
        <div class="result mp-scroll-wrap">
          <p class="tips-box remark is-pink" v-if="!curSelectedPrice.SolutionList || curSelectedPrice.SolutionList.length === 0">
            <i class="el-icon-warning"></i>  该基础价格无报价方案
          </p>
          <ul v-else>
            <li v-for="it in ruleForm.ReferencePriceList" :key="it.Solution.ID">
              <span>{{it.Solution.Name}}</span>
              <span>X</span>
              <el-input v-model.trim="it.Percent" ></el-input>
              <span>%</span>
            </li>
          </ul>
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
      return t || null;
    },
    canSelectPriceList() {
      if (!this.PriceList || this.PriceList.length === 0) return [];
      return this.PriceList.filter(it => it.IsOwnPrice && it.ID !== this.curPrice.ID);
    },
    disabled() {
      return !this.ruleForm.IsOwnPrice && (this.canSelectPriceList.length === 0 || !this.curSelectedPrice || this.ruleForm.ReferencePriceList.length === 0);
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
      const ids = this.PriceList.filter(it => !it.IsOwnPrice).map(it => it.BasePriceID);
      if (ids.includes(this.ruleForm.ID)) {
        this.messageBox.failSingleError('保存失败', '当前价格已被其它价格条目引用为基础价格');
        return false;
      }
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
        this.messageBox.failSingleError('保存失败', '价格比例不能为空且必须为数字');
        return false;
      }
      t = this.ruleForm.ReferencePriceList.find(it => it.Percent < 0);
      if (t) {
        this.messageBox.failSingleError('保存失败', '价格比例不能小于0');
        return false;
      }
      t = this.ruleForm.ReferencePriceList.find(it => it.Percent > 100);
      if (t) {
        this.messageBox.failSingleError('保存失败', '价格比例不能大于100%');
        return false;
      }
      return true;
    },
  },
  watch: {
    curSelectedPrice: {
      handler(val) {
        if (!this.visible || !val) return;
        if (!Array.isArray(val.SolutionList)) {
          this.ruleForm.ReferencePriceList = [];
          return;
        }
        if (val.ID === this.curPrice.BasePriceID) {
          this.ruleForm.ReferencePriceList = this.curPrice.ReferencePriceList;
          return;
        }
        this.ruleForm.ReferencePriceList = val.SolutionList.map(it => ({
          Solution: {
            ID: it.ID,
            Name: it.Name,
          },
          Percent: '',
        }));
      },
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
        width: 500px;
      }
      .none-list {
        > span {
          position: relative;
          top: -5px;
        }
      }
      .result {
        overflow-y: auto;
        height: 288px;
        > ul {
          > li {
            display: flex;
            align-items: center;
            padding: 5px 0;
            > span {
              font-size: 12px;
              color: #585858;
              &:last-of-type {
                color: #a2a2a2;
              }
              &:first-of-type {
                font-size: 14px;
                min-width: 6em;
                margin-right: 6px;
              }
            }
            .el-input {
              width: 100px;
              margin: 0 12px;
              margin-left: 15px;
              input {
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }
    }
    .el-radio__label {
      font-size: 12px;
    }
  }

}
</style>
