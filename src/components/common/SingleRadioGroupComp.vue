<template>
  <el-radio-group v-model="radioValue" class="mp-coms-common-single-radio-group-comp-wrap">
    <el-radio
     :label="it[defaultProps.value]"
      v-for="it in list"
     :key='it[defaultProps.value]'
     >{{it[defaultProps.label]}}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  model: {
    prop: 'radio',
    event: 'handleRadioChange',
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    radio: {},
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        value: 'ID',
      }),
    },
  },
  computed: {
    radioValue: {
      get() {
        return this.radio;
      },
      set(newVal) {
        this.$emit('handleRadioChange', newVal);
      },
    },
  },
};
</script>

<style>

</style>
