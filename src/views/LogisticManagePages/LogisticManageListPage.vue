<template>
  <section class="mp-erp-logistic-manage-list-page-wrap">
    <header v-if="localPermission.Setup">
      <div>
        <el-button type="primary" @click="onItemSaveClick(null)" :disabled="sorting">+添加物流快递</el-button>
      </div>
    </header>
    <main>
      <LogisticTableComp
        ref="SortTable"
        :dataList='logisticList'
        :sorting='sorting'
        :ThirdPlatExpressList='ThirdPlatExpressList'
        :ExpressProductList='ExpressProductList'
        :loading='loading'
        @edit="onItemSaveClick"
        @remove='handleRemove'
        @setPrice='onSetPriceClick'
        @linkRelation='onRelationLinkClick'
        @linkPrintedSheet='onPrintedSheetLinkClick'
        @linkStation='onStationLinkClick'
       />
      <LogisticItemSaveDialog :visible.sync="visible" :edit-data="curEditItem" @submit="handleItemSave" :list='logisticList' />
      <LogisticItemLinkStationDialog :visible.sync="stationLinkVisible" :edit-data="curEditItem" @submit="onStationLinkSubmit" />
      <LogisticItemLinkPrintedSheetDialog
        :visible.sync="printedSheetLinkVisible"
        :ExpressProductList='ExpressProductList'
        :edit-data="curEditItem"
        @submit="onPrintedSheetLinkSubmit"
       />
      <!-- <LogisticItemLinkRelationDialog
        :visible.sync="relationLinkVisible"
        :ThirdPlatExpressList='ThirdPlatExpressList'
        :edit-data="curEditItem"
        @submit="onRelationLinkSubmit"
       /> -->
    </main>
    <footer v-if="localPermission.Setup">
      <template v-if="!sorting">
        <el-button @click="onSortingClick" class="cancel-blue-btn">排序</el-button>
      </template>
      <template v-else>
        <el-button @click="submitSort" type="primary">保存</el-button>
        <el-button @click="sorting = false" class="cancel-blue-btn">取消</el-button>
      </template>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import LogisticTableComp from '../../components/LogisticManage/LogisticTableComp.vue';
import LogisticItemSaveDialog from '../../components/LogisticManage/LogisticItemSaveDialog.vue';
import LogisticItemLinkStationDialog from '../../components/LogisticManage/LogisticItemLinkStationDialog.vue';
// import LogisticItemLinkRelationDialog from '../../components/LogisticManage/LogisticItemLinkRelationDialog.vue';
import LogisticItemLinkPrintedSheetDialog from '../../components/LogisticManage/LogisticItemLinkPrintedSheetDialog.vue';

export default {
  name: 'LogisticManageListPage',
  components: {
    LogisticTableComp,
    LogisticItemSaveDialog,
    LogisticItemLinkStationDialog,
    // LogisticItemLinkRelationDialog,
    LogisticItemLinkPrintedSheetDialog,
  },
  data() {
    return {
      visible: false,
      curEditItem: null,
      sorting: false,
      stationLinkVisible: false,
      printedSheetLinkVisible: false,
      relationLinkVisible: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['logisticList', 'ThirdPlatExpressList', 'ExpressProductList', 'loading']),
    ...mapState('common', ['Permission', 'ExpressList']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionManageLogistics?.Obj || {};
    },
  },
  methods: {
    onItemSaveClick(item) { // 添加|编辑物流快递 点击事件
      this.curEditItem = item;
      this.visible = true;
    },
    onSortingClick() { // 排序按钮点击事件
      if (!this.logisticList || this.logisticList.length === 0) return;
      this.sorting = true;
    },
    handleItemSave(item) { // 物流快递保存 编辑|新增
      const callback = () => {
        this.visible = false;
        this.getExpressList();
      };
      this.$store.dispatch('basicSet/getLogisticItemSave', { item, callback });
    },
    handleRemove(item) { // 删除
      const callback = () => {
        this.getExpressList();
      };
      this.$store.dispatch('basicSet/getLogisticItemRemove', { item, callback });
    },
    getExpressList() { // 在物流快递列表重新修改后 重新获取下修改后的列表（用于本地中其它模块中使用）
      if (this.ExpressList.length === 0) return;
      this.$store.commit('common/setExpressList', []);
      this.$store.dispatch('common/getExpressList');
    },
    submitSort() { // 排序保存
      const ids = this.$refs.SortTable?.sortDataList?.map(it => it.ID);
      const callback = () => {
        this.sorting = false;
      };
      this.$store.dispatch('basicSet/getLogisticsSetOrder', { ids, callback });
    },
    onPrintedSheetLinkClick(item) { // 点击关联快印仓
      this.curEditItem = item;
      this.printedSheetLinkVisible = true;
    },
    onRelationLinkClick(item) { // 点击关联快递打单
      this.curEditItem = item;
      this.relationLinkVisible = true;
    },
    onPrintedSheetLinkSubmit(item) { // 关联快印仓提交
      const callback = () => {
        this.printedSheetLinkVisible = false;
      };
      this.$store.dispatch('basicSet/getLogisticsBindExpressPrint', { item, callback });
    },
    // onRelationLinkSubmit(item) { // 关联快递打单提交
    //   const callback = () => {
    //     this.relationLinkVisible = false;
    //   };
    //   this.$store.dispatch('basicSet/getLogisticsBindExpress', { item, callback });
    // },
    onStationLinkClick(item) { // 点击关联物流配送网点
      this.curEditItem = item;
      this.stationLinkVisible = true;
    },
    onStationLinkSubmit(item) { // 关联物流配送提交
      const callback = () => {
        this.stationLinkVisible = false;
      };
      this.$store.dispatch('basicSet/getLogisticsBindStation', { item, callback });
    },
    onSetPriceClick(e) { // 跳转设置价格页面
      if (!e || (!e.ID && e.ID !== 0)) return;
      this.$router.push({
        name: 'LogisticPriceList',
        params: { id: e.ID, name: e.Name },
      });
    },
  },
  mounted() {
    this.$store.dispatch('basicSet/getLogisticList');
    // this.$store.dispatch('basicSet/getThirdPlatExpressList');
    if (this.localPermission.Setup) {
      this.$store.dispatch('basicSet/getExpressProductList');
    }
    // string boolean number null undefined symbol object BigInt
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
    height: 80px;
    width: 100%;
    flex: none;
    > div {
      width: 100%;
      height: 80px;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding-left: 20px;
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
    margin-left: 20px;
    margin-right: 20px;
    padding-top: 10px;
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
