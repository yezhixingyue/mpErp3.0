<template>
  <section class="trace-client-info-comp-left">
    <div class="content-item">
      <p class="common-item-title">客户信息：</p>
      <table class="user-info table-common-style">
        <tr>
          <td>客户名称：</td>
          <td>{{customerInfo?.CustomerName}}</td>
          <td>客户编号：</td>
          <td>{{customerInfo?.CustomerSN}}</td>
        </tr>
        <tr>
          <td>销售区域：</td>
          <!-- <td>{{customerInfo?.SellArea.RegionalName}}</td> -->
          <td>{{customerInfo?.SellArea?.RegionalName}}{{customerInfo?.SellArea?.CityName}}{{customerInfo?.SellArea?.CountyName}}</td>
          <td>客户等级分类：</td>
          <td>
            {{ userTypeList.find(it => it.CategoryID === customerInfo.Type.First)?.CategoryName }}-{{
              userRankList.find(it => it.CategoryID === customerInfo.Grade.First)?.CategoryName
            }}
          </td>
        </tr>
        <tr>
          <td>联系电话：</td>
          <td>{{customerInfo?.Mobile}}</td>
          <td>联系QQ：</td>
          <td>
            <a rel="nofollow" target="_blank" :href="`tencent://message/?uin=${customerInfo?.QQ}&amp;Site=名片之家&amp;Menu=yes`" class='is-blue'>
              <span>{{ customerInfo?.QQ }}</span>
            </a>
          </td>
        </tr>
      </table>
      <p class="next-communication-time">
        <template v-if="CustomerTrackDetail?.NextCommunicateTime">
          下一次沟通时间：
        </template>
        <span>{{ CustomerTrackDetail?.NextCommunicateTime | format2MiddleLangTypeDate }}</span>
      </p>
    </div>
    <div class="content-item">
      <p class="common-item-title">近30天沟通记录: <span class="number-contacts">今日已联系 {{ CustomerTrackDetail?.TodayCommunicateCount || 0 }} 次</span></p>
      <el-table
        stripe
        border
        fit
        :data="CustomerTrackDetail?.CustomerCommunicateLogs || []"
        max-height="400px"
        style="width: 640px;"
        class="record-communication-table ft-14-table"
      >
        <el-table-column
          prop="CreateTime"
          label="时间"
          minWidth="129"
          show-overflow-tooltip
          >
          <span slot-scope="scope">{{
            scope.row.CreateTime | format2MiddleLangTypeDate
          }}</span>
        </el-table-column>
          <el-table-column
          prop="Operator.OperatorName"
          label="沟通人"
          minWidth="123"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="方式"
          minWidth="88"
          show-overflow-tooltip
        >
          <span slot-scope="scope">{{
            scope.row.CommunicateType ? 'QQ' : '电话'
          }}</span>
        </el-table-column>
        <el-table-column
          prop="CommunicateRemark"
          label="沟通备注"
          minWidth="277"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <p class="add-record-communication-btn">
        <el-button v-if="localPermission.AddCommunicateLog" class="linear-btn" @click="addRecordCommunicationVisible = true">+添加沟通记录</el-button>
      </p>
    </div>
    <recordCommunicationDialogComp
    :customerID="customerID"
    :visible="addRecordCommunicationVisible"
    @cloce="addRecordCommunicationVisible = false"/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordCommunicationDialogComp from './recordCommunicationDialogComp';

export default {
  props: {
    CustomerTrackDetail: {
      type: Object,
      default: null,
    },
    customerInfo: {
      type: Object,
      default: null,
    },
    customerID: {
      type: String,
      default: '',
    },
  },
  components: {
    recordCommunicationDialogComp,
  },
  data() {
    return {
      addRecordCommunicationVisible: false,
    };
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
  },
  methods: {
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.trace-client-info-comp-left{
  .user-info{
    margin-top: 10px;
    width: 640px;
    margin-left: 13px;
  }
  .next-communication-time{
    font-weight: 700;
    margin-top: 10px;
    margin-left: 13px;
    margin-bottom: 30px;
    span{
      font-weight: 400;
    }
  }
  .number-contacts{
    font-weight: 400;
    font-size: 12px;
    color: #888888;
    margin-left: 10px;
  }
  .record-communication-table{
    .el-table__header-wrapper thead tr th .cell {
      line-height: 36px;
      font-size: 14px;
    }
    margin-top: 10px;
    margin-left: 13px;
    .el-table__body-wrapper{
      overflow-y: auto;
    }
  }
  .add-record-communication-btn{
    width: 640px;
    text-align: right;
    margin-left: 13px;
    margin-top: 20px;
  }
}
</style>
