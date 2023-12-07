<template>
<div class="refresh-box">
  <hr color="#DCDFE6" size="1px">
  <p>
    <span>生产取消方式</span>
    <el-button type="text" @click="refresh"><i class="el-icon-refresh"></i>刷新信息</el-button>
  </p>
  <hr color="#DCDFE6" size="1px">
</div>
</template>

<script>
export default {
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>

<style lang='scss'>
.refresh-box{
  display: flex;
  align-items: center;
  padding: 10px 0;
  margin-top: 20px;
  >hr{
    flex: 1;
  }
  >p{
    margin: 0 10px;
    >span{
      font-size: 16px;
      font-weight: 700;
      color: #444;
      margin-right: 20px;
    }
    .el-button{
      i{
        font-weight: 700;
      }
    }
  }
}
</style>
