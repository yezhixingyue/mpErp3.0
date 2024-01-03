<template>
  <CommonDialogComp
    width="600px"
    top='20vh'
    title="添加沟通记录:"
    :visible="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="record-communication-dialog-comp"
   >
   <template>
    <el-form :model="AddCommunicateData" status-icon ref="ruleForm" label-width="82px" class="add-trace-ruleForm" label-position="left">
      <el-form-item label="沟通备注：">
        <el-input size="small" v-model="AddCommunicateData.CommunicateRemark"
        placeholder="选填，可填写除订单追踪之外的一些记录" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="沟通方式：" required>
        <el-radio-group v-model="AddCommunicateData.CommunicateType">
          <el-radio :label="0">电话</el-radio>
          <el-radio :label="1">QQ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="下一次沟通时间:" required class="next-communicate-time">
        <el-radio-group v-model="AddCommunicateData.NextCommunicateTimeType">
          <el-radio :label="10">10分钟后</el-radio>
          <el-radio :label="30">30分钟后</el-radio>
          <el-radio :label="120">2小时后</el-radio>
          <el-radio :label="254">自定义时间</el-radio>
          <el-radio :label="255">无需沟通</el-radio>
        </el-radio-group>
        <p>
          <template v-if="AddCommunicateData.NextCommunicateTimeType === 254">
            <el-date-picker
              class="select-date"
              v-model="date"
              size="small"
              type="date"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              placeholder="年/月/日"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-time-select
              class="select-time"
              v-model="time"
              size="small"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '21:00'
              }"
              placeholder="选择时间">
            </el-time-select>
          </template>
        </p>
      </el-form-item>
    </el-form>
   </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    customerID: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      loading: false,
      date: '',
      time: '',
      AddCommunicateData: {
        CustomerID: this.customerID,
        NextCommunicateTimeType: 0,
        NextCommunicateTime: '',
        CommunicateType: 0,
        CommunicateRemark: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  computed: {
    ...mapGetters('CommunicationRecord', ['getCommunicationRecordPage']),
    ...mapState('TraceClientList', ['condition4RecordList']),
  },
  methods: {
    ...mapMutations('TraceClientInfo', ['addCustomerCommunicateLogs']),
    ...mapActions('TraceClientInfo', ['getCustomerTrackDetail']),
    setRequestObj([[key1, key2], value]) {
      this.AddCommunicateData[key1][key2] = value;
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('cloce');
    },
    onSubmit() {
      if (!this.AddCommunicateData.CommunicateType && this.AddCommunicateData.CommunicateType !== 0) {
        this.messageBox.failSingleError('操作失败', '请选择沟通方式');
      } else if (!this.AddCommunicateData.NextCommunicateTimeType) {
        this.messageBox.failSingleError('操作失败', '请选择下一次沟通时间');
      } else if (this.AddCommunicateData.NextCommunicateTimeType === 254 && !this.date && !this.time) {
        this.messageBox.failSingleError('操作失败', '请选择具体时间');
      } else {
        this.AddCommunicateData.NextCommunicateTime = this.date ? `${this.date}T${this.time}` : '';
        this.api.getCustomerCommunicateLogSave(this.AddCommunicateData).then(res => {
          if (res.data.Status === 1000) {
            // const nowDate = new Date();
            // const hms = `${nowDate.getHours()}-${nowDate.getMinutes()}-${nowDate.getSeconds()}`;
            // const addItem = {
            //   CreateTime: `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}T${hms}`,
            //   CommunicateType: this.AddCommunicateData.CommunicateType,
            //   CommunicateRemark: this.AddCommunicateData.CommunicateRemark,
            // };
            // this.addCustomerCommunicateLogs(addItem);
            this.getCustomerTrackDetail(this.customerID);
            this.$store.dispatch('CommunicationRecord/getCommunicationRecordList', this.getCommunicationRecordPage);
            this.$store.dispatch('TraceClientList/getTraceClientList', this.condition4RecordList.Page);
            this.onCancle();
          }
        });
      }
    },
    onOpen() {
      this.date = '';
      this.time = '';
      this.AddCommunicateData = {
        CustomerID: this.customerID,
        NextCommunicateTimeType: 0,
        NextCommunicateTime: '',
        CommunicateType: 0,
        CommunicateRemark: '',
      };
    },
    onClosed() {
      this.onCancle();
    },
  },
};
</script>
<style lang='scss'>
.record-communication-dialog-comp{
  .el-dialog__body{
    padding-left: 42px;
    padding-right: 42px;
    padding-bottom: 0;
  }
  .add-trace-ruleForm{
    margin-top: 10px;
    .el-form-item{
      margin-bottom: 15px;
    }
    .el-form-item__label{
      padding-right: 0;
    }
    .next-communicate-time{
      display: flex;
      flex-direction: column;
      .el-form-item__label{
        width: 200px !important;
      }
      .el-form-item__content{
        margin-left: 0px !important;
        >p{
          height: 40px;
          .select-date{
            width: 160px;
            margin-right: 10px;
          }
          .select-time{
            width: 140px;
          }
        }
      }
    }
  }
}
</style>
