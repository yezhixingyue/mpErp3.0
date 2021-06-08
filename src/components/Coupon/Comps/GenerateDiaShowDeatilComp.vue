<template>
  <section class="mp-coupon-generate-dialog-show-detail-comp-wrap">
    <header class="is-primary">
      <div class="left">
        <span class="is-pink is-thick-line">¥{{data.Data.Amount}} </span>满
        <span class="is-pink">{{data.Data.MinPayAmount}}</span>元使用
      </div>
      <div class="right">
        <el-tooltip
          placement="top"
          :enterable="false"
          v-if="dialogProductInfo && dialogProductInfo.length > 0"
        >
          <div slot="content">
            <p v-for="(item, i) in dialogProductInfo" :key="item + '---' + i">{{ item }}</p>
          </div>
          <span class="is-thick-line">限产品：{{ dialogProductInfo.join(' ') }}</span>
        </el-tooltip>
      </div>
    </header>
    <div class="content">
      <div class="left is-primary">
        <div>
          <span>总数量：{{data.Data.TotalNumber}}张</span>
        </div>
        <div>
          <span>已生成：{{data.Data.GenerateNumber}}张</span>
          <span>未生成：{{data.Data.TotalNumber - data.Data.GenerateNumber}}张</span>
        </div>
      </div>
      <ul class="right is-gray">
        <li>
          <span>有效期开始时间：{{data.ValidStartTime | format2MiddleLangTypeDate}}</span>
          <span>有效期结束时间：{{data.ValidEndTime | format2MiddleLangTypeDate}}</span>
        </li>
        <li>
          <span>开始发放时间：{{data.ProvideStartTime | format2MiddleLangTypeDate}}</span>
          <span>结束发放时间：{{data.ProvideEndTime | format2MiddleLangTypeDate}}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      default: () => ({}),
      type: Object,
    },
    dialogProductInfo: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang='scss'>
.mp-coupon-generate-dialog-show-detail-comp-wrap {
  height: 120px;
  width: 700px;
  background: url(../../../assets/images/bg-border.png) no-repeat
    center/100% 100%;
  box-sizing: border-box;
  padding: 0 30px;
  > header {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #d1e6ee;
    display: flex;
    justify-content: center;
    align-items: center;
    > .right {
      font-size: 12px;
      margin-left: 20px;
      max-width: 360px;
      display: flex;
      align-items: flex-end;
      > span.is-thick-line {
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
      }
    }
  }
  > .content {
    height: 70px;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 10px 0;
    font-size: 12px;
    > .left {
      width: 210px;
      height: 100%;
      border-right: 1px solid #d1e6ee;
      flex: none;
      > div {
        height: 25px;
        > span {
          line-height: 25px;
          white-space: nowrap;
        }
        &:last-of-type {
          display: flex;
        //   justify-content: space-around;
         > span + span {
            margin-left: 10px;
         }
        }
      }
    }
    > .right {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      > li {
        display: flex;
        flex-direction: column;
        height: 50px;
        line-height: 25px;
        margin-left: 20px;
      }
    }
  }
}
</style>
