<template>
  <section class="mp-erp-craft-manage-craft-list-page-wrap">
    <header>
      <template v-if="Permission && Permission.PermissionList.PermissionCraftBase.Obj.Setup">
        <el-button type="primary" @click="onCraftItemSave(null)">添加工艺</el-button>
        <span class="blue-span" @click="jumpToClassifyPageClick">管理工艺分类</span>
      </template>
      <order-channel-selector
        :options='level1OptionList'
        :requestFunc='getCraftListData'
        :changePropsFunc='setCondition4CraftList'
        :typeList="[['Category', 'First']]"
        :value='Condition4CraftList.Category.First'
        label='工艺分类筛选'
        :defaultProps="{ label: 'ClassName', value: 'ID' }"
        key='order-OrderType'
        />
      <order-channel-selector
        class="terminal-select"
        :options='level2OptionList'
        :requestFunc='getCraftListData'
        :changePropsFunc='setCondition4CraftList'
        :typeList="[['Category', 'Second']]"
        :value='Condition4CraftList.Category.Second'
        :defaultProps="{ label: 'ClassName', value: 'ID' }"
        key='order-Terminal'
        label=''
      />
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
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { mapGetters, mapState, mapMutations } from 'vuex';

export default {
  name: 'CraftManageList',
  mixins: [recordScrollPositionMixin('.mp-erp-craft-list-page-craft-table-comp-wrap .el-table__body-wrapper')],
  components: {
    CraftSaveDialog,
    CraftListTableComp,
    CountComp,
    OrderChannelSelector,
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
    ...mapState('common', ['CraftClassifyData', 'Permission']),
    ...mapGetters('common', ['twoLevelsCraftClassify']),
    level1OptionList() {
      const defaultItem = { ClassName: '不限', ID: '' };
      let list = [];
      if (this.CraftClassifyData?.length > 0) {
        list = this.CraftClassifyData.filter(it => it.ParentID === -1);
      }
      return [defaultItem, ...list];
    },
    level2OptionList() {
      const defaultItem = { ClassName: '不限', ID: '' };
      let list = [];
      if (this.CraftClassifyData?.length > 0 && (this.Condition4CraftList?.Category?.First || this.Condition4CraftList?.Category?.First === 0)) {
        list = this.CraftClassifyData.filter(it => it.ParentID === this.Condition4CraftList.Category.First);
      }
      return [defaultItem, ...list];
    },
  },
  methods: {
    ...mapMutations('basicSet', ['setCondition4CraftList']),
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
    this.$store.commit('basicSet/clearCondition4CraftList');
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
    display: flex;
    align-items: center;
    > button {
      border-radius: 2px;
      width: 120px;
      height: 30px;
      padding: 0;
      margin-right: 42px;
    }
    > span {
      font-size: 14px;
      margin-right: 50px;
    }
    .mp-common-comps-order-channel-selector-wrap > header {
      width: 7em;
    }
    .terminal-select {
      padding-left: 20px;
      > header {
        display: none;
      }
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
