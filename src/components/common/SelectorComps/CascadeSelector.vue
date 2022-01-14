<template>
  <div v-if="treeData && Array.isArray(cascadeList)">
    <OrderChannelSelector
      v-for="(it, i) in cascadeList"
      :key="i"
      :options='OptionLists[i] || []'
      :requestFunc='requestFunc'
      :changePropsFunc='handlePropChange'
      :typeList="[it.keys]"
      :value='getValue(it)'
      :label='it.label||""'
      :showLabel='!!it.label'
      :defaultProps="{ label: 'ClassName', value: 'ID' }"
      />
  </div>
</template>

<script>
import OrderChannelSelector from './OrderChannelSelector.vue';

export default {
  props: {
    treeData: {
      type: Array,
      default: null,
    },
    auto: {
      type: Boolean,
      default: false,
    },
    cascadeList: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    OrderChannelSelector,
  },
  computed: {
    OptionLists() {
      if (Array.isArray(this.treeData)) {
        // const
        return [this.treeData]; // 后面动态填充
      }
      return [];
    },
  },
  data() {
    return {
      Condition4CraftList: {
        Category: {
          First: '',
        },
      },
    };
  },
  methods: {
    requestFunc() {
      console.log('requestFunc');
    },
    handlePropChange(e) {
      console.log('handlePropChange', e);
    },
    getValue({ keys }) {
      let a = '';
      if (this.value && typeof this.value === 'object') {
        let temp = JSON.parse(JSON.stringify(this.value));
        keys.forEach(key => {
          if (Object.prototype.hasOwnProperty.call(temp, key)) temp = temp[key];
          else temp = '';
        });
        a = temp;
      }
      return a;
    },
  },
  mounted() {
    console.log(this.value);
  },
};
</script>
<style lang='scss'>
</style>
