<template>
  <el-popover
    placement="bottom-start"
    popper-class="mp-common-comps-ep-cascader-comp-popper-wrap"
    trigger="manual"
    transition="el-zoom-in-top"
    v-model="visible">
    <el-button slot="reference"  @click="handleVisible">click 激活</el-button>
    <div class="display-content" v-clickoutside="handleClose">
      <el-scrollbar>
        <ul>
          <li v-for="(it, i) in allProductClassify" :key="i" @mouseenter="onLv1Mouseenter(it)">
            <span class="label">{{it.ClassName}}</span>
            <i class="el-icon-arrow-right"></i>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex';
import Clickoutside from 'element-ui/src/utils/clickoutside';

export default {
  computed: {
    ...mapGetters('common', ['allProductClassify']),
  },
  directives: {
    Clickoutside,
  },
  data() {
    return {
      visible: false,
      lv1ActiveItem: null,
    };
  },
  methods: {
    onLv1Mouseenter(it) {
      console.log('onLv1Mouseenter', it);
    },
    handleClose() {
      this.visible = false;
    },
    handleVisible() {
      this.visible = !this.visible;
    },
  },
  mounted() {
    console.log(this.allProductClassify);
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-ep-cascader-comp-popper-wrap {
  padding: 0;
  border: 1px solid #e4e7ed;
  .display-content {
    font-size: 14px;
    .el-scrollbar {
      .el-scrollbar__wrap {
        height: 204px;
        .el-scrollbar__view > ul {
          padding: 6px 0;
          > li {
            padding-left: 20px;
            padding-right: 30px;
            position: relative;
            height: 34px;
            > span.label {
              display: inline-block;
              padding: 5px 10px;
              line-height: 24px;
              width: 129px;
              box-sizing: border-box;
              overflow: hidden;
              white-space: nowrap;
            }
            > i.el-icon-arrow-right {
              position: absolute;
              right: 10px;
              top: 10px;
            }
            &:hover {
              cursor: pointer;
              background-color: lighten($color: $--color-primary, $amount: 40);
              color: $--color-primary;
              > span.label {
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
}
</style>
