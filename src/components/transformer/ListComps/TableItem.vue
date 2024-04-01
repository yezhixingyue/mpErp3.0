<template>
  <dl class="item">
    <dt @click.self="onHideClick" :class="{a: selectedPartList.length>0}">
      <div class="name">{{getProductName(props.item)}}</div>
      <div class="right">
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.partSetup)">选择产品部件 ({{selectedPartList.length}})</span>
        <span :class="{hide: selectedPartList.length < 0, disabled: !selectedPartList.length}" class="blue-span" v-if="HavePomission"
          @click="onClick(menuTypeEnum.UnionLine)">组合生产线映射 ({{props.item.UnionLineCount}})</span>
        <span :class="{hide: selectedPartList.length < 0, disabled: !selectedPartList.length}" class="blue-span" v-if="HavePomission"
          @click="onClick(menuTypeEnum.UnionWorking)">组合工序映射 ({{props.item.UnionWorkingCount}})</span>
        <span class="blue-span" :class="{disabled:!selectedPartList.length}" v-if="HavePomission"
         @click="onClick(menuTypeEnum.WorkTimes)">作业次数 ({{props.item.UnionWorkTimesCount}})</span>
        <span class="blue-span" :class="{disabled:!selectedPartList.length}" v-if="HavePomission"
         @click="onClick(menuTypeEnum.WordsInfo)">文字信息映射 ({{props.item.UnionWordsInfoCount}})</span>
        <span class="blue-span" :class="{disabled:!selectedPartList.length}" v-if="HavePomission"
         @click="onClick(menuTypeEnum.NumbericInfo)">数值映射 ({{props.item.UnionNumbericInfoCount}})</span>
        <span @click="onHideClick" class="arrow" :class="{disabled:selectedPartList.length===0}">
          {{displayPart ? '隐藏' : '展开'}}
          <i class="el-icon-caret-bottom" v-show="!displayPart"></i>
          <i class="el-icon-caret-top" v-show="displayPart"></i>
        </span>
      </div>
    </dt>
    <dd v-for="it in selectedPartList" :key="it.ID" v-show="displayPart">
      <div class="left">
        <span class="name" :title="it.Name">{{it.Name}}</span>
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.LineCount, it.ID)">生产线映射 ({{it.LineCount}})</span>
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.WorkingCount, it.ID)">工序映射 ({{it.WorkingCount}})</span>
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.WorkTimes, it.ID)">作业次数 ({{it.WorkTimesCount}})</span>
      </div>
      <div class="right">
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.WordsInfo, it.ID)">文字信息映射 ({{it.WordsInfoCount}})</span>
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.NumbericInfo, it.ID)">数值映射 ({{it.NumbericInfoCount}})</span>
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.UnionMakeupLimit, it.ID)">合拼设置 ({{it.UnionMakeupLimitCount}})</span>
        <span class="blue-span" v-if="HavePomission" @click="onClick(menuTypeEnum.NumericalCodeAutoMakeup, it.ID)">数码自动拼版 ({{it.AutoImpositionCount}})</span>
        <span class="blue-span" v-if="HavePomission">
          <i @click="onClick(menuTypeEnum.OtherSetup, it.ID)">其它设置：</i>
          <i class="gray">{{ it.NeedFolding ? '需要折手' : '不需要折手' }}</i>
        </span>
        <span>
          产出半成品：
          <i class="blue-span" @click="onClick(menuTypeEnum.SemiFinishedProduct, it.ID)" v-if="HavePomission">设置</i>
          <em class="semi" :title="it.SemiFinished?.Name ||''">{{it.SemiFinished ? it.SemiFinished.Name || '未知' : '无'}}</em>
        </span>
      </div>
    </dd>
  </dl>
</template>

<script setup lang='ts'>
import { IPart, IProduct, menuTypeEnum } from '@/pinia/modules/transformer/types';
import { IProductClassLv1ListItem } from '@/pinia/modules/transformer/utils';
import { IUser } from '@/pinia/modules/user/type';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  item: IProduct,
  productClassLevelList: IProductClassLv1ListItem[]
  UserDetail: null | IUser
}>();

const emit = defineEmits(['menuClick']);

const HavePomission = computed(() => props.UserDetail && props.UserDetail.PermissionList.PermissionManageConvert.Obj.Setup);

// const localPermission = computed(() => {
//   if (this.Permission?.PermissionList?.PermissionCoupon?.Obj) {
//     return this.Permission.PermissionList.PermissionCoupon.Obj;
//   }
//   return {};
// });

const onClick = (type: menuTypeEnum, PartID?: string) => {
  if (selectedPartList.value.length === 0 && type !== menuTypeEnum.partSetup) return;
  // if (type === menuTypeEnum.UnionLine || type === menuTypeEnum.UnionWorking) {
  //   if (selectedPartList.value.length < 1) {
  //     onHideClick();
  //     return;
  //   }
  // }
  // const _PartID = PartID && PartID !== props.item.ID ? PartID : '';
  emit('menuClick', type, props.item, PartID || '');
};

const getProductName = (it: IProduct) => {
  const arr = [];

  const { FirstLevel, SecondLevel } = it.Class;
  const lv1 = props.productClassLevelList.find(_it => _it.ID === FirstLevel.ID);
  if (lv1) {
    arr.push(lv1.ClassName);
    const _item = it;
    _item.Class.FirstLevel.Name = lv1.ClassName;
    const lv2 = lv1.children.find(_it => _it.ID === SecondLevel.ID);
    if (lv2) {
      arr.push(lv2.ClassName);
      _item.Class.SecondLevel.Name = lv2.ClassName;
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
      SemiFinished: props.item.SemiFinished,
      UnionMakeupLimitCount: props.item.UnionMakeupLimitCount,
      AutoImpositionCount: props.item.AutoImpositionCount,
      WordsInfoCount: props.item.WordsInfoCount,
      WorkTimesCount: props.item.WorkTimesCount,
      WorkingCount: props.item.WorkingCount,
      UseTimes: {
        MinValue: 1,
        MaxValue: 1,
      },
      NeedFolding: props.item.NeedFolding,
    };
    list.unshift(temp);
  }
  return list;
});

const displayPart = ref(false);

watch(() => selectedPartList.value, (newVal) => {
  displayPart.value = newVal.length > 0;
});

const onHideClick = () => {
  if (selectedPartList.value.length === 0) return;
  displayPart.value = !displayPart.value;
};

</script>

<style scoped lang='scss'>
.item {
  margin-bottom: 15px;
  font-size: 12px;
  min-width: 1550px;
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
    cursor: pointer;
    .blue-span {
      display: inline-block;
      width: 160px;
    }
    .arrow {
      display: inline-block;
      padding-left: 25px;
      text-align: right;
      padding-right: 18px;
      color: #a2a2a2;
      cursor: pointer;
      transition: color 0.1s ease-in-out;
      user-select: none;
      i {
        font-size: 14px;
        transform: scale(1.3);
        color:  inherit;
        transition: color 0.1s ease-in-out;
      }
      &:hover {
        color: #585858;
      }
      &.disabled {
        color: #ddd;
        pointer-events: none;
      }
    }
    &:hover {
      border-color: #ccc;
    }
    &.a:active {
      border-color: #aaa;
    }
    .name {
      cursor: text;
    }
    .hide {
      visibility: hidden;
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
