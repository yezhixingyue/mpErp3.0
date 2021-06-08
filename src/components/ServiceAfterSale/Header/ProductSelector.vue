<!--
 * @Author: your name
 * @Date: 2020-04-09 14:36:56
 * @LastEditTime: 2021-05-05 14:16:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/components/ServiceAfterSale/Header/ProductSelector.vue
-->
<template>
  <ul class="mp-service-header-product-select-wrap">
          <li class="mp-head-page-title">产品：</li>
          <li>
            <DropDown @select="setProductClass1" :title="largeProTitle" :list='largeProduct' />
          </li>
          <li>
            <DropDown @select="onMidSelect" :title="midProTitle" :list='midProduct' />
          </li>
          <li>
            <DropDown @select="setProductClass3" :title="smProTitle" :list='subProductList' />
          </li>
        </ul>
</template>

<script>
import {
  mapState, mapMutations, mapActions,
} from 'vuex';
import DropDown from './DropDownProduct.vue';

export default {
  components: {
    DropDown,
  },
  computed: {
    ...mapState('service', ['largeProTitle', 'midProTitle', 'smProTitle', 'subProductList', 'obj4RequestServiceList']),
    ...mapState('common', ['productList']),
    largeProduct() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      if (this.productList.length > 0) {
        const tempArr = this.productList.filter((item) => item.Level === 1);
        // console.log(tempArr, [...arr, ...tempArr]);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      const id = this.obj4RequestServiceList.Product.ClassID;
      if (id) {
        const tempArr = this.productList.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
  },
  methods: {
    ...mapMutations('service', ['setProductClass1', 'setProductClass2', 'setProductClass3']),
    ...mapActions('service', ['getProductThird']),
    onMidSelect(arr) {
      this.setProductClass2(arr);
      if (arr[0]) this.getProductThird();
    },
  },
  mounted() {
    // this.getProductList();
    this.$store.dispatch('common/getProductList');
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
 .mp-service-header-product-select-wrap{
   display: flex;
   padding-left: 15px;
   padding-top: 25px;
   padding-bottom: 22px;
   > li{
     margin-right: 15px;
   }
   .mp-head-page-title{
    font-size: 14px;
    color: $--color-text-primary;
    font-weight: 600;
    width: 5em;
    display: inline-block;
    text-align: right;
   }
   .dorp-down.el-dropdown{
    //  vertical-align: 10%;
    position: relative;
    top: -4px;
    > span{
      color: $--color-text-regular;
      font-size: 14px;
      line-height: 22px;
    }
   }
 }
</style>
