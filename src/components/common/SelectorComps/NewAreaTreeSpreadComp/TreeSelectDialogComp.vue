<template>
  <CommonDialogComp
    width="880px"
    top='6vh'
    :title="`选择${title}`"
    :visible.sync="localVisible"
    submitText='确定'
    @submit="onSubmit"
    @cancle="localVisible = false"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-common-comp-new-tree-select-dialog-comp-wrap"
  >
    <NewAreaTreeSpreadComp
     :isLevel2='isLevel2'
     v-model="localData"
     :list='list'
     :title="title"
     :DisabledList='shouldDisabledList'
     :leftWidth="type === 'area' ? undefined : '7em'"
     :rightItemWidth="type === 'area' ? undefined : '10em'"
     />
  </CommonDialogComp>
</template>

<script>
import { mapGetters } from 'vuex';
import CommonDialogComp from '../../../../packages/CommonDialogComp';
import NewAreaTreeSpreadComp from './index.vue';

export default {
  props: {
    type: {
      type: String,
      default: 'product', // product | product-customer | area
    },
    isLevel2: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    shouldDisabledList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    NewAreaTreeSpreadComp,
  },
  data() {
    return {
      localData: { List: [], IsIncludeIncreased: false },
    };
  },
  computed: {
    ...mapGetters('common', ['allProductClassify4Customer', 'allAreaTreeList', 'allProductClassify']),
    list() {
      if (this.type === 'product') return this.allProductClassify;
      if (this.type === 'product-customer') return this.allProductClassify4Customer;
      return this.allAreaTreeList;
    },
    title() {
      if (this.type === 'area') return '地区';
      return '产品';
    },
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    onOpen() {
      if (!this.value) {
        this.localData = { List: [], IsIncludeIncreased: false };
      } else {
        const listField = this.type === 'area' ? 'AreaList' : 'ProductClassList';
        const IncreasedField = this.type === 'area' ? 'IsIncludeIncreasedArea' : 'IsIncludeIncreasedProduct';
        this.localData = {
          List: this.value[listField] ? JSON.parse(JSON.stringify(this.value[listField])) : [],
          IsIncludeIncreased: this.value[IncreasedField] || false,
        };
      }
      if (this.type === 'product') {
        this.$store.dispatch('common/getProductClassifyData', { key: 6 });
        this.$store.dispatch('common/getAllProductNames');
      } else if (this.type === 'product-customer') {
        this.$store.dispatch('common/getProductClassifyData', { key: 2 });
        this.$store.dispatch('common/getAllProductNames');
      } else {
        this.$store.dispatch('common/getAreaList');
      }
    },
    onClosed() {
      this.localData = { List: [], IsIncludeIncreased: false };
    },
    onSubmit() {
      if (this.localData.List.length === 0) {
        this.messageBox.failSingleError('操作失败', `请选择${this.title}`);
        return;
      }
      const listField = this.type === 'area' ? 'AreaList' : 'ProductClassList';
      const IncreasedField = this.type === 'area' ? 'IsIncludeIncreasedArea' : 'IsIncludeIncreasedProduct';
      const temp = {
        [listField]: this.localData.List,
        [IncreasedField]: this.localData.IsIncludeIncreased,
      };
      this.$emit('input', temp);
      this.localVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comp-new-tree-select-dialog-comp-wrap {
  .el-dialog__body {
    height: 580px;
    overflow: auto;
    overflow: overlay;
  }
}
</style>
