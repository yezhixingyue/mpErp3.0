<template>
  <el-table
    :data="list" border stripe class="mp-erp-notification-list-manage-table-comp-wrap"
    :max-height="h" :height="h" fit style="width: 100%">
    <el-table-column show-overflow-tooltip width="200" label="提醒人">
      <template #default="scope">
        <span>{{ getStaffName(scope.row.ID) }}</span>
      </template>
    </el-table-column>

    <el-table-column show-overflow-tooltip min-width="300" label="提醒消息类型">
      <template #default="scope">
        <span>{{ getTypeContent(scope.row.Types) }}</span>
      </template>
    </el-table-column>

    <el-table-column width="360" label="操作" v-if="Permission && Permission.Obj.Setup">
      <template #default="scope">
        <CtrlMenus
          :showList="['edit', 'del']"
          @edit='emit("edit", scope.row)'
          @remove='onRemoveClick(scope.row)'
        />
      </template>
    </el-table-column>

    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IUser } from '@/pinia/modules/user/type';
import { MessageMemberListManageModel } from '../model/MessageMemberListManageModel';
import { IMessageMember } from '../types';
import { SystemMessageTypeEnumList } from '../types/enum';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus/index.vue';

const props = defineProps<{
  loading: boolean
  list: IMessageMember[]
  staffList: MessageMemberListManageModel['staffList']
  Permission: IUser['PermissionList']['PermissionManageMessage']
}>();

const emit = defineEmits(['edit', 'remove']);

const getStaffName = (ID: string) => props.staffList.find(it => it.StaffID === ID)?.StaffName || '';

const getTypeContent = (Types: IMessageMember['Types']) => SystemMessageTypeEnumList.filter(it => Types.includes(it.ID)).map(it => it.Name).join('、');

const onRemoveClick = (row: IMessageMember) => {
  MpMessage.warn({
    title: '确定删除该提醒人吗?',
    msg: `提醒人名称：[ ${getStaffName(row.ID)} ]`,
    onOk: () => {
      emit('remove', row);
    },
  });
};

</script>

<script lang='ts'>
// eslint-disable-next-line import/first
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const oMain: HTMLDivElement = document.querySelector('.mp-notification-manage-list-manage-wrap > main');
      if (oMain) this.h = oMain.offsetHeight;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-notification-list-manage-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
  &.el-table::before {
    display: none;
  }
  .el-table__header thead {
    tr {
      th {
        font-size: 14px;
        .cell {
          height: 34px;
          line-height: 34px;
          color: $--color-text-primary;
        }
      }
    }
  }
  .el-table__body tbody tr {
    td {
      color: $--color-text-primary;
      .cell {
        padding: 0 3px !important;
      }
      &.is-gray > .cell {
        font-size: 12px;
        color: #989898;
      }
      padding: 6px 0;
    }

    &.el-table__row.expanded {
      .cell {
        font-weight: 700;
      }
      & + tr {
        &:hover td {
          background-color: rgba($color: #000000, $alpha: 0) !important;
        }
      }
    }
    .el-table__expanded-cell {
      padding: 0;
    }
  }
}

.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
  // white-space: pre;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 16px;
}
</style>
