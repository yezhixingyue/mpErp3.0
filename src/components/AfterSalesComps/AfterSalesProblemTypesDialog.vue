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
      <li v-for="QuestionType in SolutionQuestion" :key="QuestionType.ID" v-show="QuestionType.SonClassList && QuestionType.SonClassList.length">
        <div class="label" :title="QuestionType.Name">
          {{ QuestionType.Name }}：
        </div>
        <div class="value">
          <el-checkbox  v-for="SonClass in QuestionType.SonClassList" :key="SonClass.ID"
          :checked="!!actionTypes.find(it => it.ID === SonClass.ID)"
          @change="(check) => checkChange(check, SonClass)"><p :title="SonClass.Name">{{SonClass.Name}}</p></el-checkbox>
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
    padding: 20px 40px;
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
        max-width: 6em;
      }
      .value{
        display: flex;
        flex-wrap: wrap;
      }
      .el-checkbox{
        margin-bottom: 4px;
        margin: 0;
        width: 105px;
        vertical-align: top;
        display: flex;
        align-items: center;
        .el-checkbox__label{
          p{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          padding-left: 5px;
          width: calc(100% - 14px);
        }
        .el-checkbox__input{
          margin-top: 2px;
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
