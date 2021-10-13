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
          </div>
          <TimeSearchSelector />
      </li>
      <li></li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import ServiceClassify from './ServiceClassify.vue';
import TimeSearchSelector from './TimeSearchSelector.vue';

export default {
  components: {
    ServiceClassify,
    ProductSelector,
    TimeSearchSelector,
    OrderChannelSelector,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('service', ['obj4RequestServiceList']),
  },
  methods: {
    getDataList() {
      this.$store.dispatch('service/getServiceListData');
    },
    setCondition4DataList(data) {
      // console.log(data);
      this.$store.commit('service/setCondition', data);
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
  .mp-service-page-header-first {
    > div {
      display: flex;
      flex-wrap: wrap;
      .user-selector {
        display: flex;
        padding-top: 20px;
        padding-bottom: 20px;
      }
      &.f {
        align-items: center;
        padding-top: 20px;
        > div, > ul {
          padding-top: 0px;
          padding-bottom: 18px;
        }
      }
    }
  }
}
</style>
