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
import { mapState, mapMutations, mapActions } from 'vuex';
import DropDown from './DropDownUser.vue';

export default {
  components: {
    DropDown,
  },
  computed: {
    ...mapState('finance', ['userTypeList', 'userRankList', 'userTypeTitle', 'userRankTitle']),
  },
  methods: {
    ...mapMutations('finance', ['setUserType', 'setUserRank']),
    ...mapActions('finance', ['getUserClassify']),
  },
  mounted() {
    this.getUserClassify();
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
