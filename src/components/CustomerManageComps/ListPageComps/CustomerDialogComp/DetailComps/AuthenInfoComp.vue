<template>
  <li class="mp-erp-customer-detail-dialog-authen-info-comp-wrap" v-if="customer">
    <p class="title">
      <img src="@/assets/images/c-a.png" alt="">
      <span>认证信息</span>
    </p>
    <ul class="content">
      <li>
        <label>企业名称：</label>
        <span>{{customer.AuthenInfo.CompanyName}}</span>
      </li>
      <li>
        <label>经营地址：</label>
        <span>{{sellAddress}}</span>
      </li>
      <li>
        <label>法人：</label>
        <template v-if="customer.AuthenInfo.LegalMan">
          <span>
            <template>{{customer.AuthenInfo.LegalMan}}</template>
            <i v-if="customer.AuthenInfo.Mobile" class="is-gray"> ( 电话：{{customer.AuthenInfo.Mobile}} )</i>
          </span>
        </template>
        <template v-else>
          <span class="">--</span>
        </template>
      </li>
      <li>
        <label>营业执照：</label>
        <span>
          <i v-if="!customer.AuthenInfo.LicensePath">未上传</i>
          <i v-else class="blue-span" @click="visible = true">查看图片</i>
        </span>
      </li>
      <li>
        <div style="width: 140px">
          <label>企业类型：</label>
          <span>{{customer.AuthenInfo.Type | formatType}}</span>
        </div>
        <div style="width: 140px">
          <label>经营场所：</label>
          <span>{{customer.AuthenInfo.Place | formatPlace}}</span>
        </div>
        <div style="width: 140px">
          <label>经营规模：</label>
          <span>{{customer.AuthenInfo.Scale | formatScale}}</span>
        </div>
      </li>
    </ul>
    <ImgDisplayDIalog :visible.sync='visible' :url="customer.AuthenInfo.LicensePath" />
  </li>
</template>

<script>
import { getNameFromListByIDs } from '@/assets/js/utils/util';
import { CompanyTypeEnumList, CompanyScaleEnumList, CompanyPlaceEnumList } from '../../../../../store/customerManage/Enums';
import ImgDisplayDIalog from './ImgDisplayDIalog.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ImgDisplayDIalog,
  },
  filters: {
    formatType(Type) {
      return getNameFromListByIDs(Type, CompanyTypeEnumList.filter(it => it.ID)) || '--';
    },
    formatPlace(Place) {
      return getNameFromListByIDs(Place, CompanyPlaceEnumList.filter(it => it.ID)) || '--';
    },
    formatScale(Scale) {
      return getNameFromListByIDs(Scale, CompanyScaleEnumList.filter(it => it.ID)) || '--';
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    sellAddress() {
      if (this.customer?.AuthenInfo) {
        const { SellArea, DetailAddress } = this.customer.AuthenInfo;
        if (SellArea) {
          const { RegionalName, CityName, CountyName } = SellArea;
          return `${RegionalName || ''}${CityName || ''}${CountyName || ''}${DetailAddress || ''}`;
        }
      }
      return '';
    },
  },
  methods: {
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-detail-dialog-authen-info-comp-wrap {
  width: 488px;
  height: 330px;
  margin-top: 20px;
  > ul {
    padding-left: 25px;
    > li {
      label {
        min-width: 5em !important;
      }
      > div {
        flex: none !important;
      }
    }
  }
}
</style>
