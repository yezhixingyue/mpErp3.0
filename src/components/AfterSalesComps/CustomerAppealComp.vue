<template>
  <section class="customer-appeal-comp">
    <header class="title is-bold">客户诉求</header>
    <ul>
      <li>
        <span class="label is-bold">问题：</span><span class="value is-bold">湿货、生产质量问题、材料质量问题、晚货</span>
      </li>
      <li>
        <span class="label is-bold">问题描述：</span><span class="value">后宫编号重复，客户4月28日摇号，同时出现两次重复奖项，客户要求赔偿礼品损失</span>
      </li>
      <li>
        <span class="label is-bold">诉求：</span><span class="value is-pink is-bold">后宫编号重复</span>
      </li>
      <li>
        <span class="label is-bold">联系方式：</span><span class="value">18645678456</span>
      </li>
      <li>
        <span class="label is-bold">QQ：</span><span class="value">
          <a v-if="519851418"
          :href="`tencent://message/?uin=${519851418}&amp;Site=名片之家&amp;Menu=yes`" class="details" style="padding:0">
            {{519851418}}
          </a>
          <span v-else></span>
        </span>
      </li>
      <li>
        <span class="label is-bold">图片凭证：</span><span class="value">
          <div class="image-list">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
          </div>
        </span>
      </li>
      <li>
        <span class="label is-bold">客服补充：</span><span class="value">
          <div class="image-list QuestionPicList">
            <el-upload
              :action="'/Api/Upload/Image?type=3'"
              list-type="picture-card"
              ref="upload"
              drag
              accept='.png,.jpeg,.jpg,.bmp,.gif'
              :multiple='true'
              :limit='9'
              :on-success='handllePictureUploaded'
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload='beforeUpload'
              :class="{'uploadDisabled':uploadDisabled}"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },

  components: {
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
    };
  },
  methods: {
    handllePictureUploaded(response) {
      if (response.Status !== 1000) {
        Message({
          showClose: true,
          message: response.Message,
          type: 'error',
        });
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.response && it.response.Status === 1000);
      }
      this.$refs.ruleForm1.validateField('QuestionPicList');
      this.setUploadDisabled();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    setUploadDisabled() {
      const _list = this.$refs.upload?.uploadFiles?.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if ((!_list) || _list.length < 9) {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
    },
    handleRemove() {
      this.setUploadDisabled();
      this.$refs.ruleForm1.validateField('QuestionPicList');
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        Message({
          showClose: true,
          message: '文件过大，上传失败',
          type: 'error',
        });
      }
      return isLt15M;
    },
  },
  mounted() {

  },
};
</script>

<style lang='scss'>
.customer-appeal-comp {
  padding-left: 20px;
  width: 453px;
  box-sizing: border-box;
  padding-right: 32px;
  >.title{
    font-size: 16px;
    line-height: 20px;
    margin-top: 10px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: "";
      display: inline-block;
      height: 14px;
      width: 3px;
      position: absolute;
      left: -8px;
      top: 3px;
      background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
    }
  }
  >ul{
    li{
      display: flex;
      font-size: 12px;
      margin-top: 10px;
      line-height: 15px;
      >.value{
        flex: 1;
      }
      .image-list{
        display: flex;
        flex-wrap: wrap;
        img{
          width: 107px;
          height: 75px;
          border-radius: 4px;
          margin-right: 10px;
          margin-bottom: 10px;
          &:nth-child(3n){
            margin-right: 0;
          }
        }
      }
      .QuestionPicList{
        .uploadDisabled{
          >.el-upload--picture-card{
            display:none
          }
        }
        .el-icon-close-tip{
          display: none;
          width: 0;
          height: 0;
          overflow: hidden;
        }
        .el-form-item__error{
          top: calc(100% - 95px);
        }
        .upload-Remark{
          line-height: 1.3em;
        }
        .el-upload{
          width: 107px;
          height: 75px;
          margin-bottom: 23px;
        }
        .el-upload-list__item-thumbnail {
          object-fit: cover;
        }
        .el-upload-list{
          .el-upload-list__item{
            width: 107px;
            height: 75px;

          }
        }

        .el-upload-dragger {
          width: 100%;
          height: 100%;
          border: none;
          // line-height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .is-disabled + .el-upload {
          display: none;
        }
      }
    }
  }
}
</style>
