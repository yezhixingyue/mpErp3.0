<template>
  <ul class="mp-order-staff-select-wrap">
    <li class="text">接单员：</li>
    <li>
      <DropDownStaff @select='onStaffSelect' :list='staffList' />
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DropDownStaff from '@/components/order/orderListHeader/DropDownStaff.vue';

export default {
  components: {
    DropDownStaff,
  },
  computed: {
    ...mapState('common', ['staffList']),
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderTaker']),
    onStaffSelect([id]) {
      this.setOrderTaker(id);
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
   > li {
     margin-right: 15px;
   }
 }
</style>
