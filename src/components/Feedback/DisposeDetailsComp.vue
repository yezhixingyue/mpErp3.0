<template>
  <div class="dispose-details-comp">
    <header class="header-title-box">
      <p class="mp-common-title-wrap"> 处理详情</p>
    </header>
    <EditDiaLeftTable
      class="package-list-table"
      :otherPackageNo="OrderPackageListTableData?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo) || []"
      :tableData='OrderPackageListTableData?.BackPackageInfos
      .filter(item => this.DisposeDetailsData.AfterSalePackages.some(packItem => packItem.PackageID === item.ID)) || []' :select='false' />
    <table class="serve table info-common" v-if="DisposeDetailsData">
      <tr>
        <td>问题照片</td>
        <td colspan="3">
          <div class="img" v-if="(DisposeDetailsData.SolutionQuestionPicList && DisposeDetailsData.SolutionQuestionPicList.length)||
            (DisposeDetailsData.PassQuestionPicList && DisposeDetailsData.PassQuestionPicList.length)">
            <!-- <DisplayPictrue :imgList='[...DisposeDetailsData.PassQuestionPicList,...DisposeDetailsData.SolutionQuestionPicList]' :isEditMode="false" /> -->
            <el-image style="width: 50px; height: 50px;"
            :preview-src-list="[...DisposeDetailsData.PassQuestionPicList,...DisposeDetailsData.SolutionQuestionPicList]"
              v-for="item in [...DisposeDetailsData.PassQuestionPicList,...DisposeDetailsData.SolutionQuestionPicList]" :key="item" :src="item" fit="cover" >
            </el-image>
            <span v-if="[...DisposeDetailsData.PassQuestionPicList,...DisposeDetailsData.SolutionQuestionPicList].length === 0">暂无图片</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>问题</td>
        <td colspan="3" class="questions">
          <ul>
            <li v-for="(item,index) in DisposeDetailsData.AfterSaleQuestions" :key="index">
              <div class="item question">
                <template v-if="DisposeDetailsData.AfterSaleQuestions.find(it => it.Version === 1)">
                  <el-tooltip
                  v-if="item.FirstQuestionType"
                  effect="dark"
                  :disabled="oldQuestionType.find(it => it.ID === item.FirstQuestionType)?.Name.length<11"
                  :content="oldQuestionType.find(it => it.ID === item.FirstQuestionType)?.Name"
                  placement="top">
                    <i class="i">{{oldQuestionType.find(it => it.ID === item.FirstQuestionType)?.Name}}</i>
                  </el-tooltip>
                  <el-tooltip
                  effect="dark"
                  v-if="item.SecondQuestionType"
                  :disabled="oldQuestionType.find(it => it.ID === item.SecondQuestionType)?.Name.length<11"
                  :content="oldQuestionType.find(it => it.ID === item.SecondQuestionType)?.Name"
                  placement="top">
                    <i class="i">{{oldQuestionType.find(it => it.ID === item.SecondQuestionType)?.Name}}</i>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-tooltip
                  effect="dark"
                  :disabled="QuestionFirstName(item.FirstQuestionType).length<11"
                  :content="QuestionFirstName(item.FirstQuestionType)"
                  placement="top">
                    <i class="i">{{QuestionFirstName(item.FirstQuestionType)}}</i>
                  </el-tooltip>
                  <el-tooltip
                  effect="dark"
                  :disabled="QuestionName(item.SecondQuestionType).length<11"
                  :content="QuestionName(item.SecondQuestionType)"
                  placement="top">
                    <i class="i">{{QuestionName(item.SecondQuestionType)}}</i>
                  </el-tooltip>
                </template>
              </div>
              <div class="item remark">
                （<span>备注：</span>
                <el-tooltip
                effect="dark"
                :disabled="item.Remark.length<22"
                :content="item.Remark"
                placement="top">
                  <i class="i">{{item.Remark}}</i>
                </el-tooltip>）
              </div>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>责任划分</td>
        <td colspan="3">
          <ul class="responsibility-distinction">
            <li v-for="(item,index) in DisposeDetailsData.AfterSaleResponsibilities" :key="index">
              {{DepartmentName(item.Department)}}：{{item.Proportion}}%
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>解决方案</td>
        <td colspan="3" class="solution" v-if="DisposeDetailsData.Solution">
          <div class="solution-box">
            <template v-for="(SolutionType, SolutionTypeindex) in DisposeDetailsData.Solution.SolutionTypes">
              <div :key="SolutionTypeindex" class="row line" v-if="SolutionType === 255">
                <div class="item">
                  <div style="display: block;">
                  <!-- 其他 -->
                    其他
                    <span v-if="DisposeDetailsData.Solution.OtherSolutionRemark">
                      ： 其他费用：
                      <el-tooltip
                      effect="dark"
                      :disabled="DisposeDetailsData.Solution.OtherSolutionRemark.length<50"
                      :content="DisposeDetailsData.Solution.OtherSolutionRemark"
                      placement="top">
                        <i class="i">{{DisposeDetailsData.Solution.OtherSolutionRemark}}</i>
                      </el-tooltip>
                    </span>
                  </div>
                </div>
              </div>
              <template v-if="DisposeDetailsData.Solution && SolutionType === 8">
                <div class="row line" v-for="(it,index) in selectedCouponList" :key="`${it.CouponID}${SolutionTypeindex}`">
                  <div class="item" >
                    <div class="discount-coupon" >
                      <!-- 赠送优惠券 -->
                      <span v-if="index === 0" >赠送优惠券：</span>
                      <span v-else ></span>
                      <span class="is-pink">{{it.Data.Amount}}元</span><i> - </i>
                      <span class="MinPayAmount"> 满{{it.Data.MinPayAmount}}元使用</span>
                      <span>（ <i class="is-origin">{{it.CouponNumber}}</i>张 ）</span>
                      <i> - </i>
                      <el-tooltip placement="top-start" :enterable='false'>
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
              <div :key="SolutionTypeindex" class="row line" v-if="SolutionType === 7">
                <div class="item">
                  <div>
                    <!-- 补印 -->
                    <span v-if="SolutionType === 7">
                      补印：款数：<span class="color-red">{{DisposeDetailsData.Solution.KindCount}} &nbsp;</span>款，
                      数量：<span class="color-red">{{DisposeDetailsData.Solution.Number}}</span>{{dataInfo.Order.Product.Unit}}
                    </span>
                  </div>
                </div>
              </div>
              <div :key="SolutionTypeindex" class="row line" v-if="SolutionType === 2">
                <div class="item">
                  <div>
                    <span>
                      退款：
                    </span>
                    <div class="refund" >
                      <div class="row line" v-if="DisposeDetailsData.Solution.RefundBalance">
                        <div class="item">
                          <div>
                            <!-- 退款： -->
                            <span>
                              退到余额：
                              <span class="color-red">
                              {{DisposeDetailsData.Solution.RefundBalance}}
                              </span>元
                            </span>
                            <span v-if="DisposeDetailsData.Solution.RefundFreightType === 1 && DisposeDetailsData.Solution.RefundFreightAmount">
                              含运费<span class="color-red">
                                {{DisposeDetailsData.Solution.RefundFreightAmount}}
                              </span>元
                            </span>
                            <span class="is-origin refund-sess">退款成功</span>
                          </div>
                        </div>
                      </div>
                      <div class="row line" v-if="DisposeDetailsData.Solution.RefundPrintBean">
                        <div class="item">
                          <div>
                            <span>
                              退印豆：<span class="color-red">
                                {{DisposeDetailsData.Solution.RefundPrintBean}}
                              </span>个
                            </span>
                            <span v-if="DisposeDetailsData.Solution.RefundFreightType === 3 && DisposeDetailsData.Solution.RefundFreightAmount">
                              含运费<span class="color-red">
                                {{DisposeDetailsData.Solution.RefundFreightAmount}}
                              </span>个
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="row line" v-if="DisposeDetailsData.Solution.RefundThirdParty">
                        <div class="item">
                          <div>
                            <span>
                              退到扫码账户：
                              <span class="color-red">
                                {{DisposeDetailsData.Solution.RefundThirdParty}}
                              </span>元
                            </span>
                            <span v-if="DisposeDetailsData.Solution.RefundFreightType === 2 && DisposeDetailsData.Solution.RefundFreightAmount">
                              含运费<span class="color-red">
                                {{DisposeDetailsData.Solution.RefundFreightAmount}}
                              </span>元
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="row line" v-if="DisposeDetailsData.Solution.UnpaidReducedAmount">
                        <div class="item">
                          <div>
                            <span>
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
            </template>
            <div>
              处理意见：
              <i class="i" style="text-indent: 0em">{{DisposeDetailsData.Solution.Opinion}}</i>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <div class="loss-box" v-if="!localPermission.LossConfirm || this.$route.name !== 'ServiceInfo'">
      <span class="title">损失金额：</span>
      <span class="is-pink">{{DisposeDetailsData.LossAmount}} </span>
      <span>元</span>
    </div>
    <LossAssessmentComp v-if="localPermission.LossConfirm && this.$route.name === 'ServiceInfo'" :AfterSaleData='paramsData'
    @submit="onSubmit"
    ></LossAssessmentComp>
  </div>
</template>

<script>
import {
  mapState, mapActions,
} from 'vuex';
import EditDiaLeftTable from '@/components/Feedback/DialogContent/EditDiaLeftTable.vue';
import LossAssessmentComp from '@/components/Feedback/LossAssessmentComp.vue';

export default {
  components: {
    EditDiaLeftTable,
    LossAssessmentComp,
    // LoadingComp,
  },
  props: {
    paramsData: {
      type: Object,
    },
    dataInfo: {
      type: Object,
    },
  },
  data() {
    return {
      DisposeDetailsData: {},
      oldQuestionType: [],
      OrderPackageListTableData: null,
      QuestionTypeList: [],
      // 选中的优惠券
      selectedCouponList: null,
    };
  },
  computed: {
    ...mapState('common', ['isLoading', 'DepartmentList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageAfterSales?.Obj) {
        return this.Permission.PermissionList.PermissionManageAfterSales.Obj;
      }
      return {};
    },
    QuestionName() {
      return (id) => {
        let returnData = null;
        this.QuestionTypeList.forEach(it => {
          const temp = it.SonClassList.find(i => i.ID === id);
          if (temp) {
            returnData = temp;
          }
        });
        return returnData?.Name || '';
      };
    },
    // 根据二级问题找一级问题
    QuestionFirstName() {
      return (id) => {
        const temp = this.QuestionTypeList.find(it => it.ID === id);
        return temp?.Name || '';
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
    ...mapActions('service', ['getServiceListData']),
    getSuccessDetail() {
      this.api.getSuccessDetail(this.paramsData.AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.DisposeDetailsData = res.data.Data;
          if (this.DisposeDetailsData.AfterSaleQuestions.find(it => it.Version === 1)) {
            this.api.getQuestionList().then(QuestionListRes => {
              if (QuestionListRes.data.Status === 1000) {
                this.oldQuestionType = QuestionListRes.data.Data;
              }
            });
          }
          // : this.paramsData.ProductID
          this.getQuestionTypeList(this.paramsData.ProductID);
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
    async getQuestionTypeList(ID) {
      // 获取所有问题
      const res = await this.api.getOrderAfterSaleQuestionClassList({ searchType: 1, ID });
      if (res.data.Status === 1000) {
        this.QuestionTypeList = res.data.Data;
      }
    },
    onSubmit() {
      this.getServiceListData();
      this.$goback();
    },
    submitServiceOrder() {
    },
    async getPackageListByOrderID(orderId) {
      const res = await this.api.getPackagesByOrderID(orderId);
      if (res.data.Status === 1000) {
        const temp = res.data.Data;
        this.OrderPackageListTableData = temp;
      }
    },
  },

  mounted() {
    this.getSuccessDetail();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.dispose-details-comp {
  width: 800px;
  .package-list-table{
    margin-bottom: 10px;
  }
  >.edit-dia-left-table-wrap{
    .has-gutter{
      >tr{
        height: 36px;
      }
    }
    .el-table__body-wrapper{

      .el-table__row{
        height: 36px;
      }
    }
  }

  .info-common{
    margin-bottom: 15px;
    tr{
      .mp-service-imglist-display-wrap{
        height: 70px;
        .img-list{
          height: 70px;
          box-sizing: border-box;
          padding-top: 10px;
        }
      }
      .img{
        display: flex;
        align-items: center;
      }
      .questions{
        padding: 0 !important;
        ul{
          li {
            padding: 0 20px;
            display: flex;
            &:nth-child(2n){
              background-color: #F5F5F5;
            }
            >.item{
              &.question{
                width: 24em;
                min-width: 24em;
                display: flex;
                i{
                  margin-right: 1em;
                  -webkit-line-clamp: 1;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  flex: 1;
                }
              }
              &.remark{
                color: #AEAEAE;
                display: flex;
                >span{
                  min-width: 3em;
                }
                i{
                  -webkit-line-clamp: 1;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
      .responsibility-distinction{
        display: flex;
        li{
          margin-right: 30px;
        }
      }
      .solution{
        .solution-box{
          line-height: 28px;
          padding-top: 15px;
          padding-bottom: 15px;
        }
        .row{
          width: 100%;
          &.row:last-child{
            border-bottom: none;
          }
          display: flex;
          .item{
            width: 50%;
            >div{
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
                padding-right: 300px;
                font-size: 11px;
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
          .item{
            width: 100%;
          }
        }
      }
    }
  }
  .loss-box{
    margin-top: 15px;
    font-size: 12px;
    color: #FF0000;
    font-weight: 700;
    .title{
      font-size: 14px;
      color: #444444;
    }
  }
}
</style>
