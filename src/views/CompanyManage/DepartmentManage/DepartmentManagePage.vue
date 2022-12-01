<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-wrap">
    <main>
      <LRWidthDragAutoChangeComp leftWidth='460px' v-if="departmentList.length">
        <template v-slot:left>
          <DepartmentManageLeft
           v-model='isSorting'
           :sellAreaList='departmentList'
           @totalManage='onManageTotalClick'
           @subManage='onManageSubClick'
           @sort='onSortClick'
          />
        </template>
        <template v-slot:right>
          <DepartmentManageRight
           :departmentParentID='departmentParentID'
           :departmentList='departmentList'
            ref="oRight"
           @level1Submit='handleLevel1Submit'
          />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
  </section>
</template>

<script>
import api from '@/api/index';
import { mapState, mapGetters } from 'vuex';
import { LRWidthDragAutoChangeComp } from '@/components/common/mpzj-sell-lib/lib';
import DepartmentManageLeft from '../../../components/DepartmentManageComps/DepartmentManageLeft.vue';
import DepartmentManageRight from '../../../components/DepartmentManageComps/DepartmentManageRight.vue';

export default {
  name: 'DepartmentManagePage',
  components: {
    LRWidthDragAutoChangeComp,
    DepartmentManageLeft,
    DepartmentManageRight,
  },
  computed: {
    ...mapState('common', ['areaList']),
    ...mapGetters('common', ['allAreaTreeList']),
    ...mapState('department', ['departmentList']),
  },
  data() {
    return {
      isSorting: false, // 是否正在排序中
      subAreaID: '', // 当前正在管理的子类ID
      departmentParentID: true, // 正在管理的一级部门父级id
    };
  },
  methods: {
    async getAreaList() {
      await this.$store.dispatch('common/getAreaList', false);
    },
    onManageTotalClick(needCheck) { // 点击管理一级部门
      const handler = async () => { // 切换执行函数
        this.$store.commit('department/modificationDepartmentParentID', -1);
      };
      if (needCheck === true) {
        handler();
        return;
      }
      this.handleSwitch(handler);
    },
    onManageSubClick(ID) { // 点击管理子区域，此处应传递该子区域大区ID
      const handler = async () => {
        this.$store.commit('department/modificationDepartmentParentID', ID);
      };

      this.handleSwitch(handler);
    },
    handleSwitch(handler) { // 处理右侧切换（ 根据情况看是否显示确认弹窗 ）
      if (this.$refs.oRight && (this.$refs.oRight.checkLevel1IsOrNotChange())) { // 此处判断右侧数据是否需要保存 -- 确认提示
        this.messageBox.warnCancelBox('有数据未保存，确定切换区域吗', '切换后未保存数据将丢失，如需继续请点击确认', handler);
      } else {
        handler();
      }
    },
    onSortClick(Array) { // 点击保存排序
      if (this.$refs.oRight && (this.$refs.oRight.checkLevel1IsOrNotChange())) { // 此处判断右侧数据是否需要保存 -- 确认提示
        this.messageBox.warnCancelBox('右侧有数据未保存，确定保存排序吗', '保存排序将丢失改动内容，如需继续请点击确认', () => {
          this.handleSort(Array);
        });
      } else {
        this.handleSort(Array);
      }
    },
    async handleSort(Array) { // 处理保存排序
      const resp = await this.api.getDepartmentOrder(Array).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        await this.$store.dispatch('department/getDepartmentList');
        this.messageBox.successSingle('保存排序成功');
        this.isSorting = false;
      }
    },
    async handleLevel1Submit({ returnData, removeIds, callback }) {
      // 删除
      if (removeIds.length) {
        const removeRes = await api.getAreaRemoveRange({ ids: removeIds, type: 81 });
        if (removeRes.status === 200 && removeRes.data.Status === 1000);
      }
      // 保存
      const res = await api.getDepartmentSave(returnData);
      if (res.status === 200 && res.data.Status === 1000) {
        await this.$store.dispatch('department/getDepartmentList');
        callback();
        this.messageBox.successSingle('保存成功');
      }
    },
  },
  mounted() {
    // this.getAreaList();
    this.$store.dispatch('department/getDepartmentList');
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-wrap {
  background: #f5f5f5;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  > main {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
