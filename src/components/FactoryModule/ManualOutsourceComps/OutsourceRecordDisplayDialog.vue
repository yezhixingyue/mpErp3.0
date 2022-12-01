<template>
  <CommonDialogComp
    width="700px"
    title="查看修改记录"
    :visible.sync="localVisible"
    class="mp-erp-out-source-record-display-dialog-comp-wrap"
    :showSubmit="false"
    cancelText="关闭"
    @open="onOpen"
    @cancle="cancel"
    top="13vh"
  >
    <div class="mp-scroll-wrap" ref="oWrap">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(it, index) in list" :key="it.Index" :color="index===list.length-1?'#26bcf9':''">
          <el-card>
            <h4>{{it.Description}}</h4>
            <p>
              <span class="mr-12">{{it.Operator}}</span>
              <span>{{it.OperateTime | format2MiddleLangTypeDate}}</span>
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: { // 列表数据
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
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
    onOpen() {
      if (this.$refs.oWrap) {
        this.$nextTick(() => {
          this.$refs.oWrap.scrollTop = 0;
        });
      }
    },
    cancel() {
      this.localVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-out-source-record-display-dialog-comp-wrap {
  .el-dialog__body {
    text-align: center;
    height: 450px;
    padding: 25px 15px;
    > div {
      height: 100%;
      overflow: auto;
      overflow: overlay;
      padding: 20px 45px;
      box-sizing: border-box;
      .el-timeline {
        text-align: left;
        .el-timeline-item__content {
          font-size: 13px;
          padding-left: 6px;
          .el-card__body {
            padding: 15px 20px;
            p {
              font-size: 12px;
              color: #989898;
              margin-top: 18px;
              text-align: right;
            }
          }
        }
      }
      scroll-behavior: auto;
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px;
  }
}
</style>
