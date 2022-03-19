<template>
  <menu>
    <menuitem @click="onAddClick">
      <img src="@/assets/images/add.png" alt="">
      <span>添加</span>
    </menuitem>
    <menuitem @click="onDelClick" :class="{'is-disabled':disabled}">
      <img src="@/assets/images/del.png" alt="" v-if="!disabled">
      <img src="@/assets/images/del-disabled.png" alt="" v-else>
      <span>删除</span>
    </menuitem>
  </menu>
</template>

<script>
export default {
  props: {
    // 所在索引
    index: {
      type: Number,
    },
    // 删除按钮是否禁用
    disabled: {
      type: Boolean,
    },
  },
  methods: {
    // 添加按钮
    onAddClick() {
      this.$emit('addClick');
    },
    // 删除按钮
    onDelClick() {
      if (this.disabled) return;
      this.$emit('delClick', this.index);
    },
  },
};
</script>
