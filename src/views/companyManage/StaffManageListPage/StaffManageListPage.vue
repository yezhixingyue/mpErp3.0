<template>
  <section class="wrap">
    <header>
      <mp-button type="primary" @click="onEditClick(null)">+ 添加员工</mp-button>
      <SearchInputComp :typeList="[['KeyWords', '']]" :requestFunc='getList' :changePropsFunc='setCondition' :word='condition.KeyWords'
      @reset='clearCondition' :searchWatchKey="list" title='关键词' placeholder='请输入搜索关键词' />
    </header>
    <main>
      <el-table :data="list" stripe resizable border style="width: 100%">
        <el-table-column prop="Name" label="姓名" min-width="160" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
        <el-table-column prop="Mobile" label="手机号" min-width="160" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
        <el-table-column label="状态" min-width="140" show-overflow-tooltip align="center" header-align="center" >
          <template #default="scope">
           {{scope.row.Status === StaffStatusEnum.Normal ? '正常' : '离职'}}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="160" show-overflow-tooltip align="center" header-align="center" >
          <template #default="scope">
           {{formatDateForDisplay(scope.row.RegTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip class-name="l" label-class-name="h-l" min-width="360px">
          <template #default="scope">
          <div class="ctrl-box">
            <EditMenu @click="onEditClick(scope.row)" />
            <Menu title="离职" icon="icon-lizhi iconfont" isPink v-if="scope.row.Status === StaffStatusEnum.Normal" @click="onChangeStatusClick(scope.row)" />
            <Menu title="取消离职" icon="icon-fanhui iconfont" isSuccess v-else @click="onChangeStatusClick(scope.row)" />
          </div>
        </template>
        </el-table-column>
        <template #empty>
          <div>
            <span class="ft-13 is-gray" v-show="!loading">暂无数据</span>
          </div>
        </template>
      </el-table>
      <StaffSetupDialog :visible.sync="visible" :curItem="curItem" @submit="submit" />
    </main>
    <footer>
      <Pager center :pageSize="condition.PageSize" :count="listNumber" :watchPage="condition.Page" :handlePageChange="getList" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import api from '@/api';
import EditMenu from '@/components/common/menus/EditMenu.vue';
import Menu from '@/components/common/menus/Menu.vue';
import { onMounted, ref } from 'vue';
import { Pager, SearchInputComp } from 'mpzj-sell-lib';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { formatDateForDisplay } from '@/assets/js/filter';
import { message } from '@/assets/js/message';
import { recordScrollPosition } from '@/assets/js/recordScrollPositionMixin';
import { setConditionFunc, setConditionParams } from '@/assets/js/utils';
import { StaffListCondition } from './ConditionClass';
import { IStaff, StaffStatusEnum } from './types';
import StaffSetupDialog from './StaffSetupDialog.vue';

recordScrollPosition('.el-table__body-wrapper');

/**
 * 处理条件相关
 */
const handleCondition = () => {
  const condition = ref(new StaffListCondition());
  const setCondition = (e: setConditionParams) => { // 设置条件值
    setConditionFunc(e, condition.value);
  };
  const clearCondition = () => {
    condition.value = new StaffListCondition();
  };

  return { condition, setCondition, clearCondition };
};
const { condition, setCondition, clearCondition } = handleCondition();

/**
 * 处理列表数据获取相关
 */
const handleList = () => {
  const list = ref<IStaff[]>([]);
  const listNumber = ref(0);

  const loading = ref(false);

  /**
   * 获取员工列表
   * @param Page
   */
  const getList = async (Page = 1) => {
    condition.value.Page = Page;
    list.value = [];

    loading.value = true;
    const resp = await api.getStaffList(condition.value).catch(() => null);
    loading.value = false;

    if (resp?.data.Status === 1000) {
      list.value = resp.data.Data || [];
      listNumber.value = resp.data.DataNumber;
    }
  };

  return {
    list, listNumber, loading, getList,
  };
};
const {
  list, listNumber, loading, getList,
} = handleList();

/**
 * 处理编辑|新增|离职等员工操作相关
 */
const handleItemCtrl = () => {
  const visible = ref(false);
  const curItem = ref<null | IStaff>(null);

  const onEditClick = (item: IStaff | null) => {
    curItem.value = item;
    visible.value = true;
  };

  const submit = async (data: IStaff) => {
    const resp = await api.getStaffBaseInfoSave(data).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        visible.value = false;
        const temp = { ...data };
        if (!curItem.value) {
          // 新增
          temp.ID = resp.data.Data;
          temp.RegTime = getTimeConvertFormat({ withHMS: true });
          list.value.unshift(temp);
          listNumber.value += 1;
        } else {
          // 编辑
          const i = list.value.findIndex(it => it.ID === data.ID);
          if (i > -1) {
            list.value.splice(i, 1, data);
          }
        }
      };
      message.success({
        title: curItem.value ? '编辑成功' : '添加成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  };

  const handleStatusChange = async (item:IStaff) => {
    const isDimission = item.Status === StaffStatusEnum.Normal; // true为离职
    const id = item.ID;
    const resp = await api.getStaffPause(id, isDimission).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        const _item = item;
        _item.Status = isDimission ? StaffStatusEnum.Dimission : StaffStatusEnum.Normal;
      };
      message.success({
        title: '设置成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  };

  const onChangeStatusClick = (item: IStaff) => {
    const title = item.Status === StaffStatusEnum.Normal ? '确定设为离职状态吗 ?' : '确定要取消离职吗 ?';
    message.confirm({
      title,
      message: `员工名称：[ ${item.Name} ]`,
      onOk: () => handleStatusChange(item),
    });
  };

  return {
    visible, curItem, onChangeStatusClick, onEditClick, submit,
  };
};

const {
  visible, curItem, onChangeStatusClick, onEditClick, submit,
} = handleItemCtrl();

onMounted(() => {
  getList();
});

</script>

<script lang="ts">
export default {
  name: 'StaffManageListPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #f5f5f5;
  padding-left: 8px;
  > header, > main, > footer {
    background-color: #fff;
    flex: none;
  }
  > header {
    padding: 15px 20px;
    padding-bottom: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      height: 30px;
      width: 120px;
      padding: 0;
      // margin-bottom: 10px;
    }
    > div {
      display: flex;
      justify-content: flex-end;
    }
  }
  > main {
    flex: 1;
    margin-top: 8px;
    overflow: hidden;
    :deep(.cell) {
      color: #444;
    }
    :deep(.l .cell) {
      margin-right: 30px;
      span {
        flex: none;
        &.blue-span {
          margin-left: 80px;
        }
        &.p-names {
          margin-left: 30px;
        }
      }
    }
    :deep(.h-l.cell) {
      margin-left: 150px;
    }
    :deep(.el-table) {
      height: 100%;
      .el-table__body-wrapper {
        overflow: auto;
        overflow: overlay;
        height: calc(100% - 37px);
      }
    }
    .ctrl-box {
      padding-left: 95px;
    }
  }
  > footer {
    height: 50px;
    padding-top: 2px;
    box-sizing: border-box;
  }
}
</style>
