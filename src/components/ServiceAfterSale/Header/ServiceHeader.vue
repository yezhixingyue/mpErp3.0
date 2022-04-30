<template>
  <ul class="mp-service-page-header">
      <li class="mp-service-page-header-first">
        <div class="f">
            <order-channel-selector
              :options="AfterSaleType"
              :requestFunc="getDataList"
              :changePropsFunc="setCondition4DataList"
              :typeList="[['SolutionType', '']]"
              :value="obj4RequestServiceList.SolutionType"
              :defaultProps="{ label: 'label', value: 'value' }"
              label="售后类型"
            />
            <ProductSelector
            :changePropsFunc="setCondition4DataList"
            :requestFunc="getDataList"
            :ClassID="obj4RequestServiceList.Product.ClassID"
            :TypeID="obj4RequestServiceList.Product.TypeID"
            :ProductID="obj4RequestServiceList.Product.ProductID"
            :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]" />
            <div class="user-selector">
              <order-channel-selector
                :options="userTypeList"
                :requestFunc="getDataList"
                :changePropsFunc="setCondition4DataList"
                :typeList="[['CustomerType', 'First']]"
                :value="obj4RequestServiceList.CustomerType.First"
                :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
                label="用户"
              />
              <order-channel-selector
                :showLabel="false"
                :options="userRankList"
                :requestFunc="getDataList"
                :changePropsFunc="setCondition4DataList"
                :typeList="[['CustomerType', 'Second']]"
                :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
                :value="obj4RequestServiceList.CustomerType.Second"
                label=""
              />
            </div>
            <order-channel-selector
              class="margin-right45"
              :options="AfterSaleResult"
              :requestFunc="getDataList"
              :changePropsFunc="setCondition4DataList"
              :typeList="[['Result', '']]"
              :value="obj4RequestServiceList.SolutionType"
              :defaultProps="{ label: 'label', value: 'value' }"
              label="服务结果"
            />
            <order-channel-selector
              class="margin-right45"
              :options="AfterSaleScore"
              :requestFunc="getDataList"
              :changePropsFunc="setCondition4DataList"
              :typeList="[['Score', '']]"
              :value="obj4RequestServiceList.Score"
              :defaultProps="{ label: 'label', value: 'value' }"
              label="服务评级"
            />
            <OrderChannelSelector
            style="margin-right: 30px"
            :filterable='true'
            :options='staffList'
            :requestFunc='getDataList'
            :changePropsFunc='setCondition4DataList'
            :typeList="[['OperaterID', '']]"
            :defaultProps="{ label: 'StaffName', value: 'StaffID' }"
            :value='obj4RequestServiceList.OperaterID'
            label="操作人"
          />
        </div>
        <div class="s">
          <LineDateSelectorComp
            :changePropsFunc='setCondition4DataList'
            :requestFunc='getDataList'
            :isFull="true"
            :typeList="[['DateType', ''], ['OperateTime', 'First'], ['OperateTime', 'Second']]"
            :dateValue='obj4RequestServiceList.DateType'
            :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
            :dateList='dateList'
          />
          <!-- <ElDateRangeSelector v-model="conditionDate" :condition="obj4RequestServiceList" initText='今天' /> -->
          <SearchInputComp
            class="search-section"
            :typeList="[['KeyWords', '']]"
            title="关键词"
            placeholder='请输入搜索关键词'
            :requestFunc='getDataList'
            :changePropsFunc='setCondition4DataList'
            :word='obj4RequestServiceList.KeyWords'
            :searchWatchKey="tableData"
            @reset='() => this.clearCondition()'
          />
        </div>
      </li>
      <li></li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
// import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
// import ServiceClassify from './ServiceClassify.vue';

export default {
  components: {
    // ServiceClassify,
    ProductSelector,
    OrderChannelSelector,
    // StaffSelector,
    // ElDateRangeSelector,
    SearchInputComp,
    LineDateSelectorComp,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('service', ['obj4RequestServiceList', 'tableData']),
    // conditionDate: {
    //   get() {
    //     return [this.obj4RequestServiceList.CreateTime.First, this.obj4RequestServiceList.CreateTime.Second];
    //   },
    //   set(newVal) {
    //     const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
    //     this.setCondition4DataList([['CreateTime', 'First'], key]);
    //     this.setCondition4DataList([['CreateTime', 'Second'], value]);
    //     this.getDataList();
    //   },
    // },
    UserDefinedTimeIsActive() {
      return this.obj4RequestServiceList.DateType === '' && !!this.obj4RequestServiceList.OperateTime.First && !!this.obj4RequestServiceList.OperateTime.Second;
    },
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      dateList: [{ name: '全部', ID: 'all' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }, { name: '本月', ID: 'curMonth' }, { name: '上月', ID: 'lastMonth' }],
      AfterSaleType: [{ label: '不限', value: '' }, { label: '减款', value: 1 }, { label: '补印', value: 2 }, { label: '赠送优惠券', value: 3 }],
      AfterSaleResult: [{ label: '不限', value: '' }, { label: '问题已解决', value: 1 }, { label: '问题未解决', value: 2 }],
      AfterSaleScore: [
        { label: '不限', value: '' }, { label: '1星', value: 1 },
        { label: '2星', value: 2 }, { label: '3星', value: 3 },
        { label: '4星', value: 4 }, { label: '1星', value: 5 },
      ],
      staffList: null,
    };
  },
  methods: {
    getDataList() {
      this.$store.dispatch('service/getServiceListData');
    },
    setCondition4DataList(data) {
      this.$store.commit('service/setCondition', data);
    },
    clearCondition() {
      this.$store.commit('service/clearConfigObj');
    },
    async getCustomerData() { // 获取客户数据
      this.api.getOperateStaff().then(res => {
        this.staffList = res.data.Data;
      });
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
    this.getCustomerData();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-service-page-header{
  background-color: $--color-white;
  margin-bottom: 10px;
  padding-left: 25px;
  .mp-service-page-header-first {
    > div {
      display: flex;
      flex-wrap: wrap;
      .user-selector {
        display: flex;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-right: 45px;
      }
      &.f {
        align-items: center;
        padding-top: 20px;
        > div, > ul, .second-section {
          padding-top: 0px;
          padding-bottom: 18px;
          > section > header {
            min-width: 5em;
          }
        }
        > .mp-service-header-service-classify-wrap {
          padding-left: 0;
        }
        >.mp-common-comps-order-channel-selector-wrap{
          padding-bottom: 18px;
        }
        >.margin-right45{
          margin-right: 45px;
        }
      }
      &.s {
        align-items: center;
        justify-content: space-between;
        padding-right: 60px;
        > div, > section {
          margin-bottom: 18px;
        }
      }
    }
  }
}
</style>
