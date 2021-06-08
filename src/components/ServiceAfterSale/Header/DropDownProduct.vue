<!--
 * @Author: your name
 * @Date: 2020-04-09 14:36:46
 * @LastEditTime: 2020-05-23 10:49:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\components\ServiceAfterSale\Header\DropDownProduct.vue
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
          :key="item.ID ? item.ID + '-' + index : item.ProductID"
          :command="item"
        >{{item.ClassName ? item.ClassName : item.ProductName}}</el-dropdown-item>
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
    ...mapActions('service', ['getServiceListData']),
    onCommand(command) {
      let id = command.ID ? command.ID : command.ProductID;
      if (Object.is(id, undefined)) id = 0;
      const name = command.ClassName ? command.ClassName : command.ProductName;
      if (name === this.title) return;
      this.$emit('select', [id, name]);
      this.getServiceListData();
    },
  },
};
</script>

<style lang='scss'>
// .dorp-down {
//   height: 25px;
//   width: 114px;
//   box-sizing: border-box;
//   border-bottom: 1px solid rgb(220, 220, 220);
//   &.el-dropdown {
//     font-size: 13px;
//     & > span {
//       outline: none;
//       display: flex;
//       width: 100%;
//       color: #000;
//       line-height: 25px;
//       justify-content: space-between;
//       padding: 0 7px 0 5px;
//       box-sizing: border-box;
//     }
//   }
// }
// .el-dropdown-menu {
//   padding: 0;
//   width: 112px;
//   border-radius: 0px;
//   &.el-popper[x-placement^=bottom] {
//     margin: 0;
//     & > div::after,
//     & > div{
//       display: none;
//     }
//   }
// }
</style>
