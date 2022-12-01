<template>
  <ul class="mp-order-area-select-wrap">
      <li class="text">销售区域：</li>
      <li>
        <DropDown @select="setSellAreaRegional" :title="largeTitle" :list='largeArea' />
      </li>
      <li>
        <DropDown @select="setSellAreaCity" :title="midTitle" :list='midArea' />
      </li>
      <li>
        <DropDown @select="setSellAreaCounty" :title="smTitle" :list='smArea' />
      </li>
    </ul>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import DropDown from '@/components/order/orderListHeader/DropDownArea.vue';

export default {
  components: {
    DropDown,
  },
  computed: {
    ...mapState('orderModule', ['largeTitle', 'midTitle', 'smTitle', 'objForOrderList']),
    ...mapState('common', ['areaList']),
    /* 销售区域相关
    -------------------------------*/
    largeArea() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      if (this.areaList.length > 0) {
        const tempArr = this.areaList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midArea() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      const id = this.objForOrderList.SellArea.RegionalID;
      if (id) {
        const tempArr = this.areaList.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    smArea() {
      const arr = [{ ID: 0, ClassName: '不限' }];
      const id = this.objForOrderList.SellArea.CityID;
      if (id) {
        const tempArr = this.areaList.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
  },
  methods: {
    ...mapMutations('orderModule', ['setSellAreaRegional', 'setSellAreaCity', 'setSellAreaCounty']),
    ...mapActions('common', ['getAreaList']),
  },
  created() {
    this.getAreaList();
  },
};
</script>

<style lang='scss'>
  .mp-order-area-select-wrap {
    display: flex;
    > li {
      margin-right: 15px;
    }
  }
</style>
