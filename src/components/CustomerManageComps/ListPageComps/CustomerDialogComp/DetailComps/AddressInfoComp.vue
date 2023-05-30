<template>
  <li class="mp-erp-customer-detail-dialog-address-info-comp-wrap" v-if="customer">
    <p class="title">
      <img src="@/assets/images/c-d.png" alt="">
      <span>地址区域</span>
    </p>
    <ul class="content">
      <li>
        <label>销售区域：</label>
        <span>{{sellArea}}</span>
      </li>
      <li v-for="(it, i) in deliveryDddressList" :key="it.AddressID + '' + i">
        <label>配送地址：</label>
        <span class="add">
          <i :title="it.addressContent">{{it.addressContent}}</i>
          <i>{{it.Consignee}} {{it.Mobile}}</i>
        </span>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
  },
  filters: {
  },
  computed: {
    sellArea() {
      if (!this.customer) return '';
      return this.getRCCAddressContent(this.customer.SellArea);
    },
    deliveryDddressList() {
      if (!this.customer || !Array.isArray(this.customer.Address)) return [];
      return this.customer.Address.map(it => ({
        ...it,
        addressContent: this.getRCCAddressContent(it.ExpressArea) + (it.AddressDetail || ''),
      }));
    },
  },
  methods: {
    getRCCAddressContent(obj) { // 获取省市县拼接信息
      if (!obj) return '';
      const { RegionalName, CityName, CountyName } = obj;
      return `${RegionalName || ''}${CityName || ''}${CountyName || ''}`;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-detail-dialog-address-info-comp-wrap {
  width: 480px;
  height: 330px;
  margin-top: 20px;
  margin-left: 20px;
  > ul {
    padding-left: 25px;
    > li {
      label {
        min-width: 5em !important;
      }
      align-items: flex-start !important;
      > span.add {
        padding-top: 3px;
        padding-bottom: 5px;
        > i {
          display: block;
          line-height: 18px;
          text-overflow: ellipsis;
          overflow: hidden;
          &:last-of-type {
            color: #888;
          }
        }
      }
    }
  }
}
</style>
