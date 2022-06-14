<template>
  <el-table
    class="mp-erp-factory-manage-setup-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    :data="dataList"
    stripe
    border
    fit
    style="width: 100%"
   >
    <el-table-column prop="Product.ProductName" label="产品名称" min-width="160">
      <span slot-scope="scope">
        {{getClassName(scope.row.Product.FirstLevelID)}}-{{getClassName(scope.row.Product.SecondLevelID)}}-{{scope.row.Product.ProductName}}
      </span>
    </el-table-column>
    <el-table-column prop="Price.Name" label="价格名称" min-width="360">
      <!-- <span class="is-gray">aaaa</span> -->
    </el-table-column>
    <el-table-column label="操作" width="320">
      <div class="menu-list" slot-scope="scope">
        <span @click="onEditClick(scope.row)"><i></i>编辑</span>
        <span @click="onRemoveClick(scope.row)"><i></i>删除</span>
      </div>
    </el-table-column>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
    ProductList: {
      type: Array,
      default: null,
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      search: '',
    };
  },
  computed: {
    getClassName() {
      return (ID) => {
        const resp = this.ProductList.filter(res => res.ID === ID);
        return resp && resp.length ? resp[0].ClassName : '';
      };
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 210.5);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('handleAddressItemEdit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('handleAddressItemRemove', itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-setup-page-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
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
                width: 14px;
                height: 14px;
                background: url(../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 6px;
              }
              &:last-of-type > i {
                width: 12px;
                height: 16px;
                background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
