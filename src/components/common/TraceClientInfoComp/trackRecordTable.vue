<template>
  <ul class="track-record-table">
    <li class="table-header">
      <span :style="`width: ${it.width};`" v-for="it in tableData" :key="it.label">{{it.label}}</span>
      <span :style="`width: 88px;`">操作</span>
    </li>
    <li class="table-item" v-for="(item) in CustomerTrackLogs" :key="item.CustomerID">
      <ul>
        <li :style="`width: ${it.width};`" :class="it.class" v-for="it in tableData" :key="it.label">
          <el-tooltip :disabled="!it.maxLength || it.valueFun(item).length < it.maxLength" effect="dark" :content="it.valueFun(item)" placement="top">
            <span>{{it.valueFun(item)}}</span>
          </el-tooltip>
        </li>
        <li :style="`width: 88px;`">
          <span v-if="localPermission.OperateTrackLog" @click="setStatusClick(item)" style="color: #26BCF9; cursor: pointer;">设置状态</span>
        </li>
      </ul>
      <p> <span class="is-gray">规格说明：</span>
        <el-tooltip :disabled="item.Spec.length < 65" effect="dark" :content="item.Spec" placement="top">
          <span>{{item.Spec}}</span>
        </el-tooltip>
      </p>
    </li>
    <li class="empty table-item" v-if="!CustomerTrackLogs.length">
      暂无数据
    </li>
    <CommonDialogComp
      width="550px"
      top='26vh'
      title="设置状态："
      :visible="setStatusVisible"
      cancelText='取消'
      @cancle="onCancle"
      @open='onOpen'
      @closed='onClosed'
      @submit="onSubmit"
      class="set-status-dialog-comp"
    >
    <template>
      <el-form :model="ChangeStatusData" status-icon ref="ruleForm" label-width="129px" label-position="right">
        <p>
          {{ [editData?.ProductClass.Name, editData?.ProductType.Name, editData?.Product.Name].filter(el => el).join('-')}}
        </p>
        <el-form-item label="规格说明：" class="specification">
          {{editData?.Spec}}
        </el-form-item>
        <el-form-item label="价格：" class="final-price">
          <span class="is-pink">{{editData?.FinalPrice}}</span> 元
        </el-form-item>
        <el-form-item label="当前状态：">
          {{TrackStatusList.find(it => it.value === editData?.TrackStatus)?.label}}
        </el-form-item>
        <el-form-item label="设置新状态：">
          <el-radio-group v-model="ChangeStatusData.TrackStatus">
            <template v-for="item in TrackStatusList">
              <el-radio v-if="item.value" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注（选填）：">
          <el-input v-model="ChangeStatusData.TrackRemark" size="small" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
    </template>
    </CommonDialogComp>
  </ul>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { formatDateForDisplay } from '@/assets/ts/filter';
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    CustomerTrackLogs: {
      type: Array,
      default: null,
    },
    TrackStatusList: {
      type: Array,
      default: null,
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
      tableData: [
        {
          label: '来源',
          width: '137px',
          valueFun: it => `${it.QuotationNumber === '0' ? '' : it.QuotationNumber || ''}`,
        },
        {
          label: '产品',
          width: '157px',
          valueFun: it => {
            const temp = [it.ProductClass.Name, it.ProductType.Name, it.Product.Name].filter(el => el);
            return temp.join('-');
          },
          maxLength: 12,
        },
        {
          label: '价格',
          width: '62px',
          valueFun: it => `${it.FinalPrice}元`,
          maxLength: 7,
          class: 'is-pink',
        },
        {
          label: '状态',
          width: '70px',
          valueFun: it => {
            const temp = this.TrackStatusList.filter(item => item.value === it.TrackStatus);
            if (temp.length) {
              return temp[0].label;
            }
            return '';
          },
        },
        {
          label: '备注',
          width: '97px',
          valueFun: it => it.TrackRemark,
          maxLength: 7,
        },
        {
          label: '最近一次改变状态（操作人）',
          width: '192px',
          valueFun: it => `${formatDateForDisplay(it.ChangeStatusTime)} (${it.Operator.OperatorName})`,
        },
        {
          label: '添加时间',
          width: '117px',
          valueFun: it => formatDateForDisplay(it.CreateTime),
        },
        // {
        //   label: '操作',
        //   width: '88px',
        //   valueFun: it => it.ChangeStatusTime,
        //   maxLength: 3,
        // },
      ],
      setStatusVisible: false,
      editData: null,
      ChangeStatusData: {
        TrackLogID: 0,
        TrackStatus: 0,
        TrackRemark: '',
      },
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
    ...mapState('TraceClientList', ['condition4RecordList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapActions('TraceClientInfo', ['getCustomerTrackDetail']),
    setStatusClick(data) {
      this.editData = data;
      this.setStatusVisible = true;
    },
    onCancle() {
      this.setStatusVisible = false;
    },
    onOpen() {
      this.ChangeStatusData.TrackLogID = this.editData.TrackLogID;
      this.ChangeStatusData.TrackStatus = this.editData.TrackStatus;
    },
    onClosed() {
      this.ChangeStatusData = {
        TrackLogID: 0,
        TrackStatus: 0,
        TrackRemark: '',
      };
    },
    onSubmit() {
      if (!this.ChangeStatusData.TrackStatus) {
        this.messageBox.failSingleError('操作失败', '请设置新状态');
      } else {
        this.api.getCustomerTrackLogChangeStatus(this.ChangeStatusData).then(res => {
          if (res.data.Status === 1000) {
            this.getCustomerTrackDetail(this.customerID);
            this.$store.dispatch('TraceRecord/getCustomerTrackLogList', this.getTraceRecordPage);
            this.$store.dispatch('TraceClientList/getTraceClientList', this.condition4RecordList.Page);
            this.onCancle();
          }
        });
      }
    },
  },
};
</script>
<style lang='scss'>
.track-record-table{
  text-align: center;
  border: 1px solid #E5E5E5;
  margin-left: 13px;
  margin-top: 10px;
  max-width: 937px;
  overflow-y: auto;
  .set-status-dialog-comp{
    .el-dialog__body{
      padding: 0;
      padding-right: 60px;
      color: #444;
      .el-form{
        >p{
          font-size: 14px;
          font-weight: 700;
          margin-top: 15px;
          padding-left: 60px;
        }
        .el-form-item{
          font-size: 12px;
          margin-bottom: 5px;
          min-height: 40px;
          .el-form-item__content{
            .specification{
              line-height: 16px;
            }
          }
        }
        .el-form-item__label{
          font-weight: 700;
          padding: 0;
        }
        .el-form-item__content{
          text-align: left;
        }
        .el-radio-group{
          .el-radio{
            margin-right: 15px;
            .el-radio__label{
              padding-left: 5px;
            }
            &:last-child{
              margin: 0;
            }
          }
        }
      }
    }
  }
  >.table-header{
    font-size: 14px;
    font-weight: 700;
    display: flex;
    background-color: #F5F5F5;
    line-height: 37px;
    position: sticky;
    top: 0;
    box-shadow: 0px 0px 1px #666;
    >span + span{
      position: relative;
      &::after{
        content: '';
        position: absolute;
        width: 1px;
        height: 15px;
        background-color: #D0D0D0;
        display: inline-block;
        left: 0;
        top: 11px;
      }
    }
  }
  >.table-item{
    border-top: 1px solid #E5E5E5;
    line-height: 45px;
    font-size: 12px;
    &:last-of-type{
      border-bottom: 1px solid #E5E5E5;
    }
    &:nth-child(2n-1){
      background-color: #F5F5F5;
    }
    >ul{
      display: flex;
      >li{
        box-sizing: border-box;
        padding: 0 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    >p{
      border-top: 1px solid #E5E5E5;
      text-align: left;
      text-indent: 70px;
      box-sizing: border-box;
      padding: 0 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 920px;
    }
  }
  >.empty{
    font-size: 12px;
    color: #909399;
    line-height: 60px;
  }
}
</style>
