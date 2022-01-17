<template>
  <section class="mp-erp-file-manage-page-wrap">
    <header v-if="Permission && Permission.PermissionList.PermissionFileCategory.Obj.Setup">
      <el-button type="primary" class="blue-full-color-btn-styles is-blue-button" @click="onFileSetClick(null)">添加文件类目</el-button>
    </header>
    <main>
      <FileClassifyDialogComp :visible.sync='visible' @submit='onFileSaveSubmit' :curData='SaveData' :FileTypeList='FileTypeList' />
      <FileClassifyTableComp :dataList='FileDataList' @edit='onFileSetClick' @remove='onFileRemove' :loading='isTableDataLoading' :FileTypeList='FileTypeList'/>
    </main>
    <footer>
      <span>共检索出 <i>{{FileDataList.length}}</i> 条数据</span>
    </footer>
  </section>
</template>

<script>
import FileClassifyDialogComp from '@/components/FileClassify/FileClassifyDialogComp.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';
import FileClassifyTableComp from '../../components/FileClassify/FileClassifyTableComp.vue';

export default {
  name: 'FileSetupPage',
  mixins: [recordScrollPositionMixin('.mp-erp-file-manage-page-wrap .el-table__body-wrapper')],
  components: {
    FileClassifyDialogComp,
    FileClassifyTableComp,
  },
  data() {
    return {
      visible: false,
      SaveData: null,
      isTableDataLoading: false,
    };
  },
  computed: {
    ...mapState('common', ['FileDataList', 'FileTypeList', 'Permission']),
  },
  methods: {
    onFileSetClick(data) { // 添加 或 编辑
      this.SaveData = data || null;
      this.visible = true;
    },
    async onFileSaveSubmit(data) {
      const ID = await this.$store.dispatch('common/getFileInfoSave', data);
      if (ID) {
        const isEdit = !!((data.ID || data.ID === 0));
        const _title = isEdit ? '编辑成功' : '添加成功';
        const callback = () => { this.handleSaveSuccess({ isEdit, data, ID }); };
        this.messageBox.successSingle(_title, callback, callback);
      }
    },
    handleSaveSuccess({ isEdit, data, ID }) {
      this.$store.commit('common/setFileSaveSuccess', { isEdit, data, ID });
      this.visible = false;
    },
    onFileRemove(data) {
      if (!data) return;
      const { ID, Name } = data;
      if ((!ID && ID !== 0) || !Name) return;
      this.messageBox.warnCancelBox('确定删除该文件类目吗', `类目名称：[ ${Name} ]`, () => {
        this.$store.dispatch('common/getFileInfoRemove', ID);
      });
    },
    fetchFileTypeList() {
      this.$store.dispatch('common/getFileTypeList');
    },
    async fetchTableDataList() {
      this.isTableDataLoading = true;
      await this.$store.dispatch('common/getFileInfoList');
      this.isTableDataLoading = false;
    },
  },
  mounted() {
    this.fetchFileTypeList();
    this.fetchTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-file-manage-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    height: 60px;
    padding: 15px 20px;
    background-color: #fff;
    box-sizing: border-box;
    > button {
      border-radius: 2px;
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
  }
  > footer {
    flex: none;
    height: 16px;
    background-color: #fff;
    font-size: 13px;
    padding: 10px 20px;
    padding-right: 65px;
    line-height: 16px;
    color: #585858;
    text-align: right;
    i {
      color: #26bcf9;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
