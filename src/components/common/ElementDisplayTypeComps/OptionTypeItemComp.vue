<template>
  <el-select
   v-model="checkVal"
   :placeholder="placeholder"
   default-first-option
   :allow-create='Allow'
   :filterable='Allow'
   v-if="!canRadio || options.length > 3 || Allow || SelectMode === 1"
   size="small"
   @blur.native='onBlur'
   @change.native='onBlur'
   class="mp-erp-option-type-element-display-select-comp">
    <el-option
      v-for="item in options"
      :key="item.ID"
      :label="item.Name"
      :value="item.ID">
    </el-option>
    <!-- <p v-if="Allow" class="is-font-size-12 is-gray" style="padding: 2px 5px">使用自定义数据时，请输入内容然后选择输入项或回车保存</p> -->
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
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
    SelectMode: {},
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
  methods: {
    onBlur(e) {
      if (this.Allow) this.$emit('change', e.target.value);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-option-type-element-display-select-comp {
  .el-input__inner {
    font-size: 12px;
    &::placeholder {
      font-size: 12px;
    }
  }
}
</style>
