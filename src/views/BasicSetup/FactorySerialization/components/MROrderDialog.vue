<template>
  <CommonDialogComp width="550px" title="订单信息序列化设置" :visible.sync="localVisible" class="dialog" @open="open" @submit="submit" @cancle="cancel" top="16vh">
    <div class="content" v-if="ruleForm">
      <div class="checks">
        <el-checkbox v-model="ruleForm.ShowOrderID">显示订单号</el-checkbox>
        <el-checkbox v-model="ruleForm.ShowOrderName">显示订单名称</el-checkbox>
        <el-checkbox v-model="ruleForm.ShowPeriod">显示工期</el-checkbox>
      </div>

      <div class="tips is-origin">
        <p>显示订单名称：即订单的“文件内容”。</p>
        <p>如审稿时有填写“订单名称”则优先显示，仅取前8位有效字符</p>
        <p>显示举例：1000000001_订单名称取前八位_生产需求_5月10日 03点00分前</p>
      </div>
    </div>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { IMRProduct } from '../js/types';

const props = defineProps<{
  visible: boolean
  item: IMRProduct | null
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

const ruleForm = ref<null | Pick<IMRProduct, 'ShowOrderID' | 'ShowOrderName' | 'ShowPeriod'>>(null);

const open = () => {
  ruleForm.value = props.item ? { ShowOrderID: props.item.ShowOrderID, ShowOrderName: props.item.ShowOrderName, ShowPeriod: props.item.ShowPeriod } : null;
};

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  emit('submit', ruleForm.value);
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';

.dialog {
    .content {
      margin-top: 0px;
      margin-bottom: -20px;
      padding-left: 50px;

      .checks {
        padding-left: 150px;
        padding-bottom: 15px;
        > label {
          display: block;
          margin-bottom: 13px;
        }
      }

      .tips {
        line-height: 18px;
        letter-spacing: 0.5px;
      }
    }

}
</style>
