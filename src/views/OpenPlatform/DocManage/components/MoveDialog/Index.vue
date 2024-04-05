<template>
  <CommonDialogComp
    width="600px"
    :visible.sync="localVisible"
    title="移动分类"
    submitText="保存"
    cancelText="关闭"
    :disabled="isDisabled"
    @submit="submit"
    @cancle="localVisible = false"
    @open="open"
    @closed="closed"
    class="mp-doc-manage-page-move-class-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <div class="title">
        <span class="mr-5">将</span>
        <h4>{{ movaClass?.categoryName || '' }}<i class="is-pink ml-5">移动</i> </h4>
        <span>至</span>

        <span class="ml-50 target" :class="{em: !curItem}">{{ curItem?.categoryName || '' }}</span>
      </div>
      <div class="box mp-scroll-wrap">
        <p class="all" :class="{active:curItem?.id===-1}" :disabled="!movaClass" @click="onAllClick">全部文件夹</p>
        <RowItem v-for="it in localClassTreeList" :key="it.id" :curClassId="curItem?.id || ''" :item="it" @select="item => curItem = item" />
      </div>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { IClassTreeItem, IDocClass } from '../../js/types';
import { ManageClassList } from '../../js/ManageClassList';
import RowItem from './RowItem.vue';

const props = defineProps<{
  visible: boolean,
  classList: IDocClass[]
  movaClass?: IClassTreeItem
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

const curItem = ref<null | IClassTreeItem>(null);
const localClassTreeList = ref<IClassTreeItem[]>([]);

const isDisabled = computed(() => {
  if (!curItem.value) return true;

  if (props.movaClass) {
    if (props.movaClass.categoryParentID === curItem.value.id) return true;
    if (props.movaClass.deep + curItem.value.categoryLevel > ManageClassList.config.maxLevel) return true;
  }

  return false;
});

const onAllClick = () => {
  curItem.value = {
    children: [],
    deep: 0,
    id: -1,
    categoryName: '根分类',
    categoryLevel: 0,
    categoryParentID: -11,
    categoryOrder: 0,
  };
};

const closed = () => {
  localClassTreeList.value = [];
};

const open = () => {
  curItem.value = null;
  localClassTreeList.value = ManageClassList.getClassTreeList(props.classList, props.movaClass?.id);
};

const submit = () => {
  emit('submit', curItem.value);
};

</script>

<style scoped lang='scss'>
.mp-doc-manage-page-move-class-dialog-comp-wrap {
  .content {
    display: block;
    padding: 0 20px;
    margin-top: -10px;
    margin-bottom: -15px;

    .title {
      display: flex;
      align-items: center;
      color: #444;
      h4 {
        font-weight: 700;
      }

      .target {
        color: #585858;
        font-size: 13px;

        &.em {
          color: #aaa;
        }
      }
    }

    .box {
      height: 300px;
      overflow: auto;
      border: 1px solid #dcdcdc;
      margin-top: 10px;

      .all {
        color: #444;
        line-height: 26px;
        margin: 3px 0 3px 10px;
        padding-left: 10px;
        cursor: pointer;

        &.active {
          background-color: #f5f5f5;
        }

        &[disabled=disabled] {
          pointer-events: none;
        }
      }
    }
  }
}
</style>
