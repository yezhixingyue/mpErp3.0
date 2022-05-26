<template>
    <div
      class="mp-phone-upload-comp-break-point-type-wrap out-btn"
      :class="showLoading || showProgress ? 'hide' : ''"
     >
      <input
        type="file"
        :multiple='multiple'
        :accept="accept"
        @change="onChange"
      />
      {{showTitle}}
      <div
        class="loading-box"
        @click="e => {e.stopPropagation(); return false;}"
        v-if="showLoading || showProgress"
       >
        <div v-if="showLoading">
          <i class="el-icon-loading"></i>
          <p>文件正在上传中...</p>
        </div>
        <div v-if="showProgress" class="progress-box">
          <p>正在上传中... </p>
          <el-progress stroke-linecap="square"
           :text-inside="true" :stroke-width="13" :percentage="percentageNum">
          </el-progress>
        </div>
      </div>
  </div>
</template>

<script>

import UploadFileByBreakPoint, { getUniqueFileName } from '@/assets/js/upload/UploadFileByBreakPoint';

export default { // 上传图片按钮
  props: {
    /**
     * 按钮内显示的文字
     */
    title: {
      type: String,
      default: '上传问题照片',
    },
    /**
     * 上传选择文件成功后的处理函数
     */
    successFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 上传选择文件失败后的处理函数
     */
    failFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 是否开启多选
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * 规定上传文件类型
     */
    accept: {
      type: String,
      // default: 'image/png,image/jpeg,image/gif,image/jpg,image/bmp',
      default: '*',
      // default: '.png,.jpeg,.gif,.jpg,.bmp',
      // default: '',
    },
    CustomerID: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      upLoadTitle: '',
      percentage: 0,
      showProgress: false,
      showLoading: false,
    };
  },
  computed: {
    showTitle() {
      if (!this.upLoadTitle) return this.title;
      return this.upLoadTitle;
    },
    percentageNum() {
      return +(+this.percentage).toFixed(1);
    },
  },
  methods: {
    onChange(data) {
      if (!this.multiple) { // 单个产品上传
        this.upLoadSingleFile(data.target.files[0]);
      } else if (this.multiple) { // 多产品上传
        // 暂未编写该功能
      }
    },
    async upLoadSingleFile(file) {
      if (!file) return;
      this.upLoadTitle = '读取中...';
      const _name = getUniqueFileName({ CustomerID: this.CustomerID, Terminal: 1, file });
      this.upLoadTitle = '解析完成,开始上传';
      if (file.size > 50 * 1024 * 1024) { // 文件大于50M显示进度条
        this.showProgress = true;
      } else {
        this.showLoading = true;
      }
      const onUploadProgressFunc = progress => {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(progress)) this.percentage = progress;
      };
      if (file && _name) {
        const key = await UploadFileByBreakPoint(file, _name, onUploadProgressFunc, 100);
        if (key) {
          // 上传成功
          this.successFunc(_name);
        } else {
          // 上传失败
          this.massageBox.failSingleError('文件上传失败', '抱歉，文件上传失败，请重试!', this.failFunc);
        }
        if (this.showProgress) this.showProgress = false;
        if (this.showLoading) this.showLoading = false;
        this.upLoadTitle = '';
        const oInput = document.querySelector('.mp-phone-upload-comp-break-point-type-wrap > input');
        oInput.value = '';
        this.percentage = 0;
      }
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-phone-upload-comp-break-point-type-wrap {
  width: 100px;
  height: 25px;
  background-color: $--color-primary;
  border: 1px solid $--color-primary;
  outline: none;
  font-size: 12px;
  border-radius: 2px;
  margin-right: 15px;
  // margin-top: 25px;
  user-select: none;
  display: inline-block;
  position: relative !important;
  color: #fff !important;
  text-align: center;
  line-height: 25px;
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  > input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    cursor: pointer;
  }
  > div.loading-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.7);
    z-index: 8888;
    > div {
      color: #428dfa;
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 14px;
      transform: translate(-50%, -135%);
      > i {
        font-size: 32px;
        margin-bottom: 10px;
      }
      &.progress-box {
        width: 780px;
        > p {
          text-align: left;
          margin-bottom: 10px;
          font-size: 16px;
          color: #26bcf9;
        }
        .el-progress-bar__inner {
          .el-progress-bar__innerText {
            vertical-align: top;
          }
          width: 0;
        }
      }
    }
  }
  &:hover {
    background-color: #009ef9;
    border-color: #009ef9;
  }
  &:active {
    background-color: #35dff9;
    border-color: #35dff9;
  }
  &.hide {
    &:hover {
      background-color: $--color-primary;
      border-color: $--color-primary;
    }
    &:active {
      background-color: $--color-primary;
      border-color: $--color-primary;
    }
  }
}
</style>
