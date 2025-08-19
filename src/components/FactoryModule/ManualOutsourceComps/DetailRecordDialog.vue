<template>
  <CommonDialogComp
    width="630px"
    title="查看修改记录"
    :visible.sync="localVisible"
    class="mp-erp-out-source-record-display-dialog-comp-wrap"
    :showSubmit="false"
    hideHeader
    cancelText="关闭"
    @open="onOpen"
    @cancle="localVisible = false"
    top="13vh"
  >
    <div class="content" v-if="item">
      <el-tabs
        v-model="activeName"
        class="tabs-box"
        type="card"
        @tab-click="onTabClick"
      >
        <el-tab-pane label="订单详情" name="detail">
          <div v-if="loadedList.includes('detail')">
            <OrderDetail v-if="item.OrderDetail" onlyDetail hiddenFactory :detailData='item.OrderDetail' />
          </div>
        </el-tab-pane>

        <el-tab-pane label="外购记录" name="record">
          <div v-if="loadedList.includes('record')" style="margin: 20px;padding-left: 160px;">
            <el-timeline>
              <el-timeline-item v-for="(it) in item.ProgressRecordList" :key="it.Index" :color="'#26bcf9'">
                <!-- <el-card>
                  <h4>{{it.Description}}</h4>
                  <p>
                    <span class="mr-12">{{it.Operator}}</span>
                    <span>{{format2MiddleLangTypeDateFunc2(it.OperateTime)}}</span>
                  </p>
                </el-card> -->
                <div class="content">
                  <p>{{format2MiddleLangTypeDateFunc2(it.OperateTime)}}</p>
                  <p>{{it.Description}}（{{it.Operator}}）</p>
                  <p>{{ it.StatusName }}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
            <div v-if="item.ProgressRecordList.length === 0 && loadedList.includes('record')" class="mt-50 ml-86">
              <img width="59px" height="48px" src="@/assets/images/null.png" alt="">
              <p class="ft-12 mt-10 ml-4 is-gray">暂无数据</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import OutsourceOrderItemClass from '@/views/FactoryManage/ManualOutsourceManage/classType/OutsourceOrderItemClass';
import { computed, ref } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/filters';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderDetail from '@/components/order/DialogContent/OrderDetail.vue';

const props = defineProps<{
  visible: boolean
  item: OutsourceOrderItemClass | null
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const loadedList = ref<('detail' | 'record')[]>([]);

const activeName = ref<'detail' | 'record'>('record');

const onOpen = async () => {
  if (!props.item) return;

  loadedList.value = [];
  activeName.value = 'record';

  onTabClick();
};

const onTabClick = async () => {
  if (loadedList.value.includes(activeName.value)) return;

  if (activeName.value === 'record') await props.item.getProgressRecordList();
  if (activeName.value === 'detail') await props.item.getOrderDetail();

  loadedList.value.push(activeName.value);
};

</script>

<style lang='scss'>
@import "@/assets/css/var.scss";

.mp-erp-out-source-record-display-dialog-comp-wrap {
  .el-dialog__body {
    // text-align: center;
    padding: 20px;
    padding-bottom: 0;

    .tabs-box {
      .el-tabs__header {
        // margin: 0 20px;
        user-select: none;
        .el-tabs__item {
          background-color: $--bg-color-base;
          border-color: $--border-color-base;
          color: $--color-text-regular;
          height: 36px;
          line-height: 36px;
          width: 120px;
          text-align: center;
          box-sizing: border-box;
          &.is-active {
            border-bottom: none;
            background-color: $--color-white;
            color: $--color-primary;
            position: relative;
            border-radius: 0%;
            &::before {
              content: "";
              display: block;
              height: 3px;
              width: calc(100% + 2px);
              background-color: $--color-primary;
              position: absolute;
              top: -1px;
              left: -1px;
              border-radius: 1.5px;
              z-index: 99;
            }
          }
        }

        &::before {
          content: '';
          position: absolute;
          bottom: -1px;
          width: 20px;
          height: 1px;
          left: -20px;
          background-color: #E4E7ED;
        }
      }

      .el-tabs__content {
        overflow: auto;
        height: 420px;
      }
    }

    .el-timeline {
      text-align: left;
      .el-timeline-item{
        padding-bottom: 10px;
      }
      .el-timeline-item__content {
        font-size: 13px;
        padding-left: 6px;

        .content {
          line-height: 17px;
          font-size: 12px;
          color: #444;
          // letter-spacing: 0.1px;
          p:not(:last-of-type) {
            padding-bottom: 5px;
          }
        }
      }

      .el-timeline-item__tail {
        border-color: #26bcf9;
        border-width: 1px;
      }
    }

    .order-list-dialog-orderdetail-wrap {
      width: 100%;

      .orderdetail-left {
        box-sizing: border-box;
        padding-left: 132px;
        > .bottom-line {
          width: 100%;
          box-sizing: border-box;
          margin-left: -132px;
          font-weight: 400;
        }

        .product-content {
          width: auto;
          padding-top: 0px;

          * {
            font-size: 12px;
            color: #444;
          }

          span.label {
            font-weight: 700;
            min-width: 8em;
            text-align: right;
          }
          .n {
            font-weight: 400;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 10px;
  }
}
</style>
