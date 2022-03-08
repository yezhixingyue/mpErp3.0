<template>
  <el-table
    class="mp-logistic-list-page-table-comp-wrap"
    :class="{sorting: isSorting}"
    ref="singleTable"
    :max-height="h"
    :height="h"
    :data="localDataList"
    stripe
    border
    fit
    style="width: 100%"
   >
    <!-- <el-table-column type="index" width="60" label="排序">
      <span slot-scope="scope" :class="(curMoveIndex === scope.$index) && sorting ? 'just-now-move-index' : ''">{{scope.$index + 1}}</span>
    </el-table-column> -->
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column width="520" label="排序调整" v-if="sorting && false">
      <ul slot-scope="scope" class="mp-sort-change-box" :class="curMoveIndex === scope.$index ? 'just-now-move' : ''">
        <li class="blue-span" @click="onSortChange(0, scope, true)" :class="scope.$index === 0 ? 'disabled':''">
          <i style="font-size:17px;vertical-align: -2px;" class="el-icon-top"></i>置顶</li>
        <li class="blue-span" @click="onSortChange(scope.$index === 0 ? scope.$index : scope.$index - 1, scope)" :class="scope.$index === 0 ? 'disabled':''">
          <i style="font-size:15px;vertical-align: 0px;" class="el-icon-sort-up"></i>上移
        </li>
        <li class="blue-span" :class="scope.$index === sortDataList.length - 1 ? 'disabled':''"
         @click="onSortChange(scope.$index ===  sortDataList.length - 1 ? scope.$index : scope.$index + 1, scope)">
          <i style="font-size:15px;vertical-align: -2px;" class="el-icon-sort-down"></i>下移</li>
        <li class="jump-box">
          <span style="color:#888E99">跳转指定位置：</span>
          <el-input-number
            @keyup.enter.native="e => onKeyupEnter(e, scope.row.index - 1, scope)"
            @focus="onInpNumFocus"
            v-model="scope.row.index"
            :min="1"
            :max="sortDataList.length">
          </el-input-number>
          <span style="margin-left:10px" @click="onSortChange(scope.row.index - 1, scope, true)" class="blue-span">确定</span>
        </li>
      </ul>
    </el-table-column>
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址" width="1000"> </el-table-column>
  </el-table>
</template>

<script>
import sortable from 'sortablejs';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  props: {
    sorting: {
      type: Boolean,
      default: false,
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      sortDataList: [],
      curMoveIndex: null,
      sortItem: null,
    };
  },
  computed: {
    isSorting() {
      if (!this.dataList || this.dataList.length === 0) return false;
      return this.sorting;
    },
    localDataList() {
      return this.sorting ? this.sortDataList : this.dataList;
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 175);
      this.h = tempHeight;
    },
    onInpNumFocus(e) {
      e.target.select();
    },
    onKeyupEnter(e, num, item) {
      if (num === item.$index) return;
      this.onSortChange(num, item, true);
      e.target.blur();
    },
    onSortChange(num, { $index }, showTip = false) {
      if (num === $index) return;
      const t = this.sortDataList[$index];
      this.sortDataList.splice([$index], 1); // 删除
      this.sortDataList.splice(num, 0, t);
      this.curMoveIndex = num;
      this.setTableDataIndex();
      if (showTip) {
        const message = num === 0 ? '已置顶' : '已调整';
        this.$message({ showClose: true, message, type: 'success', offset: '10' });
      }
    },
    setTableDataIndex() {
      if (!this.sortDataList || this.sortDataList.length === 0) return;
      this.sortDataList = this.sortDataList.map((it, i) => ({ ...it, index: i + 1 }));
    },
    handleTableToSort() { // 开启排序状态
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const ops = {
        onEnd: (evt) => {
          const { newIndex, oldIndex } = evt;
          this.onSortChange(newIndex, { $index: oldIndex });
          const temp = this.sortDataList;
          this.sortDataList = [];
          this.$nextTick(() => { this.sortDataList = temp; });
        },
      };
      this.sortItem = sortable.create(tbody, ops);
    },
  },
  watch: {
    isSorting: {
      immediate: false,
      handler(bool) {
        if (bool) {
          this.sortDataList = this.dataList;
          this.setTableDataIndex();
          this.$nextTick(() => {
            this.handleTableToSort();
          });
        } else if (this.sortItem) {
          this.sortItem.destroy();
        }
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-logistic-list-page-table-comp-wrap {
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      width: 100%;
      > td {
        > .cell {
          font-size: 14px;
          height: 30px;
          .just-now-move-index {
            color: #428dfa;
          }
          .mp-sort-change-box {
            display: flex;
            align-items: center;
            font-size: 12px;
            justify-content: space-around;
            > li {
              display: flex;
              align-items: center;
              cursor: pointer;
              user-select: none;
              > .el-button {
                width: 30px;
                height: 30px;
                padding: 0;
                margin-left: 8px;
                background-color: #428dfa;
                border-color: #428dfa;
              }
              &.jump-box {
                .el-input-number {
                  width: 135px;
                  line-height: 28px;
                  .el-input {
                    .el-input__inner {
                      line-height: 28px;
                      height: 30px;
                    }
                  }
                }
              }
            }
            &.just-now-move {
              .blue-span:not(.disabled) {
                color: #428dfa !important;
              }
              .el-input-number .el-input__inner {
                border-color: rgba(66, 141, 250, 0.75);
                color: #428dfa;
                font-weight: 700;
                transition: 0.05 ease-in-out;
              }
            }
          }
        }
      }
      &.current-row {
        > td {
          background-color: #659ff0 !important;
        }
        &:hover {
          > td {
            background-color: #659ff0 !important;
          }
        }
      }
    }
  }
  &.sorting .el-table__body-wrapper .el-table__row {
    cursor: move;
  }
}
</style>
