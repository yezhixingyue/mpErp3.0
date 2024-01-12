<template>
  <header class="mp-erp-certificate-manage-list-page-header">
    <div>
      <order-channel-selector
        :options="CertificateType"
        :requestFunc="getCustomerTrackLogList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CertificateType', '']]"
        :value="getCertificateCondition.CertificateType"
        :defaultProps="{ label: 'label', value: 'value' }"
        label="证书类型"
      />
      <order-channel-selector
        :options="CertificateStatus"
        :requestFunc="getCustomerTrackLogList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CertificateStatus', '']]"
        :value="getCertificateCondition.CertificateStatus"
        :defaultProps="{ label: 'label', value: 'value' }"
        label="证书状态"
      />
      <order-channel-selector
        :options="CheckStatus"
        :requestFunc="getCustomerTrackLogList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CheckStatus', '']]"
        :value="getCertificateCondition.CheckStatus"
        :defaultProps="{ label: 'label', value: 'value' }"
        label="审核状态"
      />
    </div>
    <SearchInputComp
      :typeList="[['KeyWords', '']]"
      :requestFunc='getCustomerTrackLogList'
      :changePropsFunc='setRequestObj'
      :word='getCertificateCondition.KeyWords'
      @reset='clearRequestObj'
      title="关键词"
      placeholder="可搜索客户名称、客户编号、证书名称"
      :searchWatchKey="CertificateList" />
  </header>
</template>

<script>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { mapState } from 'vuex';

export default {
  props: {
    CertificateList: {
      type: Array,
      default: () => [],
    },
    getCertificateCondition: {
      type: Object,
      default: () => null,
    },
    CheckStatus: {
      type: Array,
      default: () => [],
    },
    CertificateStatus: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SearchInputComp,
    OrderChannelSelector,
  },
  computed: {
    ...mapState('common', ['CertificateType']),
  },
  data() {
    return {
    };
  },
  methods: {
    getCustomerTrackLogList() {
      this.$emit('getList');
    },
    setRequestObj(e) {
      this.$emit('setRequest', e);
    },
    clearRequestObj() {
      this.$emit('clearRequest');
    },
  },
  mounted() {
    this.clearRequestObj();
    this.getCustomerTrackLogList();
  },
};
</script>
<style lang='scss'>
.mp-erp-certificate-manage-list-page-header {
  padding: 20px;
  padding-top: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-top: 20px;
    >.mp-common-comps-order-channel-selector-wrap{
      &+.mp-common-comps-order-channel-selector-wrap{
        margin-left: 20px;
      }
    }
  }
  >.mp-common-comps-search-box{
    margin-top: 20px;
    >.el-input{
      width: 220px;
    }
  }
}
</style>
