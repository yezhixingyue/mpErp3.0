<template>
  <el-dialog
    top="calc(50vh - 392px)"
    :visible="visible"
    width="1270px"
    :modal='false'
    @close='close'
    @open='open'
    center
    v-dialogDrag
    :close-on-click-modal='false'
    class="terminate-production-dialog"
  >
    <div class="dialog-main">
      <titleComp :OrderData="OrderData"/>
      <refreshBox @refresh="refresh"/>
      <formTableComp :list="tableList" :formValue="formValue" @changeValue="data => formValue[data.ID] = data.value"/>
      <div class="from-box">
        <div class="left-tible" style="width: 507px;">
          <h3>其他11块已裁切，如若取消，未做工序会一并取消</h3>
          <pieceTableComp :list="tableList" />
        </div>
        <div class="right-from" style="width: 507px;">
          <h3>已生产完成3款（共6款）</h3>
          <rightFromBox :list="tableList" @AmountChange="(val) => Amount = val"
            @PaymentMethodChange="(val) => PaymentMethod = val"
            :Amount="Amount" :PaymentMethod="PaymentMethod"/>
        </div>
      </div>
      <div class="confirm-cancellation-btns">
        <el-button @click="submit" type="primary" class="yes">是</el-button>
        <el-button @click="close">否</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { formatListItemSize, formatListItemCraft } from '@/assets/js/filters/filters';
import titleComp from './title.vue';
import formTableComp from './formTableComp.vue';
import refreshBox from './refreshBox.vue';
import pieceTableComp from './pieceTableComp.vue';
import rightFromBox from './rightFromBox.vue';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    OrderData: {
      type: Object,
    },
  },
  components: {
    titleComp,
    formTableComp,
    refreshBox,
    pieceTableComp,
    rightFromBox,
  },
  data() {
    return {
      dialogVisible: false,
      tableList: [],
      formValue: {},
      Amount: 2,
      PaymentMethod: 3,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('yes');
    },
    open() {
      this.initData();
    },

    initData() {
      this.tableList = [
        { ID: 101 },
        { ID: 102 },
        { ID: 103 },
        // { ID: 104 },
      ];
      const tempValue = {};
      this.tableList.forEach(element => {
        tempValue[element.ID] = this.formValue[element.ID] || 1;
      });
      this.formValue = { ...tempValue };
    },
    refresh() {
      console.log('refresh');
      this.initData();
    },

    formatCraft(list) {
      return formatListItemCraft(list);
    },
    formatSize(list) {
      return formatListItemSize(list);
    },
  },
};
</script>

<style lang='scss'>
.terminate-production-dialog{
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    height: 784px;
    box-sizing: border-box;
    padding: 0;
    .dialog-main{
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0 30px;
      .from-box{
        display: flex;
        margin-top: 30px;
        height: 193px;
        h3{
          font-size: 16px;
          color: #444;
          font-weight: 700;
          line-height: 36px;
        }
        >.right-from{
          padding-left: 65px;
          display: flex;
          flex-direction: column;
          flex: 1;
          h3{
            color: #FF003A;
          }
        }
      }
      .confirm-cancellation-btns{
        // padding-bottom: 50px;
        margin-top: 65px;
        text-align: center;
        >.el-button{
          width: 120px;
          height: 35px;
          padding: 0;
          line-height: 35px;
          border-color: #26BCF9;
          color: #26BCF9;
          &.el-button+.el-button{
            margin-left: 30px;
          }
        }
        >.yes{
          background: linear-gradient(to right, #26bcf9, #35dff9);
          border: none;
          color: #fff;
          &:hover{
            opacity: 0.88;
          }
        }
      }
    }
  }
}
</style>
