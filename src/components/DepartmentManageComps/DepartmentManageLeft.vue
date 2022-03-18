// 部门管理
<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-left-content-wrap">
    <header>
      <p class="mp-common-title-wrap">部门列表</p>
      <el-button class="cancel-blue-btn" @click="onTotalClick" :disabled='sorting'>管理一级部门</el-button>
      <span v-show="sorting" class="is-font-size-12" style="margin-left:15px">排序中.. ( 注：其它大区不参与排序)</span>
    </header>
    <main>
      <p>
        <span>部门名称</span>
        <span>操作</span>
      </p>
      <draggable tag='ul' :class="{moving: sorting}" v-bind="dragOptions" v-model="getSuperiorDepartment" v-if="departmentList.length > 0" :group='group'
         @end="onWrapMovEnd">
         <!-- 一级部门列表 -->
        <AreaItemComp
          v-for="it in getSuperiorDepartment"
          :key="it.ID" :itemData='it'
          :departmentList="departmentList"
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
      <el-button v-if="!sorting" type="primary" @click="onSortClick" :disabled='localSellAreaList.length === 0'>排序</el-button>
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
  mounted() {
    console.log(this.getSuperiorDepartment);
    console.log(this.$store.state);
  },
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
      localSellAreaList: [],
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
    setLocalSellAreaList() { // 设置本地列表数据
      this.localSellAreaList = JSON.parse(JSON.stringify(this.sellAreaList)) || [];
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
      this.setLocalSellAreaList();
    },
    onSubmitClick() { // 提交保存排序
      const bool = JSON.stringify(this.localSellAreaList) === JSON.stringify(this.sellAreaList);
      if (bool) {
        this.messageBox.failSingleError('保存失败', '排序未发生变化');
        return;
      }
      const list = this.localSellAreaList.map((it, i) => {
        const Index = it.Index !== 999 ? i : 999;
        const _it = { ...it, Index };
        delete _it.children;
        return _it;
      });
      const callback = () => {
        this.extendIds = [...this.cacheExtendIds];
        this.sorting = false;
      };
      this.$emit('sort', list, callback);
    },
    onWrapMovEnd({ oldIndex, newIndex }) { // 处理其它大区移动特殊情况（该大区位置不能移动）
      if (oldIndex === this.localSellAreaList.length - 1 || newIndex === this.localSellAreaList.length - 1) {
        const tempArr = this.localSellAreaList.splice(newIndex, 1);
        this.localSellAreaList.splice(oldIndex, 0, tempArr[0]);
        this.$message.error('其它大区位置不可变动(保持最后一位)');
      }
    },
  },
  watch: {
    sellAreaList: {
      handler() {
        this.setLocalSellAreaList();
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-left-content-wrap {
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
