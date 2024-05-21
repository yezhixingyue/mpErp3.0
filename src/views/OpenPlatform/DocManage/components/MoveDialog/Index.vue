<template>
  <CommonDialogComp
    width="600px"
    :visible.sync="localVisible"
    :title="titleBox.title"
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
        <h4>{{ titleBox.name }}<i class="is-pink ml-5">{{ copyArticle ? '复制' : '移动'  }}</i> </h4>
        <span>至</span>

        <span class="ml-50 target" :class="{em: !curItem}">{{ curItem?.categoryName || '' }}</span>
      </div>
      <div class="box mp-scroll-wrap">
        <p class="all" :class="{active:curItem?.id===-1}" :disabled="!moveClass" @click="onAllClick">全部文件夹</p>
        <RowItem v-for="it in localClassTreeList" :key="it.id" :curClassId="curItem?.id || ''" :item="it" @select="item => curItem = item" />
      </div>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { IArticle, IClassTreeItem, IDocClass } from '../../js/types';
import { ManageClassList } from '../../js/ManageClassList';
import RowItem from './RowItem.vue';

const props = defineProps<{
  visible: boolean
  classList: IDocClass[]
  moveClass?: IClassTreeItem // 和下面2个参数 3个只能有一个有值
  moveArticle?: IArticle
  copyArticle?: IArticle
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

const titleBox = computed(() => {
  const temp = {
    title: '',
    name: '',
  };
  if (props.moveClass) {
    temp.title = '移动分类';
    temp.name = props.moveClass.categoryName || '';
  } else if (props.moveArticle) {
    temp.title = '移动文章';
    temp.name = props.moveArticle.helpdocuTitle || '';
  } else if (props.copyArticle) {
    temp.title = '复制文章';
    temp.name = props.copyArticle.helpdocuTitle || '';
  }

  return temp;
});

const curItem = ref<null | IDocClass>(null);
const localClassTreeList = ref<IClassTreeItem[]>([]);

const isDisabled = computed(() => {
  if (!curItem.value) return true;

  if (props.moveClass) {
    if (props.moveClass.categoryParentID === curItem.value.id) return true;
    if (props.moveClass.deep + curItem.value.categoryLevel > ManageClassList.config.maxLevel) return true;
  }

  if (props.moveArticle && props.moveArticle.categoryID === curItem.value.id) return true;

  return false;
});

const onAllClick = () => {
  curItem.value = {
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
  localClassTreeList.value = ManageClassList.getClassTreeList(props.classList, props.moveClass?.id);

  if (props.moveArticle || props.copyArticle) {
    const _t = props.moveArticle || props.copyArticle;
    curItem.value = props.classList.find(it => it.id === _t.categoryID) || null;
  }

  if ([props.moveClass, props.moveArticle, props.copyArticle].filter(it => it).length !== 1) {
    throw new Error('传值不正确，指定3个参数中必须有且只有1个应传递值');
  }
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
      height: 320px;
      overflow: auto;
      border: 1px solid #dcdcdc;
      margin-top: 10px;

      .all {
        color: #444;
        line-height: 28px;
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
