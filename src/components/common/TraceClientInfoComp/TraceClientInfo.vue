<template>
  <section class="trace-client-info-comp">
    <header class="nav"><span @click="onGoBackClick">{{BackName}}</span> > 详情</header>
    <main class="trace-client-info-box">
      <Left :CustomerTrackDetail="CustomerTrackDetail"
      :customerID="customerID"
      :customerInfo="customerInfo"
      />
      <div class="line"></div>
      <Right
        :CustomerTrackDetail="CustomerTrackDetail"
        :customerID="customerID"
        :quotation="quotation"
        @setTrackStatus="ChangeTrackStatus"
        />
    </main>
    <footer>
      <el-button @click="onGoBackClick">返 回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Left from './left.vue';
import Right from './right.vue';

export default {
  components: {
    Left,
    Right,
  },
  data() {
    return {
      loading: false,
      customerID: null,
      customerInfo: null,
      quotation: null,
      BackName: '',
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
    ...mapState('TraceClientInfo', ['CustomerTrackDetail']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapActions('TraceClientInfo', ['getCustomerTrackDetail']),
    ChangeTrackStatus(status) {
      if (this.quotation) {
        this.quotation.TrackStatus = status;
      }
    },
    onGoBackClick() {
      this.$goback();
    },
  },
  created() {
    const { customerID, customerInfo, quotation } = this.$route.params;
    if (customerID) {
      this.customerID = customerID;
    }
    if (customerInfo) {
      this.customerInfo = { ...customerInfo };
    }
    if (quotation) {
      this.quotation = { ...quotation };
    }
    this.getCustomerTrackDetail(customerID);
  },
  watch: {},
  mounted() {
    const routeName = this.$route.name;
    switch (routeName) {
      case 'GetPriceRecordDetail':
        this.BackName = '报价记录';
        break;
      case 'TraceClientListDetail':
        this.BackName = '追踪客户列表';
        break;
      case 'CommunicationRecordDetail':
        this.BackName = '沟通记录';
        break;
      case 'TraceRecordDetail':
        this.BackName = '追踪记录';
        break;
      default:
        break;
    }
  },
};
</script>
<style lang='scss'>
.trace-client-info-comp{
  border-left: 12px solid #f5f5f5;
  height: 100%;
  padding-left: 20px;
  .el-button.linear-btn{
    background: linear-gradient(to right, #26bcf9, #35dff9);
    border: none;
    color: #fff;
    &:hover{
      opacity: 0.88;
    }
  }
  >.nav{
    padding-top: 15px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    >span{
      color: #26BCF9;
    }
  }
  .trace-client-info-box{
    margin-top: 22px;
    display: flex;
    height: calc(100% - 27px - 133px);
    min-height: 700px;
    >.line{
      display: block;
      height: 100%;
      border-left: 1px solid #D9D9D9;
      width: 1px;
      margin: 0 50px 0 20px;
    }
    .common-item-title{
      font-weight: 700;
      border-left: 3px solid #26BCF9;
      padding-left: 13px;
    }
    .table-common-style{
      // width: 800px;
      border: 1px solid #E7E7E7;
      color: #444;
      font-size: 14px;
      >tr{
        td{
          display:table-cell; vertical-align:middle;
          line-height: 36px;
        }
        td:nth-child(1),td:nth-child(3){
          max-width: 138px;
          min-width: 138px;
          width: 138px;
          text-align: center;
          font-weight: 700;
        }
        td:nth-child(2),td:nth-child(4){
          font-weight: 400;
          font-size: 12px;
          padding: 0 20px;
        }
      }
      td{
        border: 1px solid #E7E7E7;
        box-sizing: border-box;
        padding: 0 10px;
        line-height: 3em;
      }
    }
  }
  >footer{
    // height: 133px;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    min-width: 1685px;
    .el-button{
      margin-bottom: 20px;
      margin-top: 30px;
      margin-left: 650px;
      width: 120px;
      height: 35px;
      padding: 0;
      line-height: 35px;
      border-color: #26BCF9;
      color: #26BCF9;
    }
  }
}
</style>
