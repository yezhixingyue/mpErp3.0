<template>
  <div class="class-table-item" :class="{isRoot: item.categoryLevel === 1}" v-show="!hideByKeywords">
    <div class="content" :style="`margin-left: ${item.categoryLevel - 1}em;`" :class="{active: curClassId === item.id}">
      <div class="left" @click="oncommand('switch')" :title="item.categoryName" v-html="formartName(item.categoryName)"></div>
      <div class="menus">
        <span class='add menu' @click="oncommand('create')" :disabled="item.categoryLevel >= maxLevel">新增</span>

        <el-dropdown trigger="click" placement="bottom" @command="(e) => oncommand(e)">
          <span class="move menu">移动</span>
          <el-dropdown-menu slot="dropdown" class="mp-doc-menu-dropdown">
            <el-dropdown-item command="up" :disabled="!arrowUp">上移</el-dropdown-item>
            <el-dropdown-item command="down" :disabled="!arrowDown">下移</el-dropdown-item>
            <el-dropdown-item command="move" :disabled="item.deep >= maxLevel">移动到其他分类</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown trigger="click" placement="bottom" @command="(e) => oncommand(e)">
          <span class="more menu">其他</span>
          <el-dropdown-menu slot="dropdown" class="mp-doc-menu-dropdown">
            <el-dropdown-item command="edit">编辑分类</el-dropdown-item>
            <el-dropdown-item command="remove" :disabled="item.children?.length > 0">删除分类</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="children" v-if="item.children && item.children.length > 0">
      <ClassTreeItem
       v-for="(it, i) in item.children" :key="it.id"
       :item="it"
       :keywords="keywords"
       :maxLevel="maxLevel"
       :arrowUp="i > 0"
       :arrowDown="i < item.children.length - 1"
       :curClassId="curClassId"
       @command="oncommand"
      />
    </div>

  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { IClassTreeItem } from '../../js/types';
import { CommandType } from './type';

const props = defineProps<{
  item: IClassTreeItem
  curClassId: number | ''
  keywords: string
  maxLevel: number
  arrowUp: boolean
  arrowDown: boolean
}>();

const emit = defineEmits(['command']);

const oncommand = (type: CommandType, item = props.item) => {
  emit('command', type, item);
};

// 根据keywords决定是否显示当前分类 - 如果keywords有值则进行判断：如果分类名称或子列表中存放分类名称 包含 keywords特殊字段 则予以显示且针对高亮处理，否则不显示该分类
const hideByKeywords = computed(() => {
  if (props.keywords) {
    const _find = (item: IClassTreeItem) => (item.categoryName.includes(props.keywords) || !!item.children.find(child => _find(child)));

    return !_find(props.item);
  }
  return false;
});

const formartName = (str: string) => {
  if (!props.keywords) return str;
  const reg = new RegExp(`${props.keywords}`, 'g');
  return str.replace(reg, (a) => `<i class='keywords-hit'>${a}</i>`);
};

</script>

<script lang='ts'>
export default {
  name: 'ClassTreeItem',
};
</script>

<style scoped lang='scss'>
.class-table-item {
  width: 100%;
  box-sizing: border-box;

  .content {
    height: 26px;
    line-height: 26px;
    // padding: 0 20px;
    padding-left: 20px;
    margin: 15px 0;
    display: grid;
    grid-template-columns: 1fr 200px;
    align-items: center;

    .left {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .menus {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      text-align: center;
      padding: 0 12px;

      .menu {
        color: #989898;
        cursor: pointer;
        user-select: none;
        transition: color 0.15s ease-in-out;

        &:hover {
          color: #585858;
        }

        &:active {
          text-shadow: #222 0px 0px 1px;
        }

        &[disabled=disabled] {
          pointer-events: none;
          color: #cbcbcb;
          // visibility: hidden;
          &::before {
            filter: grayscale(1);
            opacity: 0.4;
          }
        }

        &::before {
          content: '';
          display: inline-block;
          width: 15px;
          height: 24px;
          background-position: center;
          background-repeat: no-repeat;
          vertical-align: top;
          margin-right: 5px;
        }
        &.add::before {
          background-image: url('./images/add.png');
        }
        &.move::before {
          background-image: url('./images/move.png');
        }
        &.more::before {
          background-image: url('./images/more.png');
        }
      }
    }

    &.active {
      background-color: #f5f5f5;
    }
  }

  &.isRoot {
    padding-left: 6px;
    &:not(:last-of-type) {
      border-bottom: 1px solid #dcdcdc;
    }
  }
}

.mp-doc-menu-dropdown {
  > li {
    text-align: center;
    padding: 0;
    font-size: 13px;
    margin: 0;
  }
}
</style>

<style lang="scss">
.class-table-item .keywords-hit {
  display: inline-block;
}
</style>
