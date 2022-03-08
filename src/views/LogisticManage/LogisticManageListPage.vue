<template>
  <section class="mp-erp-logistic-manage-list-page-wrap">
    <header>
      <div>
        <el-button type="primary" @click="onItemSaveClick(null)">+添加物流快递</el-button>
      </div>
    </header>
    <main>
      <LogisticTableComp v-if="false" ref="SortTable" :dataList='tableData' :sorting='sorting' />
      <LogisticItemSaveDialog :visible.sync="visible" :edit-data="curEditItem" />
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
import LogisticTableComp from '../../components/LogisticManageComps/LogisticTableComp.vue';
import LogisticItemSaveDialog from '../../components/LogisticManageComps/LogisticItemSaveDialog';

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
      tableData: [
        {
          date: '2016-05-02',
          name: '京东物流[外]',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '中通快递[外]',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '名片之家[外]',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '顺丰快递物流[外]',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    };
  },
  methods: {
    onItemSaveClick(data) { // 添加|编辑物流快递
      this.curEditItem = data;
      this.visible = true;
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
