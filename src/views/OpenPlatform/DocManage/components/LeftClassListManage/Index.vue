<template>
  <div class="mp-erp-doc-manage-left-class-list-manage-comp-wrap">
    <SearchInput :value="keywords" @change="e => keywords = e" />

    <span class="add" @click="handleItemSave(null)">新增一级分类</span>

    <div class="table">
      <h4 class="header">
        <span class="n">页面分类名称</span>
        <span class="m">操作</span>
      </h4>

      <div class="list mp-scroll-wrap">
        <div ref="oDiv">
          <ClassTreeItem
            v-for="(it, i) in pageData.class.classTreeList" :key="it.id"
            :item="it"
            :keywords="keywords"
            :maxLevel="ManageClassList.config.maxLevel"
            :arrowUp="i > 0"
            :arrowDown="i < pageData.class.classTreeList.length - 1"
            :curClassId="pageData.curClassId"
            @command="oncommand"
            />
        </div>
        <p class="not-match" v-if="pageData.class.list.length && keywords && divHeight === 0">当前搜索词为：{{ keywords }}，暂无符合数据</p>
        <!-- <p class="not-match" >暂无数据</p> -->
        <p class="not-match" v-if="pageData.class.list.length === 0 && !pageData.class.loading">暂无数据，快去添加分类吧！</p>
      </div>
    </div>

    <!-- 分类新增|编辑 -->
    <EditDialog :visible.sync="editData.visible" :editData="editData" />

    <!-- 移动分类 -->
    <MoveDialog :visible.sync="moveVisible" :classList="pageData.class.list" :mova-class="moveTarget" @submit="onmove" />
  </div>
</template>

<script setup lang='ts'>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';
import SearchInput from './SearchInput.vue';
import ClassTreeItem from './ClassTreeItem.vue';
import { DocManageClass } from '../../js/DocManageClass';
import EditDialog from './EditDialog/EditDialog.vue';
import { IClassTreeItem, IDocClass } from '../../js/types';
import { CommandType, IClassEditData } from './type';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import MoveDialog from '../MoveDialog/Index.vue';
import { ManageClassList } from '../../js/ManageClassList';

const props = defineProps({
  pageData: DocManageClass,
});

const keywords = ref('');

const editData = ref<IClassEditData>({
  visible: false,
  item: null,
  ParentItem: null,
  classList: [],
});

/** 新增|编辑 */
const handleItemSave = (item: null | IDocClass, ParentItem: null | IDocClass = null) => {
  editData.value.item = item;
  editData.value.ParentItem = ParentItem;
  editData.value.classList = props.pageData.class.list;
  editData.value.visible = true;
};

/** 移动至其他分类 */
const moveVisible = ref(false);
const moveTarget = ref<null | IClassTreeItem>(null);

const oncommand = (type: CommandType, item: IClassTreeItem) => {
  switch (type) {
    case 'switch':
      props.pageData.switchClass(item.id);
      break;

    case 'create':
      handleItemSave(null, item);
      break;

    case 'edit':
      handleItemSave(item);
      break;

    case 'up':
      props.pageData.class.exchange(item, -1);
      break;

    case 'down':
      props.pageData.class.exchange(item, 1);
      break;

    case 'move':
      moveTarget.value = item;
      moveVisible.value = true;
      break;
    case 'remove':
      MpMessage.warn({
        title: '确定删除该分类吗 ?',
        msg: `分类名称：[ ${item.categoryName} ]`,
        onOk: () => props.pageData.class.remove(item),
      });
      break;

    default:
      break;
  }
};

const onmove = async (item: IDocClass) => { // 移动至其他分类
  if (!moveTarget.value) return;
  const bool = await props.pageData.class.move2Other(moveTarget.value, item.id);
  if (bool) {
    moveVisible.value = false;
  }
};

const oDiv = ref<HTMLDivElement>();
const divHeight = ref(0);

const resizeObserver = new ResizeObserver(entries => {
  if (entries[0]) {
    divHeight.value = entries[0].contentRect.height;
  }
});

onMounted(() => {
  resizeObserver.observe(oDiv.value);
});
onActivated(() => {
  resizeObserver.observe(oDiv.value);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});
onDeactivated(() => {
  resizeObserver.disconnect();
});

</script>

<style scoped lang='scss'>
.mp-erp-doc-manage-left-class-list-manage-comp-wrap {
  width: 100%;
  height: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #444;
  padding-bottom: 30px;

  >* {
    flex: none;
  }

  .add {
    display: flex;
    align-items: center;
    width: 110px;
    line-height: 18px;
    margin: 15px 0;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    user-select: none;

    &:hover {
      color: #888;
    }

    &:active {
      color: #222;
    }

    &::before {
      content: '';
      width: 13px;
      height: 13px;
      margin-right: 7px;
      background: url('@/assets/images/add.png') 100% 100%;
    }
  }

  .table {
    flex: 1;
    overflow: hidden;
    margin-right: -30px;
    display: flex;
    flex-direction: column;

    .header {
      flex: none;
      height: 43px;
      width: 100%;
      display: flex;
      align-items: center;
      font-weight: 700;
      background-color: #f5f5f5;

      .n {
        flex: 1;
        margin-left: 20px;
      }

      .m {
        flex: none;
        width: 210px;
        text-align: center;
      }
    }

    >.list {
      flex: 1;
      overflow: auto;
      overflow: overlay;
      padding-right: 10px;
      box-sizing: border-box;
      .not-match {
        padding: 15px 20px;
        font-size: 13px;
        color: #989898;
      }
    }
  }
}
</style>
