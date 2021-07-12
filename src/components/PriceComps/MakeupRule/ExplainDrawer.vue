<template>
  <el-drawer
  class="mp-erp-price-module-makeup-rule-page-explain-drawer-comp-wrap"
  :visible.sync="visible"
  :show-close='false'
  :before-close="handleClose">
  <span slot="title" @click="handleClose" class="explain-title"><i class="el-icon-arrow-right"></i> 说明</span>
  <div class="content">
    <div>
      <p>拼版规则一般用于画册产品，概念类似于画册内文把 16P 定为一手，然后进行折页、裁切成为一帖。但软件里面的概念稍微有点不同，说明如下：</p>
    </div>
    <div class="example">
      <p class="title">使用锁线胶装画册举例：</p>
      <p>
        画册内文 16P 为一手，装订前我们可以把每 4P 想象成一张单页（当然也可以把2P想象成一个单页），中间是装订线，16P 则有 4张这样的类似单页，
        拼版时，这4 张需要按一定规则拼版，比如按（图1）所示的方式是比较常见的一种形式。这种方式应用到软件的概念，则转换成了 2列 X 2行的拼版规则。
      </p>
      <div class="but">
        <span>但如</span>
        <div>
          <p>（图2）则不符合本软件规范，无法成为一手。类似合法的拼法如：</p>
          <p>（图3）2列 X 1行 8P一手，（图4）1列 X 2行 8P一手等等。</p>
        </div>
      </div>
    </div>
    <ul>
      <li>
        <div class="img-box">
          <img src="@/assets/images/makeup1.png" title="示例图1" alt="示例图1">
          <h2>(图1）</h2>
        </div>
        <div class="remark">
          <p>
            <span>裁切线</span>
          </p>
          <p>
            <span>装订线</span>
          </p>
        </div>
      </li>
      <li>
        <div class="img-box">
          <img src="@/assets/images/makeup2.png" title="示例图2" alt="示例图2">
          <h2>(图2）</h2>
        </div>
      </li>
      <li>
        <div class="img-box">
          <img src="@/assets/images/makeup3.png" title="示例图3" alt="示例图3">
          <h2>(图3）</h2>
        </div>
        <div class="img-box">
          <img src="@/assets/images/makeup4.png" title="示例图4" alt="示例图4">
          <h2>(图4）</h2>
        </div>
      </li>
    </ul>
  </div>
</el-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-rule-page-explain-drawer-comp-wrap {
  .el-drawer {
    width: 470px !important;
    > header {
      padding-left: 16px;
      .explain-title {
        cursor: pointer;
        font-size: 15px;
        color: #888E99;
        display: flex;
        align-items: center;
        transition: 0.1s ease-in-out;
        > i {
          font-size: 18px;
          margin-right: 6px;
        }
        &:hover {
          color: #585858;
          > i {
            font-weight: 700;
          }
        }
      }
    }
    > .el-drawer__body {
      color: #585858;
      font-size: 12px;
      padding: 4px 36px 0;
      > div.content {
        > div {
          margin-bottom: 30px;
          p {
            line-height: 24px;
            &.title {
              margin-bottom: 5px;
            }
          }
          > .but {
            display: flex;
            margin-top: 5px;
            span {
              line-height: 24px;
            }
          }
          &.example {
            > p {
              line-height: 28px;
            }
          }
        }
        > ul {
          padding-top: 15px;
          > li {
            display: flex;
            padding-bottom: 25px;
            > .img-box {
              > h2 {
                text-align: center;
                font-weight: 700;
              }
              & + .img-box {
                margin-left: 60px;
              }
            }
            > .remark {
              display: flex;
              flex-direction: column;
              justify-content: center;
              font-size: 14px;
              padding-bottom: 10px;
              line-height: 24px;
              padding-left: 120px;
              > p {
                position: relative;
                &::before {
                  content: '';
                  position: absolute;
                  height: 1px;
                  width: 50px;
                  background: #cbcbcb;
                  top: 11px;
                  left: -60px;
                }
                &:last-of-type::before {
                  background: linear-gradient(to right, #cbcbcb 10px, transparent 10px, transparent 13px );
                  background-size: 13px 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
