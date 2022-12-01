<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-right-content-wrap">
    <header>
      <p class="mp-common-title-wrap">{{title}}</p>
    </header>
    <main>
      <Level1ManageComp v-if="isManageRoot && level1List.length > 0" :level1List='level1List' ref="oLevel1Comp"  />
      <SubAreaManageComp v-if="!isManageRoot && curManageArea" :curManageArea='curManageArea' ref="oSubAreaComp" />
    </main>
    <footer>
      <el-button type="primary" size="small" @click="onSubmitClick">保存</el-button>
    </footer>
  </section>
</template>

<script>
import Level1ManageComp from './Level1ManageComp';
import SubAreaManageComp from './SubAreaManageComp/index';

export default {
  props: {
    isManageRoot: { // 是否正在管理一级区列表 优先级高
      type: Boolean,
      default: true,
    },
    subAreaID: { // 正在管理的子区域的区域ID
      default: '',
    },
    allAreaTreeList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Level1ManageComp,
    SubAreaManageComp,
  },
  computed: {
    title() {
      if (this.isManageRoot) return '一级区域';
      if (this.curManageArea) return this.curManageArea.ClassName;
      return '子区域管理';
    },
    level1List() { // 当前一级区域列表数据（不含子区域）
      return this.isManageRoot ? this.allAreaTreeList.map(it => ({ ...it, children: null, canRemove: !it.children || it.children.length === 0 })) : [];
    },
    curManageArea() {
      return this.allAreaTreeList.find(it => it.ID === this.subAreaID);
    },
  },
  methods: {
    checkLevel1IsOrNotChange() { // 判断一级区域是否有改变
      return this.$refs.oLevel1Comp ? this.$refs.oLevel1Comp.getIsOrNotChange() : false;
    },
    checkSubAreaIsOrNotChange() { // 判断子区域设置是否有改变
      return this.$refs.oSubAreaComp ? this.$refs.oSubAreaComp.getIsOrNotChange() : false;
    },
    onSubmitClick() { // 提交
      if (this.isManageRoot && this.$refs.oLevel1Comp) { // 一级区域提交
        const data = this.$refs.oLevel1Comp.handleSubmit();
        if (data) {
          this.$emit('level1Submit', data);
        }
      }
      if (!this.isManageRoot && this.$refs.oSubAreaComp) { // 一级区域提交
        const data = this.$refs.oSubAreaComp.getSubmitData();
        if (data) {
          this.$emit('subAreaSubmit', data);
        }
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-right-content-wrap {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
  color: #585858;
  min-width: 750px;
  > header {
    flex: none;
    padding-bottom: 20px;
  }
  > main {
    flex: 1;
    overflow: hidden;
  }
  > footer {
    flex: none;
    padding-top: 32px;
    padding-bottom: 12px;
    text-align: center;
    button {
      height: 30px;
      padding: 0;
      width: 100px;
      border-radius: 3px;
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
