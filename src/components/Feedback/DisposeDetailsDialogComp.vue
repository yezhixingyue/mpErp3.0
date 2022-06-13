<template>
  <el-dialog
    title="处理详情"
    :visible.sync="visible"
    :modal-append-to-body='false'
    width="1000px"
    :modal='false'
    custom-class="dialogdisposedetailsdialogcomp mp-img-style-header"
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
        <main v-if="DisposeDetailsData.QuestionPicList && DisposeDetailsData.QuestionPicList.length">
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
            <EditDiaLeftTable :tableData='OrderPackageListTableData' :select='false' />
          </div>
          <div class="right-submit-wrap" v-if="DisposeDetailsData">
            <div class="tab-row">
              <div class="left"><div class="piece"></div></div>
              <div class="right">
                <div class="row" v-for="(item,index) in DisposeDetailsData.AfterSaleQuestions" :key="index">
                  <div class="item">
                    <div><span v-if="index ===0">问题：</span>
                      <i style="width:8em;" :style="`margin-left:${index === 0 ? 0 : 3.3}em`">{{QuestionName(item.FirstQuestionType)}}</i>
                      <i style="text-indent:0em">{{QuestionName(item.SecondQuestionType)}}</i>
                    </div>
                  </div>
                  <div class="item">
                    <div :style="`text-indent:${index === 0 ? 0 : 3.3}em`"><span v-if="index ===0">备注：</span>
                      <el-tooltip
                      effect="dark"
                      :disabled="item.Remark.length<25"
                      :content="item.Remark"
                      placement="top">
                        <i class="i">{{item.Remark}}</i>
                      </el-tooltip>
                    <!-- <i>{{item.Remark}}</i> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-row">
              <div class="left"><div class="piece"></div></div>
              <div class="right">
                <div class="row" v-for="(item,index) in DisposeDetailsData.AfterSaleResponsibilities" :key="index">
                  <div class="item">
                    <div :style="`text-indent:${index === 0 ? 0 : 5.3}em`"><span v-if="index ===0">责任部门：</span> {{DepartmentName(item.Department)}}</div>
                  </div>
                  <div class="item">
                    <div :style="`text-indent:${index === 0 ? 0 : 5.3}em`"><span v-if="index ===0">责任比例：</span> {{item.Proportion}}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-row" v-if="DisposeDetailsData.Solution && selectedCouponList">
              <div class="left"><div class="piece"></div></div>
              <div class="right">
                <div class="row line" v-if="DisposeDetailsData.Solution.SolutionType === 255">
                  <div class="item">
                    <div><span>解决方案：</span>
                    <!-- 其他 -->
                      其他
                    </div>
                  </div>
                </div>
                <template v-if="DisposeDetailsData.Solution && DisposeDetailsData.Solution.SolutionType === 8">
                  <div class="row line" v-for="(it,index) in selectedCouponList" :key="it.CouponID">
                    <div class="item" >
                      <div class="discount-coupon" ><span>{{index ===0?'解决方案：':''}}</span>
                      <!-- 赠送优惠券 -->
                        <span v-if="index === 0" :style="`text-indent:${index === 0 ? 0 : 5.05}em`">赠送优惠券：</span>
                        <span v-else style="margin-right:11.05em"></span>

                        <span class="is-pink">{{it.Data.Amount}}元</span><i> - </i>
                        <span class="MinPayAmount"> 满{{it.Data.MinPayAmount}}元使用</span>
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

                      </div>
                    </div>
                  </div>
                </template>
                <div class="row line" v-if="DisposeDetailsData.Solution.SolutionType === 7">
                  <div class="item">
                    <div><span>解决方案：</span>

                    <!-- 补印 -->
                    <span v-if="DisposeDetailsData.Solution.SolutionType === 7">
                      补印：款数：<span class="color-red">{{DisposeDetailsData.Solution.KindCount}} &nbsp;</span>款，
                      数量：<span class="color-red">{{DisposeDetailsData.Solution.Number}}</span>{{dataInfo.Order.Product.Unit}}
                    </span>
                    </div>
                  </div>
                </div>
                <div class="row line" style="border-bottom:none" v-if="DisposeDetailsData.Solution.SolutionType === 2">
                  <div class="item">
                    <!-- 问题 <span class="color-yellow">描述</span> 问题 <span class="color-red">描述</span> -->
                    <div>
                      <span>解决方案：</span>
                      <span>
                        退款：
                      </span>
                      <div class="refund" >
                        <div class="row line" style="border-bottom:none">
                          <div class="item">
                            <!-- 问题 <span class="color-yellow">描述</span> 问题 <span class="color-red">描述</span> -->
                            <div>
                              <span style="margin:0"></span>
                              <!-- 退款： -->
                              <span style="width:20em; text-indent:0em;">
                                退到余额：
                                <span class="color-red">
                                {{DisposeDetailsData.Solution.RefundBalance}}
                                </span>元
                              </span>
                              <span v-if="DisposeDetailsData.Solution.RefundFreightType === 1">
                                含运费<span class="color-red">
                                  {{DisposeDetailsData.Solution.RefundFreightAmount}}
                                </span>元
                              </span>
                              <span class="is-origin refund-sess">退款成功</span>
                            </div>
                          </div>
                        </div>
                        <div class="row line" style="border-bottom:none" v-if="DisposeDetailsData.Solution.SolutionType === 2">
                          <div class="item">
                            <div><span style="margin:0"></span>
                              <span style="width:20em;">
                                退印豆：<span class="color-red">
                                  {{DisposeDetailsData.Solution.RefundPrintBean}}
                                </span>个
                              </span>
                              <span v-if="DisposeDetailsData.Solution.RefundFreightType === 3">
                                含运费<span class="color-red">
                                  {{DisposeDetailsData.Solution.RefundFreightAmount}}
                                </span>个
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="row line" style="border-bottom:none" v-if="DisposeDetailsData.Solution.SolutionType === 2">
                          <div class="item">
                            <div><span style="margin:0"></span>
                              <span style="width:20em;">
                                退到扫码账户：<span class="color-red">
                                  {{DisposeDetailsData.Solution.RefundThirdParty}}
                                </span>元
                              </span>
                              <span v-if="DisposeDetailsData.Solution.RefundFreightType === 2">
                                含运费<span class="color-red">
                                  {{DisposeDetailsData.Solution.RefundFreightAmount}}
                                </span>元
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="row line" style="border-bottom:none" v-if="DisposeDetailsData.Solution.SolutionType === 2">
                          <div class="item">
                            <div><span style="margin:0"></span>
                              <span style="width:20em;">
                                售后优惠：<span class="color-red">
                                  {{DisposeDetailsData.Solution.UnpaidReducedAmount}}
                                </span>元
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row line">
                  <div class="item">
                    <div style="text-indent: 5.3em">
                      处理意见：
                      <el-tooltip
                      effect="dark"
                      :disabled="DisposeDetailsData.Solution.Opinion.length<50"
                      :content="DisposeDetailsData.Solution.Opinion"
                      placement="top">
                        <i class="i" style="text-indent: 0em">{{DisposeDetailsData.Solution.Opinion}}</i>
                      </el-tooltip>
                    </div>
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
import EditDiaLeftTable from '@/components/Feedback/DialogContent/EditDiaLeftTable.vue';
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
    dataInfo: {
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
          this.getPackageListByOrderID(this.paramsData.OrderID);
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
    // addSingleImg(data) {
    //   const inputFile = data;
    //   const { name, size } = inputFile;
    //   const lastModifiedDate = inputFile.lastModifiedDate.toLocaleString(84);
    //   this.imgInfo.push({
    //     name,
    //     size,
    //     lastModifiedDate,
    //   });
    //   const reader = new FileReader();
    //   reader.readAsDataURL(inputFile);
    //   reader.onloadend = () => {
    //     const strBase64 = reader.result.substring(0);
    //     this.setServiceImgList([strBase64, inputFile]); // 添加到数据仓库图片列表中
    //     return strBase64;
    //   };
    // },
    // setServiceImgList(state, [strBase64, inputFile]) {
    //   this.serviceImgList.push(strBase64);
    //   this.serviceImgList2Upload.push(inputFile);
    // },
    // async uploadImg(data) {
    //   if (!data || data.length < 1) return;
    //   const files = [];
    //   const imgExpectType = ['image/jpeg', 'image/png', 'image/bmp'];
    //   data.forEach((file) => {
    //     if (imgExpectType.includes(file.type)) files.push(file);
    //   });
    //   const len = 4 - this.serviceImgList.length || 0;
    //   // 获取到目前还可以添加的照片数量
    //   let list;
    //   if (files.length <= len) list = files;
    //   else list = files.slice(0, len);
    //   await Promise.all(list.map(async (imgData) => {
    //     // 耗时操作
    //     await this.addSingleImg(imgData);
    //   }));
    // },
    submitServiceOrder() {
    },
    async getPackageListByOrderID(orderId) {
      const res = await this.api.getPackageListByOrderID(orderId);
      if (res.data.Status === 1000) {
        const temp = res.data.Data.filter(item => this.DisposeDetailsData.AfterSalePackages.some(packItem => packItem.PackageID === item.ID));
        this.OrderPackageListTableData = temp;
      }
    },
  },

  mounted() {
    // this.getPackageListByOrderID(this.paramsData.OrderID);
  },
  beforeDestroy() {
    this.$router.push({ query: {} });
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.dialogdisposedetailsdialogcomp {
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
          margin-top: -15px;
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
        min-height: 565px;
        max-height: 565px;
        display: flex;
        margin-top: 20px;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        .marginright {
          margin-right: 1em;
        }
        > header {
          // height: 100%;
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
          margin-bottom: 20px;
          width: 835px;
          max-height: 820px;
          overflow: auto;
          .left-table{
            width: 100%;
          }
          .right-submit-wrap {
            width: calc(100% - 2px);
            box-sizing: border-box;
            .tab-row{
              width: 100%;
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
                // flex: 1;
                width: calc(100% - 50px);
                font-size: 13px;
                .row{
                  border-bottom: 1px dashed #eeeeee;
                  width: 100%;
                  &.row:last-child{
                    border-bottom: none;
                  }
                  display: flex;
                  .item{
                    width: 50%;
                    >div{
                      line-height: 40px;
                      color: #888888;
                      -webkit-line-clamp: 1;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: flex;
                      justify-content: flex-start;
                      >.refund{
                        flex: 1;
                      }
                      .refund-sess {
                        flex: 1;
                        text-align: right;
                        padding-right: 2em;
                      }
                      > .i {
                        -webkit-line-clamp: 1;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        flex: 1;
                      }
                      &.discount-coupon {
                        -webkit-line-clamp: 1;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        span, >i{
                          text-indent: 0;
                        }
                      }
                      >span:first-child{
                        color: #444444;
                        margin-right: 3px;
                        font-weight: 700;
                      }
                      .hide:first-child{
                        // color: #fff;
                        text-indent: 3em;
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
