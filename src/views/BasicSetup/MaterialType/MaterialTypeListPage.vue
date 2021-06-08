<template>
  <section class="mp-erp-material-type-page-wrap">
    <header>
      <el-button type="primary" @click="onMaterialTypeSaveClick(null)">添加物料类型</el-button>
      <span class="info" @click="drawer = true" title="点击查看">
        <i>?</i>
        <em>元素组合说明</em>
      </span>
    </header>
    <main>
      <ExplainDrawer :visible.sync='drawer' />
      <MaterialTypeSaveDialog :visible.sync='visible' :curData='curSaveData' @submit="onElementSetSubmit" />
      <UnionShowDialogComp :visible.sync='unionShowVisible' :curData='curSaveData' @submit="onUnionShowSetSaveSubmit"  /> <!-- 该组件目标设为公共组件 -->
      <MaterialTypeTableComp
       :loading='listDataLoading'
       :dataList='MaterialTypeList'
        @edit='onMaterialTypeSaveClick'
        @remove='onRemoveClick'
        @setElement='onSetElementClick'
        @setUnionShow='onSetUnionShowClick'
        @setFormula='onSetFormulaClick'
       />
    </main>
    <footer>
      <span>共检索出 <i>{{MaterialTypeList.length}}</i> 条数据</span>
    </footer>
  </section>
</template>

<script>
import ExplainDrawer from '@/components/Material/MaterialType/ExplainDrawer.vue';
import MaterialTypeSaveDialog from '@/components/Material/MaterialType/MaterialTypeSaveDialog.vue';
import MaterialTypeTableComp from '@/components/Material/MaterialType/MaterialTypeTableComp.vue';
import UnionShowDialogComp from '@/components/Material/MaterialType/UnionShowDialogComp.vue';
import { mapState } from 'vuex';

export default {
  components: {
    ExplainDrawer,
    MaterialTypeSaveDialog,
    MaterialTypeTableComp,
    UnionShowDialogComp,
  },
  data() {
    return {
      drawer: false,
      visible: false,
      unionShowVisible: false,
      curSaveData: null,
      listDataLoading: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['MaterialTypeList']),
  },
  methods: {
    onMaterialTypeSaveClick(data) {
      this.curSaveData = data || null;
      this.visible = true;
    },
    async onElementSetSubmit(saveData) { // 物料类型保存： 添加 | 编辑
      if (!saveData) return;
      const isEdit = !!saveData.ID;
      const resp = await this.api.getMaterialTypeSave(saveData).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const temp = {
          isEdit,
          data: saveData,
          ID: resp.data.Data,
        };
        const callback = () => { this.handleEditSubmitSuccess(temp); };
        const msg = isEdit ? '编辑成功' : '添加成功';
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
    handleEditSubmitSuccess({ isEdit, data, ID }) { // 添加|编辑成功后的处理方法
      this.$store.commit('basicSet/setMaterialTypeSave', { isEdit, data, ID });
      this.visible = false;
    },
    onRemoveClick(itemData) {
      if (!itemData) return;
      this.messageBox.warnCancelBox('确定删除该物料类型吗', `类型名称：[ ${itemData.Name} ]`, () => {
        this.$store.dispatch('basicSet/getMaterialTypeRemove', itemData.ID);
      });
    },
    onSetElementClick(itemData) {
      if (!itemData || !itemData.ID) return;
      this.$router.push(`/MaterialElementSet/${itemData.ID}/${itemData.Name}`);
    },
    onSetUnionShowClick(itemData) {
      this.curSaveData = itemData;
      this.unionShowVisible = true;
    },
    async onUnionShowSetSaveSubmit(data) {
      if (!this.curSaveData || !data) return;
      const temp = { UnionShowList: data, ID: this.curSaveData.ID };
      const res = await this.api.getMaterialTypeElementUnionShowSetup(temp).catch(() => {});
      if (res && res.status === 200 && res.data.Status === 1000) {
        // 关闭弹窗 处理数据变化
        const callback = () => {
          this.$store.commit('basicSet/setMaterialTypeUnionShowListChange', temp);
          this.unionShowVisible = false;
        };
        this.messageBox.successSingle('设置成功', callback, callback);
      }
    },
    onSetFormulaClick(itemData) {
      if (!itemData || !itemData.ID) return;
      this.$router.push(`/MaterialFormulaList/${itemData.ID}/${itemData.Name}`);
    },
    async getListData() {
      this.listDataLoading = true;
      await this.$store.dispatch('basicSet/getMaterialTypeList');
      this.listDataLoading = false;
    },
  },
  mounted() {
    this.getListData();
  },
};
</script>
<style lang='scss'>
.mp-erp-material-type-page-wrap {
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
    display: flex;
    align-items: center;
    > button {
      border-radius: 2px;
      width: 120px;
      height: 30px;
      padding: 0;
    }
    > .info {
      margin-left: 60px;
      height: 20px;
      padding: 0 15px;
      border-left: 1px solid #eee;
      display: flex;
      align-items: center;
      cursor: pointer;
      > i {
        color: #ff3769;
        font-size: 12px;
        margin-right: 6px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid #ff3769;
        line-height: 15px;
        text-align: center;
      }
      > em, > i {
        transition: 0.1s ease-in-out;
        user-select: none;
      }
      font-size: 12px;
      color: #a2a2a2;
      line-height: 20px;
      &:hover {
        > em {
          color: #666;
        }
        > i {
          font-weight: 700;
        }
      }
      &:active {
        > em {
          color: #022355;
        }
        > i {
          background-color: #f5f5f5;
        }
      }
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
