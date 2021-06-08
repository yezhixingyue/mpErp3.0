<!--
 * @Author: your name
 * @Date: 2020-05-12 11:03:06
 * @LastEditTime: 2020-05-23 09:46:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\components\Finance\Header\DropDownArea.vue
-->

<template>
    <el-dropdown trigger="click" class="dorp-down" placement="bottom-start" @command="onCommand">
      <span class="el-dropdown-link">
        {{title}}
        <img src="@/assets/images/arrowbottom.png" alt="">
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item,index) in list"
          :key="item.ID + '-' + index"
          :command="item"
        >{{item.ClassName}}</el-dropdown-item>
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
    ...mapActions('finance', ['getFinanceTableData']),
    onCommand(command) {
      if (command.ClassName === this.title) return;
      this.$emit('select', [command.ID, command.ClassName]);
      this.getFinanceTableData();
    },
  },
};
</script>

<style lang='scss'>
@import '@/assets/css/mixins/header/DropDownArea.scss';

</style>
