<template>
  <CommonDialogComp
    width="750px"
    :showDanger="row && row.Status === DeveloperStatusEnum.Apply"
    :showSubmit="row && row.Status === DeveloperStatusEnum.Apply"
    :visible.sync="localVisible"
    :title="title"
    submitText="通过"
    dangerText="不通过"
    cancelText="关闭"
    @submit="submit"
    @cancle="cancel"
    @danger="danger"
    class="mp-developer-list-manage-page-check-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="area" v-if="row">
      <div class="title">
        <div>
          <span class="mr-20">{{ row.Name }} （ {{ row._TypeText }} ）</span>
          <span>{{ row.Code }}</span>
        </div>
        <div v-if="row.Status === DeveloperStatusEnum.Forbit">
          <span class="is-pink">未通过</span>
          <span v-if="row.Remark">（ {{ row.Remark }} ）</span>
        </div>
        <div v-else>技术联系人：{{ row._ContactsText }}</div>
      </div>

      <el-image style="width: 100%; height: 355px" fit="cover" :src="row.Pic" :preview-src-list="[row.Pic]"></el-image>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { getDeveloperTableList } from '../js/utils';
import { DeveloperStatusEnum } from '../js/enum';

const props = defineProps<{
  visible: boolean,
  row: ReturnType<typeof getDeveloperTableList> | null
}>();

const emit = defineEmits(['update:visible', 'reject', 'resolve']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const title = computed(() => (props.row && props.row.Status === DeveloperStatusEnum.Apply ? '审核账号' : '查看详情'));

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  emit('resolve');
};

const danger = () => {
  emit('reject');
};
</script>

<style scoped lang='scss'>
.mp-developer-list-manage-page-check-dialog-comp-wrap {
  .area {
    width: 500px;
    margin: 0 auto;
    max-height: 500px;
    overflow: auto;

    .title {
      div {
        padding-bottom: 10px;
        line-height: 18px;
      }
    }
  }
}
</style>
