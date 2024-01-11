<template>
  <el-table
    class="mp-table-wrap"
    :max-height="170"
    border
    fit
    stripe
    :data="list"
    style="width: 100%; border-right: 1px solid #e5e5e5"
  >
    <el-table-column prop="Code" min-width="104" label="大版ID"/>
    <el-table-column prop="Material" show-overflow-tooltip min-width="143" label="物料"/>
    <el-table-column prop="Size" show-overflow-tooltip min-width="150" label="尺寸"/>
    <el-table-column prop="Number" min-width="79" label="数量"/>
    <el-table-column prop="ChunkCount" min-width="96" label="总块数"/>
    <el-table-column prop="Code" show-overflow-tooltip min-width="240" label="含此订单块（尺寸）">
      <template slot-scope="scope">
        {{ scope.row.ChunkList.map(it => `${it.Number}个(${it.Size})`).join('、') }}
      </template>
    </el-table-column>
    <el-table-column prop="WorkingList" show-overflow-tooltip min-width="129" label="已加工工序">
      <template slot-scope="scope">
        {{scope.row.WorkingList.join('、')}}
      </template>
    </el-table-column>
    <el-table-column min-width="262" label="取消方式">
      <template slot-scope="scope">
        <el-radio @input="(val) => radioClick(scope.row.ID, val)" :value="formValue[scope.row.ID]" :label="1">仅取消块</el-radio>
        <el-radio @input="(val) => radioClick(scope.row.ID, val)" :value="formValue[scope.row.ID]" :label="2">取消大版</el-radio>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
    },
    formValue: {
      type: Object,
    },
  },
  methods: {
    radioClick(ID, value) {
      this.$emit('changeValue', { ID, value });
    },
  },
};
</script>

<style lang='scss'>
</style>
