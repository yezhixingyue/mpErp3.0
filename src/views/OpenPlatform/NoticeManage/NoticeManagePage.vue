<template>
  <section>
    NoticeManagePage
    <div style="width: 800px;height: 500px;">
      <TinyMCEditor :modelValue.sync="content" />
    </div>
    {{ content }}
  </section>
</template>

<script setup lang='ts'>
import TinyMCEditor from '@/components/common/TinyMCEditor/TinyMCEditor.vue';
import { ref } from 'vue';

const content = ref('');
</script>

<script lang='ts'>
export default {
  name: 'NoticeManagePage',
};
</script>

<style scoped lang='scss'>
</style>
