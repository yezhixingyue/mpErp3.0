<template>
  <CommonDialogComp
    width="660px"
    title="产品半成品设置"
    :visible.sync="localVisible"
    class="dialog"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    top="16vh"
  >
    <h4>
      <span>{{props.TransformerListPageData?.curEditProductName || '未知产品'}}</span>
      <span class="ml-10" v-if="props.TransformerListPageData?.curPart?.Name">{{props.TransformerListPageData.curPart.Name}}</span>
    </h4>
    <div class="content">
      <label for="">半成品：</label>
      <el-radio-group v-model="radioValue">
        <el-radio v-for="it in SemiFinishedList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
      </el-radio-group>
    </div>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from 'mpzj-sell-lib';
import { message } from '@/assets/js/message';
import api from '@/api';
import { computed, ref, watch } from 'vue';
import { TransformerListPageDataPlainType } from '@/store/modules/transformer/TransformerListPageDataClass';

const props = defineProps<{
  visible: boolean
  TransformerListPageData: TransformerListPageDataPlainType | null,
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const SemiFinishedList = ref<{ID: string, Name: string}[]>([]);
const getSemiList = async () => {
  if (!props.TransformerListPageData || SemiFinishedList.value.length > 0) return;
  const resp = await api.getSemiFinishedProductList(props.TransformerListPageData.ServerID).catch(() => null);
  if (resp?.data.Status === 1000) {
    SemiFinishedList.value = resp.data.Data;
    if (radioValue.value) {
      const ids = SemiFinishedList.value.map(it => it.ID);
      if (!ids.includes(radioValue.value)) {
        radioValue.value = '';
        message.warn({
          title: '注意',
          message: '原半成品设置已不存在于当前半成品列表中，请重新设置',
        });
      }
    }
  }
};

const radioValue = ref('');

const onOpen = () => {
  if (!props.TransformerListPageData?.curEditItem) return;
  const target = props.TransformerListPageData.curPart || props.TransformerListPageData.curEditItem;
  radioValue.value = '';
  if (target.SemiFinished) {
    radioValue.value = target.SemiFinished.ID;
  }
  getSemiList();
};

watch(() => props.TransformerListPageData?.ServerID, () => {
  SemiFinishedList.value = [];
});

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radioValue.value = '';
};

const submit = () => {
  if (!props.TransformerListPageData) return;
  if (!radioValue.value) {
    message.error({ title: '保存失败', message: '请选择半成品' });
    return;
  }
  const t = SemiFinishedList.value.find(it => it.ID === radioValue.value);
  if (!t) return;
  props.TransformerListPageData.getSemiFinishedSave(t, cancel);
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding-left: 65px;
    h4 {
      color: #444;
    }
    .content {
      display: flex;
      margin-top: 10px;
      > label {
        flex: none;
        color: #444;
        margin-right: 4px;
      }
      > div {
        flex: 1;
        line-height: 32px;
        overflow: auto;
        overflow: overlay;
        min-height: 180px;
        max-height: 320px;
        @include scroll;
        > label {
          margin-right: 8px;
          // margin-bottom: 8px;
          .el-radio__label {
            display: inline-block;
            width: 8em;
            overflow: hidden;
            white-space: nowrap;
            vertical-align: -1px;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
