<template>
  <section class="trace-client-info-comp-left">
    <div class="content-item">
      <p class="common-item-title">客户信息：</p>
      <table class="user-info table-common-style">
        <tr>
          <td>客户名称：</td>
          <td>东翔广告</td>
          <td>客户编号：</td>
          <td>豫R0027086</td>
        </tr>
        <tr>
          <td>销售区域：</td>
          <td>豫南南阳市卧龙区</td>
          <td>客户等级分类：</td>
          <td>特立尊享-个体门店</td>
        </tr>
        <tr>
          <td>联系电话：</td>
          <td>15837762333</td>
          <td>联系QQ：</td>
          <td>979701921</td>
        </tr>
      </table>
      <p class="next-communication-time">下一次沟通时间：<span>{{ CustomerTrackDetail?.NextCommunicateTime }}</span></p>
    </div>
    <div class="content-item">
      <p class="common-item-title">近30天沟通记录: <span class="number-contacts">今日已联系 {{ CustomerTrackDetail?.TodayCommunicateCount }} 次</span></p>
      <el-table
        stripe
        border
        fit
        :data="CustomerTrackDetail?.CustomerCommunicateLogs || []"
        style="width: 640px"
        class="record-communication-table mp-erp-get-price-record-page-main-table-comp-wrap ft-14-table"
      >
        <el-table-column
          prop="CreateTime"
          label="时间"
          minWidth="129"
          show-overflow-tooltip
          ></el-table-column>
          <el-table-column
          prop="Operator "
          label="沟通人"
          minWidth="123"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="方式"
          minWidth="88"
          show-overflow-tooltip
        >
          <span class="is-gray" slot-scope="scope">{{
            scope.row.CommunicateType
          }}</span>
        </el-table-column>
        <el-table-column
          prop="CommunicateRemark"
          label="沟通备注"
          minWidth="277"
          show-overflow-tooltip
        ></el-table-column>
        <div slot="empty">
          <span v-show="!loading">暂无数据</span>
        </div>
      </el-table>
      <p class="add-record-communication-btn">
        <el-button>+添加沟通记录</el-button>
      </p>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    CustomerTrackDetail: {
      type: Object,
      default: null,
    },
  },
  components: {
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
  },
  methods: {
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
    margin-top: 10px;
    margin-left: 13px;
  }
  .add-record-communication-btn{
    width: 640px;
    text-align: right;
    margin-left: 13px;
    margin-top: 20px;
  }
}
</style>
