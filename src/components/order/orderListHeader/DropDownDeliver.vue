<template>
    <el-dropdown trigger="click" class="dorp-down" placement="bottom-start" @command="onCommand">
      <span class="el-dropdown-link">
        {{title}}
        <!-- <i class="el-icon-arrow-down el-icon-caret-bottom"></i> -->
        <img src="@/assets/images/arrowbottom.png" alt="">
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item,index) in list"
          :key="item.ID + '-' + index"
          :command="item"
        >{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: '不限',
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    ...mapActions('orderModule', ['getExpressTableData', 'getOrderTableData']),
    onCommand(command) {
      if (command.name === this.title) return;
      this.$emit('select', [command.ID, command.name]);
      if (this.$route.name === 'transport') {
        this.getExpressTableData();
      } else if (this.$route.name === 'orderManage') {
        this.getOrderTableData();
      }
    },
  },
};
</script>

<style lang='scss'>
</style>
