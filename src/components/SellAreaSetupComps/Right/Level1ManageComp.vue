<template>
  <ul class="mp-erp-basic-set-up-sell-area-set-up-page-right-content-level1-manage-wrap" ref="oWrap">
    <li v-for="(it, i) in localList" :key="it.ID || it.key">
      <el-input v-model="it.ClassName" maxlength="10" size="small" placeholder="在此输入区域名称" :disabled='it.Index === 999' />
      <menu>
        <menuitem @click="onAddClick">
          <img src="@/assets/images/add.png" alt="">
          <span>添加</span>
        </menuitem>
        <menuitem :class="{'is-disabled': !it.canRemove}" @click="onRemoveClick(it, i)">
          <img src="@/assets/images/del.png" alt="" v-if="it.canRemove">
          <img src="@/assets/images/del-disabled.png" alt="" v-else>
          <span>删除</span>
        </menuitem>
      </menu>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    level1List: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localList: [],
    };
  },
  methods: {
    getIsOrNotChange() { // 是否发生变化 （切换时使用）
      const list = this.localList.filter(it => it.ClassName);
      return JSON.stringify(list) !== JSON.stringify(this.level1List);
    },
    createAAreaItem() {
      const temp = {
        ClassName: '',
        ID: '',
        Index: '',
        Level: 1,
        ParentID: -1,
        // Type: 0,
        canRemove: true,
        key: Math.random().toString(16).slice(-10),
      };
      return temp;
    },
    async onAddClick() { // 添加一行
      this.localList.push(this.createAAreaItem());
      await this.$nextTick();
      if (this.$refs.oWrap) this.$refs.oWrap.scrollTop = 10000;
    },
    onRemoveClick(it, i) { // 删除一行
      if (!it.canRemove) return;
      if (!it.ID) { // 没有ID时可以直接删除
        this.localList.splice(i, 1);
        return;
      }
      this.messageBox.warnCancelBox('确定删除该销售区域吗', `区域名称：[ ${it.ClassName || '未设置'} ]`, () => {
        this.localList.splice(i, 1);
      });
    },
    handleSubmit() {
      if (!this.getIsOrNotChange()) {
        this.messageBox.failSingleError('保存失败', '一级区域未发生改变');
        return null;
      }
      const list = this.localList.filter(it => it.ClassName || it.ID !== '');
      if (list.some(it => !it.ClassName)) {
        this.messageBox.failSingleError('保存失败', '区域名称不能为空（新增空项除外）');
        return null;
      }
      if ([...new Set(list.map(it => it.ClassName))].length < list.length) {
        this.messageBox.failSingleError('保存失败', '区域名称重复');
        return null;
      }
      // 区分出编辑的（名称发生改动）、新增的（ID为空）、被删除的
      const saveList = list.filter(it => {
        if (it.ID === '') return true; // 新增的
        const t = this.level1List.find(_it => _it.ID === it.ID && _it.ClassName === it.ClassName);
        return !t; // 编辑的
      });
      const removeList = this.level1List.filter(it => !list.find(_it => _it.ID === it.ID)); // 被删除的
      if (saveList.length > 0 || removeList.length > 0) {
        const result = { saveList, removeList };
        return result;
      }
      return null;
    },
  },
  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.level1List)) || [];
    this.localList.push(this.createAAreaItem());
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-right-content-level1-manage-wrap {
  max-height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  > li {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    > .el-input {
      width: 240px;
      > input {
        border-left: none;
        border-right: none;
        border-top: none;
        padding: 0;
      }
      &.is-disabled .el-input__inner {
        background-color: #fcfcfc;
      }
    }
    > menu {
      display: flex;
      align-items: center;
      margin-left: 80px;
      color: #a2a2a2;
      > menuitem {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 20px;
        height: 28px;
        user-select: none;
        > img {
          margin-right: 10px;
        }
        & + menuitem {
          border-left: 1px solid #eee;
        }
        &:not(.is-disabled):hover {
          color: #585858;
        }
      }
    }
  }
}
</style>
