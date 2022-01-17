<template>
  <header class="mp-erp-customer-manage-list-page-header-comp-wrap">
    <div class="f">
      <el-button type="primary" size="small" @click="onSetupClick"
       v-if="Permission && Permission.PermissionList.PermissionManageCustomer.Obj.Add">新建客户</el-button>
      <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :word='condition4DataList.KeyWords'
        :searchWatchKey="customerDataList"
        @reset='() => this.clearCondition()'
        />
    </div>
    <div class="s">
      <div class="double">
        <OrderChannelSelector
          :options='localUserTypeList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition4DataList'
          :typeList="[['Type', 'First']]"
          :value='condition4DataList.Type.First'
          :defaultProps='{label: "CategoryName", value: "CategoryID"}'
          label='类别等级'
          />
        <OrderChannelSelector
          class="terminal-select"
          :options='localUserRankList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition4DataList'
          :typeList="[['Type', 'Second']]"
          :value='condition4DataList.Type.Second'
          :defaultProps='{label: "CategoryName", value: "CategoryID"}'
          label=''
        />
      </div>
      <div class="double">
        <OrderChannelSelector
          :options='localCustomerStatusEnumList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition4DataList'
          :typeList="[['Status', '']]"
          :value='condition4DataList.Status'
          :defaultProps='{label: "Name", value: "ID"}'
          label='状态'
          />
        <OrderChannelSelector
          class="terminal-select"
          :options='localAuthStatusEnumList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition4DataList'
          :typeList="[['AuthStatus', '']]"
          :value='condition4DataList.AuthStatus'
          :defaultProps='{label: "Name", value: "ID"}'
          label=''
        />
      </div>
      <AreaSelector
        style="margin-right: 40px"
        title='所属区域'
        :changePropsFunc="setCondition4DataList"
        :requestFunc="getDataList"
        :RegionalID="condition4DataList.SellArea.RegionalID"
        :CityID="condition4DataList.SellArea.CityID"
        :CountyID="condition4DataList.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <OrderChannelSelector
        :options='localRegTypeEnumList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['RegType', '']]"
        :value='condition4DataList.RegType'
        :defaultProps='{label: "Name", value: "ID"}'
        label='注册方式'
        />
    </div>
  </header>
</template>

<script>
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import { CustomerStatusEnumList, AuthStatusEnumList, RegTypeEnumList } from '@/store/customerManage/Enums';
import { mapState } from 'vuex';

export default {
  components: {
    SearchInputComp,
    OrderChannelSelector,
    AreaSelector,
  },
  computed: {
    ...mapState('customerManage', ['condition4DataList', 'customerDataList']),
    ...mapState('common', ['userTypeListNoneEmpty', 'userRankListNoneEmpty', 'Permission']),
    localUserTypeList() {
      return [{ CategoryID: -777, CategoryName: '类别不限' }, ...this.userTypeListNoneEmpty];
    },
    localUserRankList() {
      return [{ CategoryID: -777, CategoryName: '等级不限' }, ...this.userRankListNoneEmpty];
    },
    localCustomerStatusEnumList() {
      return [{ ID: '', Name: '状态不限' }, ...CustomerStatusEnumList];
    },
    localAuthStatusEnumList() {
      return [{ ID: '', Name: '认证状态不限' }, ...AuthStatusEnumList];
    },
    localRegTypeEnumList() {
      return [{ ID: '', Name: '注册来源不限' }, ...RegTypeEnumList];
    },
  },
  methods: {
    onSetupClick() {
      this.$emit('setup', 'null');
    },
    setCondition4DataList(e) {
      this.$store.commit('customerManage/setCondition2DataList', e);
    },
    getDataList() {
      this.$store.dispatch('customerManage/getCustomerDataList');
    },
    clearCondition() {
      this.$store.commit('customerManage/clearCondition2DataList');
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-manage-list-page-header-comp-wrap {
  padding: 20px;
  > div {
    &.f {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > button {
        font-size: 14px;
        width: 110px;
        padding: 8px 15px;
      }
    }
    &.s {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 5px;
      padding-left: 2px;
      > div {
        &.double {
          display: flex;
          align-items: center;
          .terminal-select {
            margin-left: 10px;
            > header {
              display: none;
            }
          }
          margin-right: 20px;
          &:last-of-type {
            margin-right: 50px;
          }
        }
      }
      > div, > ul, > section {
        margin-top: 16px;
      }
    }
  }
}
</style>
