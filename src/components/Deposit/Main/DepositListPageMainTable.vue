<template>
<el-table
    class="mp-deposit-page-table-comp-wrap mp-common-table-styles"
    :max-height="h"
    :height="h"
    fit
    :data="listData"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="180px" label="限产品">
      <template slot-scope="scope">
        <el-tooltip popper-class="table-item" :enterable='true' placement="top-start">
          <ul slot="content">
            <li v-for="(it, i) in scope.row.ProductString.split('\n')" :key="i">{{it}}</li>
          </ul>
          <span>{{scope.row.ProductString}}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column min-width="180px" label="使用区域">
      <template slot-scope="scope">
        <TableItemShowComp :list='getAreaContent(scope.row)' effect='dark' />
      </template>
    </el-table-column>
    <el-table-column width="110px" label="规则">
      <template slot-scope="scope">
        <span>金额 ≥ {{scope.row.MinAmount}}</span>
      </template>
    </el-table-column>
    <el-table-column width="100px" label="定金比例">
      <template slot-scope="scope">
        <span>{{scope.row.Percent}}%</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="150px" label="客户类型">
      <template slot-scope="scope">{{scope.row.CustomerTypeList | formatPromoteCustomerType
      }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="150px" label="客户等级">
      <template slot-scope="scope">{{scope.row.GradeList | formatPromoteCustomerType
      }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="150px" label="物流">
      <template slot-scope="scope">
        <span>{{scope.row.LogisticsList | formatPromoteCustomerType
      }}</span>
      </template>
    </el-table-column>
    <el-table-column width="125px" label="是否扣物流费用">
      <template slot-scope="scope">
        <span v-if="scope.row.IsChargeFreight">是</span>
        <span v-else class="is-gray">否</span>
      </template>
    </el-table-column>

    <el-table-column width="200px" label="操作">
      <ul
         class="handle-menus"
         slot-scope="scope"
         v-if="Permission.PermissionList.PermissionSetupDeposit.Obj.Manage">
        <li>
          <span
           class="is-list-btn"
           @click="handleEditClick(scope.row)">
            <img src="@/assets/images/Compile.png" alt />编辑
          </span>
        </li>
        <li>
          <span
            @click="handleDeleteClick(scope.row, scope.$index)"
            class="is-list-btn">
            <img src="@/assets/images/del.png" alt />删除
          </span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!tableDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';

export default {
  mixins: [tableMixin],
  components: {
    TableItemShowComp,
  },
  computed: {
    ...mapState('deposit', ['listData', 'tableDataLoading']),
    ...mapState('common', ['Permission']),
    ...mapGetters('common', ['twoLevelsProductClassify', 'allAreaTreeList']),
  },
  methods: {
    ...mapActions('couponStore', ['getCouponUseList', 'getCustomerData', 'getOrderDetail']),
    setHeight() {
      const tempHeight = this.getHeight('', 90);
      this.h = tempHeight;
    },
    handleEditClick(rowData) {
      this.$store.commit('deposit/backfillObjForDepositAdd', rowData);
      this.$router.push({ name: 'depositSettingsAdd', params: { type: 'edit' } });
    },
    handleDeleteClick(rowData, index) {
      const { ID } = rowData;
      this.messageBox.warnCancelNullMsg('确定删除该条定金设置吗?', () => {
        this.$store.dispatch('deposit/removeDepositSetting', [ID, index]);
      });
    },
    getAreaContent(item) {
      const temp = { List: item.AreaList, IsIncludeIncreased: item.IsIncludeIncreasedArea };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allAreaTreeList);
      return content;
    },
  },
  mounted() {
    this.$store.dispatch('common/getAreaList');
  },
};
</script>

<style lang="scss">
.mp-deposit-page-table-comp-wrap.mp-common-table-styles {
  > .el-table__body-wrapper {
    > .el-table__body {
      > tbody > tr {
        > td {
            > div.cell {
              padding: 0 3px;
              > span.el-tooltip {
                display: inline-block;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                // height: 16px;
                line-height: 16px;
                position: relative;
                top: 3px;
                padding: 0 6px;
              }
              > .handle-menus {
                display: flex;
                justify-content: space-between;
                &:before,
                &:after {
                  content: '';
                  display: block;
                }
                padding-right: 20px;
                > li {
                  padding: 0 6px;
                  > span {
                    font-size: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    > img {
                      height: 15px;
                      margin-right: 5px;
                    }
                  }
                }
              }
          }
          }
        }
      }
    }
}
</style>
