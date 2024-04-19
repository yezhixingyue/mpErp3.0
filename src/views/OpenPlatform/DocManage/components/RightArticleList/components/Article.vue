<template>
  <div class="article">
    <div class="title">
      <span class="tag" v-if="displayCollection.type" :class="displayCollection.type.className">{{ displayCollection.type.Name }}</span>
      <h2>
        <a :href="`${docClientURL}?id=${item.id}`" target="_blank" rel="noopener noreferrer">{{ item.helpdocuTitle }}</a>
      </h2>
    </div>

    <div class="workbench">
      <div class="date">
        <span >创建：{{ item.creatorName }} <i class="ml-4">{{ getDateFormat(item.helpdocuCreatdate) }}</i></span>
        <span v-if="item.helpdocuEditdate" >编辑：{{ item.operatorName }} <i class="ml-4">{{ getDateFormat(item.helpdocuEditdate) }}</i></span>
      </div>

      <div class="menus">
        <div class="menu history" @click="oncommond('history')">查看修改历史</div>
        <div class="menu edit" @click="oncommond('edit')">编辑</div>
        <!-- <div class="menu view" @click="oncommond('view')">浏览</div> -->
        <el-popover placement="bottom" trigger="click" @show="onPopoverShow" popper-class="hide-animation">
          <div class="move-content">
            <div class="close">
              <i class="el-icon-close blue-span" @click="closePopover"></i>
            </div>
             <div class="first">
              <span>1. 移动至 第</span>
              <el-input v-model.trim.number="moveVal" size="mini" maxlength="4" class="input" @keyup.enter.native="onmoveclick"></el-input>
              <span>条</span>
              <el-button type="primary" size="mini" @click="onmoveclick" :disabled="!/^\d+$/.test(moveVal) || +moveVal <= 0">确定</el-button>
             </div>
             <div class="second">
              <span>2. </span>
              <span class="blue-span" @click="onmove2outclick">移动至其他分类</span>
             </div>
          </div>
          <div slot="reference" class="menu move">移动</div>
        </el-popover>
        <div class="menu remove" @click="onRemoveClick">删除</div>
        <div class="menu copy" @click="oncommond('copy')">复制</div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ArticleCommandType, IArticle } from '../../../js/types';
import { DocTypeEnumList } from '../../../js/enum';
import { computed, ref } from 'vue';
import { getDateFormat } from '@/assets/js/utils/util';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { docClientURL } from '@/api/doc/instance';

const props = defineProps<{
  item: IArticle
  listNumber: number
}>();

const emit = defineEmits(['command']);

const displayCollection = computed(() => ({
  type: DocTypeEnumList.find(it => it.ID === props.item.helpdocuType),
}));

const moveVal = ref('');

const onPopoverShow = () => {
  moveVal.value = '';
};

const closePopover = () => { // 关闭移动弹窗
  document.body.click();
};

const onmoveclick = () => {
  if (!/^\d+$/.test(moveVal.value)) return;
  if (+moveVal.value > props.listNumber) {
    MpMessage.error({ title: '移动失败', msg: '要移动的次序超出范围' });
    return;
  }

  emit('command', 'move', props.item, moveVal.value);
  closePopover();
};

const onmove2outclick = () => {
  oncommond('move2out');
  closePopover();
};

const oncommond = (type: ArticleCommandType) => {
  emit('command', type, props.item);
};

const onRemoveClick = () => {
  MpMessage.warn({
    title: '删除后不可恢复，确认删除吗？',
    msg: `文章名称：[ ${props.item.helpdocuTitle} ]`,
    onOk: () => { oncommond('remove'); },
  });
};

</script>

<style scoped lang='scss'>
.article {
  height: 81px;
  border-bottom: 1px solid #d5d5d5;
  width: 100%;
  color: #444;

  .title {
    display: flex;
    align-items: center;
    padding-top: 15px;

    .tag {
      flex: none;
      font-size: 14px;
      font-weight: 700;
      width: 90px;
      line-height: 28px;
      text-align: center;
      border-radius: 4px;
      margin-right: 10px;

      &.blue {
        color: #26bcf9;
        background: #E9F8FF;
      }
      &.orange {
        color: #FFB300;
        background: #FAF2D0;
      }
    }
    h2 {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
      font-size: 16px;
      max-width: 80%;

      a {
        color: inherit;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .workbench {
    font-size: 12px;
    line-height: 24px;
    padding-top: 8px;
    display: flex;
    align-items: center;

    .date {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span:first-of-type {
        margin-right: 35px;
      }
    }

    .menus {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 360px;
      padding: 0 30px;

      .menu {
        cursor: pointer;
        transition: 0.1s ease-in-out;
        transition-property: color text-shadow;
        display: flex;
        align-items: center;
        user-select: none;
        font-size: 12px;
        color: #989898;

        &:hover {
          color: #444;
        }
        &:active {
          text-shadow: #444 0 0 0.5px;
        }

        &.history {
          color: #26bcf9;
          margin-right: 15px;
          &:hover {
            color: #35dff9;
          }
          &:active {
            text-shadow: #35dff9 0 0 1px;
          }
          &::before {
            background: url('../images/menus/history.png') center/16px 16px no-repeat;
          }
        }
        &::before {
          content: '';
          display: inline-block;
          width: 17px;
          height: 16px;
          margin-right: 5px;
        }
        &.edit::before {
          background: url('../images/menus/edit.png') center/16px 16px no-repeat;
        }
        &.view::before {
          background: url('../images/menus/view.png') center/17px 11px no-repeat;
        }
        &.move::before {
          background: url('../images/menus/move.png') center/14px 15px no-repeat;
        }
        &.remove::before {
          background: url('../images/menus/remove.png') center/15px 16px no-repeat;
        }
        &.copy::before {
          background: url('../images/menus/copy.png') center/14px 14px no-repeat;
        }
      }
    }
  }

}

.move-content {
  font-size: 12px;
  padding-bottom: 10px;
  span {
    letter-spacing: 0.5px;
  }
  .first {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding-bottom: 18px;

    .input {
      margin: 0 6px;
      width: 60px;
    }

    button {
      margin-left: 10px;
    }
  }

  .close {
    text-align: right;
    padding-bottom: 12px;
    i {
      font-size: 15px;
    }
  }
}
</style>

<style>
.hide-animation {
  transition: none;
}
</style>
