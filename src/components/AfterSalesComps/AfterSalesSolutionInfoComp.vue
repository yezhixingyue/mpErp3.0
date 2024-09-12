<template>
  <section class="after-sales-solution-info-comp">
    <header class="title is-bold">解决方案</header>
    <ul v-if="propsData">
      <template v-if="appealData.Status === 255">
        <li class="result cancel">
          客户已取消申请
        </li>
      </template>
      <template v-else>
        <template v-if="appealData.IsReject">
          <li class="result reject">
            <img src="@/assets/images/未发现问题.png" alt=""> 驳回申请
          </li>
          <li>
            <span class="label is-bold">原因：</span><span class="value">
              {{appealData.RejectReason}}</span>
          </li>
        </template>
        <template v-else>
          <li v-if="appealData.SolutionResults[0].SolutionName !== '赠送优惠劵'">
            <span class="label is-bold">{{appealData.SolutionResults[0].SolutionName}}：</span><span class="value">
              {{appealData.SolutionResults[0].SolutionContent}}</span>
          </li>
          <li v-if="appealData.SolutionResults[0].CouponContents.length">
            <span class="label is-bold" :style="`min-width: ${appealData.CouponIsExtra?8:6}em;`">{{appealData.CouponIsExtra?'额外':''}}增送优惠券：</span>
            <span class="value">
              <p class="coupon-item" :title="it" v-for="it in appealData.SolutionResults[0].CouponContents" :key="it">{{it}}</p>
            </span>
          </li>
          <li v-if="appealData.SolutionResultRemark">
            <span class="label is-bold">补充说明：</span><span class="value">{{appealData.SolutionResultRemark}}</span>
          </li>
          <li v-if="appealData.IsProduceEnd">
            <span class="label is-bold" style="min-width: 5em;"></span><span class="value is-pink" style="font-weight: 700">
              已终止生产
            </span>
          </li>
          <template v-if="IsShowExtraPayForm && propsData.IsAllowExtraPay">
            <li>
              <span class="label is-bold" style="min-width: 5em;">
              </span><span class="value"> <el-checkbox v-model="CompleteFrom.IsExtraPay " class="is-bold">补充额外支出：</el-checkbox> </span>
            </li>
            <template v-if="CompleteFrom.IsExtraPay">
              <li class="form-box" style="line-height: 35px;">
                <span class="label is-bold">额外支出：</span><span class="value">
                  <span>
                    <el-input v-model="CompleteFrom.ExtraPayAmount" oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]" style="width: 80px;"></el-input> 元
                  </span>
                  <span style="margin-left: 30px;">
                    <el-checkbox v-model="CompleteFrom.ExtraPayIsShow">支出给客户</el-checkbox>
                    <i class="is-gray">（选中时客户可见金额和支出说明）</i>
                  </span>
                </span>
              </li>
              <li>
                <span class="label is-bold">
                  支出说明：<span class="text">(选填)</span>
                </span>
                <span class="value">
                  <el-input v-model="CompleteFrom.ExtraPayRemark" placeholder="请输入内容" size="medium" style="margin-bottom: 10px;"></el-input>
                </span>
              </li>
              <li>
                <span class="label is-bold" style="min-width: 5em;"></span>
                <span class="value">
                  <el-button @click="saveExtraPay"
                  style="color: #fff; border: none; background: linear-gradient( 226deg, #34DEF9 0%, #26BCF9 100%); width: 120px;padding: 0;line-height: 35px;">
                    保存
                  </el-button>
                </span>
              </li>
            </template>
          </template>
          <template v-else>
            <li v-if="propsData.ExtraPayAmount">
              <span class="label is-bold">额外支出：</span><span class="value">{{propsData.ExtraPayAmount}}<i v-if="propsData.ExtraPayIsShow">（支出给客户）</i> </span>
            </li>
            <li v-if="propsData.ExtraPayRemark">
              <span class="label is-bold">支出说明：</span><span class="value">{{propsData.ExtraPayRemark}}</span>
            </li>
          </template>
          <template v-if="showImg">
            <li v-if="appealData.QuestionPics && appealData.QuestionPics.length">
              <span class="label is-bold">图片凭证：</span><span class="value">
                <div class="image-list">
                  <!-- <img v-for="it in appealData.QuestionPics" :key="it" :src="it" alt=""> -->
                  <el-image :preview-src-list="appealData.QuestionPics" :mpCloseViewer='closeViewer'
                  v-for="(item, index) in appealData.QuestionPics" :key="index + item" :src="item" fit="cover" ></el-image>
                </div>
              </span>
            </li>
            <li v-if="appealData.SupplementalQuestionPics && appealData.SupplementalQuestionPics.length">
              <span class="label is-bold">客服补充：</span><span class="value">
                <div class="image-list">
                  <!-- <img v-for="it in appealData.SupplementalQuestionPics" :key="it" :src="it" alt=""> -->
                  <el-image :preview-src-list="appealData.SupplementalQuestionPics" :mpCloseViewer='closeViewer'
                  v-for="(item, index) in appealData.SupplementalQuestionPics" :key="index + item" :src="item" fit="cover" ></el-image>
                </div>
              </span>
            </li>
          </template>
          <li v-if="showResponsibilities && appealData.AfterSaleQuestions && appealData.AfterSaleQuestions.length">
            <span class="label is-bold">问题类型：</span><span class="value">
              {{appealData.AfterSaleQuestions.map(it => `${it.FirstQuestionTypeTitle}-${it.SecondQuestionTypeTitle}`).join('、')}}
            </span>
          </li>
          <li v-if="showResponsibilities && appealData.AfterSaleResponsibilities && appealData.AfterSaleQuestions.length">
            <span class="label is-bold">责任部门：</span><span class="value">
              <template v-for="(it, i) in appealData.AfterSaleResponsibilities" >
                <i :key="it.Department">
                  <template v-if="i !== 0">、</template>
                  <template v-if="it.Department === 1">
                    业务中心
                  </template>
                  <template v-if="it.Department === 2">
                    生产工厂
                  </template>
                  <template v-if="it.Department === 3">
                    物流中心
                  </template>
                  <template v-if="it.Department === 4">
                    配送中心
                  </template>
                  <template v-if="it.Department === 5">
                    自动审稿软件
                  </template>
                  <template v-if="it.Department === 6">
                    其他软件
                  </template>{{ it.Proportion }}%
                </i>
              </template>
            </span>
          </li>
          <li v-show="PackagesList">
            <span class="label is-bold" style="min-width: 5em;">相关包裹：</span><span class="value">
              <el-table v-if="PackagesList" ref="Packages" stripe border fit :data="PackagesList.BackPackageInfos" style="width: 100%" class="ft-14-table">
                <el-table-column
                  :selectable="() => false"
                  type="selection"
                  label="包裹号"
                  width="50">
                </el-table-column>
                <el-table-column prop="ID" label="包裹号" minWidth="115" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="{'is-gray': !appealData.AfterSalePackages.find(it => it.PackageID === scope.row.ID)}">{{ scope.row.ID }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="Logistics.BillNo" label="运单号" minWidth="140" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="{'is-gray': !appealData.AfterSalePackages.find(it => it.PackageID === scope.row.ID)}">
                      {{ scope.row.Logistics?.BillNo }}
                      <template v-if="scope.row.Logistics?.BillNo && PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1)
                      .map(it => it.BillNo).length">
                        、
                      </template>
                      <template v-if="PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
                        {{PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).join('、')}}
                      </template>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="ProductAmount" label="产品数量" minWidth="70" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="{'is-gray': !appealData.AfterSalePackages.find(it => it.PackageID === scope.row.ID)}">{{ scope.row.ProductAmount }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="TotalAmount" label="金额" minWidth="70" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="{'is-gray': !appealData.AfterSalePackages.find(it => it.PackageID === scope.row.ID)}">{{ scope.row.TotalAmount }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="UnPaidAmount" label="代收金额" minWidth="70" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="{'is-gray': !appealData.AfterSalePackages.find(it => it.PackageID === scope.row.ID)}">{{ scope.row.UnPaidAmount }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </span>
          </li>
        </template>
      </template>
      <CommonDialogComp
        width="470px"
        top='30vh'
        :visible="dialogVisible"
        submitText='确认保存'
        cancelText='取消'
        @cancle="dialogVisible = false"
        @closed='dialogVisible = false'
        @submit="onSaveClick"
        class="mp-erp-save-massage-dialog-comp-wrap"
      >
        <div class="save-massage-content">
          <div class="title">
            <img src="@/assets/images/warn.png" alt="">
            <div>
              <h3>补充额外支出</h3>
              <p>请确定数据正确无误，提交后不可修改</p>
            </div>
          </div>
          <p>额外支出：{{CompleteFrom.ExtraPayAmount}}元{{ CompleteFrom.ExtraPayIsShow ? '（支出给客户）' : '' }}</p>
          <p v-if="CompleteFrom.ExtraPayRemark">支出说明：{{CompleteFrom.ExtraPayRemark}}</p>
        </div>
      </CommonDialogComp>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    PackagesList: {
      type: Object,
      default: () => (null),
    },
    appealData: {
      type: Object,
      default: () => null,
    },
    showImg: {
      type: Boolean,
      default: false,
    },
    showResponsibilities: {
      type: Boolean,
      default: false,
    },
    IsShowExtraPayForm: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    CommonDialogComp,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {
      dialogVisible: false,
      propsData: null,
      CompleteFrom: {
        AfterSaleCode: 0,
        ExtraPayAmount: '',
        ExtraPayRemark: '',
        ExtraPayIsShow: false,
      },
    };
  },
  methods: {
    closeViewer() {},
    saveExtraPay() {
      if (!this.CompleteFrom.ExtraPayAmount) {
        this.messageBox.failSingleError('操作失败', '请输入额外支出');
      } else {
        this.dialogVisible = true;
      }
    },
    onSaveClick() {
      this.CompleteFrom.AfterSaleCode = this.propsData.AfterSaleCode;
      this.api.getOrderAfterSaleExtraPay(this.CompleteFrom).then(res => {
        if (res.data.Status === 1000) {
          const cb = () => {
            this.propsData.IsExtraPay = true;
            this.dialogVisible = false;
            this.propsData.ExtraPayAmount = this.CompleteFrom.ExtraPayAmount;
            this.propsData.ExtraPayRemark = this.CompleteFrom.ExtraPayRemark;
            this.propsData.ExtraPayIsShow = this.CompleteFrom.ExtraPayIsShow;
            this.propsData.IsAllowExtraPay = false;
          };
          this.messageBox.successSingle('保存成功', cb, cb);
        }
      });
    },
  },
  mounted() {
    if (this.appealData && this.appealData.AfterSalePackages) {
      this.appealData.AfterSalePackages.forEach(it => {
        const temp = this.PackagesList.BackPackageInfos.find(Package => Package.ID === it.PackageID);
        setTimeout(() => {
          if (temp) this.$refs.Packages.toggleRowSelection(temp);
        }, 100);
      });
    }
    this.propsData = { ...this.appealData };
  },
};
</script>

<style lang='scss'>
.after-sales-solution-info-comp {
  padding-left: 20px;
  min-width: 483px;
  // width: 483px;
  box-sizing: border-box;
  padding-right: 30px;
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
    li{
      display: flex;
      font-size: 12px;
      margin-top: 10px;
      line-height: 15px;
      .el-input, input{
        height: 35px;
      }
      &.result{
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        img{
          margin-right: 10px;
        }
        &.cancel{
          color: #4CAAFC;
        }
        &.reject{
          color: #FE5065;
        }
      }
      .coupon-item{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 380px;
      }
      >.label{
        position: relative;
        >.text{
          position: absolute;
          right: 1em;
          top: 15px;
          color: #AEAEAE
        }
      }
      >.value{
        flex: 1;
        .image-list{
          display: flex;
          flex-wrap: wrap;
          img{
            width: 107px;
            height: 75px;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 10px;
            &:nth-child(3n){
              margin-right: 0;
            }
          }
        }
        .el-table{
          .el-table__header-wrapper thead tr th .cell {
            line-height: 36px;
            font-size: 14px;
          }
          .el-table__fixed-header-wrapper thead tr th .cell {
            line-height: 36px;
            font-size: 14px;
          }
          .el-table__header-wrapper{
            thead{
              .el-checkbox{
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .mp-erp-save-massage-dialog-comp-wrap{
    .el-dialog__header{
      .el-dialog__title{
        display: none;
      }
      &::after{
        content: none;
      }
    }
    .el-dialog__body{
      padding: 0 73px;
      line-height: 18px;
      font-size: 12px;
      .save-massage-content{
        .title{
          padding-left: 35px;
          display: flex;
          margin-bottom: 15px;
          h3{
            font-size: 22px;
            font-weight: 700;
            line-height: 25px;
            margin-bottom: 3px;
          }
          img{
            width: 45px;
            height: 45px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
