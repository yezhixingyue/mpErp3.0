<template>
  <section class="mp-erp-material-list-page-wrap">
    <header>
      <template v-if="Permission && Permission.PermissionList.PermissionMaterial.Obj.Setup">
        <el-button type="primary" @click="onAddClick">添加</el-button>
        <el-button type="primary" @click="onMassClick">批量生成</el-button>
      </template>
      <span class="title">物料类型：</span>
      <el-select v-model="type" filterable placeholder="请选择" size="small">
        <el-option
          v-for="(item, i) in options"
          :key="item.Name + i + item.ID"
          :label="item.Name"
          :value="item.ID">
        </el-option>
      </el-select>
    </header>
    <main>
      <MaterialListTableComp :loading='loading' :dataList='dataList' @edit='onEditClick' @remove='onRemoveClick' />
      <MaterialListSaveDialog :visible.sync='visible' :curData='saveData' @close='onDialogClose'
       :curMaterialType='curMaterialType || curEditMaterialType' @submitSuccess="onSaveSubmitSuccess" />
    </main>
    <footer>
      <CountComp
        :count='dataNumber'
        :watchPage='page'
        :handlePageChange='getTableDataList'
        center
      />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CountComp from '@/components/common/Count.vue';
import MaterialListTableComp from '@/components/Material/MaterialList/MaterialListTableComp.vue';
import MaterialListSaveDialog from '@/components/Material/MaterialList/MaterialListSaveDialog.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'MaterialListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-material-list-page-wrap .el-table__body-wrapper')],
  components: {
    CountComp,
    MaterialListTableComp,
    MaterialListSaveDialog,
  },
  computed: {
    ...mapState('basicSet', ['MaterialTypeList']),
    ...mapState('common', ['Permission']),
    options() {
      const item = { ID: '', Name: '不限' };
      if (!this.MaterialTypeList) return [item];
      return [item, ...this.MaterialTypeList];
    },
    curMaterialType() {
      if (!this.type) return null;
      const t = this.MaterialTypeList.find(it => it.ID === this.type);
      return t || null;
    },
  },
  data() {
    return {
      type: '',
      visible: false,
      saveData: null,
      dataNumber: 0,
      page: 1,
      pageSize: 30,
      dataList: [],
      loading: false,
      curEditMaterialType: null,
    };
  },
  methods: {
    onAddClick() {
      if (!this.curMaterialType) {
        this.messageBox.failSingleError('操作失败', '请先选择物料类型');
        return;
      }
      if (this.curMaterialType.ElementList.length === 0) {
        this.messageBox.failSingleError('操作失败', '当前物料类型尚未设置元素');
        return;
      }
      this.saveData = null;
      this.visible = true;
    },
    onMassClick() {
      if (!this.curMaterialType) {
        this.messageBox.failSingleError('操作失败', '请先选择物料类型');
        return;
      }
      if (this.curMaterialType.ElementList.length === 0) {
        this.messageBox.failSingleError('操作失败', '当前物料类型尚未设置元素,请检查该物料类型配置');
        return;
      }
      this.$router.push(`/MaterialMassProduction/${this.type}`);
    },
    async getTableDataList(page = 1) {
      if (this.loading) return;
      this.page = page;
      this.loading = true;
      this.dataList = [];
      const params = {
        type: this.type,
        page,
        pageSize: this.pageSize,
      };
      const resp = await this.api.getMaterialList(params).catch(() => {});
      this.loading = false;
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.dataList = resp.data.Data;
        this.dataNumber = resp.data.DataNumber;
      }
    },
    onSaveSubmitSuccess(isEdit, data) {
      if (!isEdit) {
        this.dataList.unshift(data);
      } else {
        const i = this.dataList.findIndex(it => it.ID === data.ID);
        if (i > -1) this.dataList.splice(i, 1, data);
      }
    },
    onEditClick(data) {
      this.saveData = data;
      this.visible = true;
      this.curEditMaterialType = null;
      const { ID } = data.Type;
      const t = this.MaterialTypeList.find(it => it.ID === ID);
      this.curEditMaterialType = t || null;
    },
    async onRemoveClick(data, index) {
      const resp = await this.api.getMaterialRemove(data.ID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          this.dataList.splice(index, 1);
          this.dataNumber -= 1;
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onDialogClose() {
      this.curEditMaterialType = null;
    },
  },
  watch: {
    type() {
      this.getTableDataList();
    },
  },
  mounted() {
    this.$store.dispatch('basicSet/getMaterialTypeList');
    this.getTableDataList();
  },
  activated() {
    const { init } = this.$route.query;
    if (init) {
      this.getTableDataList();
      this.$router.push({ query: {} });
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-material-list-page-wrap {
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
    > .title {
      font-size: 14px;
      color: #888E99;
      margin-left: 85px;
    }
    > .el-select {
      width: 130px;
    }
    .el-button + .el-button {
      margin-left: 25px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
    margin-right: 8px;
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
