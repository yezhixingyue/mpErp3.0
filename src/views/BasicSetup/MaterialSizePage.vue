<template>
  <section class="mp-erp-material-size-manage-page-wrap">
    <header>
      <el-button type="primary" class="blue-full-color-btn-styles is-blue-button" @click="onMaterialSizeSaveClick(null)">添加尺寸</el-button>
    </header>
    <main>
      <MaterialSizeSaveDialog :visible.sync='visible' :curData='saveData' @submit="onSaveSubmit" />
      <MaterialSizeTableComp :dataList='MaterialSizeList' :loading='tableLoading' @edit='onMaterialSizeSaveClick' @remove='onRemoveClick' />
    </main>
    <footer>
      <count-comp
        :count='MaterialSizeListDataNumber'
        :watchPage='MaterialSizePage'
        :handlePageChange='getTableDataList'
        center
        />
      <!-- <span>共检索出 <i>{{MaterialSizeListDataNumber}}</i> 条数据</span> -->
    </footer>
  </section>
</template>

<script>
import MaterialSizeSaveDialog from '@/components/Material/MaterialSize/MaterialSizeSaveDialog.vue';
import MaterialSizeTableComp from '@/components/Material/MaterialSize/MaterialSizeTableComp.vue';
import CountComp from '@/components/common/Count.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';

export default {
  name: 'MaterialSizePage',
  mixins: [recordScrollPositionMixin('.mp-erp-material-size-manage-page-wrap .el-table__body-wrapper')],
  components: {
    MaterialSizeSaveDialog,
    MaterialSizeTableComp,
    CountComp,
  },
  data() {
    return {
      visible: false,
      saveData: null,
      tableLoading: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['MaterialSizeList', 'MaterialSizeListDataNumber', 'MaterialSizePage']),
  },
  methods: {
    onMaterialSizeSaveClick(data) {
      this.saveData = data || null;
      this.visible = true;
    },
    async onSaveSubmit(data) { // 印刷幅面保存
      const ID = await this.$store.dispatch('basicSet/getMaterialSizeSave', data);
      if (ID) {
        const isEdit = !!((data.ID || data.ID === 0));
        const _title = isEdit ? '编辑成功' : '添加成功';
        const callback = () => { this.handleSaveSuccess({ isEdit, data, ID }); };
        this.messageBox.successSingle(_title, callback, callback);
      }
    },
    handleSaveSuccess({ isEdit, data, ID }) { // 印刷幅面保存成功后处理函数
      this.$store.commit('basicSet/setMaterialSizeSaveSuccess', { isEdit, data, ID });
      this.visible = false;
    },
    async getTableDataList(page = 1) {
      this.tableLoading = true;
      await this.$store.dispatch('basicSet/getMaterialSizeList', page);
      this.tableLoading = false;
    },
    onRemoveClick(data) {
      if (!data) return;
      this.messageBox.warnCancelBox('确定删除该物料尺寸吗', `尺寸名称：[ ${data.Name} ]`, () => {
        this.$store.dispatch('basicSet/getMaterialSizeRemove', data.ID);
      });
    },
  },
  mounted() {
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-material-size-manage-page-wrap {
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
    height: 45px;
    background-color: #fff;
    font-size: 13px;
    // padding: 10px 20px;
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
