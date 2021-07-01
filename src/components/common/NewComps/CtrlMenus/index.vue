<template>
  <div class="ctrl-menus-container">
    <span @click="onEditClick" :class="canEdit ? '' : 'disabled'">
      <img src="@/assets/images/Compile.png" alt="">
      <i>编辑</i>
    </span>
    <span @click="onRemoveClick" :class="canRemove ? '' : 'disabled'">
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
