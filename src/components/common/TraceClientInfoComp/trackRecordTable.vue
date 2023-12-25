<template>
  <ul class="track-record-table">
    <li class="table-header">
      <span :style="`width: ${it.width};`" v-for="it in tableData" :key="it.label">{{it.label}}</span>
    </li>
    <li class="table-item" v-for="(item) in CustomerTrackLogs" :key="item.CustomerID">
      <ul>
        <li :style="`width: ${it.width};`" v-for="it in tableData" :key="it.label">{{it.valueFun(item)}}</li>
      </ul>
      <p>{{item.CustomerName}}</p>
    </li>
    <li class="empty table-item" v-if="!CustomerTrackLogs.length">
      暂无数据
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    CustomerTrackLogs: {
      type: Array,
      default: null,
    },
  },
  components: {
  },
  data() {
    return {
      tableData: [
        {
          label: '来源',
          width: '137px',
          valueFun: it => it.QuotationNumber,
          valueKey: 'QuotationNumber',
        },
        {
          label: '产品',
          width: '157px',
          valueFun: it => it.Product,
          valueKey: 'Product',
        },
        {
          label: '价格',
          width: '62px',
          valueFun: it => it.FinalPrice,
          valueKey: 'FinalPrice',
        },
        {
          label: '状态',
          width: '69px',
          valueFun: it => it.TrackStatus,
          valueKey: 'TrackStatus',
        },
        {
          label: '备注',
          width: '98px',
          valueFun: it => it.TrackRemark,
          valueKey: 'TrackRemark',
        },
        {
          label: '最近一次改变状态（操作人）',
          width: '192px',
          valueFun: it => it.Operator,
          valueKey: 'Operator',
        },
        {
          label: '添加时间',
          width: '117px',
          valueFun: it => it.ChangeStatusTime,
          valueKey: 'ChangeStatusTime',
        },
        {
          label: '操作',
          width: '88px',
          valueFun: it => it.ChangeStatusTime,
          valueKey: 'ChangeStatusTime',
        },
      ],
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>
<style lang='scss'>
.track-record-table{
  text-align: center;
  border: 1px solid #E5E5E5;
  margin-left: 13px;
  margin-top: 10px;
  >.table-header{
    font-size: 14px;
    font-weight: 700;
    display: flex;
    background-color: #F5F5F5;
    line-height: 37px;
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
    &:nth-child(2n-1){
      background-color: #F5F5F5;
    }
    >ul{
      display: flex;
    }
    >p{
      border-top: 1px solid #E5E5E5;
      text-align: left;
      text-indent: 70px;
    }
  }
  >.empty{
    font-size: 12px;
    color: #909399;
    line-height: 60px;
  }
}
</style>
