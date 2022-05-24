<template>
  <div :class="tooltipClass" class="overflow-tooltip">
    <p ref="nodeCopy" style="position:absolute;overflow: hidden;height:0px;padding:0;">{{content}}</p>
    <!-- <p ref="node" class="textarea" style="overflow: hidden;height:0px;padding:0;">{{dataInfo.Order.Remark}}</p> -->
    <el-tooltip v-show="disabled" class="item" effect="dark" :content="content" placement="top">
      <p ref="node" class="textarea">{{content}}</p>
    </el-tooltip>
    <p  v-show="!disabled" class="textarea">{{content}}</p>
  </div>
</template>
<script>
export default {
  name: 'textTooltip',
  props: {
    content: [String, Number, Boolean],
    tooltipClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      disabled: true,
    };
  },
  watch: {
    content: {
      handler() {
        this.$nextTick(() => {
          const el = this.$refs.node;
          const elCopy = this.$refs.nodeCopy;
          this.disabled = el?.clientWidth < elCopy?.clientWidth;
        });
      },
    },
  },
};
</script>

<style scoped>
.overflow-tooltip {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
