<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    title="保存文章备注"
    submitText="保存"
    cancelText="关闭"
    @submit="submit"
    @cancle="localVisible = false"
    @open="open"
    class="mp-doc-manage-page-doc-save-remark-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <span>备注：</span>
      <el-input type="textarea" :rows="6" placeholder="请输入备注" v-model.trim="remark"></el-input>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';

const props = defineProps<{
  visible: boolean,
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const remark = ref('');

const open = () => {
  remark.value = '';
};

const submit = () => {
  emit('submit', remark.value);
};

</script>

<style scoped lang='scss'>
.mp-doc-manage-page-doc-save-remark-dialog-comp-wrap {
  .content {
    display: block;
    padding: 0 20px;
    margin-top: -10px;
    margin-bottom: -15px;

    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 1fr;
  }
}
</style>
