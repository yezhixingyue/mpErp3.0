<template>
  <footer class="mp-erp-factory-manual-out-source-manage-page-footer-wrap">
    <span class="count">共检索出<i class="blue">{{ dataNumber }}</i>条记录</span>

    <div class="size">
      <span>显示</span>
      <el-select :value="condition.PageSize" @change="onPageSizeChange" size="mini" style="width: 50px;margin: 0 6px;top: -1px;">
        <el-option :label="20" :value="20"></el-option>
        <el-option :label="30" :value="30"></el-option>
        <el-option :label="50" :value="50"></el-option>
      </el-select>
      <span>条</span>
    </div>

    <div class="box">
      <Count
        :watchPage='condition.Page'
        :pageSize="condition.PageSize"
        :handlePageChange='handlePageChange'
        :count='dataNumber'
        :showTotal="false"
        displayOnSinglePage
        class="pager"
      />
      <DownLoadExcelComp title="导出Excel表格" :configObj="configObj" />
    </div>
  </footer>
</template>

<script>
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import CommonClassType from '@/store/CommonClassType';
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
    DownLoadExcelComp,
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
    checkedFactoryList() {
      return this.multipleSelection.map(it => it.Factory.ID);
    },
    configObj() { // 导出Excel条件对象
      return {
        condition: CommonClassType.filter(this.condition, true),
        count: this.dataNumber,
        fileDefaultName: '手动外购列表',
        // fileDate: '',
        showDateByFile: false,
        downFunc: data => this.api.getFactoryOrderOrderExcel(data),
      };
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
      this.messageBox.warnCancelBox('确认外购选中订单吗 ?', msg, () => {
        this.$emit('manualOutsource');
      }, null, true);
    },
    onPageSizeChange(PageSize) {
      this.$emit('changePageSize', PageSize);
    },
  },
  watch: {
    checkedFactoryList() {
      this.radio = '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manual-out-source-manage-page-footer-wrap {
  box-sizing: border-box;
  padding-top: 2px;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding-bottom: 4px;
  line-height: 28px;
  color: #444;

  .count {
    padding: 0 10px;
    flex: none;
    min-width: 200px;
    text-align: center;
  }

  .size {
    flex: none;
    height: 28px;
    input {
      padding-right: 0;
      padding-left: 8px;
      border-radius: 3px;
    }
    .el-input__suffix {
      right: 1px;
    }
  }

  .box {
    flex: 1;
    overflow: hidden;

    display: flex;
    align-items: center;

    .pager {
      padding-right: 30px;
      padding-left: 30px;
      width: 700px;
      flex: 0 1 auto;
    }

    .mp-common-download-to-excel-comp-wrap {
      flex: 1;
      text-align: left;
      white-space: nowrap;

      button {
        font-size: 12px;
      }
    }
  }
}
</style>
