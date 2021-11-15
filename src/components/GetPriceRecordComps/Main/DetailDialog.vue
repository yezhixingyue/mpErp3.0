<template>
  <CommonDialogComp
    width="800px"
    top='10vh'
    title="报价详情"
    :visible.sync="visible"
    :showSubmit='false'
    cancelText='关闭'
    @open='onOpen'
    @cancle="visible = false"
    class="mp-erp-get-price-record-page-main-order-detail-dialog-comp-wrap"
  >
    <OrderDetail :detailData='detailData' isCalculate />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import OrderDetail from '@/components/order/DialogContent/OrderDetail.vue';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    OrderDetail,
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    onOpen() {
      this.$store.dispatch('common/getUserClassify');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-get-price-record-page-main-order-detail-dialog-comp-wrap {
  > div {
    > .el-dialog__body {
      padding: 0 20px;
      .order-list-dialog-orderdetail-wrap {
        height: 520px;
        .product-content {
          height: calc(100% - 40px);
          box-sizing: border-box;
        }
      }
      li.customer-info {
        height: 290px;
        .customer-content {
          height: 245px;
          > section {
            &:first-of-type {
              margin-bottom: 50px;
            }
          }
        }
      }
      .order-info {
        height: 210px;
        .order-content {
          height: calc(100% - 40px);
        }
      }
    }
  }
}
</style>
