<template>
  <div class="question-text-info">
    <div class="question-list">
      <div>
        <XTypeTitle title="问题：" />
      </div>
      <ul class="mp-scroll-wrap question-content">
        <li v-for="item in curServiceOrdrData.QuestionList" :key="item.ID">
          <span class="question-type">{{item.Title}}</span>
          <div>
            <div>
              <span class="question-mark-title">备注：</span>
              <el-tooltip effect="dark" :content="item.Remark" placement="top" v-if="item.Remark.length > 50">
                <span class="is-gray Remark">{{item.Remark}}</span>
              </el-tooltip>
              <span class="is-gray Remark" v-else>{{item.Remark}}</span>
            </div>
            <div v-if="item.Department">
              <span class="question-mark-title" >责任部门：</span>
              <span class="is-gray">{{item.Department.Name}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p class="solution">
      <XTypeTitle title="解决方案：" />
      <span v-if=" curServiceOrdrData.Solution.Type === 7">
        补印{{curServiceOrdrData.Solution.KindCount}}款、
        补印{{curServiceOrdrData.Solution.Number}}{{curServiceOrdrData.Order.Unit}}
      </span>
      <span
        v-if="curServiceOrdrData.Solution.Type === 2"
      >订单减款{{curServiceOrdrData.Solution.RefundAmount}}元</span>
      <span style='margin-left: 15px'
        v-if="curServiceOrdrData.Solution.Type === 2"
      >运费减款{{curServiceOrdrData.Solution.RefundFreightAmount}}元</span>
      <span
        class="is-gray"
        v-if="curServiceOrdrData.Solution.FileName
                 && curServiceOrdrData.Solution.Type === 7"
      >（文件名：{{curServiceOrdrData.Solution.FileName}})</span>
      <span
        class="re-print-box"
        v-if="curServiceOrdrData.Solution.Type === 7 && curServiceOrdrData.RePrintOrderID"
      >
        <i class="is-bold">补印单号：</i>
        {{curServiceOrdrData.RePrintOrderID}}
      </span>
      <span
        class="is-gray"
        v-if="curServiceOrdrData.Solution.Type === 8"
      >赠送优惠券</span>
    </p>
  </div>
</template>

<script>
import XTypeTitle from '@/components/ServiceAfterSale/EditDialog/XTypeTitle.vue';

export default {
  components: {
    XTypeTitle,
  },
  props: {
    curServiceOrdrData: {},
  },
  mounted() {
    this.$emit('getHeight');
  },
};
</script>

<style>
</style>
