<!--
 * @Describe: 下单渠道选择组件
 * @FilePath: /src/components/common/SelectorComps/OrderChannelSelector.vue
-->
<template>
  <section class="mp-common-comps-order-channel-selector-wrap" :class="showLabel?'':'ml-15'">
    <header v-if="showLabel">{{label}}：</header>
    <main>
      <select-comp
        :options='options'
        :defaultProps='defaultProps'
        :title='title'
        @handleChange='handleChange'
       />
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
  },
  computed: {
    title() {
      return this.value;
    },
  },
  methods: {
    handleChange(newVal) {
      // if (newVal === this.RegionalID) return;
    //  console.log(this.typeList[0], newVal);
      this.changePropsFunc([this.typeList[0], newVal]);
      this.requestFunc();
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-common-comps-order-channel-selector-wrap {
  display: flex;
  height: 25px;
  > header {
    font-size: 14px;
    line-height: 25px;
    margin-right: 15px;
    font-weight: 600;
    color: $--color-text-primary;
    width: 5em;
    text-align: right;
  }
//   > main {

//   }
}
</style>
