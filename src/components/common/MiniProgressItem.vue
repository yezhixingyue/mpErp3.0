<template>
  <li class="order-list-progress-item-mini" :class="data.isNewest ? 'active' : ''">
          <section class="left-title-wrap">
              <span class="year-box">{{data.year}}</span>
              <span class="aftertime-box">{{data.afterTime}}</span>
          </section>
          <section :class="data.isNewest ? 'md-point-wrap active' : 'md-point-wrap'">
              <span class="point"></span>
              <span v-if="data.showLine" class="line"></span>
          </section>
          <section class="right-progress-wrap">
                <span v-if="data.StatusName" class="title">{{data.StatusName}}</span>
                <span>{{data.expressDetail}}</span>
                <span v-if="data.operator" class="operator"><i>/</i>{{data.operator}}</span>
          </section>
      </li>
</template>

<script>
export default {
  // 该组件用于物流列表中的进度查询页面， 为上下进度条最小单元
  props: {
    // /**
    //  * 用于控制底部连接竖线是否显示
    //  */
    // showLine: {
    //   type: Boolean,
    //   default: true,
    // },
    // /**
    //  * 是否已完成状态，分已完成和进行中，未完成且未开始在外层控制隐藏 ，影响右侧导航条颜色、左侧文字颜色、与更上方状态是否展示
    //  */
    // isNewest: {
    //   type: Boolean,
    //   default: false,
    // },
    // /**
    //  * 左侧进度状态展示
    //  */
    // title: {
    //   type: String,
    //   default: '',
    // },
    // /**
    //  * 左侧操作人信息
    //  */
    // operator: {
    //   type: String,
    //   default: '',
    // },
    // /**
    //  * 左侧完成时间--1st为年月日 2nd为小时分钟
    //  */
    // year: {
    //   type: String,
    //   default: '',
    // },
    // afterTime: {
    //   type: String,
    //   default: '',
    // },
    // /**
    //  * 运输详情
    //  */
    // expressDetail: {
    //   type: String,
    //   default: '',
    // },
    // ------------ 下面为以上属性的集合
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-list-progress-item-mini{
    display: flex;
    justify-content: center;
    color: $--color-text-table-time;
    font-size: 12px;
    .left-title-wrap{
        width: 125px;
        text-align: right;
        // margin-top: 1px;
        .aftertime-box{
          margin-left: 8px;
        }
    }
    .md-point-wrap{
        width: 15px;
        margin: 0 22px;
        min-height: 39px;
        display: flex;
        flex-direction: column;
        align-items: center;
        > .point{
          height: 15px;
          width: 15px;
          border-radius: 50%;
          display: flex;
          flex: none;
          justify-content: center;
          align-items: center;
          &::after{
              content: '';
              width: 9px;
              height: 9px;
              background-color: $--border-color-light;
              border-radius: 50%;
            }
        }
        > .line{
            height: 100%;
            text-align: center;
            &::after{
                content: '';
                display: inline-block;
                height: calc(100% + 9px);
                width: 1px;
                background-color: $--border-color-light;
                margin-top: -6px;
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
            height: 100%;
            &::after{
              margin-top: 0px;
            }
          }
        }
    }
    .right-progress-wrap{
        width: 360px;
        margin-right: -70px;
        line-height: 22px;
        margin-top: -5px;
        margin-bottom: 12px;
        text-align: left;
        .title{
          font-size: 14px;
          font-weight: 600;
          margin-right: 10px;
        }
        .operator{
          margin-left:10px;
          > i {
            margin-right: 8px;
          }
        }
    }
    &.active{
      color: $--color-text-primary;
    }
}
</style>
