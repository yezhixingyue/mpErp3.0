<template>
  <header>
    <label for="date-selector">生效日期：</label>
    <el-date-picker
      v-model="date"
      :disabled='loading'
      :picker-options="{disabledDate: handleDisabledDate}"
      size="small"
      id="date-selector"
      value-format="yyyy-MM-dd"
      popper-class='mp-price-tactic-list-page-header-date-selector-wrap'
    />
    <span>（ 注：生效时间为所选择日期当天0点 ）</span>
  </header>
</template>

<script>
export default {
  props: {
    value: { // 日期
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    date: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    handleDisabledDate(e) {
      return new Date(e).getTime() < Date.now();
    },
  },
};
</script>
<style lang='scss'>
.mp-price-tactic-list-page-header-date-selector-wrap .el-date-table td.today span {
  color: #26bcf9 !important;
}
</style>
