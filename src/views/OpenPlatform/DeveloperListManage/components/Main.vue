<template>
  <main>
    <el-table
     :data="localTableList" border stripe class="mp-erp-developer-list-manage-page-list-manage-table-comp-wrap"
     :max-height="h" :height="h" fit style="width: 100%">
      <el-table-column width="220px" prop="Name" label="企业全称/姓名" />
      <el-table-column width="210px" prop="Code" label="统一社会信用代码/身份证号" />
      <el-table-column width="100px" prop="_TypeText" label="账号类型" />
      <el-table-column width="100px" prop="Mobile" label="手机号码" />
      <el-table-column width="220px" prop="_ContactsText" show-overflow-tooltip label="技术联系人" />
      <el-table-column width="130px" prop="_CreateTime" label="注册时间" />
      <el-table-column width="85px" prop="_StatusText" label="状态">
        <template #default="scope">
          <span :class="scope.row._StatusClass" :title="scope.row._Remark">{{ scope.row._StatusText }}</span>
        </template>
      </el-table-column>
      <el-table-column width="85px" prop="Checker" label="审核人" />
      <el-table-column width="130px" prop="_CheckTime" label="审核时间" />
      <el-table-column width="80px" prop="_AppNumber" label="应用数量" />
      <el-table-column width="85px" label="锁定状态">
        <template #default="scope">
          <span class="is-pink" v-if="scope.row.IsLock">已锁定</span>
        </template>
      </el-table-column>
      <el-table-column min-width="270px" label="操作">
        <template #default="scope">
          <div class="menus">
            <span class="blue-span" @click="onCheckClick(scope.row)" v-if="scope.row.Status === DeveloperStatusEnum.Apply">
              <img src='@/assets/images/develop-check.png' alt="">
              <i>审核</i>
            </span>

            <span class="blue-span" @click="onCheckClick(scope.row)" v-else>
              <img src='@/assets/images/detail.png' alt="">
              <i>查看详情</i>
            </span>

            <span class="red-span" @click="onLockClick(scope.row)" v-if="scope.row.Status === DeveloperStatusEnum.Checked && !scope.row.IsLock">
              <img src='@/assets/images/lock.png' alt="">
              <i>锁定</i>
            </span>

            <span class="green-span" @click="onLockClick(scope.row)" v-if="scope.row.Status === DeveloperStatusEnum.Checked && scope.row.IsLock">
              <img src='@/assets/images/unlock.png' alt="">
              <i>解锁</i>
            </span>

            <span class="blue-span" @click="onPwdResetClick(scope.row)">
              <img src='@/assets/images/reset-pwd.png' width="15px" height="15px" alt="">
              <i>重置密码</i>
            </span>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>

    <!-- 查看详情与审核弹窗 -->
    <CheckDialog :row="currentRow" :visible.sync="visible" @resolve="resolveVisible = true" @reject="rejectVisible = true" />

    <ResolveDialog :visible.sync="resolveVisible" @submit="handleResolve" />
    <RejectDialog :visible.sync="rejectVisible" @submit="handleReject" />
  </main>
</template>

<script lang='ts'>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export default {
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        '.mp-developer-list-manage-page-wrap > header',
        '.mp-developer-list-manage-page-wrap > footer',
      ) - 8;
      this.h = tempHeight;
    },
  },
};
</script>

<!-- eslint-disable import/first -->
<script setup lang='ts'>
import { computed, ref } from 'vue';
import { IDeveloper } from '../js/types';
import { DeveloperStatusEnum } from '../js/enum';
import CheckDialog from './CheckDialog.vue';
import ResolveDialog from './ResolveDialog.vue';
import RejectDialog from './RejectDialog.vue';
import { getDeveloperTableList } from '../js/utils';

const props = defineProps<{
  list: IDeveloper[]
  loading: boolean
}>();

const emit = defineEmits(['reject', 'resolve', 'lock', 'resetPwd']);

const localTableList = computed(() => props.list.map(it => getDeveloperTableList(it)));

const currentRow = ref<null | ReturnType<typeof getDeveloperTableList>>(null);
const visible = ref(false);
const resolveVisible = ref(false);
const rejectVisible = ref(false);

const onCheckClick = (row: ReturnType<typeof getDeveloperTableList>) => { // 查看详情 | 审核
  visible.value = true;
  currentRow.value = row;
};

const handleResolve = () => {
  const cb = () => {
    visible.value = false;
  };
  emit('resolve', currentRow.value, cb);
};

const handleReject = (Remark: string) => {
  const cb = () => {
    visible.value = false;
  };
  emit('reject', currentRow.value, Remark, cb);
};

const onLockClick = (row: ReturnType<typeof getDeveloperTableList>) => { // 解锁 | 锁定
  const title = row.IsLock ? '确认解锁该账号吗？' : '确认锁定该账号吗？';
  const msg = row.IsLock ? '解锁后，该账号下所有应用均恢复使用' : '锁定后，该账号下所有应用均暂停使用';

  MpMessage.warn({
    title,
    msg,
    onOk: () => {
      emit('lock', row);
    },
    success: row.IsLock === true,
    warn: row.IsLock === false,
  });
};

const onPwdResetClick = (row: ReturnType<typeof getDeveloperTableList>) => { // 解锁 | 锁定
  MpMessage.warn({
    title: '确定重置该账号密码吗 ?',
    msg: `[ ${row.Name} ]`,
    onOk: () => {
      emit('resetPwd', row);
    },
    warn: true,
  });
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-developer-list-manage-page-list-manage-table-comp-wrap {
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
        // padding-left: 5%;
        > span {
          display: flex;
          align-items: center;
          margin-left: 20px;
          img {
            margin-right: 6px;
          }

          &:first-of-type {
            margin-left: 0;
            // margin-right: 30px;
            i {
              width: 4em;
              text-align: left;
            }
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
