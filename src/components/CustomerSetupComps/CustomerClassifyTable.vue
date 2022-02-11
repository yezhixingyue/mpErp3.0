<template>
  <section>
    <header>
      <div>分类名称</div>
      <div>定价方式</div>
      <div>操作</div>
    </header>
    <main>
      <ul>
        <li v-for="it in list" :key="it.CategoryID">
          <div>{{it.CategoryName}}</div>
          <div>{{it.Value | formatValue}}</div>
          <div>
            <CtrlMenus v-show="canSetup" @edit='onSetupClick(it)' @remove='onRemoveClick(it)' :canRemove='it.AllowRemove' />
          </div>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import { CustomerPriceTypeEnumList } from '@/store/customerManage/Enums';
import { getNameFromListByIDs } from '@/assets/js/utils/util';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    canSetup: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CtrlMenus,
  },
  filters: {
    formatValue(Value) {
      return getNameFromListByIDs(Value, CustomerPriceTypeEnumList);
    },
  },
  methods: {
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该客户分类吗 ?', `分类名称：[ ${item.CategoryName} ]`, () => this.$emit('remove', item), null);
    },
  },
};
</script>
<style lang='scss'>
</style>
