<template>
  <CommonDialogComp
    width="600px"
    top='15vh'
    title="选择优惠券:"
    :visible="ProblemTypesVisible"
    cancelText='取消'
    @cancle="onCancle"
    @open='handleCouponDialogOpen'
    @closed='onCancle'
    @submit="onSelectClick"
    class="mp-erp-after-sales-problem-types-dialog-comp-wrap"
  >
    <ul class="problem-types-dialog-content">
      <li v-for="QuestionType in QuestionTypeList" :key="QuestionType.ID">
        <div class="label">
          {{ QuestionType.Name }}：
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox v-for="SonClass in QuestionType.SonClassList" :label="SonClass.Name" :key="SonClass.ID">{{SonClass.Name}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    backLabel: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    ProblemTypesVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      QuestionTypeList: [],

      checkedCities: [],
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    async getQuestionTypeList() {
      if (this.QuestionTypeList.length) return;
      // 获取所有问题
      const res = await this.api.getOrderAfterSaleQuestionClassList({ searchType: 1, ID: 'ec7d1141-ccfa-4316-b83c-b0bd01221c99' });
      if (res.data.Status === 1000) {
        console.log(res.data.Data);
        this.QuestionTypeList = res.data.Data.filter(item => item && item.SonClassList.length);
      }
    },
    handleCouponDialogOpen() {
      console.log('handleCouponDialogOpen');
      this.getQuestionTypeList();
    },
    onSelectClick() {
      console.log('onSelectClick');
    },
    onCancle() {
      this.$emit('close', false);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-after-sales-problem-types-dialog-comp-wrap{
  .el-dialog__body{
    padding: 20px 43px;
    padding-bottom: 0;
  }
  .problem-types-dialog-content{
    height: 448px;
    li{
      display: flex;
      .label{
        min-width: 5em;
        text-align: right;
        margin-right: 10px;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
      }
      .el-checkbox-group{
        .el-checkbox{
          margin-bottom: 4px;
        }
      }
      margin-bottom: 10px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
</style>
