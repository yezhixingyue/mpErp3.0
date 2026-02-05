<template>
  <li class="order-list-progress-item">
          <section class="left-title-wrap">
              <div>
                <span :title="operator" v-if="operator" :class="!isCurNewIndex ? 'operator' : 'operator active'">
                    {{operator}}
                </span>
                <i v-if="operator" style="flex: none">/</i>
                <span :class="!isCurNewIndex ? 'text-title' : 'text-title active'">
                  {{progressTitle === '下单' ? '创建订单' : progressTitle}}
                </span>
                <el-tooltip v-if="progressDesc" :content="progressDesc" placement="top">
                  <span :class="!isCurNewIndex?'desc-line':'desc-line active'">（<i>{{
                    progressDesc
                  }}</i>）</span>
                </el-tooltip>
              </div>
              <div>
                <span :class="!isCurNewIndex ? 'time' : 'time active'"
                  v-if="isCompleted">{{completeTime}}</span>
              </div>
          </section>
          <section :class="!isCurNewIndex ? 'md-point-wrap' : 'md-point-wrap active'">
              <span class="point"></span>
              <span v-if="showLine" class="line"></span>
          </section>
          <section class="right-progress-wrap">
              <el-progress
               :percentage="percentNum"
               :class="isCurNewIndex ? 'mp-progress' : 'mp-progress completed'"
               :stroke-width='4' :show-text='false'></el-progress>
              <div class="info">
                <span>{{rightInfo1}}</span>
              </div>
          </section>
      </li>
</template>

<script>

export default {
  props: {
    /**
     * 当前进度信息
     */
    orderProgressData: {
      type: Array,
      default: () => [],
    },
    /**
     * 当前索引值
     */
    index: {
      type: Number,
      default: 0,
    },
    /**
     * 当前订单进度
     */
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      operator: '',
      rightInfo1: '已完成',
      completeTime: '',
      percentNum: 100,
      isCompleted: true,
      title: '创建订单',
      showLine: true,
      isCurNewIndex: false,
    };
  },
  computed: {
    progressTitle() {
      if (!this.title) return '';
      const _t = this.title.split('(')[0];
      return _t;
    },
    progressDesc() {
      if (!this.title) return '';
      const _t = this.title.split('(')[1];
      if (_t) return _t.replace(')', '');
      return '';
    },
  },
  methods: {
    initRender() {
      this.isCurNewIndex = false;
      this.isCompleted = true;
      if (this.index === this.orderProgressData.length - 1) this.showLine = false;
      const obj = this.orderProgressData[this.index];
      this.completeTime = this.switchDate(obj.OperateTime);
      this.operator = obj.Operator;
      this.percentNum = obj.FinishPercent;
      this.title = obj.Description;
      this.rightInfo1 = obj.FinishPercent > 0 ? `${obj.FinishPercent}%` : '';
      if (obj.ShowFocus) this.isCurNewIndex = true;
      if (obj.FinishPercent < 100) this.isCompleted = false;
    },
    switchDate(date) {
      const str = date.split('.')[0].replace('T', ' ').substring(0, 16);
      return str;
    },
  },
  watch: {
    orderProgressData() {
      this.initRender();
    },
  },
  mounted() {
    this.initRender();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-list-progress-item{
    display: flex;
    justify-content: center;
    color: $--color-text-table-time;
    font-size: 12px;
    .left-title-wrap{
        width: 325px;
        text-align: right;
        margin-top: -2px;
        > div {
          &:first-of-type{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            overflow: hidden;
            // flex-wrap: wrap; // 因物流暂停备注较多的时候会换行 所以不注释掉此样式并添加title属性

            .operator {
              flex: none;
            }

            .text-title {
              font-size: 14px;
              font-weight: 600;
              white-space: nowrap;
              flex: none;
              &.active{
                  color: $--color-text-primary;
              }
            }
            .desc-line {
              font-size: 13px;
              display: flex;
              font-weight: 600;
              max-height: 30px;
              line-height: 15px;
              max-width: 100%;
              white-space: nowrap;
              margin-top: -1px;
              flex: 0 1 auto;
              overflow: hidden;
              > i {
                overflow: hidden;
                text-overflow: ellipsis;
              }
              &.active {
                color: $--color-text-primary;
              }
            }
            .operator{
              font-family:"宋体";
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              vertical-align: middle;
            }
            > i{
              margin: 0 7px 0 5px;
              font-size: 14px;
            }
          }

          & + div {
              margin-top: 4px;
          }
        }
    }
    .md-point-wrap{
        width: 15px;
        margin: 0 15px;
        height: 61px;
        display: flex;
        flex-direction: column;
        align-items: center;
        > .point{
        height: 11px;
        width: 11px;
        border-radius: 50%;
        background-color: $--border-color-light;
        }
        > .line{
            height: 50px;
            text-align: center;
            &::after{
                content: '';
                display: inline-block;
                height: 100%;
                width: 1px;
                background-color: $--border-color-light;
            }
        }
        &.active {
          > .point{
              width: 8px;
              height: 8px;
              background-color: $--color-primary;
              position: relative;
            &::after{
              height: 16px;
              width: 16px;
              content: '';
              background-color: rgba($color: $--color-primary, $alpha: .25);
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          > .line{
            height: 53px;
          }
        }
    }
    .right-progress-wrap{
        width: 180px;
        height: 26px;
        padding-top: 3px;

        > .info {
        text-align: right;
        font-size: 12px;
        margin-top: 10px;
        }
        > .mp-progress {
          .el-progress-bar{
              .el-progress-bar__outer{
              background-color: $--border-color-light;
              .el-progress-bar__inner{
                  background:linear-gradient(to right, $--color-primary, $--color-primary-light);
              }
              }
          }
          &.completed{
              .el-progress-bar{
                // margin-top: -1px;
              .el-progress-bar__outer{
                  background-color: $--border-color-light;
                  .el-progress-bar__inner{
                      background:linear-gradient(
                        to right,rgba($--color-primary-light,.6),rgba($--color-primary-lighter,.6)
                      );
                  }
              }
              }
          }
        }

    }
    .operator.active, .time.active{
      color: $--color-text-primary;
    }
    .time{
      font-family: sans-serif;
    }
}
</style>
