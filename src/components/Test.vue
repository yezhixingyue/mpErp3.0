<template>
  <div>
    <h3>{{ props.msg }}</h3>

    <p>{{name}}</p>

    <el-button type="primary" class="mr-20" size="mini" @click="count++">count is {{ count }}</el-button>
    <el-button type="success" size="mini" @click="testStore.setCounter(counter + 1)">counter is {{ counter }}</el-button>

    <el-button type="danger" size="small" @click="request">接口请求</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import api from '@/api';
import { useTestStore } from '../store/modules/test';

// eslint-disable-next-line no-undef
const props = defineProps<{
  msg: string
}>();

const testStore = useTestStore();

const { counter, name } = storeToRefs(testStore);

const count = ref(0);

const request = async () => {
  const resp = await api.getLogin(2);
  console.log('request', resp);
};

onMounted(async () => {
  // api.getLogin(1);
  // await api.getUser();
  // await api.getUser();
  // await api.getUser();
  // api.getUser();
});
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
