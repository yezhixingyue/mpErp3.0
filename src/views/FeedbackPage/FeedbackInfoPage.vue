<template>
  <section class="FeedbackInfoPage" >
    <div class="FeedbackInfoPage-main" id="feedbackinfopage" >
      <Tables :dataInfo="DetailData" :paramsData="paramsData"></Tables>
      <footer v-if="DetailData">
        <el-button  class="cancel-blue-btn" @click="onGrelievePostponeClick" key="解除挂起"
        v-if="DetailData.AfterSale.Status === 10 && DetailData.AfterSale.IsHang"
        >解除挂起</el-button>
        <template v-else>
        <el-button  class="cancel-blue-btn" @click="onGetDownToClick" key="开始处理"
        v-if="DetailData.AfterSale.Status === 0"
        >开始处理</el-button>
        <el-button  class="cancel-blue-btn" @click="onExecuteClick" key="执行售后"
        v-if="DetailData.AfterSale.Status === 10"
        >执行售后</el-button>
        <el-button  class="cancel-blue-btn" @click="onPostponeClick" key="挂起"
        v-if="DetailData.AfterSale.Status === 10 && !DetailData.AfterSale.IsHang"
        >挂起</el-button>
        <el-button  class="cancel-blue-btn" @click="onDisposeDetailsClick" key="查看处理详情"
        v-if="DetailData.AfterSale.Status === 30"
        >查看处理详情</el-button>
        <el-button  class="cancel-blue-btn" @click="onDeliverToClick" key="转他人处理"
        v-if="DetailData.AfterSale.Status === 10"
        >转他人处理</el-button>
        <el-button  class="cancel-blue-btn" @click="onRejectClick" key="驳回"
        v-if="DetailData.AfterSale.Status === 10"
        >驳回</el-button>
        </template>
        <el-button class="cancel-blue-btn" @click="onGoBackClick"><i></i> 返回</el-button>
      </footer>
      <transition name="el-fade-in-linear">
      <footer v-if="DetailData" v-show="isFootFixed" class="FootFixed">
        <el-button  class="cancel-blue-btn" @click="onGrelievePostponeClick" key="解除挂起"
        v-if="DetailData.AfterSale.Status === 10 && DetailData.AfterSale.IsHang"
        >解除挂起</el-button>
        <template v-else>
        <el-button  class="cancel-blue-btn" @click="onGetDownToClick" key="开始处理"
        v-if="DetailData.AfterSale.Status === 0"
        >开始处理</el-button>
        <el-button  class="cancel-blue-btn" @click="onExecuteClick" key="执行售后"
        v-if="DetailData.AfterSale.Status === 10"
        >执行售后</el-button>
        <el-button  class="cancel-blue-btn" @click="onPostponeClick" key="挂起"
        v-if="DetailData.AfterSale.Status === 10 && !DetailData.AfterSale.IsHang"
        >挂起</el-button>
        <el-button  class="cancel-blue-btn" @click="onDisposeDetailsClick" key="查看处理详情"
        v-if="DetailData.AfterSale.Status === 30"
        >查看处理详情</el-button>
        <el-button  class="cancel-blue-btn" @click="onDeliverToClick" key="转他人处理"
        v-if="DetailData.AfterSale.Status === 10"
        >转他人处理</el-button>
        <el-button  class="cancel-blue-btn" @click="onRejectClick" key="驳回"
        v-if="DetailData.AfterSale.Status === 10"
        >驳回</el-button>
        </template>
        <el-button class="cancel-blue-btn" @click="onGoBackClick"><i></i> 返回</el-button>
      </footer>
      </transition>
    </div>
    <template v-if="paramsData">
      <!-- 挂起 -->
      <PostponeDialogComp  :paramsData='paramsData' :visible="PostponeVisible"
      @submit="PostponeSubmit" @cloce="PostponeVisible = false"></PostponeDialogComp>
      <!-- 转他人处理 -->
      <DeliverToDialogComp
      :paramsData='paramsData' :visible="DeliverToVisible" @submit="DeliverToSubmit" @cloce="DeliverToVisible = false"></DeliverToDialogComp>
      <!-- 驳回 -->
      <RejectDialogComp
      :paramsData='paramsData' :visible="RejectVisible" @submit="RejectSubmit" @cloce="RejectVisible = false"></RejectDialogComp>
      <!-- 执行售后 -->
      <ExecuteDialogComp :dataInfo="DetailData" :paramsData='paramsData' :visible="ExecuteVisible"
      @successSubmit="ExecuteSuccessSubmit"
      @cloce="ExecuteVisible = false"></ExecuteDialogComp>
      <!-- 查看处理详情 -->
      <DisposeDetailsDialogComp
      :paramsData='paramsData' :visible="DisposeDetailsVisible" @cloce="DisposeDetailsVisible = false"></DisposeDetailsDialogComp>
    </template>
  </section>
</template>

<script>
import Tables from '@/components/Feedback/Tables.vue';
import PostponeDialogComp from '@/components/Feedback/PostponeDialogComp.vue';
import DeliverToDialogComp from '@/components/Feedback/DeliverToDialogComp.vue';
import RejectDialogComp from '@/components/Feedback/RejectDialogComp.vue';
import ExecuteDialogComp from '@/components/Feedback/ExecuteDialogComp.vue';
import DisposeDetailsDialogComp from '@/components/Feedback/DisposeDetailsDialogComp.vue';

export default {
  name: 'feedbackInfoPage',
  components: {
    Tables,
    PostponeDialogComp,
    DeliverToDialogComp,
    RejectDialogComp,
    ExecuteDialogComp,
    DisposeDetailsDialogComp,
  },
  data() {
    return {
      loading: false,
      isEdit: true,
      PostponeVisible: false,
      DeliverToVisible: false,
      RejectVisible: false,
      ExecuteVisible: false,
      DisposeDetailsVisible: false,
      DetailData: null,
      paramsData: null,
      ScrollInfo: {
        scrollTop: 0,
        scrollHeight: 0,
        offsetHeight: 0,
      },
      isFootFixed: false,
    };
  },
  computed: {
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
  },
  methods: {
    async getInitData() {
      this.loading = true;
      this.api.getHandleDetail(this.paramsData.AfterSaleCode).then(res => {
        this.DetailData = res.data.Data;
      });
      this.loading = false;
    },
    onGoBackClick() {
      this.$goback();
    },
    async onSubmitClick() {
      // 需要先校验
    },
    // 挂起
    onPostponeClick() {
      this.PostponeVisible = true;
    },
    PostponeSubmit(data) {
      this.api.getOrderAfterSaleHang(data).then(res => {
        if (res.data.Status === 1000) {
          // 挂起成功
          this.PostponeVisible = false;
          this.getInitData();
        }
      });
    },
    onDeliverToClick() {
      this.DeliverToVisible = true;
    },
    DeliverToSubmit(data) {
      this.api.getOrderAfterSaleTransfer(data).then(res => {
        if (res.data.Status === 1000) {
          // 转交成功
          this.DeliverToVisible = false;
          this.getInitData();
        }
      });
    },
    onRejectClick() {
      this.RejectVisible = true;
    },
    RejectSubmit(data) {
      this.api.getOrderAfterSaleReject(data).then(res => {
        if (res.data.Status === 1000) {
          // 驳回成功
          this.RejectVisible = false;
          this.getInitData();
        }
      });
    },
    onExecuteClick() {
      this.ExecuteVisible = true;
    },
    // 开始处理
    onGetDownToClick() {
      const successFunc = () => {
        // 开始处理
        this.api.getOrderAfterSaleDealApply(this.paramsData.AfterSaleCode).then(res => {
          if (res.data.Status === 1000) {
            // 开始处理成功
            this.getInitData();
          }
        });
      };
      const failFunc = () => {};
      this.messageBox.warnCancelBox('操作确认', '您确定要开始处理吗？', successFunc, failFunc);
    },
    // 解除挂起
    onGrelievePostponeClick() {
      const successFunc = () => {
        this.api.getOrderAfterSaleCancelHang(this.paramsData.AfterSaleCode).then(res => {
          if (res.data.Status === 1000) {
            // 解除挂起
            this.getInitData();
          }
        });
      };
      const failFunc = () => {};
      this.messageBox.warnCancelBox('操作确认', '您确定要解除挂起吗？', successFunc, failFunc);
    },
    ExecuteSuccessSubmit() {
      this.ExecuteVisible = false;
      sessionStorage.setItem('FeedbackList', true);
      this.onGoBackClick();
      // this.getInitData();
    },
    // 查看处理详情
    onDisposeDetailsClick() {
      this.DisposeDetailsVisible = true;
    },
    // getScroll(e) {
    //   console.log(e);
    // },

    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.ScrollInfo = { scrollTop, scrollHeight, offsetHeight };
    },
    cScroll() {
      this.$nextTick(() => {
        this.handleScroll(this.oPage[0]);
      });
    },
  },
  watch: {
    scrollChange() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - scrollTop > 60) this.isFootFixed = true;
      else this.isFootFixed = false;
    },
    DetailData() {
      this.$nextTick(() => {
        this.handleScroll(this.oPage[0]);
      });
    },
  },
  mounted() {
    this.paramsData = this.$route.params.paramsData;
    this.getInitData();
    // console.log(document.getElementsByClassName('page-wrap')[0]);
    this.oBottomWidth = document.getElementById('feedbackinfopage');
    this.oPage = document.getElementsByClassName('page-wrap');
    this.oPage[0].addEventListener('scroll', this.cScroll);
    this.$nextTick(() => {
      this.handleScroll(this.oPage[0]);
    });
  },
};
</script>
<style lang='scss'>
.FeedbackInfoPage {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 30px 45px;
  background-color: #F8F8F8;
  min-height: 100%;
  >.FeedbackInfoPage-main{
    background-color: #fff;
    // overflow: auto;
    // height: 100%;
    width: 100%;
    position: relative;
    > footer {
      flex: none;
      height: 65px;
      text-align: left;
      padding-top: 40px;
      padding-left: 40px;
      &.FootFixed{
        position: fixed;
        bottom: 0;
        // right: 0;
        left: 231px;
        background-color: #fff;
        box-shadow: 0px 0px 14px 0px rgba(136, 136, 136, 0.3);
        // width: calc(100vw - 186px -80px);
        width: calc(100vw - 186px - 90px);
        min-width: 900px;
        // height: 45px;
        padding-top: 20px;
        padding-right: 40px;
        box-sizing: border-box;
        margin-right: 45px;
        z-index: 2;
      }
      .cancel-blue-btn {
        width: 120px;
        height: 35px;
        padding: 0;
        border-radius: 3px;
        i {
          transform: scaleY(1.4);
          display: inline-block;
        }
        & + button.el-button {
          margin-left: 20px;
        }
      }
      .cancel-blue-btn:focus{
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        color: #fff;
      }
    }
  }
}
</style>
