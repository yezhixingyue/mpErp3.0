<template>
  <CommonDialogComp
    width="750px"
    top="8vh"
    :visible.sync="localVisible"
    title="选择区域"
    class="mp-erp-ad-area-dialog-selector-comp-wrap"
    submitText='确定'
    @submit="onSubmit"
    @closed="onClosed"
    @open="onOpen"
    @cancle="localVisible = false"
  >
    <ADAreaTreeContentComp ref="oTreeWrap" v-model="localAreaList" v-if="localVisible" />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp';
import ADAreaTreeContentComp from './ADAreaTreeContentComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    AreaDescribe: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
    ADAreaTreeContentComp,
  },
  data() {
    return {
      localAreaList: [],
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    onClosed() {
      if (this.$refs.oTreeWrap && this.$refs.oTreeWrap.$refs.TreeComp) {
        this.$refs.oTreeWrap.$refs.TreeComp.clearTreeData();
      }
    },
    onOpen() {
      this.localAreaList = [...this.value];
    },
    onSubmit() {
      this.$emit('input', [...this.localAreaList]);
      this.$emit('update:AreaDescribe', this.$refs.oTreeWrap.getTextDisplayContent());
      this.localVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-ad-area-dialog-selector-comp-wrap {
  .el-dialog__body {
    height: 520px;
    overflow: auto;
    padding-left: 30px;
    margin-right: 3px;
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cbcbcb;
      border-radius: 3px;
      &:hover {
        background-color: #989898;
      }
    }
  }
}
</style>
