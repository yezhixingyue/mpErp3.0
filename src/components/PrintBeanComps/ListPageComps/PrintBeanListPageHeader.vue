<template>
  <header>
    <div>
      <el-button type="primary" @click="onAddClick" v-if="localPermission.SetupPrintBean">添加印豆设置</el-button>
      <!-- <AreaSelector
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :RegionalID='condition.SellArea.RegionalID'
        :CityID='condition.SellArea.CityID'
        :CountyID='condition.SellArea.CountyID'
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      /> -->
      <EpCascaderByArea
        class="mr-25 mt-18"
        :getList="getList"
        :setCondition="setCondition"
        :RegionalID="condition.SellArea.RegionalID"
        :CityID="condition.SellArea.CityID"
        :CountyID="condition.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <OrderChannelSelector
        label='客户种类'
        withEmpty
        :options='CategoryEnumsList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['Category', '']]"
        :value='condition.Category'
        :defaultProps="{label: 'Name',value: 'ID'}"
      />
      <OrderChannelSelector
        label='客户类型'
        :options='userTypeList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['CustomerType', '']]"
        :value='condition.CustomerType'
        :defaultProps="{label: 'CategoryName',value: 'CategoryID'}"
      />
      <OrderChannelSelector
        label='客户等级'
        :options='userRankList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['CustomerGrade', '']]"
        :value='condition.CustomerGrade'
        :defaultProps="{label: 'CategoryName',value: 'CategoryID'}"
      />
    </div>
    <div>
      <RadioButtonGroupComp
        :radioList="statusEnumList"
        :requestFunc="getList"
        v-model="Status"
        :isFull="true"
        title="购买状态"
      />
      <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :word='condition.KeyWords'
        @reset='clearCondition'
        :searchWatchKey="searchWatchKey"
        title='关键词'
        placeholder='请输入搜索关键词'
      />
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
// import AreaSelector from '../../common/SelectorComps/AreaSelectorIndex.vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '../../common/SelectorComps/OrderChannelSelector.vue';
import { CategoryEnumsList } from '../../../store/printBean/PrintBeanClassType';
import RadioButtonGroupComp from '../../common/RadioButtonGroupComp.vue';
import { PrintBeanBuyStatusEnumsList } from '../../../store/printBean/ConditonClass4ListData';
import EpCascaderByArea from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    searchWatchKey: {},
  },
  components: {
    // AreaSelector,
    OrderChannelSelector,
    SearchInputComp,
    RadioButtonGroupComp,
    EpCascaderByArea,
  },
  data() {
    return {
      CategoryEnumsList,
    };
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManagePrintBean?.Obj) {
        return this.Permission.PermissionList.PermissionManagePrintBean.Obj;
      }
      return {};
    },
    Status: {
      get() {
        return this.condition.Status;
      },
      set(newVal) {
        this.setCondition([['Status', ''], newVal]);
      },
    },
    statusEnumList() {
      const list = PrintBeanBuyStatusEnumsList.map(it => ({ ID: it.ID, name: it.Name }));
      return [{ ID: '', name: '不限' }, ...list];
    },
  },
  methods: {
    onAddClick() {
      this.$emit('add');
    },
    getList() {
      this.$store.dispatch('printBean/getPrintBeanList');
    },
    setCondition(data) {
      this.$store.commit('printBean/setCondition', data);
    },
    clearCondition(data) {
      this.$store.commit('printBean/clearCondition', data);
    },
  },
};
</script>
<style lang='scss'>
</style>
