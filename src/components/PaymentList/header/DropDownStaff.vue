<template>
  <div class="order-staff-select-dropdown-wrapper">
    <el-select
    class="order-staff-select-dropdown-wrap mp-payment-staff-wrap"
    popper-class='order-staff-select-dropdown-pop-wrap'
    v-model="value"
    filterable
    :placeholder="title"
    @change="onChange"
  >
    <el-option
      v-for="item in list"
      :key="item.StaffID"
      :label="item.StaffName"
      :value="item.StaffID"
    ></el-option>
  </el-select>
  <i class="el-icon-error" @click="onClearClick" v-show="value !== '不限'"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: '不限',
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      value: '不限',
    };
  },
  computed: {
    ...mapState('paymentModule', ['set2PaymentList']),
    StaffValue() {
      return this.set2PaymentList.Operator;
    },
  },
  watch: {
    StaffValue(newVal) {
      if (newVal === '') this.value = '不限';
    },
  },
  methods: {
    onChange(...args) {
      this.$emit('select', args);
    },
    onClearClick() {
      this.$emit('select', ['']);
    },
  },
};
</script>

<style lang='scss'>
.mp-payment-staff-wrap {
  position: relative;
  top: -2px;
}
.order-staff-select-dropdown-wrapper {
  position: relative;
  > i {
    color: #989898c5;
    // background-color: #989898c5;
    border-radius: 50%;
    font-size: 15px;
    // padding: 3px;
    // transform: scale(0.88);
    position: absolute;
    right: 17px !important;
    top: 1px;
    cursor: pointer;
    font-weight: 100;
    display: none;
  }
  &:hover {
    > i {
      display: block;
    }
  }
}
</style>
