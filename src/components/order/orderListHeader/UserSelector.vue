<template>
  <ul class="mp-order-user-select-wrap">
    <li class="text">用户：</li>
    <li>
      <DropDown @select="setUserType" :title="userTypeTitle" :list='userTypeList' />
    </li>
    <li>
      <DropDown @select="setUserRank" :title="userRankTitle" :list='userRankList' />
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DropDown from '@/components/order/orderListHeader/DropDownUser.vue';

export default {
  components: {
    DropDown,
  },
  computed: {
    ...mapState('orderModule', ['userTypeTitle', 'userRankTitle']),
    ...mapState('common', ['userTypeList', 'userRankList']),
  },
  methods: {
    ...mapMutations('orderModule', ['setUserType', 'setUserRank']),
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>

<style lang='scss'>
  .mp-order-user-select-wrap{
    display: flex;
    > li{
      margin-right: 15px;
    }
  }
</style>
