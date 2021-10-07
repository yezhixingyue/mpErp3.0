<template>
  <header class="mp-deposit-list-page-header-comp-wrap">
    <normal-btn-full
     v-if="Permission.PermissionList.PermissionSetupDeposit.Obj.Manage"
     class="blue-full-color-btn-styles" @click.native="onClick" title="添加定金设置" />
    <product-selector-index-two-levels
      :changePropsFunc="setObjForListData"
      :requestFunc="getDepositList"
      :ClassID="objForListData.Product.classID"
      :TypeID="objForListData.Product.typeID"
      :typeList="[['Product', 'classID'],['Product', 'typeID']]" />
  </header>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import ProductSelectorIndexTwoLevels from '@/components/common/SelectorComps/ProductSelectorIndexTwoLevels.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    normalBtnFull,
    ProductSelectorIndexTwoLevels,
  },
  computed: {
    ...mapState('deposit', ['objForListData', 'listData']),
    ...mapState('common', ['Permission']),
  },
  methods: {
    ...mapMutations('deposit', ['setObjForListData']),
    ...mapActions('deposit', ['getDepositList']),
    onClick() {
      this.$router.push({ name: 'depositSettingsAdd', params: { type: 'add' } });
    },
  },
  mounted() {
    this.$store.commit('deposit/clearObjForListData');
    this.getDepositList();
  },
  activated() {
    if (this.listData.length === 0) this.getDepositList();
  },
};
</script>

<style lang='scss'>
.mp-deposit-list-page-header-comp-wrap {
  height: 80px;
  width: 100%;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 25px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  > button {
    margin-right: 10px !important;
  }
}
</style>
