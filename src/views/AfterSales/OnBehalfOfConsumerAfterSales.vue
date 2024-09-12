<template>
  <section class="on-behalf-of-consumer-after-sales">
    <header>
      <BreadcrumbNav backLabel="订单列表" label="售后"></BreadcrumbNav>
    </header>
    <main>
      <div class="left">
        <div class="top">
          <OrderDetailsComp :OrderDetail="OrderDetail" showDownload :AfterSaleStatus="0"/>
          <div class="after-sales-trouble">
            <header class="title is-bold">问题图片</header>
            <ul>
              <li>
                <span class="label is-bold">售后问题：</span>
                <span class="value">
                  <el-checkbox-group v-model="CompleteFrom.QuestionTypes">
                    <el-checkbox v-for="(item, index) in ApplyQuestionList" :key="index" :label="item.ID">{{item.Title}}</el-checkbox>
                  </el-checkbox-group>
                </span>
              </li>
              <li>
                <span class="label is-bold">图片凭证：</span>
                <span class="value">
                  <div class="image-list QuestionPicList">
                    <ImageUploadComp :ImgList="CompleteFrom.QuestionPics" @UploadedSeccess="UploadedSeccess"
                    @PictureDelete="PictureDelete" :limit='6' :beforeUploadFun="beforeUpload"></ImageUploadComp>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <AfterSalesSolutionFromComp consent :PackagesList="PackagesList" :OrderID="$route.query.OrderID" :dataInfo="OrderDetail"
      ref="AfterSalesSolutionFrom" Source :OrderStatus="OrderDetail?.Status" :KindCount="OrderDetail?.ProductParams?.Attributes?.Unit"/>
      <!-- <SuspendDialogComp :visible="SuspendVisible" @cloce="SuspendVisible = false" @submit="SuspendVisible = false"></SuspendDialogComp> -->
    </main>
    <footer>
      <el-button @click="AfterSaleSubmit" class="linear-bg-color">执行售后</el-button>
      <el-button @click="SuspendClick">挂起</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import ImageUploadComp from '@/components/AfterSalesComps/ImageUploadComp.vue';
import AfterSalesSolutionFromComp from '@/components/AfterSalesComps/AfterSalesSolutionFromComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';
// import SuspendDialogComp from '@/components/AfterSalesComps/SuspendDialogComp.vue';
import { Message } from 'element-ui';

export default {
  name: 'applyAfterSalesPage',
  components: {
    OrderDetailsComp,
    AfterSalesSolutionFromComp,
    BreadcrumbNav,
    // SuspendDialogComp,
    ImageUploadComp,
  },
  data() {
    return {
      ApplyQuestionList: [],
      PackagesList: null,
      SuspendVisible: false,
      OrderDetail: null,
      CompleteFrom: {
        QuestionTypes: [],
        QuestionPics: [],
      },
    };
  },
  computed: {
    isUpImg() {
      if (!this.ApplyQuestionList) {
        return false;
      }
      const ActionQuestionList = this.ApplyQuestionList.filter(res => this.CompleteFrom.QuestionTypes.find(item => item === res.ID));
      return ActionQuestionList.filter(res => res.IsUploadPic).length !== 0;
    },
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    UploadedSeccess(Url) {
      this.CompleteFrom.QuestionPics.push(Url);
    },
    PictureDelete(Url) {
      this.CompleteFrom.QuestionPics = this.CompleteFrom.QuestionPics.filter(it => it !== Url);
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        Message({
          showClose: true,
          message: '文件过大，上传失败',
          type: 'error',
        });
      }
      return isLt15M;
    },

    SuspendClick() {
      if (!this.formValidator()) return;
      this.$refs.AfterSalesSolutionFrom.onSuspendClick(this.CompleteFrom);
    },
    getOrderDetail(OrderID) {
      this.api.getOrderDetailUseOrderID(OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderDetail = res.data.Data;
        }
      });
    },
    async getPackagesByOrderID() {
      const resp = await this.api.getPackagesByOrderID(this.$route.query.OrderID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.PackagesList = resp.data.Data;
      }
    },
    formValidator() {
      if (!this.CompleteFrom.QuestionTypes.length) {
        this.messageBox.failSingleError('操作失败', '请选择售后问题');
        return false;
      }
      if (this.isUpImg && !this.CompleteFrom.QuestionPics.length) {
        this.messageBox.failSingleError('操作失败', '请上传图片凭证');
        return false;
      }
      return true;
    },
    AfterSaleSubmit() {
      if (!this.formValidator()) return;
      this.$refs.AfterSalesSolutionFrom.submit(this.CompleteFrom);
    },
    initQuestion() {
      this.api.getApplyQuestionList().then(res => {
        if (res.data.Status === 1000) {
          this.ApplyQuestionList = res.data.Data;
        }
      });
    },
  },
  mounted() {
    this.getOrderDetail(this.$route.query.OrderID);
    this.initQuestion();
    this.getPackagesByOrderID();
  },
};
</script>

<style lang='scss'>
.on-behalf-of-consumer-after-sales{
  overflow-x: auto;
  height: 100%;
  padding-left: 20px;
  >header{
    margin-top: 20px;
  }
  >main{
    display: flex;
    >.left{
      display: flex;
      flex-direction: column;
      >.top{
        display: flex;
        .after-sales-trouble {
          padding-left: 20px;
          width: 453px;
          box-sizing: border-box;
          padding-right: 32px;
          >.title{
            font-size: 16px;
            line-height: 20px;
            margin-top: 10px;
            position: relative;
            margin-bottom: 20px;
            &::before{
              content: "";
              display: inline-block;
              height: 14px;
              width: 3px;
              position: absolute;
              left: -8px;
              top: 3px;
              background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
            }
          }
          >ul{
            >li{
              display: flex;
              font-size: 12px;
              margin-top: 10px;
              line-height: 15px;
              >.value{
                flex: 1;
                .image-list{
                  .el-image{
                    border-radius: 4px;
                  }
                }
                .el-checkbox-group{
                  .el-checkbox{
                    margin-right: 0;
                    width: 85px;
                    .el-checkbox__label{
                      font-size: 12px;
                      padding-left: 5px
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  >footer{
    padding: 60px 0 20px 0;
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
}
</style>
