<template>
  <section>
    <Pager :pageSize="20" :count="200" />
    <EpCascader />
    <CommonDialogComp />
    <MpButton type="primary" size="mini">123</MpButton>
    <Button type="primary" size="mini">333</Button>
    <Button type="primary" size="small">124443</Button>
    <Button type="primary" size="small">125553</Button>
  </section>
</template>

<script setup lang='ts'>
import {
  Pager, EpCascader, CommonDialogComp, Button,
} from 'mpzj-sell-lib';
</script>

<style scoped lang='scss'>
</style>
