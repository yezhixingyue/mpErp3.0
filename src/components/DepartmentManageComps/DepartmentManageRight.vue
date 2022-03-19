<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-right-content-wrap">
    <header>
      <p class="mp-common-title-wrap">{{title}} {{departmentParentID +'0'}}</p>
    </header>
    <main>
      <Level1ManageComp :level1List='level1List' ref="oLevel1Comp"  />
    </main>
    <footer>
      <el-button type="primary" size="small" @click="onSubmitClick">保存</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import Level1ManageComp from './Right/Level1ManageComp';
// import SubAreaManageComp from './Right/SubAreaManageComp/index';

export default {
  props: {
    departmentList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Level1ManageComp,
    // SubAreaManageComp,
  },
  computed: {
    ...mapState('department', ['departmentParentID']),
    title() {
      if (this.departmentParentID === -1) return '一级部门';
      if (this.departmentParentID !== -1) return this.departmentList.find((item) => item.ID === this.departmentParentID).ClassName;
      return '子部门管理';
    },
    level1List() { // 当前一级部门数据（不含子部门）
      return this.departmentList.filter((item) => item.ParentID === this.departmentParentID);
      // return this.isManageRoot ? this.allAreaTreeList.map(it => ({ ...it, children: null, canRemove: !it.children || it.children.length === 0 })) : [];
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
      console.log(this.$refs.oLevel1Comp);
      const data = this.$refs.oLevel1Comp.save();
      console.log(data);
      if (data) {
        this.$emit('level1Submit', data);
      }
      // if (this.isManageRoot && this.$refs.oLevel1Comp) { // 一级区域提交
      // }
      // if (!this.isManageRoot && this.$refs.oSubAreaComp) { // 一级区域提交
      //   const data = this.$refs.oSubAreaComp.getSubmitData();
      //   if (data) {
      //     this.$emit('subAreaSubmit', data);
      //   }
      // }
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
