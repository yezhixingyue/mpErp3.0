<template>
  <CommonDialogComp
    width="750px"
    top='12vh'
    title="设置返现比例"
    :visible.sync="localVisible"
    submitText='确定'
    @submit="onSubmit"
    @cancle="localVisible = false"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-back-cash-setup-page-right-item-comp-return-value-setup-dialog-wrap"
  >
   <ul v-if="itemData" class="content">
     <li>
        <el-input v-model.trim="itemData.Range.MinValue" size="mini" maxlength="9"></el-input>
        <span class="g">≤消费金额≤</span>
        <el-input v-model.trim="itemData.Range.MaxValue" size="mini" maxlength="9"></el-input>
        <span class="g is-font-size-12">元</span>
        <span class="tips-box"><i class="el-icon-warning"></i>-1代表无穷大</span>
     </li>
     <li>
       <el-radio-group v-model="itemData.Type" >
        <el-radio v-for="it in ReturnTypeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
     </li>
     <li v-if="itemData.Type === ReturnTypeEnums.fixed.ID">
       <span>返</span>
       <el-input v-model.trim="itemData._ReturnPercent" size="mini" maxlength="9"></el-input>
       <span class="g is-font-size-12">%</span>
     </li>
     <li v-if="itemData.Type === ReturnTypeEnums.increase.ID" class="increase">
       <div>
         <div class="l">
           <span>每</span>
           <el-input v-model.trim="itemData.Increment" size="mini" maxlength="9"></el-input>
           <span class="g is-font-size-12">元</span>
         </div>
         <div>
           <el-checkbox v-model="itemData.StartFromZero">从零开始计算</el-checkbox>
         </div>
       </div>
       <div>
           <span>返</span>
           <el-input v-model.trim="itemData.ReturnValue" size="mini" maxlength="9"></el-input>
           <span class="g is-font-size-12">元</span>
       </div>
     </li>
   </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';
import FundSetupItemClass from '../../../store/cashback/CashBackRightItemClass/FundSetupItemClass';
import { ReturnTypeEnumList, ReturnTypeEnums } from '../../../store/cashback/CashBackRightItemClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    return {
      itemData: null,
      ReturnTypeEnumList,
      ReturnTypeEnums,
    };
  },
  methods: {
    onOpen() {
      this.itemData = new FundSetupItemClass(this.value);
    },
    onClosed() {
      this.itemData = null;
    },
    onSubmit() {
      if (this.itemData.check()) {
        this.$emit('submit', this.itemData.transform());
        this.localVisible = false;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-back-cash-setup-page-right-item-comp-return-value-setup-dialog-wrap {
  .el-dialog__body {
    height: 320px;
    padding-top: 50px;
    padding-left: 80px;
    ul.content {
      > li {
        display: flex;
        justify-content: center;
        line-height: 30px;
        margin-bottom: 40px;
        padding-right: 100px;
        &:first-of-type {
          padding-left: 10px;
          padding-right: 0;
        }
        .el-input {
          width: 110px;
          // height: 30px;
          input {
            height: 30px;
            font-size: 13px;
            position: relative;
            top: -1px;
          }
        }
        .tips-box {
          width: 180px;
        }
        > span {
          margin: 0 8px;
        }
        .g {
          color: #a2a2a2;
        }
        .el-radio__label, .el-checkbox__label {
          font-size: 12px;
          position: relative;
          top: 1px;
        }
        &.increase {
          padding-right: 70px;
          > div {
            > span {
              margin: 0 8px;
            }
            & + div {
              margin-left: 20px;
            }
            > div.l {
              margin-bottom: 8px;
              > span {
                margin: 0 8px;
              }
            }
            .el-checkbox {
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
