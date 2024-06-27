<template>
  <section class="after-sales-solution-from-comp">
    <header class="title is-bold">解决方案</header>
    <ul>
      <li>
        <span class="value">
          <el-radio-group v-model="radio">
            <el-radio :label="3">驳回申请</el-radio>
            <el-radio :label="6">同意售后</el-radio>
          </el-radio-group>
        </span>
      </li>
      <li>
        <span class="label is-bold">解决方案：</span><span class="value">
          <el-radio-group v-model="radio">
            <el-radio :label="3">退款</el-radio>
            <el-radio :label="6">补印</el-radio>
            <el-radio :label="6">赠送优惠券</el-radio>
          </el-radio-group>
        </span>
      </li>
      <li>
        <span class="label is-bold">选择包裹：</span><span class="value">
          <el-table stripe border fit :data="[]" style="width: 100%" class="ft-14-table">
            <el-table-column
              type="selection"
              label="包裹号"
              width="73">
              aaa
            </el-table-column>
            <el-table-column prop="AfterSaleCode" label="包裹号" minWidth="123" show-overflow-tooltip></el-table-column>
            <el-table-column prop="OrderID" label="运单号" minWidth="114" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CustomerType" label="产品数量" minWidth="85" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.CustomerType}}====={{scope.row.CustomerGrade}}</template>
            </el-table-column>
            <el-table-column prop="CustomerType" label="金额" minWidth="57" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.CustomerType}}{{scope.row.CustomerGrade}}</template>
            </el-table-column>
            <el-table-column prop="CustomerType" label="代收金额" minWidth="84" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
            </el-table-column>
          </el-table>
        </span>
      </li>
      <li class="form-box">
        <span class="label is-bold">补印数量：</span><span class="value">
          <span>
            <el-input v-model="input" style="width: 80px;"></el-input> 款
          </span>
          <span style="margin-left: 30px;">
            <i class="is-bold">每款数量：</i>
            <el-input v-model="input" style="width: 100px;"></el-input> 张/款
          </span>
          <br/>
          <el-checkbox v-model="checked">终止生产</el-checkbox>
          <br/>
          <el-checkbox v-model="checked" style="line-height: 20px;">额外增送优惠券</el-checkbox>
        </span>
      </li>
      <li>
        <span class="label is-bold">优惠券：</span><span class="value">
          <span>选择优惠券</span>
          <el-table stripe border fit :data="[]" style="width: 100%; margin-top: 10px" class="ft-14-table">
            <el-table-column prop="AfterSaleCode" label="包裹号" minWidth="123" show-overflow-tooltip></el-table-column>
            <el-table-column prop="OrderID" label="运单号" minWidth="114" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CustomerType" label="产品数量" minWidth="85" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.CustomerType}}====={{scope.row.CustomerGrade}}</template>
            </el-table-column>
            <el-table-column prop="CustomerType" label="金额" minWidth="57" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.CustomerType}}{{scope.row.CustomerGrade}}</template>
            </el-table-column>
            <el-table-column prop="CustomerType" label="代收金额" minWidth="84" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
            </el-table-column>
          </el-table>
        </span>
      </li>
      <li class="line">
        <i></i>
        <span>以下内容客户不可见</span>
        <i></i>
      </li>
      <li>
        <span class="label is-bold">
          补充说明：<span class="text">(选填)</span>
        </span><span class="value">
          <el-input
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="textarea2">
          </el-input>
        </span>
      </li>
      <li class="form-box">
        <span class="label is-bold">额外支出：</span><span class="value">
          <span>
            <el-input v-model="input" style="width: 80px;"></el-input> 元
          </span>
          <span style="margin-left: 30px;">
            <el-checkbox v-model="checked">支出给客户</el-checkbox>
            <i>（选中时客户可见金额和支出说明）</i>
          </span>
        </span>
      </li>
      <li>
        <span class="label is-bold">
          支出说明：<span class="text">(选填)</span>
        </span>
        <span class="value">
          <el-input v-model="input" placeholder="请输入内容" size="medium" style="margin-bottom: 10px;"></el-input>
          <br/>
          <span style="padding-top: 10px;">
            <el-checkbox v-model="checked">划分责任</el-checkbox>
            <el-checkbox v-model="checked">业务中心</el-checkbox>
            <i>（可以先不划分，售后完成后3日内可补充。责任确认前可修改）</i>
          </span>
        </span>
      </li>
      <li>
        <span class="label is-bold">问题类别：</span><span class="value">
          <span>选择类别</span> <i>成品异常-数量异常、成品异常-包装异常</i>
        </span>
      </li>
      <li  class="form-box">
        <span class="label is-bold">责任占比：</span><span class="value" style="display: flex; flex-wrap: wrap">
          <span style="width: 50%;">
            <el-checkbox v-model="checked" style="margin-right: 20px;">业务中心</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
            </template>
          </span>
          <span style="width: 50%;">
            <el-checkbox v-model="checked" style="margin-right: 20px;">业务中心</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
            </template>
          </span>
          <span style="width: 50%; margin-top: 10px;">
            <el-checkbox v-model="checked" style="margin-right: 20px;">业务中心</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
            </template>
          </span>
          <span style="width: 50%; margin-top: 10px;">
            <el-checkbox v-model="checked" style="margin-right: 20px;">业务中心</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
            </template>
          </span>
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

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
  },

  components: {
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {

    };
  },
  methods: {

  },
  mounted() {

  },
};
</script>

<style lang='scss'>
.after-sales-solution-from-comp {
  padding-left: 20px;
  min-width: 650px;
  width: 650px;
  box-sizing: border-box;
  padding-right: 30px;
  .el-checkbox{
    .el-checkbox__label{
      font-size: 12px;
      color: #444;
    }
  }
  >.title{
    font-size: 16px;
    line-height: 20px;
    margin-top: 10px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: "";
      display: inline-block;
      height: 14px;
      width: 3px;
      position: absolute;
      left: -8px;
      top: 3px;
      background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
    }
  }
  >ul{
    li{
      display: flex;
      font-size: 12px;
      margin-top: 10px;
      line-height: 15px;
      &.line{
        display: flex;
        align-items: center;
        margin: 20px 0;
        span{
          margin: 0 10px;
        }
        i{
          flex: 1;
          border-top: 1px dashed #E5E5E5;
        }
      }
      &.form-box{
        line-height: 35px;
        .el-input, input{
          height: 35px;
        }
      }
      >.label{
        position: relative;
        >.text{
          position: absolute;
          right: 1em;
          top: 15px;
          color: #AEAEAE
        }
      }
      >.value{
        flex: 1;
        .el-table{
          .el-table__header-wrapper thead tr th .cell {
            line-height: 36px;
            font-size: 14px;
          }
          .el-table__fixed-header-wrapper thead tr th .cell {
            line-height: 36px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
