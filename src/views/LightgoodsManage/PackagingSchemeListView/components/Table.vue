<template>
  <el-table
    :data="list" border stripe class="mp-erp-lightgoods-manage-solution-list-view-wrap-table-comp-wrap"
    :max-height="h" :height="h" fit style="width: 100%">
    <el-table-column width="85px" label="序号">
      <template #default="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column width="220px" prop="Name" label="名称" />
    <el-table-column min-width="285px" label="条件">
      <template #default="scope">
        <ConditionTextDisplayComp :conditionObj="getConditionObj(scope.row)" suffixText="使用此打包方案" />
      </template>
    </el-table-column>
    <el-table-column width="120px" label="体积公式">
      <template #default="scope">
        <span v-if="scope.row.Formula">已设置</span>
        <span v-else class="is-pink">尚未设置！</span>
      </template>
    </el-table-column>
    <el-table-column width="80px" prop="Priority" label="优先级" />
    <el-table-column width="220px" label="方案特征">
      <template #default="scope">容器款数({{ scope.row.DataList?.length || 0 }})</template>
    </el-table-column>
    <el-table-column width="265px" label="操作">
        <template #default="scope">
          <div class="menus">
            <EditMenu @click="onEditClick(scope.row)" />
            <Menu title="方案设计" class="m" icon="icon-fangansheji iconfont" @click="onSetupClick(scope.row)" />
            <RemoveMenu @click="onRemoveClick(scope.row)" />
          </div>
        </template>
      </el-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import EditMenu from '@/components/common/NewSetupComps/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/NewSetupComps/menus/RemoveMenu.vue';
import Menu from '@/components/common/NewSetupComps/menus/Menu.vue';
import ConditionTextDisplayComp from '@/components/common/FormulaAndConditionComps/ConditionTextDisplayComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ILightgoodsProductSolution } from '../../types/types';
import { getConditionObj } from '../../tools';

defineProps<{
  list: ILightgoodsProductSolution[]
  loading: boolean
}>();

const emit = defineEmits(['edit', 'setup', 'remove']);

const onEditClick = (row: ILightgoodsProductSolution) => {
  emit('edit', row);
};

const onRemoveClick = (row: ILightgoodsProductSolution) => {
  MpMessage.warn('确定删除该条打包方案吗 ?', `方案名称：[ ${row.Name} ]`, () => {
    emit('remove', row);
  });
};

const onSetupClick = (row: ILightgoodsProductSolution) => {
  emit('setup', row);
};

</script>

<script lang='ts'>
// eslint-disable-next-line import/first
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        '.mp-erp-lightgoods-manage-solution-scheme-list-view-wrap > header',
        '.mp-erp-lightgoods-manage-solution-scheme-list-view-wrap > footer',
      ) - 8;
      this.h = tempHeight;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-lightgoods-manage-solution-list-view-wrap-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
  &.el-table::before {
    display: none;
  }
  .el-table__header-wrapper .el-table__header thead {
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
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: $--color-text-primary;
    &.is-gray > .cell {
      font-size: 12px;
      color: #989898;
    }
    padding: 6px 0;
    > .cell {
      color: #585858;
      height: 32px;
      input {
        padding: 0 10px;
      }
      .p {
        input {
          text-align: center;
        }
      }
      .menus {
        display: flex;
        align-items: center;
        justify-content: center;

        .m {
          margin: 0 16px;
        }
      }
    }
    &.left {
      text-align: left;
    }
    &.el-table-column--selection > .cell {
      padding: 0;
    }
    &:not(.el-box) > .cell {
      line-height: 32px;
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
