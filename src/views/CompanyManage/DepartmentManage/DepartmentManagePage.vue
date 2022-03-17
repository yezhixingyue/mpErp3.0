<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-wrap">
    <main>
      <LRWidthDragAutoChangeComp leftWidth='460px'>
        <template v-slot:left>
          <DepartmentManageLeft
           v-model='isSorting'
           :sellAreaList='allAreaTreeList'
           @totalManage='onManageTotalClick'
           @subManage='onManageSubClick'
           @sort='onSortClick'
          />
        </template>
        <template v-slot:right>
          <DepartmentManageRight
           :subAreaID='subAreaID'
           :isManageRoot='isManageRoot'
           :allAreaTreeList='allAreaTreeList'
            ref="oRight"
           @level1Submit='handleLevel1Submit'
           @subAreaSubmit='handleSubAreaSubmit'
          />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import DepartmentManageLeft from '../../../components/DepartmentManageComps/DepartmentManageLeft.vue';
import DepartmentManageRight from '../../../components/DepartmentManageComps/DepartmentManageRight';

export default {
  name: 'SellAreaSetupPage',
  components: {
    LRWidthDragAutoChangeComp,
    DepartmentManageLeft,
    DepartmentManageRight,
  },
  computed: {
    ...mapState('common', ['areaList']),
    ...mapGetters('common', ['allAreaTreeList']),
  },
  data() {
    return {
      isSorting: false, // 是否正在排序中
      subAreaID: '', // 当前正在管理的子类ID
      isManageRoot: true, // 是否正在管理一级区
    };
  },
  methods: {
    async getAreaList() {
      await this.$store.dispatch('common/getAreaList', false);
    },
    onManageTotalClick(needCheck) { // 点击管理一级区域
      const handler = async () => { // 切换执行函数
        if (this.isManageRoot) {
          this.isManageRoot = false;
          await this.$nextTick();
        }
        this.isManageRoot = true;
      };
      if (needCheck === true) {
        handler();
        return;
      }
      this.handleSwitch(handler);
    },
    onManageSubClick(ID) { // 点击管理子区域，此处应传递该子区域大区ID
      const handler = async () => {
        if (!this.isManageRoot && this.subAreaID === ID) {
          this.subAreaID = '';
          await this.$nextTick();
        }
        this.isManageRoot = false;
        this.subAreaID = ID;
      };

      this.handleSwitch(handler);
    },
    handleSwitch(handler) { // 处理右侧切换（ 根据情况看是否显示确认弹窗 ）
      if (this.$refs.oRight && (this.$refs.oRight.checkLevel1IsOrNotChange() || this.$refs.oRight.checkSubAreaIsOrNotChange())) { // 此处判断右侧数据是否需要保存 -- 确认提示
        this.messageBox.warnCancelBox('有数据未保存，确定切换区域吗', '切换后未保存数据将丢失，如需继续请点击确认', handler);
      } else {
        handler();
      }
    },
    onSortClick(Array, callback) { // 点击保存排序
      if (this.$refs.oRight && (this.$refs.oRight.checkLevel1IsOrNotChange() || this.$refs.oRight.checkSubAreaIsOrNotChange())) { // 此处判断右侧数据是否需要保存 -- 确认提示
        this.messageBox.warnCancelBox('右侧有数据未保存，确定保存排序吗', '保存排序将丢失改动内容，如需继续请点击确认', () => {
          this.handleSort(Array, callback);
        });
      } else {
        this.handleSort(Array, callback);
      }
    },
    async handleSort(Array, callback) { // 处理保存排序
      const temp = {
        Array,
        IsSave: false,
        Type: 3,
      };
      const resp = await this.api.getProductClassSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          if (callback) callback();
          const list = this.areaList.filter(it => it.Level > 1);
          list.unshift(...Array);
          this.$store.commit('common/setAreaList', list);
          if (this.isManageRoot) this.onManageTotalClick(true);
        };
        this.messageBox.successSingle('保存排序成功', cb, cb);
      }
    },
    async handleLevel1Submit(data) { // 一级区域提交保存
      if (this.isSorting) {
        this.messageBox.failSingleError('保存失败', '左侧列表正在排序，请先取消排序');
        return;
      }
      const { saveList, removeList } = data;
      const removeIds = removeList.map(it => it.ID);
      const temp1 = saveList.length > 0 ? { Array: saveList, IsSave: true, Type: 3 } : null;
      const temp2 = removeIds.length > 0 ? { ids: removeIds, type: 3 } : null;
      const func1 = temp1 ? () => this.api.getProductClassSave(temp1).catch(() => null) : null;
      const func2 = temp2 ? () => this.api.getAreaRemoveRange(temp2).catch(() => null) : null;
      const list = [func1, func2].filter(it => it);
      const resp = await Promise.all(list.map(it => it()));
      const callback = async () => {
        await this.getAreaList();
        this.onManageTotalClick(true);
      };
      if (resp.every(it => it && it.data && it.data.Status === 1000)) {
        // 全部保存成功;
        const t = resp.find(it => it && /^\/Api\/RemoveRange/.test(it.config.url));
        if (t) {
          const obj = t.data.Data;
          const removeSuccessIds = Object.entries(obj).filter(([, value]) => value).map(([key]) => +key);
          if (removeSuccessIds.length < removeList.length) {
            const removeFailList = removeList.filter(_it => !removeSuccessIds.includes(_it.ID)).map(_it => _it.ClassName);
            if (removeFailList.length > 0) {
              const msg = `${removeFailList.join('、')}删除失败，其余保存成功`;
              this.messageBox.failSingleError('部分保存失败', msg, callback, callback);
              return;
            }
          }
        }
        this.messageBox.successSingle('保存成功', callback, callback);
        return;
      }
      if (resp.some(it => it && it.data && it.data.Status === 1000)) {
        this.messageBox.successSingle('部分保存成功', callback, callback);
        return;
      }
      if (temp1) callback();
    },
    async handleSubAreaSubmit(data) {
      if (this.isSorting) {
        this.messageBox.failSingleError('保存失败', '左侧列表正在排序，请先取消排序');
        return;
      }
      const { RegionalID, level2List, level3List } = data;
      const temp = {
        Array: level3List,
        RegionalID,
        Type: 3,
        IsSave: true,
      };
      const resp = await this.api.getProductClassSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const originCityIds = this.areaList.filter(it => it.Level === 2 && it.ParentID === RegionalID).map(it => it.ID);
          const list = [...this.areaList].filter(it => !originCityIds.includes(it.ID) && !originCityIds.includes(it.ParentID));
          list.push(...[...level2List, ...level3List]);
          this.$store.commit('common/setAreaList', list);
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
  mounted() {
    this.getAreaList();
    this.$store.dispatch('common/fetchAdAreaList');
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
