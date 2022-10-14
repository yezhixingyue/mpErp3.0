<template>
  <span>
    {{props.title}}
  </span>
</template>

<script setup lang='ts'>
const props = withDefaults(defineProps<{
  title?: string,
  disabled?: boolean
  type?: 'edit' | 'del'
  defineOption?: null | {

  },
}>(), {
  title: '编辑',
  disabled: false,
  type: 'edit',
});
</script>

<style scoped lang='scss'>
</style>
