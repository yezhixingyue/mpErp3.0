<template>
  <section class="responsibility-confirm-comp">
    <header class="title is-bold">划分责任</header>
    <ul>
      <li>
        <div class="label is-bold">问题类别：</div><div class="value">
          <i>
            {{ConfirmDetail.AfterSaleQuestions.map(it => `${it.FirstQuestionTypeTitle}-${it.SecondQuestionTypeTitle}`).join('、')}}
          </i>
        </div>
      </li>
      <li class="form-box">
        <div class="label is-bold">责任占比：</div><div class="value" style="font-weight: 700;">
          <p v-if="ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 1)" class="is-pink" style="font-size: 14px;">
            业务中心 {{ ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 1).Proportion }}%
          </p>
          <p v-if="ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 2)">
            生产工厂 {{ ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 2).Proportion }}%
          </p>
          <p v-if="ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 3)">
            物流中心 {{ ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 3).Proportion }}%
          </p>
          <p v-if="ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 4)">
            配送中心 {{ ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 4).Proportion }}%
          </p>
        </div>
      </li>
      <template v-if="!ConfirmDetail.ResponsibilityIsAllowConfirm">
        <li class="form-box">
          <div class="label is-bold" style="min-width: 5em;text-align: right">责任人：</div><div class="value">
            <p v-for="it in ConfirmDetail.ResponsibilityPersons" :key="it">
              {{ it }}
            </p>
          </div>
        </li>
      </template>
      <template v-else>
        <li class="form-box" v-if="RelevantPerson && RelevantPerson.length && RelevantPerson.find(it => it.ResponsiblePersonType === 1)">
          <div class="label is-bold" style="min-width: 5em;text-align: right">责任人：</div><div class="value">
            <el-checkbox v-model="IsTakeOrders">接单客服
              <i>（{{RelevantPerson.find(it => it.ResponsiblePersonType === 1)?.ResponsiblePersonName}}）</i>
            </el-checkbox>
          </div>
        </li>
        <li class="form-box" v-if="RelevantPerson && RelevantPerson.length && RelevantPerson.find(it => it.ResponsiblePersonType === 2)">
          <div class="label is-bold" style="min-width: 5em;"></div><div class="value">
            <el-checkbox v-model="IsReader">审稿客服
              <i>（{{RelevantPerson.find(it => it.ResponsiblePersonType === 2)?.ResponsiblePersonName}}）</i>
            </el-checkbox>
          </div>
        </li>
        <li class="form-box">
          <div class="label is-bold" style="min-width: 5em;"></div><div class="value">
            <el-checkbox v-model="IsRests">其他责任人</el-checkbox>
            <el-input v-if="IsRests" v-model="RestsMsg" placeholder="请输入责任人名称" style="width: 150px;margin-left: 10px;"></el-input>
            <p v-if="IsRests" style="line-height: 20px;" class="is-gray">（确认责任时责任人必填，如果有多个其他责任人，请使用逗号分隔。）</p>
          </div>
        </li>
        <li>
          <div class="hint">
            <img src="@/assets/images/cancelWarning.png" alt="">
            <p>注：首次责任划分72小时后，系统会自动确认。</p>
            <p>如果对责任比例不接受，请尽快协商。</p>
            <p>系统自动确认时，责任人为空。</p>
          </div>
        </li>
      </template>
    </ul>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    ConfirmDetail: {
      type: Object,
      default: () => (null),
    },
    AfterSaleCode: {
      type: Number,
      default: 0,
    },
    OrderID: {
      type: Number,
      default: 0,
    },
  },

  components: {
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    ...mapState('AfterSale', ['QuestionClassList', 'ResponsibilityConfirmCondition']),
  },
  data() {
    return {
      IsTakeOrders: false, // 是否是接单
      IsReader: false, // 是否是接单
      IsRests: false, // 是否是其他
      RestsMsg: '', // 其他责任人
      RelevantPerson: null, // 售后相关人
      ProblemTypesList: [],
      submitForm: {
        AfterSaleCode: 0,
        ResponsibilityID: 0,
        ResponsiblePersons: [],
      },
    };
  },
  methods: {
    ...mapActions('AfterSale', ['getOrderAfterSaleQuestionClassList', 'getOrderAfterSaleResponsibilityConfirmList']),
    onGoBackClick() {
      this.$goback();
    },
    getQuestionClassList() {
      if (this.QuestionClassList.length === 0) {
        this.getOrderAfterSaleQuestionClassList({ searchType: 2 });
      }
    },
    getOrderAfterSaleRelevantPerson() {
      this.api.getOrderAfterSaleRelevantPerson(this.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.RelevantPerson = res.data.Data;
          console.log(res);
        }
      });
    },
    setResponsiblePersons() {
      this.submitForm.ResponsiblePersons = [];
      if (this.IsTakeOrders) {
        this.submitForm.ResponsiblePersons.push({
          ResponsiblePersonType: 1,
          ResponsiblePersonName: this.RelevantPerson.find(it => it.ResponsiblePersonType === 1)?.ResponsiblePersonName,
        });
      }
      if (this.IsReader) {
        this.submitForm.ResponsiblePersons.push({
          ResponsiblePersonType: 2,
          ResponsiblePersonName: this.RelevantPerson.find(it => it.ResponsiblePersonType === 2)?.ResponsiblePersonName,
        });
      }
      if (this.IsRests) {
        this.submitForm.ResponsiblePersons.push({
          ResponsiblePersonType: 3,
          ResponsiblePersonName: this.RestsMsg,
        });
      }
    },
    submit() {
      const temp = this.ConfirmDetail.AfterSaleResponsibilities.find(it => it.Department === 1);
      this.submitForm.AfterSaleCode = this.AfterSaleCode;
      this.submitForm.ResponsibilityID = temp.ResponsibilityID;
      this.setResponsiblePersons();
      if (!this.submitForm.ResponsiblePersons.length || this.submitForm.ResponsiblePersons.find(it => !it.ResponsiblePersonName)) {
        this.messageBox.failSingleError('操作失败', '请输入责任人');
      } else {
        this.api.getOrderAfterSaleResponsibilityConfirm(this.submitForm).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              this.getOrderAfterSaleResponsibilityConfirmList(this.ResponsibilityConfirmCondition.Page);
              this.onGoBackClick();
            };
            this.messageBox.successSingle('确认成功', cb, cb);
          }
        });
      }
    },
  },
  mounted() {
    Promise.all([this.getQuestionClassList(), this.getOrderAfterSaleRelevantPerson()]).then(() => {
      this.AfterSaleQuestions = this.ConfirmDetail.AfterSaleQuestions;
    });
  },
};
</script>

<style lang='scss'>
.responsibility-confirm-comp {
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
      line-height: 15px;
      .hint{
        background-color: #FFFBF6;
        padding: 5px 10px;
        padding-left: 40px;
        width: 348px;
        box-sizing: border-box;
        color: #F4A307;
        position: relative;
        font-size: 14px;
        line-height: 1.2em;
        img{
          position: absolute;
          left: 13px;
          top: 7px;
          width: 13px;
          height: 13px;
        }
      }
      &.form-box{
        .el-input, input{
          height: 35px;
        }
      }
      >.value{
        flex: 1;
        >p{
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          >.el-checkbox{
            .el-checkbox__label{
              font-size: 12px;
              color: #444;
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
