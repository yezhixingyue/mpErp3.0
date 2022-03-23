<template>
  <section class="mp-erp-logistic-manage-list-page-wrap">
    <header>
      <div>
        <el-button type="primary" @click="onItemSaveClick(null)">+添加物流快递</el-button>
      </div>
    </header>
    <main>
      <LogisticTableComp v-if="false" ref="SortTable" :dataList='logisticList' :sorting='sorting' />
      <LogisticItemSaveDialog :visible.sync="visible" :edit-data="curEditItem" @submit="handleItemSave" :list='logisticList' />
    </main>
    <footer>
      <template v-if="!sorting">
        <el-button @click="onSortingClick" class="cancel-blue-btn">排序</el-button>
      </template>
      <template v-else>
        <el-button @click="submitSort" type="primary">保存</el-button>
        <el-button @click="cancelSort" class="cancel-blue-btn">取消</el-button>
      </template>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import LogisticTableComp from '../../components/LogisticManage/LogisticTableComp.vue';
import LogisticItemSaveDialog from '../../components/LogisticManage/LogisticItemSaveDialog';

export default {
  name: 'LogisticManageListPage',
  components: {
    LogisticTableComp,
    LogisticItemSaveDialog,
  },
  data() {
    return {
      visible: false,
      curEditItem: null,
      sorting: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['logisticList']),
  },
  methods: {
    onItemSaveClick(data) { // 添加|编辑物流快递
      this.curEditItem = data;
      this.visible = true;
    },
    handleItemSave(data) { // 物流快递保存 编辑|新增
      const callback = () => {
        this.visible = false;
      };
      this.$store.dispatch('basicSet/getLogisticItemSave', { data, callback });
    },
    onSortingClick() { // 排序
      if (!this.tableData || this.tableData.length === 0) return;
      this.sorting = true;
    },
    submitSort() {
      // console.log('submitSort', this.$refs.SortTable.handleSortSubmit());
    },
    cancelSort() {
      // 此处执行原始表格数据还原 已不需要 只执行关闭
      this.sorting = false;
    },
  },
  mounted() {
    this.$store.dispatch('basicSet/getLogisticList');
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-manage-list-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    background-color: #f5f5f5;
    height: 90px;
    width: 100%;
    flex: none;
    > div {
      width: 100%;
      height: 80px;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding-left: 26px;
      box-sizing: border-box;
      > button {
        border-radius: 2px;
        width: 130px;
        height: 35px;
        padding: 0;
      }
    }
  }
  > main {
    flex: 1;
  }
  > footer {
    flex: none;
    text-align: center;
    padding-bottom: 25px;
    padding-top: 25px;
    button.el-button {
      width: 120px;
      height: 35px;
      border-radius: 2px;
      padding: 0;
      & + button.el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
