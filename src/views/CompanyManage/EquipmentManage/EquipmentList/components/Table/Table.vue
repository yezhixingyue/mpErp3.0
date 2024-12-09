<template>
  <el-table
    :data="list" border stripe class="mp-erp-equipment-list-manage-table-comp-wrap"
    :max-height="h" :height="h" fit style="width: 100%">
    <el-table-column type="expand" width="40">
      <template #default="props">
        <AttrListDisplayPanel :list="getAdaptiveAttrList(props.row)" />
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="100" prop="index" label="设备类型">
      <template #default="scope">
        <span>{{ getEquipmentTypeText(scope.row.type) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="100" prop="code" label="设备编号" />
    <el-table-column show-overflow-tooltip width="85" label="状态">
      <template #default="scope">
        <span :style="`color: ${getStateColor(scope.row.status)};`">{{ getStateText(scope.row.status) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="120" label="部门">
      <template #default="scope">
        <span>{{ getDepartment(scope.row.user) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="120" label="岗位">
      <template #default="scope">
        <span>{{ getPostName(scope.row.user) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="80" label="姓名">
      <template #default="scope">
        <span>{{ getStaffName(scope.row.user) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="105" prop="supplier" label="供应商" />
    <el-table-column show-overflow-tooltip width="85" label="采购日期">
      <template #default="scope">
        <span>{{ getOnlyDateFormat(scope.row.purchaseAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="110" label="保修到期日期">
      <template #default="scope">
        <span>{{ getOnlyDateFormat(scope.row.warrantyExpiredAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="120" prop="remark" label="备注">
      <template #default="scope">
        <span class="is-gray">{{scope.row.remark}}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="80" label="创建人">
      <template #default="scope">
        <span>{{ scope.row.creator === '00000000-0000-0000-0000-000000000000' ? '数据导入' : getStaffName(scope.row.creator) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="130" label="创建时间">
      <template #default="scope">
        <span>{{ getDateTimeFormat(scope.row.createdAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="130" label="最近更新时间">
      <template #default="scope">
        <span>{{ getDateTimeFormat(scope.row.updatedAt === scope.row.createdAt ? '' : scope.row.updatedAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="260px" label="操作">
        <template #default="scope">
          <div class="menus">
            <!-- 设置禁用 -->
            <span class="blue-span" @click="emit('edit', scope.row)"
              :class="{disabled:[EquipmentStatusEnum.abandoned, EquipmentStatusEnum.calledout].includes(scope.row.status)}">
              <i>编辑</i>
            </span>
            <!-- <span class="blue-span ml-15" @click="emit('abandon', EquipmentHistoryTypeEnum.abandon, scope.row)"
              :class="{disabled:[EquipmentStatusEnum.abandoned, EquipmentStatusEnum.calledout].includes(scope.row.status)}">
              <i>维修</i>
            </span> -->
            <span class="blue-span ml-15" @click="emit('changeStatus', EquipmentHistoryTypeEnum.callin, scope.row)"
               v-if="scope.row.status === EquipmentStatusEnum.calledout">
              <i>调入</i>
            </span>
            <span class="blue-span ml-15" @click="emit('changeStatus', EquipmentHistoryTypeEnum.callout, scope.row)" v-else
              :class="{disabled:[EquipmentStatusEnum.abandoned, EquipmentStatusEnum.calledout].includes(scope.row.status)}">
              <i>调出</i>
            </span>
            <span class="blue-span ml-15" @click="emit('changeStatus', EquipmentHistoryTypeEnum.abandon, scope.row)"
              :class="{disabled:[EquipmentStatusEnum.abandoned, EquipmentStatusEnum.calledout].includes(scope.row.status)}">
              <i>作废</i>
            </span>
            <span class="blue-span ml-15" @click="emit('history', scope.row)"
             :class="{disabled: scope.row.creator === '00000000-0000-0000-0000-000000000000' && !scope.row.updatedAt}">
              <i>查看历史记录</i>
            </span>
          </div>
        </template>
      </el-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { getOnlyDateFormat, getDateTimeFormat } from '../../js/tool';
import { useStaffList } from '../../hooks/useStaffList';
import { EquipmentStatusEnumList, EquipmentStatusEnum, EquipmentHistoryTypeEnum, EquipmentTypeEnumList } from '../../types/enum';
import { TEquipment } from '../../types';
import AttrListDisplayPanel from './AttrListDisplayPanel.vue';
import { getAdaptiveAttrList } from './adapter';

defineProps<{
  list: TEquipment[]
  loading: boolean
}>();

const emit = defineEmits(['edit', 'history', 'changeStatus']);

const { getStaffName, getDepartment, getPostName } = useStaffList();

const getEquipmentTypeText = (type) => EquipmentTypeEnumList.find(it => it.ID === type)?.Name || '';
const getStateText = (status) => EquipmentStatusEnumList.find(it => it.ID === status)?.Name || '';
const getStateColor = (status) => EquipmentStatusEnumList.find(it => it.ID === status)?.color || '';

</script>

<script lang='ts'>
// eslint-disable-next-line import/first
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const oMain: HTMLDivElement = document.querySelector('.mp-equipment-manage-equip-list-manage-wrap > main');
      if (oMain) this.h = oMain.offsetHeight;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-equipment-list-manage-table-comp-wrap {
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
