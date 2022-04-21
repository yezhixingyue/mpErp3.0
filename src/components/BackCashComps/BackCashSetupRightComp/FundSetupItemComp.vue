<template>
  <div class="mp-erp-back-cash-setup-page-right-item-fund-item-comp-wrap">
    <div class="c" :title="content">{{content}}</div>
    <CtrlMenus @edit='edit' @remove='remove' />
  </div>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { ReturnTypeEnums } from '../../../store/cashback/CashBackRightItemClass';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
    content() {
      const { Range, Type, Increment, ReturnValue, StartFromZero } = this.item;
      if (!Range) return '';
      const { MinValue, MaxValue } = Range;
      let str = `${MinValue} <= 消费金额 <= ${+MaxValue === -1 ? '无穷大' : MaxValue}`;

      if (Type === ReturnTypeEnums.fixed.ID) {
        str += ` 按固定比例${ReturnValue}%返现`;
      } else if (Type === ReturnTypeEnums.increase.ID) {
        str += ` 每消费${Increment}元返${ReturnValue}元`;
        if (StartFromZero) {
          str += ' ( 从零开始计算 )';
        }
      }

      return str;
    },
  },
  methods: {
    edit() {
      this.$emit('edit');
    },
    remove() {
      this.messageBox.warnCancelNullMsg('确定删除该条返现设置吗', () => {
        this.$emit('remove');
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-back-cash-setup-page-right-item-fund-item-comp-wrap {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-right: 20px;
  > div {
    line-height: 40px;
    &.ctrl-menus-container {
      flex: none;
    }
    &.c {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 20px;
      font-size: 13px;
      color: #585858;
    }
  }
}
</style>
