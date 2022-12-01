<template>
  <el-drawer
  class="mp-erp-material-type-page-explain-drawer-comp-wrap"
  :visible="visible"
  :show-close='false'
  :before-close="handleClose">
  <span slot="title" @click="handleClose" class="explain-title"><i class="el-icon-arrow-right"></i> 说明</span>
  <div class="text-box">
    <p class="title">元素组合显示： </p>
    <p>根据物料元素组合显示相应联动下拉框，具体看示例：</p>
    <ul>
      <li>
        <span>假如：我们设置类型“纸张”有三个元素：</span>
        <span class="is-pink">“种类”、“克重”、“颜色”</span>
        <span>：</span>
      </li>
      <li>
        <span>种类：铜版纸、双胶纸；</span>
      </li>
      <li>
        <span>克重：80克、157克、200克；</span>
      </li>
      <li>
        <span>颜色：白色、黑色</span>
      </li>
    </ul>
    <p class="">根据以上值我们生成 12 种物料，都应用到某一产品中，这时根据不同设置显示不同的联动下拉框，如下：</p>
  </div>
  <div class="explain-box">
    <div>
      <span>界面展现</span>
      <span>相应设置</span>
    </div>
    <ul>
      <li>
        <div class="left">
          <el-select v-model="explain1.value1" size='mini'>
            <el-option
              v-for="item in explain1.options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="explain1.value2" size='mini'>
            <el-option
              v-for="item in explain1.options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <span>种类+颜色</span>
          <i>|</i>
          <span>克重</span>
        </div>
      </li>
      <li>
        <div class="left">
          <el-select v-model="explain2.value1" size='mini'>
            <el-option
              v-for="item in explain2.options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="explain2.value2" size='mini'>
            <el-option
              v-for="item in explain2.options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="explain2.value3" size='mini'>
            <el-option
              v-for="item in explain2.options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <span>种类</span>
          <i>|</i>
          <span>克重</span>
          <i>|</i>
          <span>颜色</span>
        </div>
      </li>
      <li>
        <div class="left">
          <el-select v-model="explain3.value1" size='mini'>
            <el-option
              v-for="item in explain3.options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <span>种类+克重+颜色</span>
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
      explain1: {
        value1: 0,
        options1: [{ label: '铜版纸白色', value: 0 }, { label: '铜版纸黑色', value: 1 }, { label: '双胶纸白色', value: 2 }, { label: '双胶纸黑色', value: 3 }],
        value2: 0,
        options2: [{ label: '157克', value: 0 }, { label: '200克', value: 1 }],
      },
      explain2: {
        value1: 0,
        options1: [{ label: '铜版纸', value: 0 }, { label: '双胶纸', value: 1 }],
        value2: 0,
        options2: [{ label: '157克', value: 0 }, { label: '200克', value: 1 }],
        value3: 0,
        options3: [{ label: '白色', value: 0 }, { label: '黑色', value: 1 }],
      },
      explain3: {
        value1: 0,
        options1: [{ label: '铜版纸白色157克', value: 0 }, { label: '铜版纸黑色157克', value: 1 }, { label: '双胶纸白色157克', value: 2 }, { label: '双胶纸白色157克', value: 3 },
          { label: '铜版纸白色200克', value: 4 }, { label: '铜版纸黑色200克', value: 5 }, { label: '双胶纸白色200克', value: 6 }, { label: '双胶纸白色200克', value: 7 }],
      },
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
.mp-erp-material-type-page-explain-drawer-comp-wrap {
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
      padding: 4px 16px 0 28px;
      > .text-box {
        > p.title {
          font-weight: 700;
          font-size: 14px;
          padding-bottom: 22px;
        }
        > ul {
          padding-top: 23px;
          > li {
            padding: 7px 0;
          }
        }
        > p:last-of-type {
          padding-top: 20px;
          line-height: 26px;
        }
      }
      > .explain-box {
        padding-top: 28px;
        > div {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          font-weight: 700;
          font-size: 14px;
          line-height: 20px;
          padding: 10px 50px 9px 60px;
          user-select: none;
        }
        > ul {
          padding-top: 8px;
          > li {
            display: flex;
            padding: 12px 0;
            align-items: center;
            > .left {
              width: 300px;
              .el-select {
                margin-right: 5px;
                .el-input__inner {
                  padding: 0 13px 0 6px;
                }
                .el-input__suffix {
                  right: 0px;
                }
              }
            }
            > .right {
              > i {
                margin: 0 8px;
              }
            }
            &:not(:last-of-type) > .left .el-select {
              width: 90px;
            }
          }
        }
      }
    }
  }
}
</style>
