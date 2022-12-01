<!--
 * @Author: your name
 * @Date: 2020-05-12 11:03:48
 * @LastEditTime: 2020-05-23 10:30:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\components\Finance\Header\DropDownUser.vue
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
          :key="item.CategoryID + '-' + index"
          :command="item"
        >{{item.CategoryName}}</el-dropdown-item>
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
      if (command.CategoryName === this.title) return;
      this.$emit('select', [command.CategoryID, command.CategoryName]);
      this.getFinanceTableData();
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
//       > i {
//         align-self: center;
//         height: 15px;
//         width: 10px;
//       }
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
