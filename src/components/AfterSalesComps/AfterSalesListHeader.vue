<template>
  <header class="mp-after-sales-page-header-wrap">
    <ul>
      <li>
        <div>
          <EpCascaderByProduct
            class="mr-12"
            :getList="getDataList"
            :setCondition="setCondition4DataList"
            :First="condition.Product.ClassID"
            :Second="condition.Product.TypeID"
            :ProductID="condition.Product.ProductID"
            :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
          />
          <EpCascaderByArea
            style="margin-right: 40px"
            :getList="getDataList"
            :setCondition="setCondition4DataList"
            :RegionalID="condition.SellRegionalID"
            :CityID="condition.SellCityID"
            :CountyID="condition.SellCountyID"
            :typeList="[['SellRegionalID', ''],['SellCityID', ''],['SellCountyID', '']]"
          />
          <OrderChannelSelector
            :options="userTypeList"
            :requestFunc="getDataList"
            :changePropsFunc="setCondition4DataList"
            :typeList="[['CustomerType', 'First']]"
            :value="condition.CustomerType.First"
            :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
            label="客户类型"
          />
        </div>
        <div>
          <SearchInputComp
            class="search-section"
            :typeList="[['KeyWords', '']]"
            title="关键词"
            placeholder='请输入搜索关键词'
            :requestFunc='getDataList'
            :changePropsFunc='setCondition4DataList'
            :word='condition.KeyWords'
            :searchWatchKey="dataList"
            @reset='() => this.clearCondition()'
          />
        </div>
      </li>
      <li>
        <LineDateSelectorComp
          :changePropsFunc='setCondition4DataList'
          :requestFunc='getDataList'
          :isFull="true"
          :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          minDate="2022-01-01 00:00:00"
          label="申请时间"
          :dateList="dateList"
        />
        售后渠道
      </li>
      <li>
        <RadioButtonGroupComp
          :radioList="progressList"
          :requestFunc="getDataList"
          v-model="CouponUseStatus"
          :isFull="true"
          title="状态筛选"
        />
        <el-checkbox v-model="checked">仅显示我能处理的</el-checkbox>
      </li>
    </ul>
  </header>
</template>

<script>
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import { mapState } from 'vuex';
import EpCascaderByProduct from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';

import EpCascaderByArea from '../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },

  components: {
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
    EpCascaderByArea,
    EpCascaderByProduct,
    RadioButtonGroupComp,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    UserDefinedTimeIsActive() {
      return this.condition.DateType === '' && !!this.condition.Date.First && !!this.condition.Date.Second;
    },
    progressList() {
      const arr = [
        { name: '不限', ID: '' },
        { name: '待处理', ID: 0 },
        { name: '处理中', ID: 10 },
        { name: '已挂起', ID: 25 },
        { name: '已完成', ID: 30 },
        { name: '已取消', ID: 255 },
      ];
      return arr;
    },
  },
  data() {
    return {
      dateList: [
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    };
  },
  methods: {
    clearCondition() {
      this.$emit('clearCondition');
    },
    setCondition4DataList(data) {
      this.$emit('setCondition', data);
    },
    getDataList() {
      this.$emit('getDataList');
    },
    // async getCustomerData() { // 获取客户数据
    //   this.api.getOperateStaff().then(res => {
    //     this.staffList = [{ StaffName: '不限', StaffID: '' }, ...res.data.Data];
    //   });
    // },
  },
  mounted() {
    this.$store.dispatch('common/getFeedbackQuestionList');
    this.$store.dispatch('common/getUserClassify');
    // this.getCustomerData();
  },
};
</script>

<style lang='scss'>
.mp-after-sales-page-header-wrap {
  > ul {
    padding: 12px 20px;
    padding-top: 8px;
    > li {
      display: flex;
      // height: 48px;
      align-items: center;
      flex-wrap: wrap;
      > div {
        margin-top: 9px !important;
        margin: 9px 0;
      }
      > section {
        margin: 11.5px 0;
      }
      &:first-of-type {
        justify-content: space-between;
        flex-wrap: wrap;
        >div{
          flex-wrap: wrap;
          display: flex;
        }
      }
    }
  }
}
</style>
