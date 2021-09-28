<template>
  <section class="mp-erp-craft-manage-craft-list-page-wrap">
    <header>
      <el-button type="primary" @click="onCraftItemSave(null)">添加工艺</el-button>
      <span class="blue-span" @click="jumpToClassifyPageClick">管理工艺分类</span>
    </header>
    <main>
      <CraftSaveDialog :curData='curData' :visible.sync='visible' :classifyData='twoLevelsCraftClassify' @submitSuccess='onCraftSaveSuccess' />
      <CraftListTableComp :loading='loading' :dataList='CraftDataList' @edit='onCraftItemSave' @remove='onRemoveClick' @setElement='onSetElementClick' />
    </main>
    <footer>
      <CountComp
        :count='CraftDataNumber'
        :watchPage='Condition4CraftList.Page'
        :handlePageChange='getCraftListData'
        center
      />
    </footer>
  </section>
</template>

<script>
import CraftSaveDialog from '@/components/CraftComps/CraftSaveDialog.vue';
import CraftListTableComp from '@/components/CraftComps/CraftListTableComp.vue';
import CountComp from '@/components/common/Count.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'CraftManageList',
  mixins: [recordScrollPositionMixin('.mp-erp-craft-list-page-craft-table-comp-wrap .el-table__body-wrapper')],
  components: {
    CraftSaveDialog,
    CraftListTableComp,
    CountComp,
  },
  data() {
    return {
      visible: false,
      curData: null,
      loading: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['CraftDataList', 'CraftDataNumber', 'Condition4CraftList', 'craftFetchData']),
    ...mapGetters('common', ['twoLevelsCraftClassify']),
  },
  methods: {
    onCraftItemSave(data) {
      this.curData = data;
      this.visible = true;
    },
    jumpToClassifyPageClick() {
      this.$router.push('/CraftClassifyManage');
    },
    onCraftSaveSuccess(isEdit, craftData) {
      this.$store.commit('basicSet/setCraftDataListItemSave', [isEdit, craftData]);
    },
    async getCraftListData(page = 1) {
      this.loading = true;
      await this.$store.dispatch('basicSet/getCraftDataList', page);
      this.loading = false;
    },
    onRemoveClick({ Name, ID }) {
      this.messageBox.warnCancelBox('确实删除该工艺吗', `工艺名称：[ ${Name} ]`, () => {
        this.$store.dispatch('basicSet/getCraftRemove', ID);
      });
    },
    onSetElementClick(data) {
      if (!data) return;
      const { Name, ID } = data;
      this.$router.push(`CraftElementSet/${ID}/${Name}`);
    },
  },
  mounted() {
    this.$store.dispatch('common/getCraftClassifyData');
    this.getCraftListData();
  },
  activated() {
    if (this.craftFetchData) {
      this.getCraftListData();
      this.$store.commit('basicSet/setCraftFetchData', false);
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-craft-manage-craft-list-page-wrap {
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
      margin-right: 42px;
    }
    > span {
      font-size: 14px;
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
