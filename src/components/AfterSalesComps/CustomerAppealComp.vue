<template>
  <section class="customer-appeal-comp">
    <header class="title is-bold">客户诉求</header>
    <ul v-if="appealData">
      <li>
        <span class="label is-bold">问题：</span><span class="value is-bold">{{appealData?.QuestionTypeTitles.join('、')}}</span>
      </li>
      <li v-if="appealData.QuestionRemark">
        <span class="label is-bold">问题描述：</span><span class="value">{{appealData.QuestionRemark}}</span>
      </li>
      <li v-if="appealData.AppealContent">
        <span class="label is-bold">诉求：</span><span class="value is-pink is-bold">{{appealData.AppealContent}}</span>
      </li>
      <li v-if="appealData.Mobile">
        <span class="label is-bold">联系方式：</span><span class="value">{{appealData.Mobile}}</span>
      </li>
      <li v-if="appealData.QQ">
        <span class="label is-bold">QQ：</span><span class="value">
          <a v-if="appealData.QQ"
          :href="`tencent://message/?uin=${appealData.QQ}&amp;Site=名片之家&amp;Menu=yes`" class="details" style="padding:0">
            {{appealData.QQ}}
          </a>
          <span v-else></span>
        </span>
      </li>
      <li v-if="appealData.QuestionPics && appealData.QuestionPics.length">
        <span class="label is-bold">图片凭证：</span><span class="value">
          <div class="image-list">
            <!-- <el-image :preview-src-list="appealData.QuestionPics" :mpCloseViewer='closeViewer'
              v-for="(item, index) in appealData.QuestionPics" :key="index + item" :src="item" fit="cover" ></el-image> -->
            <ImageUploadComp :ImgList="appealData.QuestionPics" :limit='6' :disabled="true"
            :beforeUploadFun="beforeUpload"></ImageUploadComp>
          </div>
        </span>
      </li>
      <li v-if="SupplementalQuestionPics.length || appealData.Status === 10 || appealData.Status === 25">
        <span class="label is-bold">客服补充：</span><span class="value">
          <div class="image-list">
            <ImageUploadComp :ImgList="SupplementalQuestionPics" @UploadedSeccess="UploadedSeccess"
            @PictureDelete="PictureDelete" :limit='6' :disabled="appealData.Status === 30 || appealData.Status === 255"
            :beforeUploadFun="beforeUpload"></ImageUploadComp>
            <p class="is-origin" style="font-size: 12px;">（最多可补充6张图片，支持jpg/.jpep/.png/.gif/.bmp格式）</p>
          </div>
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ImageUploadComp from '@/components/common/UploadComp/ImageUploadComp.vue';
import { debounce } from '@/assets/js/utils/throttle';
import { Message } from 'element-ui';

export default {
  props: {
    appealData: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    ImageUploadComp,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {
      SupplementalQuestionPics: [],
      imgList: [],
    };
  },
  methods: {
    SupplementalPicAdd(picUrl) {
      this.api.getOrderAfterSaleSupplementalPicAdd({
        AfterSaleCode: this.appealData.AfterSaleCode,
        QuestionPics: picUrl,
      }).then(res => {
        if (res.data.Status === 1000 && res.data.Data && res.data.Data.length) {
          this.SupplementalQuestionPics.push(...res.data.Data);
        }
      });
    },
    SupplementalPicRemove(picUrl) {
      this.api.getOrderAfterSaleSupplementalPicRemove({
        AfterSaleCode: this.appealData.AfterSaleCode,
        QuestionPics: [picUrl],
      }).then(res => {
        if (res.data.Status === 1000) {
          this.SupplementalQuestionPics = this.SupplementalQuestionPics.filter(it => it !== picUrl);
        }
      });
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
    closeViewer() {},
    PicAdd() {
      this.SupplementalPicAdd(this.imgList);
      this.imgList = [];
    },
    UploadedSeccess(Url) {
      this.imgList.push(Url);
      this.debounceFnc();
    },
    PictureDelete(Url) {
      this.SupplementalPicRemove(Url);
    },
  },
  created() {
    this.debounceFnc = debounce(this.PicAdd, 100);
  },
  mounted() {
    if (
      this.appealData.SupplementalQuestionPics
      && this.appealData.SupplementalQuestionPics.length
    ) {
      this.SupplementalQuestionPics = this.appealData.SupplementalQuestionPics;
    }
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
    >li{
      display: flex;
      font-size: 14px;
      margin-top: 10px;
      line-height: 15px;
      >.value{
        flex: 1;
        >a{
          color: #26BCF9;
          cursor: pointer;
        }
      }
      .image-list{
        display: flex;
        flex-wrap: wrap;
        .el-image{
          width: 107px;
          height: 75px;
          border-radius: 4px;
          margin-right: 5px;
          margin-bottom: 10px;
          &:nth-child(3n){
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
