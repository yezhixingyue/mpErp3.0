<template>
  <section class="test-wrap" style="display: flex; flex-wrap: wrap">
    <!-- <AreaTextInputList /> -->

    <AreaTextGroup :list="values" @change="onChange" />
  </section>
</template>

<script setup lang="ts">
// import AreaTextInputList from './AreaTextInputList.vue';
import AreaTextGroup from './AreaTextGroup.vue';
import { computed, ref } from 'vue';

const obj = ref({
  value1: '1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n\na\nb\nc',
  value2: '',
  value3: '1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n\na\nb\nc',
});

const values = computed(() => [obj.value.value1, obj.value.value2, obj.value.value3]);

const onChange = (val: string, index: number) => {
  if (index === 0) obj.value.value1 = val;
  if (index === 1) obj.value.value2 = val;
  if (index === 2) obj.value.value3 = val;
};

</script>

<style scoped lang="scss">
.test-wrap {
  padding-left: 10px;
  display: none !important;

  > * {
    flex: none;
  }
}
</style>
