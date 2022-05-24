<template>
  <CommonDialogComp
    width="880px"
    top='11vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-server-after-sale-question-change-dialog-comp-wrap"
  >
    <ul class="list">
      <li class="item">
        <span class="title">问题：</span>
        <div class="conent" >
          <div class="row" v-for="(item,index) in from.AfterSaleQuestions" :key="item.key">
            <el-select v-model="item.FirstQuestionType" @change="changeQuestions(index)" placeholder="请选择问题类型" size="small">
              <el-option
                v-for="it in FirstGradeQuestionType"
                :key="it.ID"
                :label="it.Name"
                :value="it.ID">
              </el-option>
            </el-select>
            <el-select v-model="item.SecondQuestionType" placeholder="请选择具体问题" size="small">
              <el-option
                v-for="it in SecondLevelQuestionType(index)"
                :key="it.ID"
                :label="it.Name"
                :value="it.ID">
              </el-option>
            </el-select>
            <el-input size="small" v-model="item.Remark" placeholder="在此输入备注信息" maxlength="200" show-word-limit></el-input>
            <div class="menus">
              <span @click="onQuestionsAddClick">
                <img src="@/assets/images/add.png" alt />添加</span>
              <span @click="onQuestionsRemoveClick(index)" v-if="true">
                <img src="@/assets/images/del.png" alt />删除</span>
              <span v-else class="disabled">
                <img src="@/assets/images/del-disabled.png" alt />删除</span>
            </div>
          </div>
        </div>
      </li>
      <li class="item">
        <span class="title">责任部门：</span>
        <div class="conent" >
          <div class="row" v-for="(item,index) in from.AfterSaleResponsibilities" :key="item.key">
            <el-select v-model="item.Department" placeholder="请选择责任部门" size="small">
              <el-option
                v-for="it in DepartmentList"
                :key="it.ID"
                :label="it.Title"
                :value="it.ID">
              </el-option>
            </el-select>
            <el-input-number :min="0" :max="100" :controls="false" v-model="item.Proportion" placeholder="输入责任比例" size="small">
            </el-input-number>
            %
            <div class="menus">
              <span @click="onDepartmentAddClick">
                <img src="@/assets/images/add.png" alt />添加</span>
              <span @click="onDepartmentRemoveClick(index)" v-if="true">
                <img src="@/assets/images/del.png" alt />删除</span>
              <span v-else class="disabled">
                <img src="@/assets/images/del-disabled.png" alt />删除</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    ...mapState('common', ['DepartmentList']),
    FirstGradeQuestionType() {
      return this.QuestionTypeList?.filter(res => res.ParentID === -1);
    },
    SecondLevelQuestionType() {
      return (index) => this.QuestionTypeList?.filter(res => res.ParentID === this.from?.AfterSaleQuestions[index].FirstQuestionType);
    },
  },
  data() {
    return {
      title: '问题修改',
      QuestionList: [],
      QuestionTypeList: null,
      SecondQuestionType: '',
      from: {
        AfterSaleCode: '',
        AfterSaleQuestions: [
          {
            AfterSaleCode: '',
            SecondQuestionType: '',
            FirstQuestionType: '',
            Remark: '',
          },
        ],
        AfterSaleResponsibilities: [
          {
            AfterSaleCode: '',
            Department: '',
            Proportion: '',
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      if (!this.curData) return;
      // 校验
      // this.messageBox.failSingleError('保存失败', `第${i + 1}行数据不完整， 请检查并补充完整`);
      this.getServiceQuestionChange();
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.QuestionList = [];
    },
    changeQuestions(index) {
      this.from.AfterSaleQuestions[index].SecondQuestionType = '';
    },
    async initEditData() { // 数据初始化方法
      if (this.curData) {
        this.getQuestionTypeList();

        // this.getServiceDetail(this.curData.ID);
        this.$store.dispatch('common/getAfterSalesDepartmentList');
      }
    },
    async getQuestionTypeList() {
      // 所有问题
      const res = await this.api.getQuestionList();
      if (res.data.Status === 1000) {
        this.QuestionTypeList = res.data.Data;
        // 需要用到问题父级id
        this.getResultDetail();
      }
    },
    async getResultDetail() {
      // 已有的数据
      const res = await this.api.getResultDetail(this.curData.AfterSaleCode);
      if (res.data.Status === 1000) {
        this.from = res.data.Data;
        if (res.data.Data.AfterSaleQuestions.length) {
          this.from.AfterSaleQuestions = res.data.Data.AfterSaleQuestions.map(it => {
            const _it = it;
            const temp = this.QuestionTypeList.filter(item => item.ID === _it.SecondQuestionType);
            _it.FirstQuestionType = temp.length ? temp[0].ParentID : -1;
            return _it;
          });
        } else {
          this.onQuestionsAddClick();
        }
        if (!res.data.Data.AfterSaleResponsibilities.length) {
          this.onDepartmentAddClick();
        }
      }
    },

    onQuestionsAddClick() {
      const item = {
        AfterSaleCode: this.curData.AfterSaleCode,
        SecondQuestionType: '',
        FirstQuestionType: '',
        Remark: '',
        key: Math.random().toString(36).slice(-8),
      };
      this.from.AfterSaleQuestions.push(item);
    },
    onQuestionsRemoveClick(i) {
      this.from.AfterSaleQuestions.splice(i, 1);
    },
    onDepartmentAddClick() {
      const item = {
        AfterSaleCode: this.curData.AfterSaleCode,
        Department: '',
        Proportion: undefined,
        key: Math.random().toString(36).slice(-8),
      };
      this.from.AfterSaleResponsibilities.push(item);
    },
    onDepartmentRemoveClick(i) {
      this.from.AfterSaleResponsibilities.splice(i, 1);
    },
    async getServiceQuestionChange() {
      const AfterSaleResponsibilitiesIsNull = this.from.AfterSaleResponsibilities.some(res => !res.Department || !res.Proportion);
      const AfterSaleQuestionsIsNull = this.from.AfterSaleQuestions.some(res => !res.SecondQuestionType || !res.FirstQuestionType || !res.Remark);
      if (AfterSaleResponsibilitiesIsNull || AfterSaleQuestionsIsNull) {
        this.messageBox.failSingleError('保存失败', AfterSaleQuestionsIsNull ? '请选择问题数据并输入备注' : '请选择责任部门并输入责任比例');
        return;
      }
      this.from.AfterSaleCode = this.curData.AfterSaleCode;
      const resp = await this.api.getSaveResult(this.from).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.onCancle();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-server-after-sale-question-change-dialog-comp-wrap {

  .el-dialog{
    .el-dialog__header{
       span::before{
          display: inline-block;
          background: url('../../../assets/images/xiugai.png') no-repeat center #26BCF9;
          background-size: 15px 15px;
          content: "";
          display: inline-block;
          height: 19px;
          width: 19px !important;
          vertical-align: -15%;
          margin-right: 10px;
          border-radius: 50%;
       }
    }
  }
  .el-dialog__body {
    padding-left: 30px;
    margin-top:30px;
    overflow-y: overlay;
    > .list {
      max-height: 520px;
      > .item {
        display: flex;
        // align-items: center;
        margin-bottom: 15px;
        > .title {
          font-size: 14px;
          color: #585858;
          font-weight: 700;
          line-height: 32px;
          margin-right: 4px;
          width: 5em;
          text-align: right;
        }
        .conent{
          flex: 1;
          .row{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            > .el-cascader {
              width: 140px;
              flex: none;
              margin-right: 10px;
              > .el-input {
                display: flex;
                align-items: center;
                .el-input__inner {
                  border: none;
                  border-bottom: 1px solid #eee;
                  font-size: 12px;
                  color: #585858;
                  border-radius: 0;
                  &::placeholder {
                    color: #ccc;
                  }
                }
              }
            }
            > .el-select{
              width: 130px;
              flex: none;
              margin-right: 18px;
              .el-input__inner {
                border: none;
                border-bottom: 1px solid #eee;
                font-size: 12px;
                color: #585858;
                border-radius: 0;
                &::placeholder {
                  color: #ccc;
                }
              }
              &:first-of-type {
                .el-input__inner {
                  &::placeholder {
                    color: #888;
                  }
                }
              }
            }
            > .el-input {
              margin-right: 18px;
              flex: 1;
              .el-input__inner {
                font-size: 12px;
                color: #989898;
                padding-right: 63px;
                &::placeholder {
                  color: #ccc;
                }
              }
            }
            .el-input-number{
              margin-right: 15px;
            }
            > .menus {
              padding-left: 2px;
              > span {
                font-size: 12px;
                color: #999;
                margin: 0 13px;
                transition: color 0.1s ease-in-out;
                user-select: none;
                &:not(.disabled){
                  cursor: pointer;
                  &:hover {
                    color: #444;
                  }
                }
                > img {
                  vertical-align: bottom;
                  margin-right: 6px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.el-cascader-menu__wrap {
  height: 360px;
}
</style>
