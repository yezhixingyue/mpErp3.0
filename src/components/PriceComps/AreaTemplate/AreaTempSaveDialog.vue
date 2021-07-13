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
    class="mp-erp-comps-price-module-area-template-save-dialog-comp-wrap"
  >
    <div class="header">
      <span class="label">模板名称：</span>
      <el-input size="small" v-model.trim="ruleForm.Name" maxlength="10" show-word-limit></el-input>
    </div>
    <div class="content">
      <p class="mp-common-title-wrap">适用区域</p>
      <NewAreaTreeSpreadComp v-model="ruleForm.Range" :list='allAreaTreeList' />
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
  },
  components: {
    CommonDialogComp,
    NewAreaTreeSpreadComp,
  },
  computed: {
    ...mapGetters('common', ['allAreaTreeList']),
    ...mapState('common', ['areaList']),
  },
  data() {
    return {
      title: '新建模板',
      ruleForm: {
        ID: '',
        Name: '',
        Range: {
          IsIncludeIncreased: false,
          List: [],
        },
      },
    };
  },
  methods: {
    onSubmit() { // 提交
      const bool = this.formDataChecker();
      if (bool) {
        const { ID, Name, Range } = this.ruleForm;
        const { IsIncludeIncreased, List } = Range;
        const temp = { ID, Name, AreaList: List, IsIncludeIncreasedArea: IsIncludeIncreased };
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
      this.title = this.EditData ? '编辑模板' : '新建模板';
      const ID = this.EditData ? this.EditData.ID : '';
      const Name = this.EditData ? this.EditData.Name : '';
      const IsIncludeIncreased = this.EditData ? this.EditData.IsIncludeIncreasedArea : false;
      const List = this.EditData ? this.EditData.AreaList : [];
      this.ruleForm.ID = ID;
      this.ruleForm.Name = Name;
      this.ruleForm.Range.IsIncludeIncreased = IsIncludeIncreased;
      this.ruleForm.Range.List = List;
    },
    formDataChecker() {
      if (!this.ruleForm.Name) {
        this.messageBox.failSingleError('保存失败', '请输入模板名称');
        return false;
      }
      if (!this.ruleForm.Range.List.length === 0 && !this.ruleForm.Range.IsIncludeIncreased) {
        this.messageBox.failSingleError('保存失败', '请选择适用区域');
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-area-template-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    padding-bottom: 10px;
    height: 580px;
    display: flex;
    flex-direction: column;
    > div.header {
      flex: none;
      > span.label {
        font-size: 14px;
        color: #888E99;
      }
      > div.el-input {
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
