<template>
  <section class="responsibility-measure-page">
    <header>
      <mp-button type="primary" size="small" @click="EditClick()">新增售后问题</mp-button>
    </header>
    <div>
      <el-table stripe border fit :data="dataList" style="width: 100%" class="ft-14-table" :max-height="h-40" :height="h-40">
        <el-table-column prop="DivideName" label="责任划分名称" width="244" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductDescribe" label="产品" minWidth="125" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{getResponsibilityMeasure(scope.row.ProductIDS)}}</template> -->
        </el-table-column>
        <el-table-column label="操作" width="279" fixed="right">
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
    <SaveOrderAfterSaleDivideDialog @getList="getDataList(condition.Page)" :EditData.sync="editData" :visible.sync="showEdit"/>
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
import { mapState } from 'vuex';

export default {
  name: 'FeedbackPage',
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
      dataNumber: 0,
      h: 0,
      condition: {
        Page: 1,
        PageSize: 20,
      },
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionAfterSalesApply?.Obj) {
        return this.Permission.PermissionList.PermissionAfterSalesApply.Obj;
      }
      return {};
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.responsibility-measure-page > header', 60);
      this.h = tempHeight;
    },
    clearCondition() {
      this.condition = {
        Page: 1,
        PageSize: 20,
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
      if (item) {
        this.editData = item;
      }
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
      this.messageBox.warnCancelBox('确定删除责任划分名称吗 ?', `责任划分名称：[ ${item.DivideName} ]`, handleItemDel, null);
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
