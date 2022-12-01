<template>
  <footer class="mp-erp-factory-manual-out-source-manage-page-footer-wrap">
    <Count
      :watchPage='condition.Page'
      :pageSize="condition.PageSize"
      :handlePageChange='handlePageChange'
      :count='dataNumber'
    >
      <div slot="left" class="left-box">
        <el-checkbox v-model="checked" :indeterminate="isIndeterminate">全选</el-checkbox>
        <span class="blue-span" v-if="localPermission.ReceiveOrder" @click="onOutsourceClick" :class="{'disabled':multipleSelection.length===0}">确认选中订单外协</span>
        <div v-if="localPermission.ChangeFactory">
          <span class="is-bold mr-5">选中订单更改外协工厂为：</span>
          <el-select :value="radio" placeholder="请选择" @change="onFactorySelect" size="mini" :disabled="multipleSelection.length===0">
            <el-option v-for="it in factorys" :key="it.FactoryID" :label="it.FactoryName" :value="it.FactoryID"></el-option>
          </el-select>
        </div>
      </div>
    </Count>
  </footer>
</template>

<script>
import Count from '../../common/Count.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    dataNumber: {
      type: Number,
      default: 0,
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
    condition: {
      type: Object,
      default: () => ({}),
    },
    factorys: {
      type: Array,
      default: () => [],
    },
    changeMultipleFactory: {
      type: Function,
      default: () => {},
    },
    localPermission: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Count,
  },
  data() {
    return {
      radio: '',
    };
  },
  computed: {
    checked: {
      get() {
        return this.multipleSelection.length > 0 && this.multipleSelection.length === this.list.length;
      },
      set(val) {
        this.$emit('checkAll', val);
      },
    },
    isIndeterminate() {
      return !this.checked && this.multipleSelection.length > 0;
    },
  },
  methods: {
    handlePageChange(page) {
      this.$emit('getList', page);
    },
    async onFactorySelect(FactoryID) {
      const res = await this.changeMultipleFactory(FactoryID);
      if (res === true) {
        this.radio = FactoryID;
      }
    },
    onOutsourceClick() {
      if (this.multipleSelection.length === 0) return;
      const msg = `<span>共选中 <i class='is-primary-blue'>${this.multipleSelection.length}</i> 个订单</span>`;
      this.messageBox.warnCancelBox('确认外协选中订单吗 ?', msg, () => {
        this.$emit('manualOutsource');
      }, null, true);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manual-out-source-manage-page-footer-wrap {
  box-sizing: border-box;
  padding-top: 1px;
  .count-wrap {
    flex-wrap: wrap;
    min-height: 45px;
    height: auto;
    .left-box {
      flex: 1;
      text-align: left;
      white-space: nowrap;
      .el-checkbox {
        margin-left: 14px;
        .el-checkbox__label {
          font-weight: 700;
        }
      }
      > div {
        display: inline-block;
        .el-select {
          width: 130px;
          input {
            height: 30px;
          }
        }
      }
      > .blue-span {
        margin: 0 25px;
      }
    }
  }
}
</style>
