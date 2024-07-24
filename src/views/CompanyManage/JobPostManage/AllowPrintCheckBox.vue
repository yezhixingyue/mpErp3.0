<template>
  <el-checkbox v-model="localChecked" v-if="props.user.PermissionList.PermissionPrintPackage.Obj.PrintLimit && loaded">未完工订单打印标签</el-checkbox>
</template>

<script setup lang='ts'>
import api from '@/api';
import { IUser } from '@/pinia/modules/user/type';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  user: IUser
}>();

const checked = ref(false);
const loaded = ref(false);

const localChecked = computed({
  get() {
    return checked.value;
  },
  async set() {
    const resp = await api.getPrintPackageChangeUnFinishedOrderLimit(!checked.value);

    if (resp?.data?.isSuccess) {
      checked.value = !checked.value;
    }
  },
});

onMounted(async () => {
  if (!props.user.PermissionList.PermissionPrintPackage.Obj.PrintLimit) return;

  const resp = await api.getPrintPackageUnFinishedOrderLimit();

  if (resp?.data?.isSuccess) {
    checked.value = resp.data.Data === 'True';
    loaded.value = true;
  }
});
</script>

<style scoped lang='scss'>
</style>
