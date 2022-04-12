<template>
  <el-table
    class="mp-promote-page-main-table"
    :max-height="h"
    :height="h"
    fit
    :data="localPromoteListData"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="110px" prop="InternalSN" label="编号"></el-table-column>
    <el-table-column
     min-width="190px" class-name="is-font-size-14" prop="Title" label="活动标题"></el-table-column>

    <el-table-column min-width="140px" label="区域" class-name="is-font-size-12">
      <template slot-scope="scope">
        <TableItemShowComp :list='getAreaContent(scope.row)' effect='dark' />
      </template>
    </el-table-column>

    <el-table-column min-width="150px" label="产品" class-name="is-font-size-12">
      <template slot-scope="scope">
        <el-tooltip placement="top-start" :enterable='true'
          v-if="scope.row.ProductListArray && scope.row.ProductListArray.length > 0" >
          <div slot="content">
              <p v-for="(item, i) in scope.row.ProductListArray" :key="item + '---' + i">
                {{ item }}
              </p>
          </div>
          <span class="area-span">{{ scope.row.ProductListArray.join('、') }}</span>
        </el-tooltip>
      </template>
    </el-table-column>


    <el-table-column min-width="100px" show-overflow-tooltip label="用户类型">
      <template slot-scope="scope">
        {{ scope.row.CustomerTypeList | formatPromoteCustomerType }}
      </template>
    </el-table-column>

    <el-table-column min-width="90px" show-overflow-tooltip label="用户等级">
      <template slot-scope="scope">
        {{scope.row.GradeList | formatPromoteCustomerGrade}}
      </template>
    </el-table-column>

    <el-table-column min-width="90px" show-overflow-tooltip label="下单渠道">
      <template slot-scope="scope">{{scope.row.OrderTypeList | formatPromoteOrderType}}</template>
    </el-table-column>

    <el-table-column min-width="125px" class-name="is-gray" label="开始时间">
      <template slot-scope="scope">{{ scope.row.ValidStartTime | formatDate }}</template>
    </el-table-column>
    <el-table-column min-width="125px" class-name="is-gray" label="结束时间">
      <template slot-scope="scope">{{ scope.row.ValidEndTime | formatDate }}</template>
    </el-table-column>

    <el-table-column min-width="73px" class-name="is-font-size-14" label="活动状态">
      <template slot-scope="scope">
        <span :class="'status-' + scope.row.Status">
          {{ scope.row.Status | formatPromoteStatus }}
        </span>
      </template>
    </el-table-column>

    <el-table-column
      min-width="75px"
      prop="ApplyUser.StaffName"
      class-name="is-gray"
      label="申请人"
    ></el-table-column>

    <el-table-column
      min-width="75px"
      prop="OperateUser.StaffName"
      class-name="is-gray"
      label="操作人"
    ></el-table-column>

    <el-table-column width="220px" label="操作">
      <ul class="handle-menus" slot-scope="scope">
        <li>
          <span  @click="handle2Detail(scope.row)" class="is-list-btn">
            <img src="@/assets/images/detail.png" alt />详情</span>
        </li>
        <li v-if="Permission.PermissionList.PermissionPromote.Obj.Setup">
          <span
           v-if="scope.row.Status === 0" @click="handleEditPromote(scope.row)" class="is-list-btn">
            <img src="@/assets/images/Compile.png" alt />编辑
          </span>
          <span v-else class="is-disabled">
            <img src="@/assets/images/Compile-disabled.png" alt />编辑
          </span>
        </li>
        <li v-if="Permission.PermissionList.PermissionPromote.Obj.PauseAndStart" class="stop-box">
          <span
           v-if="scope.row.Status === 1"
           @click="handlePausePromote(scope.row, scope.$index)"
           class="is-list-btn">
            <img src="@/assets/images/stop-y.png" alt />中止
          </span>
          <span v-else class="is-disabled">
            <img src="@/assets/images/stop-y-disabled.png" alt />中止
          </span>
        </li>
        <li v-if="Permission.PermissionList.PermissionPromote.Obj.Setup">
          <span
           v-if="scope.row.Status === 0"
           @click="handleCancelPromote(scope.row, scope.$index)"
           class="is-list-btn">
            <img src="@/assets/images/cancel.png" alt />取消
          </span>
          <span v-else class="is-disabled">
            <img src="@/assets/images/cancelstop.png" alt />取消
          </span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!promoteTableDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
// import { getProductArrayList, reg } from '../promoteUtils';

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('promoteStore', ['promoteTableDataLoading', 'PromoteListData']),
    ...mapState('common', ['Permission']),
    ...mapGetters('common', ['allAreaTreeList', 'allProductClassify']),
    localPromoteListData() {
      if (!Array.isArray(this.PromoteListData)) return [];
      return this.PromoteListData.map(it => ({
        ...it,
        ProductListArray: it.ProductList ? it.ProductList.map(_it => _it.ProductString).filter(_it => _it) : [],
      }));
    },
    // SellAreaArrayList() {
    //   if (this.allAreaTreeList.length === 0) return [];
    //   const _list = this.PromoteListData.map(data => data.SellAreaArray);
    //   const _tempList = _list.map(item => getAreaList(item, this.allAreaTreeList));
    //   if (!_tempList || _tempList.length === 0) return '';
    //   const list = _tempList.map(temp => {
    //     const _textArr = [];
    //     if (temp === '全部区域') return ['全部区域'];
    //     temp.forEach(l1 => {
    //       if (reg.test(l1.children[0])) {
    //         _textArr.push(`${l1.ClassName}全部区域`);
    //       } else {
    //         // _textArr.push(`${l1.ClassName}：`);
    //         let _text = `${l1.ClassName}：[`;
    //         l1.children.forEach((l2, i2) => {
    //           if (i2 > 0) _text += '、';
    //           if (reg.test(l2.children[0])) {
    //             _text += `${l2.ClassName}全部区域 `;
    //           } else {
    //             _text += `${l2.ClassName}: `;
    //             l2.children.forEach((l3, i) => {
    //               if (i === 0) _text += `${l3.ClassName}`;
    //               else _text += `、${l3.ClassName}`;
    //             });
    //           }
    //         });
    //         _text += ' ]';
    //         _textArr.push(_text);
    //       }
    //       // _text += ';';
    //     });
    //     return _textArr;
    //   });
    //   return list;
    // },
    // ProductListArray() {
    //   if (this.allProductClassify.length === 0) return [];
    //   let _list = this.PromoteListData.map(
    //     data => data.ProductList,
    //   ).map(item => {
    //     const _arr = [];
    //     item.forEach(it => {
    //       _arr.push(...it.LimitList);
    //     });
    //     return _arr;
    //   });
    //   _list = _list.map(item => getProductArrayList(item, this.allProductClassify));
    //   if (!_list || _list.length === 0) return '';
    //   //  console.log(_list);
    //   const list = _list.map(temp => {
    //     const _textArr = [];
    //     if (temp === '全部产品') return ['全部产品'];
    //     temp.forEach(l1 => {
    //       if (reg.test(l1.children[0])) {
    //         _textArr.push(`${l1.ClassName}全部产品`);
    //       } else {
    //         // _textArr.push(`${l1.ClassName}：`);
    //         let _text = `${l1.ClassName}：[`;
    //         l1.children.forEach((l2, i2) => {
    //           if (i2 > 0) _text += '、';
    //           if (reg.test(l2.children[0])) {
    //             _text += `全部${l2.ClassName}产品 `;
    //           } else {
    //             _text += `${l2.ClassName}: `;
    //             l2.children.forEach((l3, i) => {
    //               if (i === 0) _text += `${l3.ClassName}`;
    //               else _text += `、${l3.ClassName}`;
    //             });
    //           }
    //         });
    //         _text += ' ]';
    //         _textArr.push(_text);
    //       }
    //     });
    //     return _textArr;
    //   });
    //   return list;
    // },
  },
  components: {
    TableItemShowComp,
  },
  methods: {
    ...mapMutations('promoteStore', ['writeBackPromoteAddRequestObj', 'setPromoteStaffList', 'setStatusInPromoteListData']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-promote-page-header-wrap', 55);
      this.h = tempHeight;
    },
    handle2Detail(data) {
      this.writeBackPromoteAddRequestObj(data);
      this.setPromoteStaffList(data.ApplyUser);
      const type = 'detail';
      this.$router.push({ name: 'promoteAdd', params: { type } });
    },
    handleEditPromote(data) {
      if (data.Status > 0) {
        this.messageBox.warnSingleError('只有未开始状态才能编辑', null, null);
        return;
      }
      this.writeBackPromoteAddRequestObj(data);
      this.setPromoteStaffList(data.ApplyUser);
      const type = 'edit';
      this.$router.push({ name: 'promoteAdd', params: { type } });
    },
    handleCancelPromote(data, index) {
      this.messageBox.warnCancelNullMsg('确定取消该活动吗 ?', () => this.go2Cancel(data, index), null);
    },
    async go2Pause(data, index) {
      const { PromoteID } = data;
      const res = await this.api.PausePromote({ PromoteID });
      if (res.data.Status === 1000) {
        this.messageBox.successSingle('终止成功', () => { this.setStatusInPromoteListData([index, 2]); }, () => { this.setStatusInPromoteListData([index, 2]); });
      }
    },
    async go2Cancel(data, index) {
      const { PromoteID } = data;
      const res = await this.api.cancelPromote(PromoteID);
      if (res.data.Status === 1000) {
        // eslint-disable-next-line max-len
        this.messageBox.successSingle('活动取消成功!', () => { this.setStatusInPromoteListData([index, 255]); }, () => { this.setStatusInPromoteListData([index, 255]); });
      }
    },
    handlePausePromote(data, index) {
      if (data.Status === 2) {
        this.$message.error('当前活动已是中止状态!');
        return;
      }
      this.messageBox.warnCancelNullMsg('确定中止该活动吗 ?', () => this.go2Pause(data, index), null);
    },
    getAreaContent(item) {
      const temp = { List: item.AreaList, IsIncludeIncreased: item.IsIncludeIncreasedArea };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allAreaTreeList);
      return content;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-promote-page-main-table {
  border-color: #e5e5e5;
  &.el-table::before {
    display: none;
  }
  .el-table__header-wrapper .el-table__header thead {
    tr {
      th {
        font-size: 14px;
        .cell {
          height: 34px;
          line-height: 34px;
          color: $--color-text-primary;
        }
      }
    }
  }
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: $--color-text-primary;
    .handle-menus {
      display: flex;
      justify-content: space-between;
      &:before,
      &:after {
        content: "";
        display: block;
      }
      > li {
        padding: 0 5px;
        flex: none;
        > span {
          font-size: 12px;
          display: block;
          height: 100%;
          cursor: pointer;
          > img {
            vertical-align: middle;
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }
          &.is-blue:hover {
            color: $--color-text-primary !important;
          }
          &.is-red:hover {
            color: $--color-text-orgin !important;
          }
          &.is-gray:hover {
            cursor: not-allowed;
          }
        }
        &.stop-box > span > img{
          position: relative;
          top: -1px;
        }
        &:last-of-type {
          > span > img {
            position: relative;
            top: -1px;
          }
        }
      }
    }
    &.is-gray > .cell {
      font-size: 12px;
    }
    > .cell {
      // font-size: 12px;
      > span {
        &.status-2 {
          color: $--color-text-table-pending;
        }
        &.status-1 {
          color: $--color-text-table-completed;
        }
        &.status-255 {
          color: $--color-text-secondary;
        }
        &.area-span {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 24px;
          line-height: 24px;
        }
      }
      height: 24px;
      line-height: 24px;
    }
  }
}

  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    // white-space: pre;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
  }
</style>
