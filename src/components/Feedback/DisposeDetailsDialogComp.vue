<template>
  <el-dialog
    title="处理详情"
    :visible.sync="visible"
    :modal-append-to-body='false'
    width="1000px"
    :modal='false'
    custom-class="dialog-to-order-service-box mp-img-style-header"
    top="6vh"
    @open="Open"
    center :close-on-press-escape='false'
    :before-close="onClosed" :close-on-click-modal='false'
    v-dialogDrag
  >
    <template>
      <section v-show="!isLoading" class="question-photo">
        <!-- 问题照片 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/photo.png')" title="问题照片" />
        </header>
        <main v-if="DisposeDetailsData && DisposeDetailsData.QuestionPicList">
          <!-- {{DisposeDetailsData.QuestionPicList}} -->
          <DisplayPictrue :imgList='DisposeDetailsData.QuestionPicList' :isEditMode="false" />
        </main>
        <p v-else style="padding-left:30px">暂未上传图片</p>
      </section>

      <section class="service-after-sale" v-show="!isLoading">
        <!-- 售后处理 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/service2.png')" title="售后处理" />
        </header>
        <main>
          <div class="left-table">
            <EditDiaLeftTable :tableData='OrderPackageListTableData' />
          </div>
          <div class="right-submit-wrap">
            <div class="tab-row">
              <div class="left"><div class="piece"></div></div>
              <div class="right">
                <div class="row" v-for="(item,index) in DisposeDetailsData.AfterSaleQuestions" :key="index">
                  <div class="item">
                    <p><span :class="{'hide': index !==0}">问题：</span> {{QuestionName(item.QuestionType)}}</p>
                  </div>
                  <div class="item">
                    <p><span :class="{'hide': index !==0}">备注：</span> {{item.Remark}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-row">
              <div class="left"><div class="piece"></div></div>
              <div class="right">
                <div class="row" v-for="(item,index) in DisposeDetailsData.AfterSaleResponsibilities" :key="index">
                  <div class="item">
                    <p><span :class="{'hide': index !==0}">责任部门：</span> {{DepartmentName(item.Department)}}</p>
                  </div>
                  <div class="item">
                    <p><span :class="{'hide': index !==0}">责任比例：</span> {{item.Proportion}}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-row" v-if="DisposeDetailsData.Solution">
              <div class="left"><div class="piece"></div></div>
              <div class="right">
                <div class="row line" v-if="DisposeDetailsData.Solution.SolutionType === 255">
                  <div class="item">
                    <p><span>解决方案：</span>
                    <!-- 其他 -->
                      其他
                    </p>
                  </div>
                </div>
                <template v-if="DisposeDetailsData.Solution && DisposeDetailsData.Solution.SolutionType === 8">
                  <div class="row line" v-for="(it,index) in selectedCouponList" :key="it.CouponID">
                    <div class="item" >
                      <p><span :class="{'hide': index !==0}">解决方案：</span>
                      <!-- 赠送优惠券 -->
                        赠送优惠券：
                        <span class="is-pink">{{it.Data.Amount}}元</span>
                        <span class="MinPayAmount">满{{it.Data.MinPayAmount}}元使用</span>
                        <span>（ <i class="is-origin">{{it.CouponNumber}}</i>张 ）</span>
                        <i> - </i>
                        <el-tooltip placement="top-start" :enterable='false' >
                          <div slot="content">
                              <p v-for="(item, i) in it.ProductListTextArray" :key="item + '---' + i">
                                {{ item }}
                              </p>
                          </div>
                          <span class="area-span">限产品：{{ it.ProductListTextArray.join(' ') }}</span>
                        </el-tooltip>

                      </p>
                    </div>
                  </div>
                </template>
                <div class="row line" v-if="DisposeDetailsData.Solution.SolutionType === 7">
                  <div class="item">
                    <p><span>解决方案：</span>

                    <!-- 补印 -->
                    <span v-if="DisposeDetailsData.Solution.SolutionType === 7">
                      补印：
                    </span>
                    </p>
                  </div>
                </div>
                <div class="row line" v-if="DisposeDetailsData.Solution.SolutionType === 2">
                  <div class="item">
                    <!-- 问题 <span class="color-yellow">描述</span> 问题 <span class="color-red">描述</span> -->
                    <p><span>解决方案：</span>
                    <!-- 退款： -->
                    <span v-if="DisposeDetailsData.Solution.SolutionType === 2">
                      退款：订单退款：￥{{DisposeDetailsData.Solution.RefundAmount}}&nbsp;&nbsp;&nbsp;
                      运费退款：￥{{DisposeDetailsData.Solution.RefundFreightAmount}}&nbsp;&nbsp;&nbsp;
                      共计：￥<span class="color-red">
                        {{DisposeDetailsData.Solution.RefundFreightAmount + DisposeDetailsData.Solution.RefundAmount}}
                      </span>&nbsp;&nbsp;&nbsp;
                      退回余额：￥<span class="color-red">
                        {{DisposeDetailsData.Solution.RefundFreightAmount + DisposeDetailsData.Solution.RefundAmount}}
                      </span>&nbsp;&nbsp;&nbsp;
                    </span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </section>
      <span slot="footer" class="dialog-footer" v-show="!isLoading">
        <div class="loss-box">
          <span class="title">损失金额：</span>
          <span class="is-pink">{{DisposeDetailsData.LossAmount}} </span>
          <span>元</span>
        </div>
        <div class="btns">
          <normalBtnFull @click.native="onClosed" title="关闭" />
        </div>
      </span>
    </template>
    <div v-if="isLoading">
      <LoadingComp class="loading-box" />
    </div>
  </el-dialog>
</template>

<script>
import {
  mapState,
} from 'vuex';
// import OrderServiceEditCord from '@/components/ServiceAfterSale/EditDialog/OrderServiceEditCord.vue';
import VTypeTitle from '@/components/ServiceAfterSale/EditDialog/VTypeTitle.vue';
import EditDiaLeftTable from '@/components/ServiceAfterSale/EditDialog/EditDiaLeftTable.vue';
// import EditDiaRightSubmit from '@/components/ServiceAfterSale/EditDialog/EditDiaRightSubmit.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import DisplayPictrue from '@/components/ServiceAfterSale/EditDialog/DisplayPictrue.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  components: {
    normalBtnFull,
    // OrderServiceEditCord,
    VTypeTitle,
    EditDiaLeftTable,
    // EditDiaRightSubmit,
    DisplayPictrue,
    LoadingComp,
  },
  props: {
    className: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
    },
    paramsData: {
      type: Object,
    },
  },
  data() {
    return {
      imgInfo: [],
      imgSrc: null,
      fileList: [],
      DisposeDetailsData: {},
      serviceImgList: [],
      serviceImgList2Upload: [],
      OrderPackageListTableData: null,
      QuestionTypeList: [],
      // 选中的优惠券
      selectedCouponList: null,
    };
  },
  computed: {
    ...mapState('common', ['isLoading', 'DepartmentList']),
    QuestionName() {
      return (id) => {
        const temp = this.QuestionTypeList.filter(it => it.ID === id);
        return temp[0]?.Name;
      };
    },
    DepartmentName() {
      return (id) => {
        const temp = this.DepartmentList.filter(it => it.ID === id);
        return temp[0]?.Title;
      };
    },
  },
  methods: {
    Open() {
      this.api.getSuccessDetail(this.paramsData.AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.DisposeDetailsData = res.data.Data;
          this.getQuestionTypeList();
          this.getCoupon(res.data.Data.Solution.CouponList);
        }
      });
      this.$store.dispatch('common/getAfterSalesDepartmentList');
    },
    async getCoupon(CouponList) {
      const resp = await this.api.getCouponList({ ProvideStatus: 1, FieldType: 1, ReceiveNumber: 1 }).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const couponList = resp.data.Data.map(it => {
          const ProductListTextArray = it.ProductString ? it.ProductString.split('\n') : [];
          const temp = CouponList?.filter(item => item.CouponID === it.CouponID);
          return {
            ...it,
            checked: !!CouponList?.some(item => item.CouponID === it.CouponID),
            CouponNumber: temp && temp.length ? temp[0].Number : '',
            ProductListTextArray,
          };
        });
        this.selectedCouponList = couponList.filter(it => it.checked);
      }
    },
    async getQuestionTypeList() {
      // 获取所有问题
      const res = await this.api.getQuestionList();
      if (res.data.Status === 1000) {
        this.QuestionTypeList = res.data.Data;
      }
    },

    onCancle() { // 取消  关闭弹窗
      this.$emit('cloce');
    },
    onClosed() {
      this.onCancle();
    },
    addSingleImg(data) {
      const inputFile = data;
      const { name, size } = inputFile;
      const lastModifiedDate = inputFile.lastModifiedDate.toLocaleString(84);
      this.imgInfo.push({
        name,
        size,
        lastModifiedDate,
      });
      const reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onloadend = () => {
        const strBase64 = reader.result.substring(0);
        this.setServiceImgList([strBase64, inputFile]); // 添加到数据仓库图片列表中
        return strBase64;
      };
    },
    setServiceImgList(state, [strBase64, inputFile]) {
      this.serviceImgList.push(strBase64);
      this.serviceImgList2Upload.push(inputFile);
    },
    async uploadImg(data) {
      if (!data || data.length < 1) return;
      const files = [];
      const imgExpectType = ['image/jpeg', 'image/png', 'image/bmp'];
      data.forEach((file) => {
        if (imgExpectType.includes(file.type)) files.push(file);
      });
      const len = 4 - this.serviceImgList.length || 0;
      // 获取到目前还可以添加的照片数量
      let list;
      if (files.length <= len) list = files;
      else list = files.slice(0, len);
      await Promise.all(list.map(async (imgData) => {
        // 耗时操作
        await this.addSingleImg(imgData);
      }));
    },
    submitServiceOrder() {
    },
    async getPackageListByOrderID(orderId) {
      const res = await this.api.getPackageListByOrderID(orderId);
      if (res.data.Status === 1000) {
        this.OrderPackageListTableData = res.data.Data;
      }
    },
  },

  mounted() {
    this.getPackageListByOrderID(this.paramsData.OrderID);
  },
  beforeDestroy() {
    this.$router.push({ query: {} });
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.dialog-to-order-service-box {
  height: 800px;
  position: relative;
  .el-dialog--center .el-dialog__body{
    text-align: left;
  }

  .el-dialog__header > span::before {
    background: url(../../assets/images/service.png) no-repeat center;
  }

  .el-dialog__body {
    box-sizing: border-box;
    height: 695px;
    padding: 0%;
    padding-top: 20px;
    > section {
      margin-left: 20px;
      width: 960px;
      box-sizing: border-box;
      &.question-photo {
        display: flex;
        height: 90px;
        align-items: center;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        > header {
          text-align: left;
          height: 100%;
          width: 85px;
          padding-top: 16px;
          box-sizing: border-box;
          > div {
            margin: 0 auto;
          }
        }
        > main {
          padding-top: 8px;
          margin-bottom: 0px;
          padding-left: 20px;
          display: flex;
          .submit-img-box{
            display: flex;
            flex-direction: column;
            margin-right: 52px;
            .upload-btn{
              margin: 14px 0 16px 0;
            }
            .explain {
              font-size: 12px;
              color: $--color-text-table-time;
            }
          }
        }
      }
      &.service-after-sale {
        height: 395px;
        display: flex;
        margin-top: 20px;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        > header {
          height: 100%;
          width: 85px;
          flex: none;
          > div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        > main {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          margin-top: 20px;
          .left-table {
            width: 835px;
          }
          .right-submit-wrap {
            .tab-row{
              display: flex;
              border-left: 1px solid #eeeeee;
              border-right: 1px solid #eeeeee;
              border-bottom: 1px solid #eeeeee;
              >.left{
                width: 50px;
                .piece{
                  width: 13px;
                  height: 8px;
                  background-color: #F4A307;
                  margin-top: 15px;
                }
              }
              .right{
                flex: 1;
                font-size: 13px;
                .row{
                  border-bottom: 1px dashed #eeeeee;
                  &.row:last-child{
                    border-bottom: none;
                  }
                  display: flex;
                  .item{
                    width: 50%;
                    p{
                      line-height: 40px;
                      color: #888888;
                      span:first-child{
                        color: #444444;
                        margin-right: 3px;
                        font-weight: 700;
                      }
                      .hide:first-child{
                        color: #fff;
                      }
                      .color-red{
                        color: #FF3769;
                      }
                      .color-yellow{
                        color: #F4A307;
                      }
                    }
                  }
                }
                .line{
                  // &.row:nth-child(1){
                  //   border-bottom: none;
                  // }
                  .item{
                    width: 100%;
                  }
                }
              }
            }

          }
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 15px 20px 14px 20px;
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .loss-box {
        margin-left: 112px;
        font-size: 12px;
        > .title{
          font-weight: 600;
        }
        > span:last-of-type{
          color: $--color-text-table-time;
        }
      }
      .btns{
        position: relative;
        top: 5px;
        button {
          width: 120px;
          height: 29px;
          border-radius: 2px;
          &:first-of-type {
            margin-left: 30px;
          }
          & + button {
            margin-left: 30px;
            background: linear-gradient(
              to right,
              $--color-primary,
              $--color-primary-light
            );
            border: none;
            position: relative;
            top: 0px;
          }
        }
      }

    }
  }

}
</style>
