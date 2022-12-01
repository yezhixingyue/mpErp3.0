<template>
  <el-table
    class="mp-erp-factory-manage-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    :data="dataList"
    stripe
    border
    fit
    style="width: 100%"
   >
    <el-table-column prop="FactoryName" label="工厂名称" min-width="160">
    </el-table-column>
    <el-table-column prop="Address" label="工厂地址" min-width="360">
      <span slot-scope="scope" class="is-gray">{{getAddName(scope.row)}}</span>
    </el-table-column>
    <el-table-column prop="LinkMan" label="联系人" min-width="130"> </el-table-column>
    <el-table-column prop="Mobile" label="联系电话" min-width="115"> </el-table-column>
    <el-table-column prop="Mobile" label="外发产品" min-width="80">
      <template slot-scope="scope">
          {{scope.row.ProductNumber}}个
      </template>
    </el-table-column>
    <el-table-column prop="Convert.Name" label="转换服务器" min-width="130"> </el-table-column>
    <!-- <el-table-column prop="Convert.Name" label="转换器" min-width="130"> </el-table-column> -->
    <el-table-column label="操作" width="320">
      <div class="menu-list" slot-scope="scope" >
        <span v-if="Permission && Permission.PermissionList.PermissionSetupFactoryBase.Obj.SetupPrice" @click="onSettingClick(scope.row)"><i></i>外发设置</span>
        <template v-if="Permission && Permission.PermissionList.PermissionSetupFactoryBase.Obj.Setup">
          <span @click="onEditClick(scope.row)"><i></i>编辑</span>
          <span @click="onRemoveClick(scope.row)"><i></i>删除</span>
        </template>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-if="filterWords">当前关键字为：{{filterWords}}， 筛选出条目为0， 请尝试更换搜索关键字</span>
      <span v-else>暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { mapState } from 'vuex';

export default {
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
    filterWords: {},
    getAddName: {
      type: Function,
      default: () => {},
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 105);
      this.h = tempHeight;
    },
    onSettingClick(itemData) {
      this.$emit('handleAddressItemSetting', itemData);
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
.mp-erp-factory-manage-page-table-comp-wrap {
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
              &:first-of-type > i {
                width: 12px;
                height: 16px;
                background: url(../../assets/images/setup.png) no-repeat center center/14px 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
