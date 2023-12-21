<template>
  <el-table
    class="mp-table-wrap piece-table"
    :max-height="157"
    border
    fit
    stripe
    :data="list"
    style="width: 100%; border-right: 1px solid #e5e5e5"
  >
    <el-table-column prop="Code" min-width="80" label="大版ID"/>
    <el-table-column prop="Number" show-overflow-tooltip min-width="80" label="物料">
      <span slot-scope="scope">
        {{ scope.row.Number }}
        {{ OrderData?.Unit }}
      </span>
    </el-table-column>
    <el-table-column prop="Size" show-overflow-tooltip min-width="80" label="尺寸"/>
    <el-table-column prop="WorkingList" show-overflow-tooltip min-width="90" label="数量">
      <span slot-scope="scope">
        已做：{{ scope.row.WorkingList.join('、') }}
      </span>
    </el-table-column>
  </el-table>
</template>

<script>
import { Message } from 'element-ui';

export default {
  props: {
    list: {
      type: Array,
    },
    OrderData: {
      type: Object,
    },
  },
};
</script>

<style lang='scss'>
.piece-table{
  .el-table__header-wrapper{
    display: none;
  }
}
</style>
