<template>
  <section>
    <header>
      <div>等级名称</div>
      <div>信誉额度</div>
      <div>操作</div>
    </header>
    <main>
      <ul>
        <li v-for="it in list" :key="it.CategoryID">
          <div>{{it.CategoryName}}</div>
          <div>{{it.Value}}</div>
          <div>
            <CtrlMenus v-show="canSetup" @edit='onSetupClick(it)' @remove='onRemoveClick(it)' :canRemove='it.AllowRemove' />
          </div>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
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
  methods: {
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该客户等级吗 ?', `等级名称：[ ${item.CategoryName} ]`, () => this.$emit('remove', item), null);
    },
  },
};
</script>
<style lang='scss'>
</style>
