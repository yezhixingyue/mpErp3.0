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
    <el-table-column min-width="380px" label="产品">
      <template slot-scope="scope">
        <el-tooltip
         placement="top-start" popper-class='mp-common-table-tooltip' :enterable='false' >
          <div slot="content">
              <p v-for="(item, i) in getProduct4TwoLevel(scope.row.ProductList)"
               :key="item + '---' + i">
                <span v-for="(it2, i2) of item" :key="it2 + '---' + i2">
                  {{it2}}
                  <i v-if="i2 < item.length - 1">、</i>
                </span>
              </p>
          </div>
          <span>{{getProduct4TwoLevel(scope.row.ProductList).join('、')}}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column min-width="120px" label="规则">
      <template slot-scope="scope">
        <span>金额 ≥ {{scope.row.MinAmount}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="108px" label="定金比例">
      <template slot-scope="scope">
        <span>{{scope.row.Percent}}%</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="210px" label="客户类型">
      <template slot-scope="scope">{{scope.row.CustomerTypeList | formatPromoteCustomerType
      }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="210px" label="客户等级">
      <template slot-scope="scope">{{scope.row.GradeList | formatPromoteCustomerType
      }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="260px" label="物流">
      <template slot-scope="scope">
        <span>{{scope.row.LogisticsList | formatPromoteCustomerType
      }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="155px" label="是否扣物流费用">
      <template slot-scope="scope">
        <span v-if="scope.row.IsChargeFreight">是</span>
        <span v-else class="is-gray">否</span>
      </template>
    </el-table-column>

    <el-table-column width="280px" label="操作">
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

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('deposit', ['listData', 'tableDataLoading']),
    ...mapState('common', ['Permission']),
    ...mapGetters('common', ['twoLevelsProductClassify']),
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
      this.messageBox.warnCancelNullMsg('确定删除该条定金设置信息吗?', () => {
        this.$store.dispatch('deposit/removeDepositSetting', [ID, index]);
      });
    },
    getProduct4TwoLevel(data) {
      const _list = data.map(it => it.SecondLevelID); // 由选中二级分类ID组件的数组
      const _arr = [];
      this.twoLevelsProductClassify.forEach(level1 => {
        let _tempArr = [];
        level1.children.forEach(level2 => {
          if (_list.includes(level2.ID)) {
            _tempArr.push(`[ ${level1.ClassName} - ${level2.ClassName} ]`);
          }
        });
        if (_tempArr.length === level1.children.length) _tempArr = [`[ 全部${level1.ClassName}产品 ]`];
        if (_tempArr.length > 0) _arr.push(_tempArr);
      });
      const _arr2 = [];
      _arr.forEach(it => {
        _arr2.push(...it);
      });
      if (_arr2.length === this.twoLevelsProductClassify.length && _arr2.length > 0) {
        const reg = /^\[ 全部/;
        let _key = true;
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < _arr2.length; index++) {
          const item = _arr2[index];
          if (!reg.test(item)) _key = false;
        }
        if (_key) return [['全部产品']];
      }
      return _arr;
    },
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
              }
              > .handle-menus {
                display: flex;
                justify-content: space-between;
                &:before,
                &:after {
                  content: '';
                  display: block;
                }
                padding-right: 50px;
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
