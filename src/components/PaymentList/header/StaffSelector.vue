<template>
  <ul class="mp-order-staff-select-wrap">
    <li class="text">创建人：</li>
    <li class="right">
      <DropDownStaff @select='onStaffSelect' :list='staffList' />
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import DropDownStaff from './DropDownStaff.vue';

export default {
  components: {
    DropDownStaff,
  },
  computed: {
    ...mapState('common', ['staffList']),
  },
  methods: {
    ...mapMutations('paymentModule', ['setStaffInfo']),
    ...mapActions('paymentModule', ['getPaymentListTableData']),
    onStaffSelect([id]) {
      this.setStaffInfo(id);
      this.getPaymentListTableData();
    },
  },
  mounted() {
    this.$store.dispatch('common/getStaffList');
  },
};
</script>

<style lang='scss'>
 .mp-order-staff-select-wrap{
   display: flex;
   height: 28px;
   > li {
     margin-right: 10px;
     &.right{
       padding-top: 5px;
       box-sizing: border-box;
     }
   }
 }
</style>
