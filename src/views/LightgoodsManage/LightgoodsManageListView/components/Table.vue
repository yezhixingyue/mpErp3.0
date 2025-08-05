<template>
  <el-table
    :data="list" border stripe class="mp-erp-lightgoods-manage-list-view-wrap-table-comp-wrap"
    :max-height="h" :height="h" fit style="width: 100%">
    <el-table-column width="85px" label="序号">
      <template #default="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column width="200px" prop="ProductName" label="产品名称" />
    <el-table-column min-width="285px" label="所属分类">
      <template #default="scope">{{scope.row.CategoryList.map(it => [it.FirstLevel.Name, it.SecondLevel.Name].filter(Boolean).join('-')).join('，')}}</template>
    </el-table-column>
    <el-table-column width="135px" prop="SolutionNumber" label="打包方案数" />
    <!-- <el-table-column width="180px"  label="添加时间">
      <template #default="scope">
        <span>{{ scope.row.CreateTime | format2LangTypeDate }}</span>
      </template>
    </el-table-column> -->
    <el-table-column width="235px" label="操作" v-if="Permission.Obj.Setup">
        <template #default="scope">
          <div class="menus">
            <RemoveMenu @click="onRemoveClick(scope.row)" />
            <Menu title="打包方案" class="m" icon="icon-dabaofangan iconfont" @click="onClick(scope.row)" />
          </div>
        </template>
      </el-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { IUser } from '@/pinia/modules/user/type';
import RemoveMenu from '@/components/common/NewSetupComps/menus/RemoveMenu.vue';
import Menu from '@/components/common/NewSetupComps/menus/Menu.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ILightgoodsProduct } from '../../types/types';

defineProps<{
  list: ILightgoodsProduct[]
  loading: boolean
  Permission: IUser['PermissionList']['PermissionBulkyCargo']
}>();

const emit = defineEmits(['setup', 'remove']);

const onRemoveClick = (row: ILightgoodsProduct) => {
  if (row.SolutionNumber > 0) {
    MpMessage.error('删除失败', '需要先清空所有打包方案，才能从“抛货”产品中删除');
    return;
  }

  MpMessage.warn('确定删除该产品吗 ?', `产品名称：[ ${row.ProductName} ]`, () => {
    emit('remove', row);
  });
};

const onClick = (row: ILightgoodsProduct) => {
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
        '.mp-erp-lightgoods-manage-list-view-wrap > header',
        '.mp-erp-lightgoods-manage-list-view-wrap > footer',
      ) - 8;
      this.h = tempHeight;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-lightgoods-manage-list-view-wrap-table-comp-wrap {
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
          margin-left: 20px;
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
