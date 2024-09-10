<template>
  <section class="select-after-sales-source">
    <div class="container">
      <span class="title">售后渠道:</span>
      <p>
        <span v-for="it in dateValue" :key="it">
          {{AfterSaleChannel.find(e => e.ID === it)?.name}}
        </span>
        <el-popover
          placement="bottom"
          @after-leave="afterLeave"
          @show="show"
          v-model="visible">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="it in AfterSaleChannel" :key="it.ID" :label="it.ID">{{ it.name }}</el-checkbox>
          </el-checkbox-group>
          <div class="select-after-sales-source-btn-btn">
            <el-button @click="confirm" class="linear-bg-color">确定</el-button>
            <!-- <el-button @click="() => visible = false">取消</el-button> -->
          </div>
          <i slot="reference">选择渠道</i>
        </el-popover>
      </p>
    </div>
    <!-- <CommonDialogComp
      width="500px"
      top='30vh'
      title="选择售后渠道:"
      :visible="visible"
      cancelText='取消'
      @cancle="onCancle"
      @open='onOpen'
      @closed='onClosed'
      @submit="onSubmit"
      class="select-after-sales-source-dialog"
    >
    <template>
    </template>
    </CommonDialogComp> -->
  </section>
</template>

<script>
// import CommonDialogComp from '@/packages/CommonDialogComp';

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
    // CommonDialogComp,
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
    confirm() {
      this.changePropsFunc([['AfterSaleChannels', ''], [...this.checkList]]);
      this.requestFunc();
      this.onCancle();
    },
    afterLeave() {
      this.checkList = this.dateValue;
    },
    show() {
      this.checkList = this.dateValue;
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
      i{
        color: #26BCF9;
        cursor: pointer;
      }
    }
  }
}
.select-after-sales-source-btn-btn{
  padding-top: 20px;
  text-align: center;
  .el-button{
    width: 120px;
    height: 35px;
    padding: 0;
    border: none;
    background: #fff;
    color: #26BCF9;
    border: 1px solid #26BCF9;
    &.linear-bg-color{
      color: #fff;
      background: linear-gradient( 226deg, #34DEF9 0%, #26BCF9 100%);
    }
    & + .el-button{
      margin-left: 30px;
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
