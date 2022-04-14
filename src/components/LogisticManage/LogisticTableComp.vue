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
    <el-table-column prop="Name" label="名称" min-width="160" show-overflow-tooltip></el-table-column>
    <el-table-column prop="_TypeContent" label="类型" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column label="启用状态" width="100" show-overflow-tooltip>
      <span slot-scope="scope" :class="scope.row.IsEnabled ? 'is-success' : 'is-pink'">{{scope.row._EnableContent}}</span>
    </el-table-column>
    <el-table-column prop="_PriceRecord" label="价格记录" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="_RelationContent" label="关联快递打单" min-width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="_StationContent" label="关联物流配送" width="150" show-overflow-tooltip></el-table-column>
    <!-- <el-table-column label="" min-width="50" class-name="blank"></el-table-column>
    <el-table-column label="" width="185" v-if="localPermission.Setup">
      <div slot-scope="scope" class="menus">
        <span class="blue-span" @click="onRelationLinkClick(scope.row)">关联快递打单</span>
        <span class="blue-span" @click="onStationLinkClick(scope.row)">关联物流配送</span>
      </div>
    </el-table-column> -->
    <el-table-column label="操作" width="540" v-if="localPermission.Setup" class-name="ctrl">
      <div slot-scope="scope" class='menus'>
        <span class="blue-span" @click="onRelationLinkClick(scope.row)">关联快递打单</span>
        <span class="blue-span" @click="onStationLinkClick(scope.row)">关联物流配送</span>
        <CtrlMenus
          @setup='onSetupPriceClick(scope.row)'
          @edit='onEditClick(scope.row)'
          @remove='onRemoveClick(scope.row)'
          :showList="['setup', 'edit', 'del']"
          setupCostText='设置价格'
        />
      </div>
    </el-table-column>
    <!-- <el-table-column width="520" label="排序调整" v-if="sorting && false">
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
    </el-table-column> -->
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import sortable from 'sortablejs';
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { logisticTypeEnumList, OutPlatTypeEnumList } from '../../assets/js/TypeClass/LogisticTypeClass/logisticEnums';

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
    ThirdPlatExpressList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-logistic-manage-list-page-wrap .el-table__body-wrapper')],
  components: {
    CtrlMenus,
  },
  data() {
    return {
      sortDataList: [],
      curMoveIndex: null,
      sortItem: null,
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionManageLogistics?.Obj || {};
    },
    _dataList() {
      return this.dataList.map(it => ({
        ...it,
        _TypeContent: this.getTypeContent(it),
        _EnableContent: it.IsEnabled ? '已启用' : '未启用',
        _PriceRecord: `${it.RecordCount > 0 ? '有' : '无'}价格（${it.RecordCount}条记录）`,
        _RelationContent: this.getRelationContent(it, this.ThirdPlatExpressList),
        _StationContent: this.getStationContent(it),
      }));
    },
    isSorting() {
      if (!this._dataList || this._dataList.length === 0) return false;
      return this.sorting;
    },
    localDataList() {
      return this.sorting ? this.sortDataList : this._dataList;
    },
  },
  methods: {
    setHeight() {
      const d = this.localPermission.Setup ? 175 : 20;
      const tempHeight = this.getHeight('', d);
      this.h = tempHeight;
    },
    getTypeContent({ Type }) {
      return this.$utils.getNameFromListByIDs(Type, logisticTypeEnumList);
    },
    getStationContent({ StationName, DistrictName }) {
      const connector = StationName && DistrictName ? ' - ' : '';
      return `${StationName || ''}${connector}${DistrictName || ''}`;
    },
    getRelationContent({ RelationList }, ThirdPlatExpressList) { // OutPlatTypeEnumList
      if (!Array.isArray(RelationList) || RelationList.length === 0) return '';
      const list = RelationList.map(({ OutPlatType, ThirdID }) => {
        const t1 = OutPlatTypeEnumList.find(it => it.ID === OutPlatType);
        const _OutPlatContent = t1 ? t1.Name : '';
        const t2 = ThirdPlatExpressList.find(it => it.First === ThirdID);
        const _ThirdContent = t2 ? t2.Second : '';
        if (_ThirdContent && _OutPlatContent) {
          return `${_ThirdContent} (${_OutPlatContent})`;
        }
        return '';
      }).filter(it => it);
      return list.join('、');
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
    onRelationLinkClick(item) { // 关联快递打单
      this.$emit('linkRelation', item);
    },
    onStationLinkClick(item) { // 关联物流配送网点
      this.$emit('linkStation', item);
    },
    onSetupPriceClick(item) {
      this.$emit('setPrice', item);
    },
    onEditClick(item) { // 编辑
      this.$emit('edit', item);
    },
    onRemoveClick(item) { // 删除
      this.messageBox.warnCancelBox('确定删除该配送方式吗 ?', `名称：[ ${item.Name} ]`, () => {
        this.$emit('remove', item);
      }, null);
    },
  },
  watch: {
    isSorting: {
      immediate: false,
      handler(bool) {
        if (bool) {
          this.sortDataList = this._dataList;
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
          font-size: 13px;
          height: 30px;
          color: #585858;
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
          .menus {
            text-align: right;
            padding-right: 15px;
            > span {
              margin-right: 28px;
              font-size: 12px;
            }
            .ctrl-menus-container {
              width: 215px;
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
  &.el-table .has-gutter > tr > th.is-leaf.ctrl {
    text-align:right;
    padding-right: 100px;
  }
  &.sorting {
    .menus , .ctrl-menus-container {
      user-select: none;
      pointer-events: none;
      // > span {
      //   color: #989898 !important;
      //   filter: grayscale(1) !important;
      //   opacity: 0.5;
      // }
    }
  }
}
</style>
