<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-item-save-dialog-comp-wrap"
  >
    <div class="header">
      <p>
        <span class="label">产品：</span>
        <span>{{productTitle}}</span>
      </p>
      <p>
        <span class="label">分组名称：</span>
        <el-input size="small" v-model.trim="ruleForm.Name" maxlength="10" show-word-limit></el-input>
      </p>
    </div>
    <div class="content">
      <p class="mp-common-title-wrap">
        <span>适用区域</span>
        <RangeTemplateSelector @select="handleRabfeTempSelect" :selectedID='selectedTempID' />
      </p>
      <NewAreaTreeSpreadComp v-model="ruleForm.Range" :list='allAreaTreeList' />
      <p class="mp-common-title-wrap" style="margin-top:25px">
        <span>适用等级价格</span>
      </p>
      <el-checkbox-group v-model="ruleForm.GradeList">
        <el-checkbox :label="it.CategoryID" v-for="it in userRankListNoneEmpty" :key="it.CategoryID">{{it.CategoryName}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="footer">
      <p class="tips-box is-pink"><i class="el-icon-warning"></i>注：新加区域指后续如果有新增加的区域是否自动适用。选中则自动适用，不选中则不会自动适用。</p>
    </div>
  </CommonDialogComp>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import NewAreaTreeSpreadComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp';
import RangeTemplateSelector from './RangeTemplateSelector.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    EditData: {
      type: Object,
      default: null,
    },
    productTitle: {
      type: String,
      default: '',
    },
    OpenType: {
      type: String,
      default: 'save',
    },
  },
  components: {
    CommonDialogComp,
    NewAreaTreeSpreadComp,
    RangeTemplateSelector,
  },
  computed: {
    ...mapGetters('common', ['allAreaTreeList']),
    ...mapState('common', ['userRankListNoneEmpty']),
  },
  data() {
    return {
      title: '添加价格',
      ruleForm: {
        ID: '',
        Name: '',
        Range: {
          IsIncludeIncreased: false,
          List: [],
        },
        GradeList: [],
      },
      selectedTempID: '',
    };
  },
  methods: {
    onSubmit() { // 提交
      const bool = this.formDataChecker();
      if (bool) {
        const { ID, Name, Range, GradeList } = this.ruleForm;
        const { IsIncludeIncreased, List } = Range;
        const list = this.userRankListNoneEmpty.filter(it => GradeList.includes(it.CategoryID)).map(it => ({ ID: it.CategoryID, Name: it.CategoryName }));
        const temp = { ID, Name, AreaList: List, IsIncludeIncreasedArea: IsIncludeIncreased, GradeList: list };
        this.$emit('submit', temp);
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      this.title = this.EditData ? '编辑价格' : '添加价格';
      if (this.OpenType === 'copy') this.title = '拷贝价格';
      const ID = this.EditData ? this.EditData.ID : '';
      const Name = this.EditData ? this.EditData.Name : '';
      const IsIncludeIncreased = this.EditData ? this.EditData.IsIncludeIncreasedArea : false;
      const List = this.EditData ? this.EditData.AreaList : [];
      const GradeList = this.EditData ? this.EditData.GradeList.map(it => it.ID) : [];
      this.ruleForm.ID = ID;
      this.ruleForm.Name = Name;
      this.ruleForm.Range.IsIncludeIncreased = IsIncludeIncreased;
      this.ruleForm.Range.List = List;
      this.ruleForm.GradeList = GradeList;
    },
    formDataChecker() {
      if (!this.ruleForm.Name) {
        this.messageBox.failSingleError('保存失败', '请输入价格名称');
        return false;
      }
      if (this.ruleForm.Range.List.length === 0 && !this.ruleForm.Range.IsIncludeIncreased) {
        this.messageBox.failSingleError('保存失败', '请选择适用区域');
        return false;
      }
      if (!this.ruleForm.GradeList || this.ruleForm.GradeList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择适用等级价格');
        return false;
      }
      return true;
    },
    handleRabfeTempSelect(tempData) {
      if (!tempData) return;
      const { ID, AreaList, IsIncludeIncreasedArea } = tempData;
      this.ruleForm.Range.IsIncludeIncreased = IsIncludeIncreasedArea;
      this.ruleForm.Range.List = AreaList;
      this.selectedTempID = ID;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    padding-bottom: 10px;
    height: 580px;
    display: flex;
    flex-direction: column;
    > div.header {
      flex: none;
      > p {
        margin-bottom: 15px;
        line-height: 28px;
        display: flex;
        align-items: center;
        span {
          color: #585858;
        }
        & + p {
          margin-bottom: 5px;
        }
      }
      span.label {
        font-size: 14px;
        color: #888E99;
        min-width: 5em;
        text-align: right;
        margin-right: 4px;
      }
      div.el-input {
        width: 350px;
      }
    }
    > .content {
      flex: 1;
      padding-top: 20px;
      overflow-y: auto;
      > .mp-common-title-wrap {
        color: #585858;
        padding-bottom: 12px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .blue-span {
          font-weight: 400;
          margin-left: 35px;
        }
      }
      > .el-checkbox-group {
        margin-top: 10px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
      }
    }
    > .footer {
      flex: none;
      padding-left: 45px;
      padding-top: 20px;
      > p {
        width: 650px;
      }
    }
  }

}
</style>
