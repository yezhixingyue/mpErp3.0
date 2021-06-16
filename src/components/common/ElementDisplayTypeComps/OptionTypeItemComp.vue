<template>
  <el-select v-model="checkVal" :placeholder="placeholder" v-if="!canRadio || options.length > 3" size="small">
    <el-option
      v-for="item in options"
      :key="item.ID"
      :label="item.Name"
      :value="item.ID">
    </el-option>
  </el-select>
  <el-radio-group v-model="checkVal" v-else>
    <el-radio v-for="item in options" :key="item.ID" :label="item.ID">{{item.Name}}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择',
    },
    value: {},
    options: {
      type: Array,
      default: () => [],
    },
    canRadio: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    checkVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
