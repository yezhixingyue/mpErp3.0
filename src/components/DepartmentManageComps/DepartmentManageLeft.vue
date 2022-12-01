// 部门管理
<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-left-content-wrap">
    <header>
      <p class="mp-common-title-wrap">部门列表</p>
      <el-button class="cancel-blue-btn" @click="onTotalClick" :disabled='sorting'>管理一级部门</el-button>
      <span v-show="sorting" class="is-font-size-12" style="margin-left:15px">排序中.. </span>
    </header>
    <main>
      <p>
        <span>部门名称</span>
        <span>操作</span>
      </p>
      <draggable tag='ul' :scroll="true" animation="200"
      :class="{moving: sorting}" v-bind="dragOptions"
      v-model="localDepartmentList" v-if="localDepartmentList.length > 0" :group='group'
         >
         <!-- 一级部门列表 -->
        <AreaItemComp
          v-for="it in localDepartmentList"
          :key="it.ID" :itemData='it'
          :departmentList="localDepartmentList"
          :activeId='activeId'
          :moving='sorting'
          :extendIds="extendIds"
          @extend='handleExtend'
          @active='id => activeId = id'
          @subManage='handleSubManage'
        />
      </draggable>
    </main>
    <footer>
      <el-button v-if="!sorting" type="primary" @click="onSortClick" :disabled='localDepartmentList.length === 0'>排序</el-button>
      <template v-else>
        <el-button type="primary" @click="onSubmitClick">保存</el-button>
        <el-button class="cancel-blue-btn" @click="onCancelClick">取消</el-button>
      </template>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import AreaItemComp from './AreaItemComp/index.vue';

export default {
  props: {
    sellAreaList: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AreaItemComp,
    draggable,
  },
  data() {
    return {
      // 排序之前的数据
      sortDepartment: [],
      // 数据
      localDepartmentList: [],
      extendIds: [], // 展开的区域ID列表
      activeId: '',
      cacheExtendIds: [],
      group: { name: 'wrap', pull: false },
    };
  },
  computed: {
    ...mapState('department', ['departmentList']),
    ...mapGetters('department', ['getSuperiorDepartment']),
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.sorting,
        ghostClass: 'ghost',
      };
    },
    sorting: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    setSuperiorDepartmentAreaList() { // 设置本地列表数据
      this.localDepartmentList = JSON.parse(JSON.stringify(this.getSuperiorDepartment)) || [];
      this.localDepartmentList.forEach(SuperiorDepartment => {
        this.$set(SuperiorDepartment, 'children', this.departmentList.filter(item => item.ParentID === SuperiorDepartment.ID) || []);
      });
      this.localDepartmentList = JSON.parse(JSON.stringify(this.localDepartmentList)) || [];
      this.localDepartmentList.forEach(SuperiorDepartment => {
        SuperiorDepartment.children.forEach(SecondLevelDepartment => {
          this.$set(SecondLevelDepartment, 'children', this.departmentList.filter(item => item.ParentID === SecondLevelDepartment.ID) || []);
        });
      });
      // this.localDepartmentList =
      this.sortDepartment = JSON.parse(JSON.stringify(this.localDepartmentList)) || [];
    },
    onTotalClick() { // 管理一级区  -- 点击时，如果此时为排序状态，则应取消排序状态
      this.onCancelClick();
      this.$emit('totalManage');
    },
    handleExtend(ID) { // 展开|收起某个大区
      if (this.sorting) return;
      const i = this.extendIds.indexOf(ID);
      if (i > -1) this.extendIds.splice(i, 1);
      else this.extendIds.push(ID);
    },
    handleSubManage(ID) { // 管理子区域
      this.$emit('subManage', ID);
    },
    onSortClick() { // 点击排序
      this.cacheExtendIds = [...this.extendIds];
      // this.extendIds = [];
      this.sorting = true;
    },
    onCancelClick() { // 取消排序
      this.extendIds = [...this.cacheExtendIds];
      this.sorting = false;
      this.setSuperiorDepartmentAreaList();
    },
    onSubmitClick() { // 提交保存排序
      const bool = JSON.stringify(this.localDepartmentList) === JSON.stringify(this.sortDepartment);
      if (bool) {
        this.messageBox.failSingleError('保存失败', '排序未发生变化');
        return;
      }
      const returnData = [];
      const returnOneIt = this.localDepartmentList.map((oneIt, oneI) => {
        const _oneIt = { ...oneIt, Index: oneIt.Index !== 999 ? oneI : 999 };
        const returntowIt = oneIt.children.map((towIt, towI) => {
          const _towIt = { ...towIt, Index: towIt.Index !== 999 ? towI : 999 };
          _towIt.ParentID = oneIt.ID;
          const returnThreeIt = towIt.children.map((threeIt, threeI) => {
            const _threeIt = { ...threeIt, Index: threeIt.Index !== 999 ? threeI : 999 };
            _threeIt.ParentID = towIt.ID;
            delete _threeIt.children;
            return _threeIt;
          });
          returnData.push(...returnThreeIt);
          delete _towIt.children;
          return _towIt;
        });

        returnData.push(...returntowIt);
        delete _oneIt.children;
        return _oneIt;
      });
      returnData.push(...returnOneIt);
      // const returnData = [];
      this.$emit('sort', returnData);
    },
    // onWrapMovEnd({ oldIndex, newIndex }) { // 处理其它大区移动特殊情况（该大区位置不能移动）
    //   if (oldIndex === this.localDepartmentList.length - 1 || newIndex === this.localDepartmentList.length - 1) {
    //     const tempArr = this.localDepartmentList.splice(newIndex, 1);
    //     this.localDepartmentList.splice(oldIndex, 0, tempArr[0]);
    //     this.$message.error('其它大区位置不可变动(保持最后一位)');
    //   }
    // },
  },
  watch: {
    getSuperiorDepartment: {
      handler() {
        this.setSuperiorDepartmentAreaList();
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-left-content-wrap {
  .hover-margin {
    margin: 5px 0;
  }
  display: flex;
  flex-direction: column;
  min-width: 440px;
  max-width: 520px;
  height: 100%;
  padding-right: 20px;
  > header {
    flex: none;
    > p {
      display: block;
      margin-bottom: 25px;
    }
    > button {
      border-radius: 3px;
    }
    > span {
      color: #cbcbcb;
    }
    padding-bottom: 22px;
  }
  > main {
    flex: 1;
    overflow: hidden;
    color: #585858;
    > p {
      font-size: 14px;
      color: #444;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      background: #f5f5f5;
      line-height: 38px;
      padding-left: 25px;
      padding-right: 30px;
    }
    > ul {
      max-height: calc(100% - 40px);
      overflow-y: auto;
      &.moving > li > .header {
        cursor: move;
      }
    }
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
  .active {
    background-color: #C1C1C1 !important;
  }
}
</style>
