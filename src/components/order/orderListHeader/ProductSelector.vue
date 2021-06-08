<template>
  <ul class="mp-order-product-select-wrap">
          <li class="text">产品：</li>
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
import DropDown from '@/components/order/orderListHeader/DropDownProduct.vue';

export default {
  components: {
    DropDown,
  },
  computed: {
    ...mapState('orderModule', ['largeProTitle', 'midProTitle', 'smProTitle', 'subProductList', 'objForOrderList']),
    ...mapState('common', ['productList']),
    largeProduct() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      if (this.productList.length > 0) {
        const tempArr = this.productList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      const id = this.objForOrderList.ProductClass.First;
      if (id) {
        const tempArr = this.productList.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
  },
  methods: {
    ...mapMutations('orderModule', ['setProductClass1', 'setProductClass2', 'setProductClass3']),
    ...mapActions('orderModule', ['getProductThird']),
    onMidSelect(arr) {
      this.setProductClass2(arr);
      // console.log(arr, 'arerrrrrr', this.midProduct);
      if (arr[0]) this.getProductThird();
    },
  },
  mounted() {
    // console.log('产品mounted');
    // this.getProductList();
    this.$store.dispatch('common/getProductList');
  },
};
</script>

<style lang='scss'>
 .mp-order-product-select-wrap{
   display: flex;
   > li{
     margin-right: 15px;
   }
 }
</style>
