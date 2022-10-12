<template>
  <section>
    <Pager :pageSize="20" :count="200" />
    <EpCascader />
    <CommonDialogComp />
  </section>
</template>

<script setup lang='ts'>
import { Pager, EpCascader, CommonDialogComp } from 'mpzj-sell-lib';
</script>

<style scoped lang='scss'>
</style>
