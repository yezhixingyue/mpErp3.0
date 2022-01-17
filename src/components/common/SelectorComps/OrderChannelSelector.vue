<!--
 * @Describe: 下单渠道选择组件
 * @FilePath: /src/components/common/SelectorComps/OrderChannelSelector.vue
-->
<template>
  <section class="mp-common-comps-order-channel-selector-wrap" :class="showLabel?'':'ml-15'">
    <header v-if="showLabel">{{label}}：</header>
    <main>
      <select-comp
        v-if="!isRadio"
        :options='localOptions'
        :defaultProps='defaultProps'
        :title='title'
        @handleChange='handleChange'
       />
      <el-radio-group v-model="radio" v-else>
        <el-radio :label="it[defaultProps.value]" :key="it[defaultProps.value]" v-for="it in localOptions">{{it[defaultProps.label]}}</el-radio>
      </el-radio-group>
    </main>
  </section>
</template>

<script>
import SelectComp from '../SelectComp.vue';

export default {
  components: {
    SelectComp,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '下单渠道',
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        value: 'ID',
      }),
    },
    value: {
      default: '',
      required: true,
    },
    typeList: {
      type: Array,
      required: true,
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    isRadio: {
      type: Boolean,
      default: false,
    },
    withEmpty: {
      type: Boolean,
      default: false,
    },
    initSelect: { // 是否初始选中选项
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.value;
    },
    radio: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.handleChange(newVal);
      },
    },
    localOptions() {
      const list = [];
      if (Array.isArray(this.options)) {
        list.push(...this.options);
      }
      if (this.withEmpty) {
        list.unshift({ [this.defaultProps.label]: '不限', [this.defaultProps.value]: '' });
      }
      return list;
    },
  },
  methods: {
    handleChange(newVal) {
      this.changePropsFunc([this.typeList[0], newVal]);
      this.requestFunc();
    },
  },
  mounted() {
    if (this.initSelect && this.value === '' && this.options.length > 0 && this.options[0][this.defaultProps.value] !== '') {
      this.handleChange(this.options[0][this.defaultProps.value]);
    }
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-common-comps-order-channel-selector-wrap {
  display: flex;
  height: 25px;
  overflow: hidden;
  > header {
    font-size: 14px;
    line-height: 25px;
    margin-right: 15px;
    font-weight: 600;
    color: $--color-text-primary;
    width: 5em;
    text-align: right;
    flex: none;
  }
  > main {
    > .el-radio-group {
      position: relative;
      top: 5px;
      white-space: nowrap;
    }
    .el-input__inner {
      border-radius: 0;
    }
  }
}
</style>
