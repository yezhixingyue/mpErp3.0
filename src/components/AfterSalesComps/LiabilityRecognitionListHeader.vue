<template>
  <header class="mp-liability-recognition-page-header-wrap">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick"
    v-if="localPermission.BusinessQueryAll || localPermission.BusinessQueryDepartment || localPermission.AutoSoftManage || localPermission.OtherSoftManage">
      <el-tab-pane label="业务中心" name="businessCenter" v-if="localPermission.BusinessQueryAll || localPermission.BusinessQueryDepartment">
      </el-tab-pane>
      <el-tab-pane label="自动审稿软件" name="reviewSoftware" v-if="localPermission.AutoSoftManage">
      </el-tab-pane>
      <el-tab-pane label="其他软件" name="otherSoftware" v-if="localPermission.OtherSoftManage">
      </el-tab-pane>
      <el-tab-pane label="物流软件" name="logisticsCenter" v-if="localPermission.OtherSoftManage">
      </el-tab-pane>
    </el-tabs>
    <ul>
      <li>
        <div>
          <EpCascaderByProduct
            class="mr-12"
            :getList="getDataList"
            :setCondition="setCondition4DataList"
            :First="condition.ProductClass.ClassID"
            :Second="condition.ProductClass.TypeID"
            :ProductID="condition.ProductClass.ProductID"
            :typeList="[['ProductClass', 'ClassID'],['ProductClass', 'TypeID'],['ProductClass', 'ProductID']]"
          />
          <EpCascaderByArea
            style="margin-right: 40px"
            :getList="getDataList"
            :setCondition="setCondition4DataList"
            :RegionalID="condition.SellArea.RegionalID"
            :CityID="condition.SellArea.CityID"
            :CountyID="condition.SellArea.CountyID"
            :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
          />
          <OrderChannelSelector
            :options="userTypeList"
            :requestFunc="getDataList"
            :changePropsFunc="setCondition4DataList"
            :typeList="[['CustomerType', 'First']]"
            :value="condition.CustomerType.First"
            :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
            label="客户类型"
          />
        </div>
        <div>
          <SearchInputComp
            class="search-section"
            :typeList="[['KeyWords', '']]"
            title="关键词"
            placeholder='请输入搜索关键词'
            :requestFunc='getDataList'
            :changePropsFunc='setCondition4DataList'
            :word='condition.KeyWords'
            :searchWatchKey="dataList"
            @reset='() => this.clearCondition()'
          />
        </div>
      </li>
      <li>
        <LineDateSelectorComp
          :changePropsFunc='setCondition4DataList'
          :requestFunc='getDataList'
          :isFull="true"
          :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          minDate="2022-01-01 00:00:00"
          label="责任划分时间"
          :dateList="dateList"
        />
      </li>
      <li>
        <RadioButtonGroupComp
          :radioList="progressList"
          :requestFunc="getDataList"
          v-model="Status"
          :isFull="true"
          title="状态筛选"
        />
      </li>
    </ul>
  </header>
</template>

<script>
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import { mapState } from 'vuex';
import EpCascaderByProduct from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';

import EpCascaderByArea from '../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
    progressList: {
      type: Array,
      default: () => ([]),
    },
  },

  components: {
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
    EpCascaderByArea,
    EpCascaderByProduct,
    RadioButtonGroupComp,
  },
  computed: {
    ...mapState('common', ['Permission', 'userTypeList']),
    UserDefinedTimeIsActive() {
      return this.condition.DateType === '' && !!this.condition.Date.First && !!this.condition.Date.Second;
    },
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionResponsibilityConfirm?.Obj) {
        return this.Permission.PermissionList.PermissionResponsibilityConfirm.Obj;
      }
      return {};
    },
    Status: {
      get() {
        return this.condition.Status;
      },
      set(val) {
        this.setCondition4DataList([['Status', ''], val]);
      },
    },
  },
  data() {
    return {
      activeName: '1',
      dateList: [
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    };
  },
  methods: {
    handleClick() {
      switch (this.activeName) {
        case 'businessCenter':
          this.setCondition4DataList([['DepartmentID', ''], 1]);
          break;
        case 'reviewSoftware':
          this.setCondition4DataList([['DepartmentID', ''], 5]);
          break;
        case 'otherSoftware':
          this.setCondition4DataList([['DepartmentID', ''], 6]);
          break;
        case 'logisticsCenter':
          this.setCondition4DataList([['DepartmentID', ''], 3]);
          break;
        default:
          break;
      }
      this.$emit('getDataList');
    },
    clearCondition() {
      this.$emit('clearCondition');
    },
    setCondition4DataList(data) {
      this.$emit('setCondition', data);
    },
    getDataList() {
      this.$emit('getDataList');
    },
    // async getCustomerData() { // 获取客户数据
    //   this.api.getOperateStaff().then(res => {
    //     this.staffList = [{ StaffName: '不限', StaffID: '' }, ...res.data.Data];
    //   });
    // },
  },
  mounted() {
    this.$store.dispatch('common/getFeedbackQuestionList');
    this.$store.dispatch('common/getUserClassify');
    // this.getCustomerData();
    if (this.localPermission.BusinessQueryAll || this.localPermission.BusinessQueryDepartment) {
      this.activeName = 'businessCenter';
      this.setCondition4DataList([['DepartmentID', ''], 1]);
    } else if (this.localPermission.AutoSoftManage) {
      this.activeName = 'reviewSoftware';
      this.setCondition4DataList([['DepartmentID', ''], 5]);
    } else if (this.localPermission.OtherSoftManage) {
      this.activeName = 'otherSoftware';
      this.setCondition4DataList([['DepartmentID', ''], 6]);
    } else {
      this.setCondition4DataList([['DepartmentID', ''], '']);
    }
  },
};
</script>

<style lang='scss'>
.mp-liability-recognition-page-header-wrap {
  > ul {
    padding: 12px 20px;
    padding-top: 8px;
    > li {
      display: flex;
      // height: 48px;
      align-items: center;
      flex-wrap: wrap;
      > div {
        margin-top: 9px !important;
        margin: 9px 0;
        >.title{
          width: 7em;
        }
      }
      > section {
        margin: 11.5px 0;
      }
      &:first-of-type {
        justify-content: space-between;
        flex-wrap: wrap;
        >div{
          flex-wrap: wrap;
          display: flex;
        }
      }
    }
  }
  > .el-tabs {
    margin-left: -8px;
    > .el-tabs__header {
      background-color: rgb(245, 245, 245);
      padding-left: 30px;
      padding-top: 13px;
      margin-bottom: 0;
      .el-tabs__nav {
        > div {
          height: 38px;
          line-height: 36px;
          &.is-active {
            position: relative;
            background-color: #fff;
            &::before {
              content: "";
              position: absolute;
              height: 2px;
              width: calc(100%);
              background-color: rgb(38, 188, 249);
              left: 0px;
              top: 0px;
              border-radius: 2px;
            }
          }
          font-size: 13px;
        }
      }
    }
  }
}
</style>
