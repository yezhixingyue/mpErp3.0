<template>
  <dl class="item">
    <dt>
      <div class="name">{{getProductName(props.item)}}</div>
      <div class="right">
        <span class="blue-span" @click="onClick(menuTypeEnum.partSetup)">选择产品部件 ({{selectedPartList.length}})</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.UnionLine)">组合生产线映射 ({{props.item.UnionLineCount}})</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.UnionWorking)">组合工序映射 ({{props.item.UnionWorkingCount}})</span>
        <span @click="displayPart = !displayPart" class="arrow" :class="{disabled:selectedPartList.length===0}">
          {{displayPart ? '隐藏' : '展开'}}
          <i class="el-icon-caret-bottom" v-show="!displayPart"></i>
          <i class="el-icon-caret-top" v-show="displayPart"></i>
        </span>
      </div>
    </dt>
    <dd v-for="it in selectedPartList" :key="it.ID" v-show="displayPart">
      <div class="left">
        <span class="name" :title="it.Name">{{it.Name}}</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.LineCount, it.ID)">生产线映射 ({{it.LineCount}})</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.WorkingCount, it.ID)">工序映射 ({{it.WorkingCount}})</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.WorkTimes, it.ID)">作业次数 ({{it.WorkTimesCount}})</span>
      </div>
      <div class="right">
        <span class="blue-span" @click="onClick(menuTypeEnum.WordsInfo, it.ID)">文字信息映射 ({{it.WordsInfoCount}})</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.NumbericInfo, it.ID)">数值映射 ({{it.NumbericInfoCount}})</span>
        <span class="blue-span" @click="onClick(menuTypeEnum.UnionMakeupLimit, it.ID)">合拼设置 ({{it.UnionMakeupLimitCount}})</span>
        <span>
          产出半成品：
          <i class="blue-span">设置</i>
          <em class="semi" :title="it.SemiFinishedProduct||''">{{it.SemiFinishedProduct || '无'}}</em>
        </span>
      </div>
    </dd>
  </dl>
</template>

<script setup lang='ts'>
import { IProductClassLv1ListItem } from '@/assets/js/utils';
import { IPart, IProduct, menuTypeEnum } from '@/store/modules/transformer/types';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  item: IProduct,
  productClassLevelList: IProductClassLv1ListItem[]
}>();

const emit = defineEmits(['menuClick']);

const onClick = (type: menuTypeEnum, PartID?: string) => {
  const _PartID = PartID && PartID !== props.item.ID ? PartID : '';
  emit('menuClick', type, props.item, _PartID);
};

const getProductName = (it: IProduct) => {
  const arr = [];

  const { FirstLevel, SecondLevel } = it.Class;
  const lv1 = props.productClassLevelList.find(_it => _it.ID === FirstLevel.ID);
  if (lv1) {
    arr.push(lv1.Name);
    const lv2 = lv1.children.find(_it => _it.ID === SecondLevel.ID);
    if (lv2) {
      arr.push(lv2.Name);
    }
  }

  arr.push(it.Name);

  return arr.join(' ');
};

/** 已选中产品部件列表 */
const selectedPartList = computed(() => {
  const list = props.item.PartList.filter(it => it.IsSelected);
  if (props.item.IsSelected) {
    const temp: IPart = {
      ID: props.item.ID,
      Name: '产品',
      IsSelected: props.item.IsSelected,
      DefaultLine: props.item.DefaultLine,
      LineCount: props.item.LineCount,
      NumbericInfoCount: props.item.NumbericInfoCount,
      SemiFinishedProduct: props.item.SemiFinishedProduct,
      UnionMakeupLimitCount: props.item.UnionMakeupLimitCount,
      WordsInfoCount: props.item.WordsInfoCount,
      WorkTimesCount: props.item.WorkTimesCount,
      WorkingCount: props.item.WorkingCount,
      UseTimes: {
        MinValue: 1,
        MaxValue: 1,
      },
    };
    list.unshift(temp);
  }
  return list;
});

const displayPart = ref(false);

watch(() => selectedPartList.value, (newVal) => {
  displayPart.value = newVal.length > 0;
});

</script>

<style scoped lang='scss'>
.item {
  margin-bottom: 15px;
  font-size: 12px;
  min-width: 1300px;
  color: #444;
  > dt {
    height: 44px;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 12px;
    padding-right: 10px;
    box-sizing: border-box;
    border: 1px solid #f8f8f8;
    transition: borderColor 0.1s ease-in-out;
    margin-bottom: 2px;
    .blue-span {
      display: inline-block;
      width: 160px;
    }
    .arrow {
      display: inline-block;
      margin-left: 25px;
      text-align: right;
      margin-right: 18px;
      color: #a2a2a2;
      cursor: pointer;
      i {
        font-size: 14px;
        transform: scale(1.3);
        color: #cbcbcb;
      }
      &.disabled {
        color: #ddd;
        i {
          color: #ddd;
        }
        pointer-events: none;
      }
    }
    &:hover {
      border-color: #ccc;
    }
  }
  > dd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    line-height: 40px;
    white-space: nowrap;
    transition: backgroundColor 0.1s ease-in-out;
    span.blue-span {
      display: inline-block;
      width: 150px;
      min-width: 100px;
    }
    .name {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 105px;
      margin-right: 5px;
      vertical-align: top;
    }
    .semi {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 120px;
      vertical-align: top;
      margin-left: 8px;
    }
    &:hover {
      background-color: rgba(216,239,252,.37);
    }
  }
}
</style>
