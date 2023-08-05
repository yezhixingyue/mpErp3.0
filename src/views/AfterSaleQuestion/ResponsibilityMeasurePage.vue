<template>
  <section class="responsibility-measure-page">
    <header v-if="localPermission.DivideSetup">
      <mp-button type="primary" size="small" @click="EditClick()">添加问题类型</mp-button>
    </header>
    <div>
      <el-table stripe border fit :data="dataList" style="width: 100%" class="ft-14-table" :max-height="h-40" :height="h-40">
        <el-table-column prop="DivideName" label="问题类型" width="244" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductDescribe" label="产品" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{getResponsibilityMeasure(scope.row.ProductIDS)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="279" fixed="right" v-if="localPermission.DivideSetup">
          <div class="is-font-12 btn-wrap" slot-scope="scope">
            <span @click="onPhotoClick(scope.row)">
              <!-- <img src="@/assets/images/detail.png" alt /> -->
              <span>管理问题分类</span>
            </span>
            <span @click="EditClick(scope.row)">
              <!-- <img src="@/assets/images/detail.png" alt /> -->
              <span>编辑</span>
            </span>
            <span @click="DeleteClick(scope.row)">
              <!-- <img src="@/assets/images/detail.png" alt /> -->
              <span>删除</span>
            </span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <SaveOrderAfterSaleDivideDialog :disabledProducts="disabledProducts"
    @getList="getDataList(condition.Page)" :EditData.sync="editData" :visible.sync="showEdit"/>
    <footer>
      <el-button size="small" @click="onGoBackClick()" class="go-back">返回</el-button>
      <Count
       :watchPage='condition.Page'
       :handlePageChange='handlePageChange'
       :count='dataNumber'
       :pageSize='20'
       />
    </footer>
  </section>
</template>

<script>
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import ClassType from '@/store/CommonClassType';
import Count from '@/components/common/Count.vue';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import SaveOrderAfterSaleDivideDialog from '@/components/AfterSaleQuestion/SaveOrderAfterSaleDivideDialog';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ResponsibilityMeasurePage',
  components: {
    Count,
    SaveOrderAfterSaleDivideDialog,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],

  data() {
    return {
      showEdit: false,
      editData: null,
      dataList: [],
      disabledProducts: [],
      dataNumber: 0,
      h: 0,
      condition: {
        Page: 1,
      },
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ProductMultipleClassifyList']),
    ...mapGetters('common', ['allProductClassifyWithEmpty', 'allProductClassify4CustomerWithEmpty']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageAfterSales?.Obj) {
        return this.Permission.PermissionList.PermissionManageAfterSales.Obj;
      }
      return {};
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.responsibility-measure-page > header', 60);
      this.h = tempHeight;
    },
    getResponsibilityMeasure(IDS) {
      const returnData = [];
      this.allProductClassifyWithEmpty.forEach(lv1it => {
        const lv1Data = [];
        lv1it.children.forEach(lv2it => {
          const list = lv2it.children.filter(lv3it => IDS.find(it => lv3it.ID === it));
          if (list.length) {
            lv1Data.push({
              name: lv2it.ClassName,
              item: list,
            });
          }
        });
        if (lv1Data.length) {
          returnData.push({
            name: lv1it.ClassName,
            item: lv1Data,
          });
        }
      });
      return returnData.map(lv1 => `${lv1.name}:${lv1.item.map(lv2 => `${lv2.name}（${lv2.item.map(lv3 => lv3.ClassName)}）`)}`).join('；');
    },
    clearCondition() {
      this.condition = {
        Page: 1,
      };
    },
    onGoBackClick() {
      this.$router.replace('/Service');
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    setCondition([[key1, key2], value]) {
      if (key2) this.condition[key1][key2] = value;
      else this.condition[key1] = value;
    },
    async getDataList(page = 1) { // 获取列表数据
      this.condition.Page = page;
      const _obj = ClassType.filter(this.condition, true);
      this.dataList = [];
      const res = await this.api.getOrderAfterSaleDivideList(_obj).catch(() => null);
      if (res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.dataNumber = res.data.DataNumber;
      }
    },

    onPhotoClick(item) {
      this.$router.push({ name: 'QuestionClass', params: { item } });
    },
    EditClick(item) {
      this.disabledProducts = [];
      if (item) {
        this.editData = item;
        this.dataList.filter(it => it.ID !== item.ID).forEach(element => {
          this.disabledProducts.push(...element.ProductIDS);
        });
      } else {
        this.dataList.forEach(element => {
          this.disabledProducts.push(...element.ProductIDS);
        });
      }
      console.log(this.disabledProducts);
      this.showEdit = true;
    },
    DeleteClick(item) {
      const handleItemDel = () => {
        this.api.getOrderAfterSaleDivideRemove(item.ID).then(res => {
          if (res.data.Status === 1000) {
            this.getDataList(this.condition.Page);
          }
        });
      };
      this.messageBox.warnCancelBox('确定删除问题类型吗 ?', `问题类型：[ ${item.DivideName} ]`, handleItemDel, null);
    },

  },
  mounted() {
    this.getDataList();
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },

  beforeDestroy() {
    window.onresize = null;
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.responsibility-measure-page {
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  header{
    margin-bottom: 20px;
  }
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table{
    .el-table__fixed-right{
      tr:first-child{
        line-height: 36px;
        font-size: 14px;
      }
    }
    .btn-wrap{
      display: flex;
      justify-content: space-around;
      >span{
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #26bcf9;
        >span{
          margin-left: 4px;
        }
      }
    }
  }

  > footer {
    padding-top: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    >.el-button{
      &.go-back {
        border: 1px solid #26BCF9;
        color: #26BCF9;
        margin-left: 40px;
        height: 35px;
        width: 120px;
      }
    }
    .count-wrap{
      width: calc(50% - 60px);
    }
  }
}
</style>
