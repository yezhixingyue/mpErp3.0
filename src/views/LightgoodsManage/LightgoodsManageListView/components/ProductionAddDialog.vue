<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    title="新增抛货产品"
    submitText="保存"
    cancelText="取消"
    @submit="submit"
    @cancle="localVisible = false"
    @open="open"
    :disabled="!selectedId"
    class="mp-lightgoods-manage-page-production-add-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <span class="star">选择产品：</span>

      <el-select v-model="selectedId" filterable placeholder="请选择" style="height: 30px;width: 266px;" size="small">
        <el-option
          v-for="item in productList"
          :key="item.ID"
          :disabled="lightgoodsPoductIds.includes(item.ID)"
          :label="item.Name"
          :value="item.ID">
        </el-option>
      </el-select>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import api from '@/api';
import { IBaseProduct } from '../../types/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  visible: boolean
  lightgoodsPoductIds: string[]
}>();

const emit = defineEmits(['update:visible', 'submit', 'update:lightgoodsPoductIds']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const productList = ref<IBaseProduct[]>([]);

const selectedId = ref('');

const open = async () => {
  selectedId.value = '';
  if (productList.value.length > 0) return;

  const resp = await api.getAllProductLists();
  if (resp.data.isSuccess) {
    productList.value = resp.data.Data;
    const lightgoodsPoductIds = productList.value.filter(it => it.IsBuckyCargo).map(it => it.ID);
    emit('update:lightgoodsPoductIds', lightgoodsPoductIds);
  }
};

const submit = () => {
  const targetProduct = productList.value.find(it => it.ID === selectedId.value);
  if (!targetProduct) {
    MpMessage.error('保存失败', '找不到产品信息');
    return;
  }

  emit('submit', targetProduct);
};

</script>

<style scoped lang='scss'>
.mp-lightgoods-manage-page-production-add-dialog-comp-wrap {
  .content {
    padding: 0 20px;
    margin-top: -10px;
    margin-bottom: -15px;
    height: 100px;
    text-align: center;
    line-height: 32px;
  }
}
</style>
