<template>
  <div class="mp-erp-notice-list-table-comp-wrap"  :style="`width:${tableWidth + 30}px`">
    <div class="header">
      <h4 :style="`width: ${widths[0]}px;`">标题</h4>
      <h4 :style="`width: ${widths[1]}px;`">接收对象</h4>
      <h4 :style="`width: ${widths[2]}px;`">新注册账号是否接收</h4>
      <h4 :style="`width: ${widths[3]}px;`">发送日期</h4>
      <h4 :style="`width: ${widths[4]}px;`">操作</h4>
    </div>

    <ul class="body">
      <li class="row" v-for="it in localList" :key="it.ID">
        <div class="title">
          <div :style="`width: ${widths[0]}px;`" class="title">
            <span :title="it.Title">{{ it.Title }}</span>
          </div>
          <div :style="`width: ${widths[1]}px;`" class="target">
            <span :title="it._TargetTypeText">{{ it._TargetTypeText }}</span>
          </div>
          <div :style="`width: ${widths[2]}px;`" class="include">
            <span>{{ it._IncludeNewText }}</span>
          </div>
          <div :style="`width: ${widths[3]}px;`" class="date">
            <span>{{ it._CreateTime }}</span>
          </div>
          <div :style="`width: ${widths[4]}px;`" class="menus">
            <span class="red-span menu" @click="onRemoveClick(it)">
              <img src="@/assets/images/del-red.png" alt="">删除
            </span>
            <span class="blue-span menu" @click="() => emit('spread', it.ID)">
              <i v-if="!it._IsSpread" class="el-icon-arrow-down"></i>
              <i v-else class="el-icon-arrow-up"></i>
              {{ it._IsSpread ? '点击收起信息' : '点击查看详情' }}
            </span>
          </div>
        </div>

        <div class="content" v-show="it._IsSpread">
          <DocViewer :Content="it.Content" />
        </div>
      </li>

      <li v-if="!loading && list.length === 0" style="border: none;padding-top: 20vh;">
        <Empty />
      </li>
    </ul>

  </div>
</template>

<script setup lang='ts'>
import { getDateFormat } from '@/assets/js/utils/util';
import { computed } from 'vue';
import { DeveloperNoticeTargetEnum, DeveloperNoticeTargetEnumList } from '../js/enum';
import { NoticeManageClass } from '../js/NoticeManageClass';
import Empty from '@/components/common/NewSetupComps/Empty/Empty.vue';
import DocViewer from './DocViewer.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  list: NoticeManageClass['list']
  loading: boolean
}>();

const emit = defineEmits(['spread', 'remove']);

const localList = computed(() => props.list.map(it => {
  let _TargetTypeText = DeveloperNoticeTargetEnumList.find(_it => _it.ID === it.TargetType)?.Name || '';
  if (_TargetTypeText && it.TargetType === DeveloperNoticeTargetEnum.Developer) _TargetTypeText = `${_TargetTypeText}（${it.DeveloperName || '--'}）`;

  let _IncludeNewText = '';
  if (it.TargetType !== DeveloperNoticeTargetEnum.Developer) _IncludeNewText = it.IncludeNew ? '是' : '否';

  return {
    ...it,
    _TargetTypeText,
    _IncludeNewText,
    _CreateTime: getDateFormat(it.CreateTime),
  };
}));

const widths = [300, 360, 160, 200, 220];
const tableWidth = computed(() => widths.reduce((a, b) => a + b, 0));

const onRemoveClick = (row: NoticeManageClass['list'][number]) => {
  MpMessage.warn({
    title: '确定删除该条消息吗 ?',
    msg: `信息标题：[ ${row.Title} ]`,
    onOk: () => {
      emit('remove', row.ID);
    },
  });
};

</script>

<style scoped lang='scss'>
.mp-erp-notice-list-table-comp-wrap {
  color: #444;
  font-size: 12px;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 27px 1fr;

  > div.header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d5d5d5;
    padding-bottom: 12px;

    h4 {
      flex: none;
      font-weight: 700;
      text-align: center;
      font-size: 13px;
    }
  }

  > ul.body {
    overflow: auto;
    li {
      border-bottom: 1px solid #d5d5d5;
      > div.title {
        display: flex;
        align-items: center;
        > div {
          flex: none;
          box-sizing: border-box;
          height: 45px;
          line-height: 35px;
          padding: 5px 6px;
          text-align: center;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.menus {
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            .menu {
              display: flex;
              align-items: center;

              i, img {
                font-size: 14px;
                margin-right: 4px;
              }

              & + .menu {
                margin-left: 30px;
              }
            }
          }
        }
      }

      > div.content {
        margin-bottom: 15px;
        margin-right: 10px;
      }
    }
  }
}
</style>
