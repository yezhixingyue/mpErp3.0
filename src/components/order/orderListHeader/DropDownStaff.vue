
<template>
  <div class="order-staff-select-dropdown-wrapper">
    <el-select
    class="order-staff-select-dropdown-wrap"
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
import { mapState, mapActions } from 'vuex';

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
    ...mapState('orderModule', ['objForOrderList']),
    StaffValue() {
      return this.objForOrderList.OrderTaker;
    },
  },
  watch: {
    StaffValue(newVal) {
      if (newVal === '') this.value = '不限';
    },
  },
  methods: {
    ...mapActions('orderModule', ['getExpressTableData', 'getOrderTableData']),
    onChange(...args) {
      this.$emit('select', args);
      if (this.$route.name === 'transport') {
        this.getExpressTableData();
      } else if (this.$route.name === 'orderManage') {
        this.getOrderTableData();
      }
    },
    onClearClick() {
      this.$emit('select', ['']);
      if (this.$route.name === 'transport') {
        this.getExpressTableData();
      } else if (this.$route.name === 'orderManage') {
        this.getOrderTableData();
      }
    },
  },
};
</script>

<style lang='scss'>
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
    top: 2px;
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
