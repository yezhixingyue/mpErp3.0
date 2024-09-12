<template>
  <ul class="image-upload-comp">
    <li v-for="img in ImgList" :key="img">
      <div class="model-box">
        <div @click="onPreview(img)" style="width: 100%; height: 100%; text-align: center;">
          <i class="el-icon-zoom-in"></i> 查看
        </div>
        <i v-if="!disabled" class="el-icon-close" @click="onDelete(img)"></i>
      </div>
      <el-image :src="img" fit="cover" ></el-image>
    </li>
    <li v-if="limit - ImgList.length && !disabled">
      <el-upload
        class="upload-demo"
        :action="'/Api/Upload/Image?type=3'"
        multiple
        :disabled="false"
        :limit="limit"
        accept='.png,.jpeg,.jpg,.bmp'
        :on-success='handllePictureUploaded'
        :on-error='() => loadding = false'
        :before-upload="beforeUpload">
        <i class="el-icon-loading" v-if="loadding"></i>
        <i class="el-icon-plus" v-else></i>
      </el-upload>
    </li>
    <el-image-viewer
      style="z-index: 3050;"
      v-if="showViewer"
      :on-close="() => showViewer = false"
      :url-list="PreviewSrc"
    />
  </ul>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

export default {
  props: {
    ImgList: {
      type: Array,
      default: () => ([]),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 6,
    },
    beforeUploadFun: {
      type: Function,
      default: () => true,
    },
  },
  components: {
    ElImageViewer,
  },
  computed: {
    getlimit() {
      return this.limit - this.ImgList.length;
    },
  },
  data() {
    return {
      loadding: false,
      showViewer: false,
      PreviewSrc: [],
    };
  },
  methods: {
    handllePictureUploaded(e) {
      this.loadding = false;
      if (e.Status === 1000) {
        if (this.limit - this.ImgList.length) {
          this.$emit('UploadedSeccess', e.Data.Url);
        } else {
          this.messageBox.failSingleError('上传失败', '您最多只能补充6张图片');
        }
      } else {
        this.messageBox.failSingleError('上传失败', e.Message);
      }
    },
    beforeUpload(e) {
      const bool = this.beforeUploadFun(e);
      if (bool) {
        this.loadding = true;
      }
      return bool;
    },
    onDelete(url) {
      this.$emit('PictureDelete', url);
    },
    onPreview(url) {
      const index = this.ImgList.findIndex(it => it === url);
      this.PreviewSrc = [...this.ImgList.slice(index), ...this.ImgList.slice(0, index)];
      this.showViewer = true;
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.image-upload-comp{
  display: flex;
  flex-wrap: wrap;
  >li{
    border-radius: 4px;
    margin: 0 10px 10px 0;
    position: relative;
    width: 107px;
    height: 75px;
    border-radius: 4px;
    margin-right: 5px;
    margin-bottom: 10px;
    // overflow: hidden;
    .el-image{
      width: 100%;
      height: 100%;
    }
    .upload-demo{
      display: flex;
      height: 100%;
      width: 100%;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      box-sizing: border-box;
      .el-upload{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-upload-list{
        display: none;
      }
    }
    &:nth-child(3n){
      margin-right: 0;
    }
    &:hover{
      >.model-box{
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
        >i{
          display: inline;
          opacity: 1;
        }
      }
    }
    >.model-box{
      transition: all 0.2s;
      z-index: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
      >div{
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      i{
        font-size: 20px;
        padding: 5px;
      }
      >i{
        transition: all 0.2s;
        position: absolute;
        padding: 0;
        right: -7px;
        top: -7px;
        z-index: 2;
        padding: 0;
        border-radius: 50%;
        font-size: 14px;
        display: none;
        background-color: #FF003A;
        color: #FFFFFF;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        cursor: pointer;
        opacity: 0;
      }
    }
  }
}
</style>
