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
            <span class="label is-bold">{{appealData.CouponIsExtra?'额外':''}}增送优惠券：</span><span class="value">
              <p v-for="it in appealData.SolutionResults[0].CouponContents" :key="it">{{it}}</p>
            </span>
          </li>
          <li v-if="appealData.SolutionResultRemark">
            <span class="label is-bold">补充说明：</span><span class="value">{{appealData.SolutionResultRemark}}</span>
          </li>
          <template v-if="!propsData.IsExtraPay && IsShowExtraPayForm">
            <li>
              <span class="label is-bold" style="min-width: 5em;">
              </span><span class="value"> <el-checkbox v-model="CompleteFrom.IsExtraPay " class="is-bold">补充额外支出：</el-checkbox> </span>
            </li>
            <template v-if="CompleteFrom.IsExtraPay">
              <li class="form-box" style="line-height: 35px;">
                <span class="label is-bold">额外支出：</span><span class="value">
                  <span>
                    <el-input v-model="CompleteFrom.ExtraPayAmount" style="width: 80px;"></el-input> 元
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
                  style="color: #fff; border: none; background: linear-gradient( 226deg, #34DEF9 0%, #26BCF9 100%);">保存</el-button>
                </span>
              </li>
            </template>
          </template>
          <template v-else>
            <li v-if="propsData.ExtraPayAmount">
              <span class="label is-bold">额外支出：</span><span class="value">{{propsData.ExtraPayAmount}}</span>
            </li>
            <li v-if="propsData.ExtraPayRemark">
              <span class="label is-bold">支出说明：</span><span class="value">{{propsData.ExtraPayRemark}}</span>
            </li>
          </template>
          <template v-if="showImg">
            <li>
              <span class="label is-bold">图片凭证：</span><span class="value">
                <div class="image-list">
                  <img v-for="it in appealData.QuestionPics" :key="it" :src="it" alt="">
                </div>
              </span>
            </li>
            <li>
              <span class="label is-bold">客服补充：</span><span class="value">
                <div class="image-list">
                  <img v-for="it in appealData.SupplementalQuestionPics" :key="it" :src="it" alt="">
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
                  width="65">
                </el-table-column>
                <el-table-column prop="ID" label="包裹号" minWidth="110" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Logistics.BillNo" label="运单号" minWidth="114" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.Logistics?.BillNo }}
                    <template v-if="scope.row.Logistics?.BillNo && PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1)
                    .map(it => it.BillNo).length">
                      、
                    </template>
                    <template v-if="PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
                      {{PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).join('、')}}
                    </template>
                  </template></el-table-column>
                <el-table-column prop="ProductAmount" label="产品数量" minWidth="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TotalAmount" label="金额" minWidth="57" show-overflow-tooltip></el-table-column>
                <el-table-column prop="UnPaidAmount" label="代收金额" minWidth="80" show-overflow-tooltip></el-table-column>
              </el-table>
            </span>
          </li>
        </template>
      </template>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

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
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {
      propsData: null,
      CompleteFrom: {
        AfterSaleCode: 0,
        ExtraPayAmount: '',
        ExtraPayRemark: '',
        ExtraPayIsShow: true,
      },
    };
  },
  methods: {
    saveExtraPay() {
      if (!this.CompleteFrom.ExtraPayAmount) {
        this.messageBox.failSingleError('操作失败', '请输入额外支出');
      } else {
        this.CompleteFrom.AfterSaleCode = this.propsData.AfterSaleCode;
        this.api.getOrderAfterSaleExtraPay(this.CompleteFrom).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              this.propsData.IsExtraPay = true;
              this.propsData.ExtraPayAmount = this.CompleteFrom.ExtraPayAmount;
              this.propsData.ExtraPayRemark = this.CompleteFrom.ExtraPayRemark;
            };
            this.messageBox.successSingle('保存成功', cb, cb);
          }
        });
      }
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
}
</style>
