<template>
  <section class="mp-erp-product-page-material-size-comp-left-conten-wrap">
    <header>
      <el-button type="primary" size="small" @click="onMaterialAddClick">+添加物料</el-button>
      <span class="title">物料提示名称：</span>
      <template v-if="!isTitleEditing">
        <span class="value">{{this.MaterialDisplayName}}</span>
        <span class="blue-span menu" @click="onTitleEditClick">编辑名称</span>
      </template>
      <template v-else>
        <el-input size="mini" v-model.trim="title" maxlength="10" show-word-limit @keyup.enter.native="onTitleSaveClick"></el-input>
        <span class="blue-span menu" @click="onTitleSaveClick">保存</span>
        <span class="red-span menu" @click="isTitleEditing = false">取消</span>
        <span class="tip">（可回车保存）</span>
      </template>
    </header>
    <main>
      <MaterialSelectDialog :visible.sync='visible' :dataList="MaterialAllList" :typeList='MaterialTypeList' />
    </main>
  </section>
</template>

<script>
import { normalNameReg } from '@/assets/js/utils/regexp';
import { mapState } from 'vuex';
import MaterialSelectDialog from './MaterialSelectDialog.vue';

export default {
  props: {
    curProduct: {
      type: Object,
      default: null,
    },
    curPart: {
      type: Object,
      default: null,
    },
  },
  components: {
    MaterialSelectDialog,
  },
  data() {
    return {
      title: '',
      isTitleEditing: false,
      visible: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['MaterialTypeList']),
    ...mapState('common', ['MaterialAllList']),
    MaterialDisplayName() {
      if (!this.curProduct) return '';
      return this.curPart ? this.curPart.MaterialDisplayName : this.curProduct.MaterialDisplayName;
    },
  },
  methods: {
    initData() {
      // if (!this.MaterialTypeList || !Array.isArray(this.MaterialTypeList) || this.MaterialTypeList.length === 0) {
      //   this.$store.dispatch('basicSet/getMaterialTypeList');
      // }
      this.$store.dispatch('basicSet/getMaterialTypeList');
      this.$store.dispatch('common/getMaterialAllList');
    },
    onTitleEditClick() { // 点击编辑物料提示名称
      this.title = this.MaterialDisplayName;
      this.isTitleEditing = true;
    },
    async onTitleSaveClick() { // 保存物料提示名称
      if (this.title === this.MaterialDisplayName) {
        this.messageBox.failSingle('物料提示名称未发生变化');
        return;
      }
      if (!this.title) {
        this.messageBox.failSingle('请输入物料提示名称');
        return;
      }
      if (!normalNameReg.test(this.title)) {
        this.messageBox.failSingle('只能使用中文、字母与数字组成');
        return;
      }
      const cb = () => { this.isTitleEditing = false; };
      const ProductID = this.curProduct.ID;
      const PartID = this.curPart ? this.curPart.ID : '';
      this.$store.dispatch('productManage/getMaterialDisplayNameChange', [ProductID, PartID, this.title, cb]);
    },
    onMaterialAddClick() { // 点击物料按钮添加
      if (!this.MaterialTypeList || this.MaterialTypeList.length === 0) {
        this.messageBox.failSingle('尚无物料相关设置，请先到物料管理里面进行设置');
        return;
      }
      this.visible = true;
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-page-material-size-comp-left-conten-wrap {
  > header {
    font-size: 13px;
    display: flex;
    align-items: center;
    .el-input {
      width: 200px;
      flex: none;
    }
    > span {
      color: #585858;
      flex: none;
      white-space: nowrap;
      &.title {
        color: #888E99;
        margin-left: 22px;
      }
      &.value {
        font-weight: 700;
        margin-right: 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &.menu {
        font-size: 12px;
      }
      &.blue-span {
        margin: 0 10px;
      }
      &.tip {
        font-size: 12px;
        color: #cbcbcb;
        margin-left: 8px;
      }
    }
  }
}
</style>
