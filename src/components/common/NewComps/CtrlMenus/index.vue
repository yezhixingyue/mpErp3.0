<template>
  <div class="ctrl-menus-container">
    <span @click="onCopyClick" :class="canCopy ? '' : 'disabled'" v-if="showList.includes('copy')">
      <img src="@/assets/images/copy.png" alt="">
      <i>拷贝</i>
    </span>
    <span @click="onSelectClick" :class="canSelect ? '' : 'disabled'" v-if="showList.includes('select')">
      <img src="@/assets/images/select.png" alt="">
      <i>选择</i>
    </span>
    <span @click="onEditClick" :class="canEdit ? '' : 'disabled'" v-if="showList.includes('edit')">
      <img src="@/assets/images/Compile.png" alt="">
      <i>编辑</i>
    </span>
    <span @click="onRemoveClick" :class="canRemove ? '' : 'disabled'" v-if="showList.includes('del')">
      <img src="@/assets/images/del.png" alt="">
      <i>删除</i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    canEdit: {
      type: Boolean,
      default: true,
    },
    canRemove: {
      type: Boolean,
      default: true,
    },
    canCopy: {
      type: Boolean,
      default: true,
    },
    canSelect: {
      type: Boolean,
      default: true,
    },
    showList: {
      type: Array,
      default: () => ['edit', 'del'],
    },
  },
  methods: {
    onEditClick() {
      if (!this.canEdit) return;
      this.$emit('edit');
    },
    onRemoveClick() {
      if (!this.canRemove) return;
      this.$emit('remove');
    },
    onCopyClick() {
      if (!this.canCopy) return;
      this.$emit('copy');
    },
    onSelectClick() {
      if (!this.canSelect) return;
      this.$emit('select');
    },
  },
};
</script>
<style lang='scss'>
.ctrl-menus-container {
  display: inline-block;
  > span {
    font-size: 12px;
    color: #989898;
    cursor: pointer;
    > img {
      margin-right: 6px;
      vertical-align: -2px;
    }
    transition: color 0.1s ease-in-out;
    user-select: none;
    &:hover {
      color: #444;
    }
    & + span {
      margin-left: 20px;
    }
    &.disabled {
      > img {
        filter: grayscale(1);
      }
      color: #cbcbcb;
      cursor: not-allowed;
    }
  }
}
</style>
