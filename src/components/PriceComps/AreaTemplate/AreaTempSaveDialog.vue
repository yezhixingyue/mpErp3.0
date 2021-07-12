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
      <NewAreaTreeSpreadComp v-model="ruleForm.Range" :list='allAreaTreeList' />
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
          AreaList: [],
        },
      },
    };
  },
  methods: {
    onSubmit() { // 提交
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
    },
  },
  mounted() {
    this.$store.dispatch('common/getAreaList');
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-area-template-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    height: 560px;
    overflow-y: auto;
    > div.header {
      > span.label {
        font-size: 14px;
        color: #888E99;
      }
      > div.el-input {
        width: 350px;
      }
    }
  }

}
</style>
