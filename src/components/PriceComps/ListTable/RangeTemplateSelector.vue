<template>
  <el-popover
    placement="right-start"
    width="330"
    v-model="visible"
    popper-class='mp-erp-price-manage-price-save-range-temp-select-wrap mp-scroll-wrap'>
    <div class="content">
      <div v-for="it in ApplyRangeTemplateList" :key="it.ID">
        <span @click="onSelectClick(it)" :class="{active: selectedID === it.ID}">{{it.Name}}</span>
      </div>
      <div class="empty" v-if="!ApplyRangeTemplateList || ApplyRangeTemplateList.length === 0">
        <p class="tips-box is-pink"> <i class="el-icon-warning"></i> 暂无模板，请先添加！</p>
      </div>
    </div>
    <span slot="reference" class="blue-span is-font-size-12">选择模板</span>
  </el-popover>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    selectedID: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('priceManage', ['ApplyRangeTemplateList']),
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    onSelectClick(item) {
      this.$emit('select', item);
      this.visible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-price-save-range-temp-select-wrap {
  min-height: 100px;
  max-height: 360px;
  overflow-y: auto;
  box-sizing: border-box;
  > .content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 6px;
    > div {
      font-size: 14px;
      color: #585858;
      width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 30px;
      height: 30px;
      padding-right: 6px;
      box-sizing: border-box;
      margin: 5px 0;
      > span {
        cursor: pointer;
        padding: 5px 0;
        transition: color 0.1s ease-in-out;
        user-select: none;
        &:hover {
          color: #35dff9;
        }
        &.active {
          color: #26BCF9;
        }
        &:active {
          color: #0556cf;
        }
      }
      &.empty {
        padding: 5px 0;
        height: 70px;
        line-height: 30px;
        color: #a2a2a2;
        font-size: 12px;
        width: 200px;
      }
    }
  }
}
</style>
