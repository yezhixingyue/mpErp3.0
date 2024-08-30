<template>
  <section class="responsibility-differentiation-comp">
    <header class="title is-bold">划分责任</header>
    <ul>
      <li v-if="Status === 255">
        <p class="overtime is-pink"><img src="@/assets/images/超时未划分责任.png" alt="">超时未划分责任！！！</p>
      </li>
      <template v-else>
        <li>
          <div class="label is-bold">问题类别：</div><div class="value">
            <template v-if="ResponsibilityDivideDetail.ResponsibilityIsAllowDivide">
              <span @click="selectProblemTypesClick" style="color: #26BCF9; cursor: pointer;"
              >选择类别</span>
              <i>
                {{ProblemTypesList.map(it => `${it.ParentName}-${it.Name}`).join('、')}}
              </i>
            </template>
            <template v-else-if="ResponsibilityDivideDetail.AfterSaleQuestions">
              {{ResponsibilityDivideDetail.AfterSaleQuestions.map(it => `${it.FirstQuestionTypeTitle}-${it.SecondQuestionTypeTitle}`).join('、')}}
            </template>
          </div>
        </li>
        <li class="form-box">
          <div class="label is-bold">责任占比：</div><div class="value">
            <template v-if="ResponsibilityDivideDetail.ResponsibilityIsAllowDivide">
              <p>
                <el-checkbox v-model="ProportionResponsibility.Department1">业务中心</el-checkbox>
                <template v-if="ProportionResponsibility.Department1">
                  所占责任：
                  <el-input v-model="ProportionResponsibility.DepartmentProportion1" size="medium" style="width: 50px;"></el-input> %
                  <template v-if="ResponsibilityDivideDetail &&
                  ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 1)?.ConfirmTime">
                    <i>已确认</i>
                    <img src="@/assets/images/success.png" alt="">
                  </template>
                </template>
              </p>
              <p>
                <el-checkbox v-model="ProportionResponsibility.Department2">生产工厂</el-checkbox>
                <template v-if="ProportionResponsibility.Department2">
                  所占责任：
                  <el-input v-model="ProportionResponsibility.DepartmentProportion2" size="medium" style="width: 50px;"></el-input> %
                  <template v-if="ResponsibilityDivideDetail &&
                  ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 2)?.ConfirmTime">
                    <i>已确认</i>
                    <img src="@/assets/images/success.png" alt="">
                  </template>
                </template>
              </p>
              <p>
                <el-checkbox v-model="ProportionResponsibility.Department3">物流中心</el-checkbox>
                <template v-if="ProportionResponsibility.Department3">
                  所占责任：
                  <el-input v-model="ProportionResponsibility.DepartmentProportion3" size="medium" style="width: 50px;"></el-input> %
                  <template v-if="ResponsibilityDivideDetail &&
                  ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 3)?.ConfirmTime">
                    <i>已确认</i>
                    <img src="@/assets/images/success.png" alt="">
                  </template>
                </template>
              </p>
              <p>
                <el-checkbox v-model="ProportionResponsibility.Department4">配送中心</el-checkbox>
                <template v-if="ProportionResponsibility.Department4">
                  所占责任：
                  <el-input v-model="ProportionResponsibility.DepartmentProportion4" size="medium" style="width: 50px;"></el-input> %
                  <template v-if="ResponsibilityDivideDetail &&
                  ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 4)?.ConfirmTime">
                    <i>已确认</i>
                    <img src="@/assets/images/success.png" alt="">
                  </template>
                </template>
              </p>
            </template>
            <template v-else>
              <p v-if="ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 1)">
                业务中心 {{ ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 1).Proportion }}%
              </p>
              <p v-if="ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 2)">
                生产工厂 {{ ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 2).Proportion }}%
              </p>
              <p v-if="ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 3)">
                物流中心 {{ ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 3).Proportion }}%
              </p>
              <p v-if="ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 4)">
                配送中心 {{ ResponsibilityDivideDetail.AfterSaleResponsibilities.find(it => it.Department === 4).Proportion }}%
              </p>
            </template>
          </div>
          <AfterSalesProblemTypesDialog @select="ProblemTypesSelect" :ProblemTypesVisible.sync="ProblemTypesVisible"
          @close="() => ProblemTypesVisible = false" :selectKeys="ProblemTypesList"/>
        </li>
        <li style="width: 348px; margin-bottom: 35px;" v-if="ResponsibilityDivideDetail.ResponsibilityIsAllowDivide">
          <div>
            <p>说明：在所有相关责任部门全部确认前，可无限次修改责任占比。如果某一部门已确认，然后又修改了其责任占比，则该部门需要重新确认。</p>
          </div>
        </li>
      </template>
    </ul>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AfterSalesProblemTypesDialog from '@/components/AfterSalesComps/AfterSalesProblemTypesDialog.vue';

export default {
  props: {
    ResponsibilityDivideDetail: {
      type: Object,
      default: () => (null),
    },
    AfterSaleCode: {
      type: Number,
      default: 0,
    },
    Status: {
      type: Number,
      default: 0,
    },
  },

  components: {
    AfterSalesProblemTypesDialog,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    ...mapState('AfterSale', ['QuestionClassList', 'ResponsibilityMeasureCondition']),
  },
  data() {
    return {
      oldData: '',
      oldTypesData: [],
      ProblemTypesVisible: false,
      ProblemTypesList: [],
      ProportionResponsibility: {
        Department1: false,
        DepartmentProportion1: '',
        Department2: false,
        DepartmentProportion2: '',
        Department3: false,
        DepartmentProportion3: '',
        Department4: false,
        DepartmentProportion4: '',
      },
      submitForm: {
        AfterSaleCode: 0,
        AfterSaleQuestions: [
          {
            FirstQuestionType: 0,
            SecondQuestionType: 0,
            Remark: '',
            Version: 1,
            QuestionTitle: '',
          },
        ],
        AfterSaleResponsibilities: [
          {
            Department: 0,
            Proportion: 0,
            ConfirmerName: '',
            ConfirmTime: '',
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions('AfterSale', ['getOrderAfterSaleQuestionClassList', 'getOrderAfterSaleResponsibilityDivideList']),
    ProblemTypesSelect(list) {
      this.ProblemTypesList = list;
      this.submitForm.AfterSaleQuestions = list.map(it => ({
        FirstQuestionType: it.ParentID,
        SecondQuestionType: it.ID,
        Remark: '',
        Version: 3,
        QuestionTitle: it.Name,
      }));
    },
    selectProblemTypesClick() {
      this.ProblemTypesVisible = true;
    },
    onGoBackClick() {
      this.$goback();
    },
    getQuestionClassList() {
      if (this.QuestionClassList.length === 0) {
        this.getOrderAfterSaleQuestionClassList({ searchType: 2 });
      }
    },
    getContrastOldTypesData() {
      let bool = true;
      this.ProblemTypesList.forEach(it => {
        if (this.oldTypesData.findIndex(el => el === it.ID) === -1) {
          bool = false;
        }
      });
      if (this.oldTypesData.length === this.ProblemTypesList.map(it => it.ID).length && bool) {
        return true;
      }
      return false;
    },
    // 设置划分责任的数据
    setResponsibility() {
      const Responsibilities = [];
      const setResponsibilities = (key, value) => {
        Responsibilities.push({
          Department: key,
          Proportion: value,
          ConfirmerName: '',
          ConfirmTime: '',
        });
      };
      let num = 0;
      if (this.ProportionResponsibility.Department1) {
        num += Number(this.ProportionResponsibility.DepartmentProportion1);
        setResponsibilities(1, Number(this.ProportionResponsibility.DepartmentProportion1));
      }
      if (this.ProportionResponsibility.Department2) {
        num += Number(this.ProportionResponsibility.DepartmentProportion2);
        setResponsibilities(2, Number(this.ProportionResponsibility.DepartmentProportion2));
      }
      if (this.ProportionResponsibility.Department3) {
        num += Number(this.ProportionResponsibility.DepartmentProportion3);
        setResponsibilities(3, Number(this.ProportionResponsibility.DepartmentProportion3));
      }
      if (this.ProportionResponsibility.Department4) {
        num += Number(this.ProportionResponsibility.DepartmentProportion4);
        setResponsibilities(4, Number(this.ProportionResponsibility.DepartmentProportion4));
      }
      this.submitForm.AfterSaleResponsibilities = Responsibilities;
      if (num === 100) {
        return true;
      }
      return false;
    },
    submit() {
      if (!this.ProblemTypesList.length) {
        this.messageBox.failSingleError('操作失败', '请选择问题类别');
      } else if (this.oldData === JSON.stringify(this.ProportionResponsibility) && this.getContrastOldTypesData()) {
        this.messageBox.failSingleError('操作失败', '数据无更改');
      } else if (!this.setResponsibility()) {
        this.messageBox.failSingleError('操作失败', '责任占比总和需为100');
      } else if (this.submitForm.AfterSaleResponsibilities.findIndex(it => Number(it.Proportion) === 0) !== -1) {
        this.messageBox.failSingleError('操作失败', '请勿勾选无责任中心');
      } else {
        this.submitForm.AfterSaleCode = this.AfterSaleCode;
        this.api.getOrderAfterSaleResponsibilityDivide(this.submitForm).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              this.getOrderAfterSaleResponsibilityDivideList(this.ResponsibilityMeasureCondition.Page);
              this.onGoBackClick();
            };
            this.messageBox.successSingle('划分成功', cb, cb);
          }
        });
      }
    },
    async backResponsibilities() {
      this.submitForm.AfterSaleResponsibilities.forEach(it => {
        this.ProportionResponsibility[`Department${it.Department}`] = true;
        this.ProportionResponsibility[`DepartmentProportion${it.Department}`] = `${it.Proportion}`;
      });
      this.oldData = JSON.stringify(this.ProportionResponsibility);
    },
    async backQuestionClass() {
      this.ProblemTypesList = this.submitForm.AfterSaleQuestions.map(it => {
        const lv1QuestionClass = this.QuestionClassList.find(lv1Question => lv1Question.ID === it.FirstQuestionType);
        return {
          ParentID: it.FirstQuestionType,
          ParentName: lv1QuestionClass?.Name,
          ID: it.SecondQuestionType,
          Name: lv1QuestionClass?.SonClassList.find(Son => Son.ID === it.SecondQuestionType)?.Name,
        };
      });
      this.oldTypesData = this.ProblemTypesList.map(it => it.ID);
    },
  },
  mounted() {
    Promise.all([this.getQuestionClassList()]).then(() => {
      this.submitForm.AfterSaleResponsibilities = this.ResponsibilityDivideDetail.AfterSaleResponsibilities;
      if (this.submitForm.AfterSaleResponsibilities.length) this.backResponsibilities();

      this.submitForm.AfterSaleQuestions = this.ResponsibilityDivideDetail.AfterSaleQuestions || [];
      if (this.submitForm.AfterSaleQuestions.length) this.backQuestionClass();
    });
  },
};
</script>

<style lang='scss'>
.responsibility-differentiation-comp {
  padding-left: 20px;
  max-width: 400px;
  width: 400px;
  min-width: 400px;
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
      line-height: 20px;
      .overtime{
        display: flex;
        align-items: flex-start;
        font-size: 16px;
        font-weight: 700;
        line-height: 30px;
      }
      &.form-box{
        line-height: 35px;
        .el-input, input{
          height: 35px;
        }
        .el-input{
          input{
            padding: 0 10px;
          }
        }
      }
      >.value{
        flex: 1;
        >i{
          line-height: 20px;
        }
        >p{
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          >.el-checkbox{
            .el-checkbox__label{
              font-size: 12px;
              color: #444;
              padding-left: 5px;
            }
            margin-right: 20px;
          }
          >.el-input{
            margin-right: 5px;
          }
          >i{
            margin-right: 5px;
            margin-left: 20px;
            color: #80c269;
          }
          img{
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
}
</style>
