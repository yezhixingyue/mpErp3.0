<template>
  <div class="mp-erp-comps-price-module-price-table-item-axis-prop-data-option-type-panel-wrap">
    <el-checkbox-group v-model="checkList">
      <el-checkbox :label="it.First" v-for="it in optionList" :key="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
    </el-checkbox-group>
    <!-- 添加尺寸区域 type为groupSize时 -->
    <SizeAddPanelComp />
  </div>
</template>

<script>
import SizeAddPanelComp from '@/components/ProductManageComps/SizeMaterial/SizeAddPanelComp.vue';

export default {
  props: {
    Property: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Array,
      default: () => [],
    },
    PropType: {
      type: String,
      default: '',
    },
  },
  components: {
    SizeAddPanelComp,
  },
  data() {
    return {
    };
  },
  computed: {
    optionList() {
      if (!this.Property || !Array.isArray(this.Property.OptionList)) return [];
      return this.Property.OptionList;
    },
    checkList: {
      get() {
        return this.value.map(it => it.Value);
      },
      set(val) {
        const list = val.map(it => ({
          ID: this.$utils.getAUUID(),
          Value: it,
        }));
        this.$emit('input', list);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-item-axis-prop-data-option-type-panel-wrap {
  > .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    > label.el-checkbox {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      margin-right: 8px;
      padding-top: 6px;
      > .el-checkbox__label {
        font-size: 12px;
        width: 9em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 16px;
      }
      > .el-checkbox__input {
        margin-top: 1px;
      }
    }
  }
}
</style>
