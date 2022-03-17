<template>
  <div class="ctrl-menus-container">
    <span @click="onDetailClick" :class="canDetail ? '' : 'disabled'" v-if="showList.includes('detail')">
      <img src="@/assets/images/detail.png" alt="" style="height: 15px;position:relative;top:1px">
      <i>详情</i>
    </span>
    <span @click="onCopyClick" :class="canCopy ? '' : 'disabled'" v-if="showList.includes('copy')">
      <img src="@/assets/images/copy.png" alt="">
      <i>拷贝</i>
    </span>
    <span @click="onDimissionClick" :class="{disabled: !canDimission}" class="em-4" v-if="showList.includes('dimission')">
      <img v-if="!isDimission" src="@/assets/images/dimission.png" alt="">
      <img v-else src="@/assets/images/regain.png" alt="">
      <i>{{isDimission ? '取消离职' : '离职'}}</i>
    </span>
    <span @click="onCheckClick" v-if="showList.includes('check')" class="em-4">
      <img src="@/assets/images/check.png" alt="">
      <i>审核</i>
    </span>
    <span @click="onSelectClick" :class="canSelect ? '' : 'disabled'" v-if="showList.includes('select')">
      <img src="@/assets/images/select.png" alt="">
      <i>选择</i>
    </span>
    <span @click="onSetupCostClick" :class="canSetupCost ? '' : 'disabled'" v-if="showList.includes('setup')">
      <img src="@/assets/images/setup.png" alt="">
      <i>{{setupCostText}}</i>
    </span>
    <span @click="onSetup2Click" :class="canSetup2 ? '' : 'disabled'" v-if="showList.includes('setup2')">
      <img src="@/assets/images/setup.png" alt="">
      <i>{{setupText2}}</i>
    </span>
    <span @click="onAllCostClick" :class="canAllCost ? '' : 'disabled'" v-if="showList.includes('allCost')">
      <img src="@/assets/images/cost.png" alt="">
      <i>总费用</i>
    </span>
    <!-- <span @click="onAllCostClick" :class="canAllCost ? '' : 'disabled'" v-if="showList.includes('allCost')">
      <img src="@/assets/images/cost.png" alt="">
      <i>总费用</i>
    </span> -->
    <span @click="onWriteClick" :class="canWrite ? '' : 'disabled'" v-if="showList.includes('write')">
      <img src="@/assets/images/write2.png" alt="">
      <i>{{writeText}}</i>
    </span>
    <span @click="onExportClick" :class="canExport ? '' : 'disabled'" v-if="showList.includes('export')">
      <img src="@/assets/images/export.png" alt="">
      <i>{{exportText}}</i>
    </span>
    <span @click="onEditClick" :class="canEdit ? '' : 'disabled'" v-if="showList.includes('edit')">
      <img src="@/assets/images/Compile.png" alt="">
      <i>编辑</i>
    </span>
    <span @click="onRemoveClick" :class="canRemove ? '' : 'disabled'" v-if="showList.includes('del')">
      <img src="@/assets/images/del.png" alt="">
      <i>删除</i>
    </span>
    <span @click="onAddClick" :class="canAdd ? '' : 'disabled'" v-if="showList.includes('add')">
      <img src="@/assets/images/add.png" alt="">
      <i>{{addText}}</i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    canEdit: {
      type: Boolean,
      default: true,
    },
    canRemove: {
      type: Boolean,
      default: true,
    },
    canAdd: {
      type: Boolean,
      default: true,
    },
    canCopy: {
      type: Boolean,
      default: true,
    },
    canDimission: {
      type: Boolean,
      default: true,
    },
    isDimission: {
      type: Boolean,
      default: false,
    },
    canDetail: {
      type: Boolean,
      default: true,
    },
    canSelect: {
      type: Boolean,
      default: true,
    },
    canSetupCost: {
      type: Boolean,
      default: true,
    },
    canSetup2: {
      type: Boolean,
      default: true,
    },
    canAllCost: {
      type: Boolean,
      default: true,
    },
    showList: {
      type: Array,
      default: () => ['edit', 'del'],
    },
    setupCostText: {
      type: String,
      default: '设置费用组成',
    },
    setupText2: {
      type: String,
      default: '',
    },
    canExport: {
      type: Boolean,
      default: true,
    },
    exportText: {
      type: String,
      default: '导出表',
    },
    canWrite: {
      type: Boolean,
      default: true,
    },
    writeText: {
      type: String,
      default: '填写表数据',
    },
    addText: {
      type: String,
      default: '添加一行',
    },
  },
  methods: {
    onEditClick() {
      if (!this.canEdit) return;
      this.$emit('edit');
    },
    onRemoveClick() {
      if (!this.canRemove) return;
      this.$emit('remove');
    },
    onAddClick() {
      if (!this.canAdd) return;
      this.$emit('add');
    },
    onCopyClick() {
      if (!this.canCopy) return;
      this.$emit('copy');
    },
    onDimissionClick() {
      if (!this.canDimission) return;
      this.$emit('dimission');
    },
    onCheckClick() {
      this.$emit('check');
    },
    onSelectClick() {
      if (!this.canSelect) return;
      this.$emit('select');
    },
    onAllCostClick() {
      if (!this.canAllCost) return;
      this.$emit('allCost');
    },
    onSetupCostClick() {
      if (!this.canSetupCost) return;
      this.$emit('setup');
    },
    onSetup2Click() {
      if (!this.canSetup2) return;
      this.$emit('setup2');
    },
    onExportClick() {
      if (!this.canExport) return;
      this.$emit('export');
    },
    onWriteClick() {
      if (!this.canWrite) return;
      this.$emit('write');
    },
    onDetailClick() {
      if (!this.canDetail) return;
      this.$emit('detail');
    },
  },
};
</script>
<style lang='scss'>
.ctrl-menus-container {
  display: inline-block;
  > span {
    font-size: 12px;
    color: #989898;
    cursor: pointer;
    > img {
      margin-right: 6px;
      vertical-align: -2px;
    }
    transition: color 0.1s ease-in-out;
    user-select: none;
    &:hover {
      color: #444;
    }
    & + span {
      margin-left: 20px;
    }
    &.disabled {
      > img {
        filter: grayscale(1);
        opacity: 0.4;
      }
      color: #cbcbcb;
      cursor: not-allowed;
    }
  }
}
</style>
