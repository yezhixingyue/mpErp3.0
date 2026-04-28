<template>
  <CommonDialogComp
    width="535px"
    :visible.sync="localVisible"
    title="查看进度"
    submitText="确定"
    closeOnClickModal
    :showCancel="false"
    @submit="localVisible = false"
    @cancle="localVisible = false"
    top="25vh"
    class="mp-finance-refund-exception-page-wrap-progress-dialog"
  >
    <!-- 内容区域 -->
    <div class="content" v-if="item">
      <h2>订单号：{{ item.OrderID }}</h2>

      <ul>
        <li v-for="(it, i) in progressList" :key="i">
          <span class="l">{{ it.date }}</span>
          <div class="point" :class="{active: i === 0}">
            <i></i>
          </div>
          <div class="r">
            <h4>{{ it.content }}</h4>
            <span>{{ it.remark }}</span>
          </div>
        </li>
      </ul>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { format2LangTypeDateFunc } from '@/assets/js/filters/filters';
import { RefundExceptionTableRow } from '../model/ManageRefundExceptionListModel';
import { RefundExceptionStatusEnum } from '../types/enum';

const props = defineProps<{
  visible: boolean,
  item: RefundExceptionTableRow | null
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

const progressList = computed(() => {
  if (!props.item) return [];

  const _getSecondDate = (prevDate: string, nextDate: string) => {
    if (!nextDate) return '';

    const _date = format2LangTypeDateFunc(nextDate);

    if (prevDate) {
      const prevChunk = prevDate.slice(0, 10);
      if (prevChunk.length === 10 && _date.includes(prevChunk)) {
        return _date.replace(`${prevChunk} `, '');
      }
    }
    return _date;
  };

  const list = [
    {
      date: format2LangTypeDateFunc(props.item.ApplyTime),
      content: '申请退款',
      remark: `（申请人：${props.item.ApplyName}）`,
    },
    {
      date: _getSecondDate(props.item.ApplyTime, props.item.RetryTime),
      content: '系统自动退款失败',
      remark: '',
    },
  ];

  if (props.item.Status === RefundExceptionStatusEnum.ManualProcessed) {
    list.push({
      date: _getSecondDate(props.item.RetryTime, props.item.FinishTime),
      content: '确认退款成功',
      remark: `（处理人：${props.item.OperatorName}）`,
    });
  }

  return list.reverse();
});
</script>

<style scoped lang='scss'>
.mp-finance-refund-exception-page-wrap-progress-dialog {
  .content {
    color: #444;
    margin-top: -15px;
    margin-bottom: -30px;
    padding: 0 20px;

    > h2 {
      font-weight: 700;
      font-size: 16px;
    }

    > ul {
      padding-top: 30px;
      > li {
        display: flex;
        font-size: 14px;
        line-height: 16px;
        min-height: 60px;

        > span {
          flex: none;
          width: 185px;
          text-align: right;
          color: #888;
        }

        > div.point {
          position: relative;
          width: 16px;
          display: flex;
          flex-direction: column;
          margin: 0 12px;

          &::before {
            content: '';
            height: 100%;
            width: 2px;
            background-color: #eee;
            position: absolute;
            left: 50%;
            top: 3px;
            transform: translateX(-50%);
          }

          > i {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            position: relative;
            z-index: 2;

            &::before {
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #eee;
            }
          }

          &.active {
            i {
              background-color: rgba($color: #26bcf9, $alpha: 0.2);

              &::before {
                width: 8px;
                height: 8px;
                background-color: #26bcf9;
              }
            }
          }
        }

        > div.r {
          color: #444;
          h4 {
            font-weight: 700;
            display: inline;
          }
        }

        &:last-of-type {
          > div.point {
            &::before {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
