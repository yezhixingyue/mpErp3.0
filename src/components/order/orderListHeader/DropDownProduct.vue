<!--
 * @Author: your name
 * @Date: 2020-03-16 15:42:34
 * @LastEditTime: 2020-05-22 18:07:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\components\order\orderListHeader\DropDownProduct.vue
-->
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
          :key="item.ID ? item.ID + '-' + index : item.ProductID"
          :command="item"
        >{{item.ClassName ? item.ClassName : item.ProductName}}</el-dropdown-item>
      </el-dropdown-menu>
      <!-- {{list}} -->
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
      let id = command.ID ? command.ID : command.ProductID;
      if (Object.is(id, undefined)) id = 0;
      const name = command.ClassName ? command.ClassName : command.ProductName;
      if (name === this.title) return;
      this.$emit('select', [id, name]);
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
