<template>
  <el-table
    class="mp-erp-element-template-page-element-group-table-comp-wrap"
    :data="localTableData"
    stripe
    border
    fit
    style="max-width: 1600px"
   >
    <el-table-column prop="Name" label="名称" width="185"></el-table-column>
    <el-table-column prop="NameHiddenStringify" label="界面隐藏名称" width="130"></el-table-column>
    <el-table-column prop="UseTimesText" label="使用次数" width="200"></el-table-column>
    <el-table-column prop="ArrangeText" label="排列方式" width="130"></el-table-column>
    <el-table-column prop="CustomerHiddenStringify" label="客户界面" width="140"></el-table-column>
    <el-table-column prop="ElementSetText" label="元素集" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" width="270">
      <div class="menu-list" slot-scope="scope" v-if="!nonePermission">
        <span @click="onSortClick(scope.row)"><i></i>元素排序</span>
        <span @click="onEditClick(scope.row)"><i></i>编辑</span>
        <span @click="onRemoveClick(scope.row)"><i></i>删除</span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-if="!loading">暂无数据</span>
      <span v-else>加载中...</span>
    </div>
  </el-table>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  mixins: [recordScrollPositionMixin('.mp-erp-element-template-page-element-group-table-comp-wrap .el-table__body-wrapper')],
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    nonePermission: { // 是否没有权限 默认false为有
      type: Boolean,
      default: false,
    },
  },
  computed: {
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        ...this.getLocalInfoNames(it),
      }));
    },
  },
  methods: {
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    onSortClick(itemData) {
      if (itemData.ElementList && Array.isArray(itemData.ElementList)) {
        if (itemData.ElementList.length > 1) {
          this.$emit('sort', itemData);
        } else if (itemData.ElementList.length <= 1) {
          this.messageBox.failSingleError('操作失败', '当前元素组中元素数量不足2个，不支持排序');
        }
      }
    },
    getLocalInfoNames(itemData) { // 表格数据转换
      const { IsNameHidden, HiddenToCustomer, UseTimes, IsHorizontalDisplay, ElementList } = itemData;
      const NameHiddenStringify = IsNameHidden ? '隐藏' : '显示';
      const CustomerHiddenStringify = HiddenToCustomer ? '隐藏' : '显示';
      let UseTimesText = '';
      if (UseTimes && Object.prototype.toString.call(UseTimes) === '[object Object]') {
        const { MinValue, MaxValue } = UseTimes;
        if ((MinValue || MinValue === 0) && (MaxValue || MaxValue === 0)) {
          UseTimesText = `${MinValue}≤ 次数 ≤${MaxValue}`;
        }
      }
      const ArrangeText = IsHorizontalDisplay ? '横排' : '竖排';
      const _tempList = [...ElementList];
      const ElementSetText = _tempList.sort((a, b) => a.Index - b.Index).map(it => it.Name).join('、');
      return {
        NameHiddenStringify, // 界面是否隐藏名称
        CustomerHiddenStringify, // 客户界面是否隐藏
        UseTimesText,
        ArrangeText,
        ElementSetText,
      };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-element-template-page-element-group-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  min-height: 222px;
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      width: 100%;
      > td {
        > .cell {
          font-size: 12px;
          height: 30px;
          .menu-list {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 12px;
            > span {
              color: #a2a2a2;
              transition: color 0.05s ease-in-out;
              cursor: pointer;
              margin: 0 10px;
              display: flex;
              align-items: center;
              user-select: none;
              &:hover {
                color: #444;
              }
              > i {
                width: 22px;
                height: 16px;
                background: url(../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 4px;
              }
              &:first-of-type > i {
                background: url(../../assets/images/upIcon.png) no-repeat center center/22px 12px;
                margin-right: 6px;
              }
              &:last-of-type > i {
                background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
  .el-table__empty-block {
    min-height: 150px;
  }
}
</style>
