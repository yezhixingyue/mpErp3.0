<template>
  <ul class="mp-service-page-header">
      <li class="mp-service-page-header-first">
        <div class="f">
            <ServiceClassify />
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
            <StaffSelector
              title="操作人"
              needlimit
              class="second-section"
              :changePropsFunc="setCondition4DataList"
              :requestFunc="getDataList"
              :typeList="[['Operator', '']]"
              :value="obj4RequestServiceList.Operator"
            />
        </div>
        <div class="s">
          <ElDateRangeSelector v-model="conditionDate" :condition="obj4RequestServiceList" initText='今天' />
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
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import ServiceClassify from './ServiceClassify.vue';

export default {
  components: {
    ServiceClassify,
    ProductSelector,
    OrderChannelSelector,
    StaffSelector,
    ElDateRangeSelector,
    SearchInputComp,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('service', ['obj4RequestServiceList', 'tableData']),
    conditionDate: {
      get() {
        return [this.obj4RequestServiceList.CreateTime.First, this.obj4RequestServiceList.CreateTime.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setCondition4DataList([['CreateTime', 'First'], key]);
        this.setCondition4DataList([['CreateTime', 'Second'], value]);
        this.getDataList();
      },
    },
  },
  data() {
    return {
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
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
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
