<template>
  <section class="select-after-sales-source">
    <div class="container">
      <span class="title">售后渠道:</span>
      <p>
        <span v-for="it in dateValue" :key="it">
          {{AfterSaleChannel.find(e => e.ID === it)?.name}}
        </span>
        <i @click="SelectSource">选择渠道</i>
      </p>
    </div>
    <CommonDialogComp
      width="500px"
      top='30vh'
      title="转他人处理:"
      :visible="visible"
      cancelText='取消'
      @cancle="onCancle"
      @open='onOpen'
      @closed='onClosed'
      @submit="onSubmit"
      class="select-after-sales-source-dialog"
    >
    <template>
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="it in AfterSaleChannel" :key="it.ID" :label="it.ID">{{ it.name }}</el-checkbox>
      </el-checkbox-group>
    </template>
    </CommonDialogComp>
  </section>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    dateValue: {
      type: Array,
      default: () => ([]),
    },
    AfterSaleChannel: {
      type: Array,
      default: () => ([]),
    },
    changePropsFunc: {
      type: Function,
      default: () => null,
    },
    requestFunc: {
      type: Function,
      default: () => null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      visible: false,
      checkList: [],
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.visible = false;
    },
    onSubmit() {
      this.changePropsFunc([['AfterSaleChannels', ''], [...this.checkList]]);
      this.requestFunc();
      this.onCancle();
    },
    onOpen() {
      this.checkList = this.dateValue;
    },
    onClosed() {
      this.onCancle();
    },
    SelectSource() {
      this.visible = true;
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.select-after-sales-source{
  .container{
    display: flex;
    line-height: 25px;
    .title{
      font-size: 14px;
      margin-right: 15px;
      font-weight: 600;
      color: #444444;
      width: 5em;
      text-align: right;
      flex: none;
    }
    >p{
      font-size: 12px;
      >span{
        margin-right: 10px;
      }
      >i{
        color: #26BCF9;
        cursor: pointer;
      }
    }
  }
}
.mp-erp-suspend-dialog-comp-wrap{
  .el-dialog__body{
    padding-top: 20px;
    padding-bottom: 0;
    .demo-ruleForm{
      .el-form-item{
        margin-bottom: 20px;
      }
      .el-form-item__label{
        font-weight: 700;
        line-height: 15px;
      }
      .el-radio-group{
        display: flex;
        flex-direction: column;
        .el-radio + .el-radio{
          margin-top: 10px;
        }
      }
      .mp-textarea, .el-textarea, textarea{
        height: 90px;
      }
    }
  }
}
</style>
