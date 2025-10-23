<template>
  <CommonDialogComp
    :visible="localVisible"
    width="550px"
    appendBody
    :title="`暂停订单: ${PauseInfo?.OrderID}`"
    submitText="提交"
    @open="onOpen"
    @cancle="close"
    @submit="submit"
    class="order-pause-dialog"
  >
  <!-- <el-dialog
    top="calc(50vh - 273px)"
    :visible="localVisible"
    width="550px"
    :modal='false'
    @close='close'
    @open='onOpen'
    center
    v-dialogDrag
    :close-on-click-modal='false'
    class="order-pause-dialog"
  > -->
    <div class="dialog-box">
      <div class="main">
        <span>备注：</span>
        <el-input  type="textarea" :rows="3" placeholder="请输入备注" v-model="submitData.Remark"></el-input>
      </div>
      <!-- <div class="btns">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div> -->
    </div>
  <!-- </el-dialog> -->
</CommonDialogComp>
</template>

<script>
import { mapActions } from 'vuex';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    PauseInfo: {
      type: Object,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      submitData: {
        OrderID: 0,
        IsPause: true,
        Remark: '',
      },
    };
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
  },
  methods: {
    ...mapActions('orderModule', ['getOrderPause']),
    onOpen() {
      this.submitData = {
        OrderID: this.PauseInfo.OrderID,
        IsPause: true,
        Remark: '',
      };
    },
    close() {
      this.localVisible = false;
    },
    submit() {
      if (!this.submitData.Remark) {
        this.messageBox.failSingleError('操作失败', '请输入暂停备注');
      } else {
        this.getOrderPause({ submitData: this.submitData, back: this.close });
      }
    },
  },
};

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';
.order-pause-dialog {
  .dialog-box{
    .main{
      display: flex;
      justify-content: center;
      align-items: flex-start;
      span{
        font-size: 16px;
        font-weight: 700;
        line-height: 30px;
        width: 4em;
      }
    }
    .btns{
      text-align: center;
      .el-button{
        width: 120px;
        margin-top: 30px;
        &+.el-button{
          margin-left: 50px;
        }
      }
    }
  }
  :deep(.el-dialog__body) {
    height: 380px;
    padding: 20px 25px;
  }
}
</style>
