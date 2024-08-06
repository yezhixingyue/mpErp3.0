<template>
  <el-table
    :data="list" border stripe class="mp-erp-application-list-manage-page-list-manage-table-comp-wrap"
    :max-height="h" :height="h" fit style="width: 100%">
    <el-table-column width="285px" prop="Name" label="应用名称" />
    <el-table-column width="280px" prop="Key" label="Key" />
    <el-table-column width="280px" prop="SecretKey" label="安全密钥" />
    <el-table-column width="180px"  label="添加时间">
      <template #default="scope">
        <span>{{ scope.row.CreateTime | format2LangTypeDate }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px" prop="DeveloperName" label="所属账号" />
    <el-table-column width="180px" prop="Customer.Name" label="已绑定客户名称" />
    <el-table-column width="170px" label="操作" v-if="Permission.Obj.BindCustomer">
        <template #default="scope">
          <div class="menus">
            <span class="blue-span" @click="onClick(scope.row)" :class="{disabled:scope.row.Type !== ApplicationTypeEnum.Single}">
              <i class="iconfont icon-bangdingIPhekehu"></i>
              <i>绑定IP和客户</i>
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
import { IUser } from '@/pinia/modules/user/type';
import { ApplicationTypeEnum } from '../js/enum';
import { IApplication } from '../js/type';

defineProps<{
  list: IApplication[]
  loading: boolean
  Permission?: IUser['PermissionList']['PermissionOpenApi']
}>();

const emit = defineEmits(['bind']);

const onClick = (item: IApplication) => {
  if (item.Type !== ApplicationTypeEnum.Single) return;

  emit('bind', item);
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
        '.mp-erp-develop-open-api-app-list-manage-page-wrap > header',
        '.mp-erp-develop-open-api-app-list-manage-page-wrap > footer',
      ) - 8;
      this.h = tempHeight;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-application-list-manage-page-list-manage-table-comp-wrap {
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
        padding-left: 15%;
        > span {
          display: flex;
          align-items: center;
          i:first-of-type {
            margin-right: 8px;
            font-size: 12px;
          }
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
