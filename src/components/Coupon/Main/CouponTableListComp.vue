<template>
<el-table
    class="mp-coupon-table-list-comp-wrap mp-common-table-styles"
    :max-height="h"
    :height="h"
    fit
    :data="couponListData"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="75px" prop="InternalSN" label="内部代号"></el-table-column>
    <el-table-column show-overflow-tooltip min-width="70px" label="金额">
      <template slot-scope="scope">
        <span class="is-origin is-thick-line is-font-size-14">{{scope.row.Data.Amount}}元</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="88px" label="满额">
      <template slot-scope="scope">
        <span class="is-font-size-14">满{{scope.row.Data.MinPayAmount}}元</span>
      </template>
    </el-table-column>
    <el-table-column min-width="130px" label="限产品">
      <template slot-scope="scope" v-if="ProductListArray && ProductListArray[scope.$index]">
        <el-tooltip placement="top-start" :enterable='false' >
          <div slot="content">
              <p v-for="(item, i) in ProductListArray[scope.$index]" :key="item + '---' + i">
                {{ item }}
              </p>
          </div>
          <span class="area-span">{{ ProductListArray[scope.$index].join(' ') }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column min-width="130px" label="使用区域">
      <template slot-scope="scope">
        <TableItemShowComp :list='getAreaContent(scope.row)' effect='dark' />
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="78px" label="用户类型">
      <template slot-scope="scope">{{scope.row.CustomerTypeList | formatPromoteCustomerType
      }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="78px" label="用户等级">
      <template slot-scope="scope">{{scope.row.GradeList | formatPromoteCustomerGrade}}
      </template>
    </el-table-column>

    <el-table-column show-overflow-tooltip min-width="85px" label="下单渠道">
      <template slot-scope="scope">{{scope.row.OrderTypeList | formatPromoteOrderType}}
      </template>
    </el-table-column>
    <el-table-column min-width="65px" class-name='two-layers-wrap left' label="状态">
      <template slot-scope="scope">
        <div>
          <span
           :class="{
             'is-pink':scope.row.ProvideStatus === 2,
             'is-success':scope.row.ProvideStatus === 1,
            }"
           >{{scope.row.ProvideStatus | formatProvideStatus}}</span>
          <span
           :class="{
             'is-pink':scope.row.UseStatus === 2,
             'is-success':scope.row.UseStatus === 1,
            }"
           >{{scope.row.UseStatus | formatUseStatus}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="75px" class-name='two-layers-wrap left' label="生成/总数">
      <template slot-scope="scope">
        <div>
          <span><i>{{scope.row.Data.GenerateNumber}}</i>张</span>
          <span><i>{{scope.row.Data.TotalNumber}}</i>张</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="75px" class-name='two-layers-wrap left' label="使用/激活">
      <template slot-scope="scope">
        <div>
          <span><i>{{scope.row.Data.UseNumber}}</i>张</span>
          <span><i>{{scope.row.Data.BindNumber}}</i>张</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="140px"  class-name='two-layers-wrap' label="发放起止时间">
      <template slot-scope="scope">
        <div class="is-gray">
          <span>{{scope.row.ProvideStartTime | format2LangTypeDate}}</span>
          <span>{{scope.row.ProvideEndTime | format2LangTypeDate}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="140px" class-name='two-layers-wrap' label="有效期起止时间">
      <template slot-scope="scope">
        <div class="is-gray">
          <span>{{scope.row.ValidStartTime | format2LangTypeDate}}</span>
          <span>{{scope.row.ValidEndTime | format2LangTypeDate}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="65px" prop="ApplyUser.StaffName" label="申请人"></el-table-column>
    <el-table-column min-width="65px" prop="OperateUser.StaffName" label="操作人"></el-table-column>

    <el-table-column width="356px" label="操作">
      <ul class="handle-menus" slot-scope="scope">
        <li class="stop-box" v-if="Permission.PermissionList.PermissionCoupon.Obj.Generate">
          <span class="is-list-btn"
           @click="onGenerateCoupons(scope.row, scope.$index, ProductListArray[scope.$index])">
            <img src="@/assets/images/edit-icon.png" alt />手动生成
          </span>
        </li>
        <li v-if="Permission.PermissionList.PermissionCoupon.Obj.Query">
          <span
           v-if="scope.row.Data.GenerateNumber > 0"
           @click="handle2Detail(scope.row, ProductListArray[scope.$index])"
           class="is-list-btn"><img src="@/assets/images/detail.png" alt />查看使用列表</span>

          <span v-else class="is-disabled">
            <img src="@/assets/images/detail-gray.png" alt />查看使用列表</span>
        </li>
        <li v-if="Permission.PermissionList.PermissionCoupon.Obj.Setup">
          <span
           v-if="scope.row.ProvideStatus === 0"
           class="is-list-btn"
           @click="handleEditClick(scope.row)">
            <img src="@/assets/images/Compile.png" alt />编辑
          </span>
          <span v-else class="is-disabled">
            <img src="@/assets/images/Compile-disabled.png" alt />编辑
          </span>
        </li>
        <li v-if="Permission.PermissionList.PermissionCoupon.Obj.Setup">
          <span
            v-if="scope.row.Data.GenerateNumber === 0"
            @click="handleDeleteClick(scope.row, scope.$index)"
            class="is-list-btn">
            <img src="@/assets/images/del.png" alt />删除
          </span>
          <span v-else
           class="is-disabled">
            <img src="@/assets/images/del-disabled.png" alt />删除
          </span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!tableDataLoading">暂无数据</span>
      <span v-show="tableDataLoading && initLoading" style="margin-top: -80px">
        <i style="font-size: 20px;color:#428dfa" class="el-icon-loading"></i> 正在加载数据...，请稍候
      </span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';
import { getAreaList, getProductArrayList, reg } from '../../Promote/promoteUtils';

export default {
  mixins: [tableMixin],
  components: {
    TableItemShowComp,
  },
  computed: {
    ...mapState('couponStore', ['couponListData', 'tableDataLoading']),
    ...mapGetters('common', ['allProductClassify', 'allAreaTreeList']),
    ...mapState('common', ['CouponProvideStatusList', 'CouponUseStatusList', 'Permission']),

    SellAreaArrayList() {
      if (this.allAreaTreeList.length === 0) return [];
      const _list = this.couponListData.map(data => data.SellAreaArray);
      const _tempList = _list.map(item => getAreaList(item, this.allAreaTreeList));
      if (!_tempList || _tempList.length === 0) return '';
      const list = _tempList.map(temp => {
        const _textArr = [];
        if (temp === '全部区域') return ['全部区域'];
        temp.forEach(l1 => {
          if (reg.test(l1.children[0])) {
            _textArr.push(`${l1.ClassName}全部区域`);
          } else {
            // _textArr.push(`${l1.ClassName}：`);
            let _text = `${l1.ClassName}：[`;
            l1.children.forEach((l2, i2) => {
              if (i2 > 0) _text += '、';
              if (reg.test(l2.children[0])) {
                _text += `${l2.ClassName}全部区域 `;
              } else {
                _text += `${l2.ClassName}: `;
                l2.children.forEach((l3, i) => {
                  if (i === 0) _text += `${l3.ClassName}`;
                  else _text += `、${l3.ClassName}`;
                });
              }
            });
            _text += ' ]';
            _textArr.push(_text);
          }
          // _text += ';';
        });
        return _textArr;
      });
      return list;
    },
    ProductListArray() {
      if (this.allProductClassify.length === 0) return [];
      let _list = this.couponListData.map(
        data => data.ProductList,
      );
      _list = _list.map(item => getProductArrayList(item, this.allProductClassify));
      if (!_list || _list.length === 0) return '';
      //  console.log(_list);
      const list = _list.map(temp => {
        const _textArr = [];
        if (temp === '全部产品') return ['全部产品'];
        temp.forEach(l1 => {
          if (reg.test(l1.children[0])) {
            _textArr.push(`${l1.ClassName}全部产品`);
          } else {
            // _textArr.push(`${l1.ClassName}：`);
            let _text = `${l1.ClassName}：[`;
            l1.children.forEach((l2, i2) => {
              if (i2 > 0) _text += '、';
              if (reg.test(l2.children[0])) {
                _text += `全部${l2.ClassName}产品 `;
              } else {
                _text += `${l2.ClassName}: `;
                l2.children.forEach((l3, i) => {
                  if (i === 0) _text += `${l3.ClassName}`;
                  else _text += `、${l3.ClassName}`;
                });
              }
            });
            _text += ' ]';
            _textArr.push(_text);
          }
        });
        return _textArr;
      });
      return list;
    },
  },
  methods: {
    ...mapActions('couponStore', ['getCouponList']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-coupon-page-header-wrap', 48);
      this.h = tempHeight;
    },
    onGenerateCoupons(rowData, index, productInfo) {
      const _obj = rowData;
      this.$emit('handleOpenDialog', [_obj, index, productInfo]);
    },
    handleDeleteClick(rowData, index) {
      const { CouponID } = rowData;
      this.messageBox.warnCancelNullMsg('确定要删除该条优惠券吗?', () => {
        this.$store.dispatch('couponStore/removeCoupon', [CouponID, index]);
      });
    },
    handleEditClick(rowData) {
      this.$store.commit('couponStore/backfillCondition2CouponSave', rowData);
      this.$store.commit('couponStore/setAddPageCurStaff', rowData.ApplyUser);
      this.$router.push({ name: 'couponAdd', params: { type: 'edit' } });
    },
    handle2Detail(rowData, productInfo) {
      const { GenerateNumber } = rowData.Data;
      if (GenerateNumber === 0) {
        this.messageBox.failSingle('当前优惠券尚未生成可用数量!');
        return;
      }
      this.$store.commit('couponStore/setCondition2CouponUseList', [['ID', ''], rowData.CouponID]);
      this.$store.commit('couponStore/setInfo2CouponUseListPage', [rowData, productInfo]);
      this.$router.push({ name: 'couponDetailList' });
    },
    getAreaContent(item) {
      const temp = { List: item.AreaList, IsIncludeIncreased: item.IsIncludeIncreasedArea };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allAreaTreeList);
      return content;
    },
  },
  async mounted() {
    this.initLoading = true;
    this.$store.commit('couponStore/clearCondition2ListData');
    await this.getCouponList();
    this.initLoading = false;
  },
};
</script>

<style lang="scss">
.mp-coupon-table-list-comp-wrap.mp-common-table-styles {
  > .el-table__body-wrapper {
    > .el-table__body {
      > tbody > tr {
        > td {
          // height: 48px;
          &.two-layers-wrap {
            padding: 0;
            > div.cell {
              padding: 0;
              > div {
                display: flex;
                flex-direction: column;
                > span {
                  line-height: 14px;
                  > i {
                    min-width: 45px;
                    display: inline-block;
                    text-align: right;
                  }
                }
              }
            }
            &.left > div.cell {
              padding-left: 5px !important;
              > div > span {
                text-align: left;
              }
            }
          }
          > div.cell {
            padding: 0 3px;
            > .handle-menus {
              display: flex;
              justify-content: space-between;
              &:before,
              &:after {
                content: '';
                display: block;
              }
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
  > .el-table__header-wrapper .el-table__header thead tr th.two-layers-wrap {
      // .cell {
      //   // text-align: left;
      // }
      &.left {
        .cell {
          text-align: left;
          padding-left: 9px !important;
        }
      }
  }
}
</style>
