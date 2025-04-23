<template>
  <ul class="mp-erp-common-select-comps-two-level-select-comp-wrap">
    <li class="first-select-box">
      <SelectComp v-model="ElementID" :options='ElementList' size="mini" :defaultProps="{ label: 'Name', value: 'ID' }" />
    </li>
    <li>
      <el-checkbox-group v-model="OptionList">
        <el-checkbox v-for="it in ElementOptionList" :key="it.ID" :label="it.ID" :disabled="disabledOptions.includes(it.ID)">{{ it.Name }}</el-checkbox>
      </el-checkbox-group>
    </li>
  </ul>
</template>

<script>
import SelectComp from '../../../../common/SelectorComps/NewSelectComp.vue';

export default {
  props: {
    value: {
      type: Object,
      default: () => ({ ElementID: '', OptionList: [] }),
    },
    ElementList: {
      type: Array,
      default: () => ([]),
    },
    ElementOptionList: {
      type: Array,
      default: () => ([]),
    },
    disabledOptions: {
      type: Array,
      default: () => ([]),
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  components: {
    SelectComp,
  },
  computed: {
    ElementID: {
      get() {
        return this.value.ElementID;
      },
      set(val) {
        if (this.value.ElementID === val) return;
        this.$emit('change', {
          ElementID: val,
          OptionList: [],
        });
      },
    },
    OptionList: {
      get() {
        return this.value.OptionList;
      },
      set(val) {
        this.$emit('change', {
          ElementID: this.ElementID,
          OptionList: val,
        });
      },
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-common-select-comps-two-level-select-comp-wrap{
  > li {
    margin-bottom: 6px;
    max-width: 400px;
    > .el-select.mp-common-select-comp-wrap {
      > .el-input > input {
        color: $--color-text-primary;
        font-size: 13px;
      }
    }
    .el-input__inner {
      width: 150px;
    }
  }
}
</style>
