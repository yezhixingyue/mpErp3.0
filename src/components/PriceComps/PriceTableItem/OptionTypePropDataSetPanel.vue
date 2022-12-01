<template>
  <div class="mp-erp-comps-price-module-price-table-item-axis-prop-data-option-type-panel-wrap">
    <el-checkbox-group v-model="checkList">
      <el-checkbox :label="it.First" v-for="it in optionList" :key="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
    </el-checkbox-group>
    <!-- 添加尺寸区域 type为groupSize时 -->
    <SizeAddPanelComp
      ref='oPanel'
      canEmpty
      hiddenName
      hiddenSort
      hiddenCustomerSet
      v-if="showSizePanel"
      :Elements='Property.SizeGroup.ElementList'
      :sizeTemp='template' :List='SizeList' />
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
    SizeList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SizeAddPanelComp,
  },
  data() {
    return {
      template: null,
      showSizePanel: false,
    };
  },
  computed: {
    optionList() {
      if (!this.Property || !Array.isArray(this.Property.OptionList)) return [];
      const _list = [...this.Property.OptionList];
      if ([42, 43, 45].includes(this.Property.FixedType)) return _list;
      return _list.sort((a, b) => a.Second.localeCompare(b.Second));
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
  methods: {
    getInputSizeList() {
      return this.$refs.oPanel.onSubmit();
    },
  },
  mounted() {
    if (this.PropType === 'groupsize') {
      this.template = {
        ID: '',
        Name: '',
        Index: 0,
        HiddenToCustomer: false,
        List: [],
      };
      this.Property.SizeGroup.ElementList.forEach(it => {
        const temp = { First: it.ID, Second: '' };
        this.template.List.push(temp);
      });
      this.showSizePanel = true;
    }
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
        width: 201px;
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
  > .mp-erp-comps-pruduct-module-general-size-set-dialog-size-add-panel-comp-wrap {
    .btn-box {
      padding-left: 0;
      padding-top: 15px;
      padding-bottom: 10px;
    }
    > div {
      > div.header {
        > div {
          max-width: 1000px;
        }
      }
      > ul {
        max-height: 360px;
      }
    }
  }
}
</style>
