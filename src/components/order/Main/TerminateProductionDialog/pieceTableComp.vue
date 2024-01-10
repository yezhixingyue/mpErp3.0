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
    <el-table-column prop="ID" min-width="110" label="大版ID"/>
    <el-table-column prop="ID" min-width="80" label="物料"/>
    <el-table-column prop="ID" min-width="60" label="尺寸"/>
    <el-table-column prop="ID" min-width="79" label="数量"/>
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
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
