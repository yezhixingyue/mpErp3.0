<template>
  <section>
    <header>
      <div>分类名称</div>
      <div>权限</div>
      <div>操作</div>
    </header>
    <main>
      <ul>
        <li v-for="it in list" :key="it.CategoryID">
          <div>{{it.CategoryName}}</div>
          <div>
            <span v-for="item in it.PermissionList" :key="item.Key" >
              <template v-if="item.HavePermission">
                {{item.Name}} &nbsp;
              </template>
            </span>
          </div>
          <div>
            <!-- <span>设置权限</span> -->
            <CtrlMenus v-show="canSetup"
            :showList="['edit','del', 'permissionSetting']"
            @edit='onSetupClick(it)'
            @remove='onRemoveClick(it)'
            @onSermissionSetting="onSermissionSetting(it)"
            :canRemove='it.AllowRemove' />
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
      this.messageBox.warnCancelBox('确定删除该客户分类吗 ?', `分类名称：[ ${item.CategoryName} ]`, () => this.$emit('remove', item), null);
    },
    onSermissionSetting(item) {
      this.$emit('sermissionSetting', item);
    },
  },
};
</script>
<style lang='scss'>
</style>
