<template>
  <CommonDialogComp
    width="600px"
    top='15vh'
    title="选择问题类别:"
    :visible="ProblemTypesVisible"
    cancelText='取消'
    @cancle="onCancle"
    @open="onOpen"
    @closed='onCancle'
    @submit="onSelectClick"
    class="mp-erp-after-sales-problem-types-dialog-comp-wrap"
  >
    <ul class="problem-types-dialog-content">
      <li v-for="QuestionType in SolutionQuestion" :key="QuestionType.ID">
        <div class="label">
          {{ QuestionType.Name }}：
        </div>
        <div>
          <el-checkbox  v-for="SonClass in QuestionType.SonClassList" :key="SonClass.ID"
          :checked="!!actionTypes.find(it => it.ID === SonClass.ID)"
          @change="(check) => checkChange(check, SonClass)">{{SonClass.Name}}</el-checkbox>
        </div>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    selectKeys: {
      type: Array,
      default: () => [],
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
  computed: {
    ...mapState('AfterSale', ['QuestionClassList']),
    SolutionQuestion() {
      return this.QuestionClassList.map(element => {
        const temp = element.SonClassList.map(it => ({ ...it, ParentID: element.ID, ParentName: element.Name }));
        return { ...element, SonClassList: temp };
      });
    },
  },
  data() {
    return {
      actionTypes: [],
    };
  },
  methods: {
    ...mapActions('AfterSale', ['getOrderAfterSaleQuestionClassList']),
    onSelectClick() {
      this.$emit('select', [...this.actionTypes]);
      this.onCancle();
    },
    onCancle() {
      this.$emit('close', false);
    },
    onOpen() {
      this.actionTypes = [...this.selectKeys];
    },
    checkChange(check, item) {
      if (check) {
        this.actionTypes.push(item);
      } else {
        this.actionTypes = this.actionTypes.filter(it => it.ID !== item.ID);
      }
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
    overflow-y: auto;
    li{
      display: flex;
      .label{
        min-width: 6em;
        text-align: right;
        margin-right: 10px;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
      }
      .el-checkbox{
        margin-bottom: 4px;
        margin: 0;
        width: 105px;
        .el-checkbox__label{
          padding-left: 5px;
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
