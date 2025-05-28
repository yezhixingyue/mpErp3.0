<template>
  <CommonDialogComp
    width="660px"
    :visible.sync="localVisible"
    :submitText="localManageData && localManageData.loading ? '正在上传...' : '保存'"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog anew-upload-dialog"
    :class="{uploading: localManageData && localManageData.loading}"
    top="15vh"
  >
    <div class="main-area">
      <div class="header">
        <h2>上传文件/选择证书</h2>
      </div>

      <!-- 文件上传 -->
      <div class="upload-box">
        <div class="title">
          <div class="l">
            <h4>上传文件：</h4>
            <span class="remark">支持文件类型：{{ accept }}</span>
          </div>
          <span class="menu" v-show="fileList.length" @click="fileList = []">
            <img src="@/assets/images/clearFile-gray.png" alt="">
            <img class="active" src="@/assets/images/clearFile-pink.png" alt="">
            清空文件
          </span>
        </div>

        <div class="select-file-area">
          <MpFileUploader :accept="accept" multiple :width="610" :height="215" :fileList.sync="fileList" :disabled="localManageData?.loading">
            <ul v-if="localManageData">
              <QuestionFileComp v-for="it in localManageData.list" :key="it.key"
                :item="it"
                :listLoading="localManageData.loading"
                @change="(bool) => it.isPrintFile = bool"
              />
            </ul>
          </MpFileUploader>
        </div>
      </div>

      <!-- 证书选择 -->
      <div class="certificate-box" v-if="localManageData">
        <h4 v-if="localManageData.oldCertificateID">
          <span class="is-bold" style="width: 5em;text-align: right;">原证书：</span>
          <CertificateImgName :Name="localManageData.oldCertificateName" :CertificateItem="localManageData.oldCertificateItem" style="max-width: 550px;" />
        </h4>

        <div class="content">
          <span class="is-bold label"> {{ localManageData.oldCertificateID ? '修改证书' : '设置证书'}}：</span>
          <el-radio-group v-model="localManageData.useCertificate" style="position: relative;top: 1px;">
            <el-radio :label="false" style="margin-right: 20px;">无注册商标</el-radio>
            <el-radio :label="true">带注册商标</el-radio>
          </el-radio-group>
          <div v-show="localManageData.useCertificate" style="margin-left: 30px;">
            <span class="blue-span underline btn" :class="{active:!!localManageData.newCertificateID}" @click="selectVisible=true">
            <i class="el-icon-circle-check"></i>{{ localManageData.oldCertificateID ? '重新选择证书' : '选择证书'}}</span>
            <template v-if="localManageData.newCertificateID">
              <CertificateImgName :CertificateItem="localManageData.newCertificate" style="margin-right: 10px;max-width: 165px;" />
              <span class="clear blue-span" @click="clear">清除</span>
            </template>
            <span v-else-if="localManageData.oldCertificateID" style="font-size: 12px;color: #aaa;">( <i class="el-icon-info ft-14"></i> 不重新选择则保持原证书不变 )</span>
          </div>
        </div>

        <CertificateSelectDialog
         :id.sync="localManageData.newCertificateID"
         :visible.sync="selectVisible"
         :CertificateList="localManageData.CertificateList"
         :CertificateTypeList="CertificateTypeList"
         @refresh="() => localManageData.getCustomerCertificateAll()"
         />
      </div>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import MpFileUploader from '@/components/common/NewComps/MpFileUploader/MpFileUploader.vue';
import { QuestionManageCLass } from './QuestionManageCLass';
import QuestionFileComp from './QuestionFileComp.vue';
import CertificateSelectDialog from './CertificateSelectDialog.vue';
import { ICertificate } from './type';
import CertificateImgName from './CertificateImgName.vue';

const props = defineProps<{
  visible: boolean,
  CustomerID: string,
  CertificateID: string,
  CertificateList: ICertificate[]
  CertificateTypeList: { label: string, value: '' | number }[]
  handerFunc:(args) => Promise<boolean>
}>();

const emit = defineEmits(['update:visible', 'setCertificateList']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const accept = '.jpg,.jpeg,.png,.cdr,.pdf,.ai,.zip,.rar,.7z';

const localManageData = ref<QuestionManageCLass | null>(null);

const fileList = computed({
  get() {
    return localManageData.value?.list.map(it => it.file) || [];
  },
  set(list: File[]) {
    if (localManageData.value?.loading) return;
    localManageData.value.updateFileList(list);
  },
});

const onOpen = () => {
  const refreshcb = (list: ICertificate[]) => {
    emit('setCertificateList', list);
  };
  localManageData.value = new QuestionManageCLass([], props.CustomerID, props.CertificateID, props.CertificateList, refreshcb);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
};

const selectVisible = ref(false);

const clear = () => {
  localManageData.value.newCertificateID = '';
};

const submit = () => {
  if (!props.CustomerID || !localManageData.value) return;

  localManageData.value.submit(props.handerFunc, cancel);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog.anew-upload-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }
  :deep(.el-dialog__body) {
    height: 340px;
    padding: 20px 25px;

    .main-area {
      color: #444;
      > .header {
        text-align: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 16px;
        user-select: none;
        h2 {
          font-weight: 700;
          font-size: 16px;
        }
      }

      > .upload-box {
        > .title {
          display: flex;
          align-items: center;
          line-height: 18px;
          padding-top: 15px;
          padding-bottom: 12px;

          .l {
            flex: 1;
            overflow: hidden;
            display: flex;
            align-items: center;

            h4 {
              font-weight: 700;
              flex: none;
              // &::before {
              //   content: '*';
              //   display: inline-block;
              //   color: #ff3769;
              // }
            }
            .remark {
              color: #888;
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .menu {
            flex: none;
            padding-left: 20px;
            cursor: pointer;
            user-select: none;
            img {
              vertical-align: -2px;

              &.active {
                display: none;
              }
            }
            font-size: 12px;
            color: #aaa;

            &:hover {
              img {
                display: none;
                &.active {
                  display: inline;
                }
              }
              color: #ff3769;
            }
          }
        }
      }

      > .certificate-box {
        padding-top: 20px;

        .content {
          padding-top: 10px;
          // padding-left: 5em;
          line-height: 15px;

          .btn {
            margin-right: 20px;
            i {
              margin-right: 4px;
              display: none;
            }

            &::after {
              bottom: -1px;
            }

            &.active {
              i {
                display: inline-block;
              }
              &::after {
                left: 17px;
              }
            }
          }

          .clear {
            font-size: 12px;
            position: relative;
            top: -1px;
          }
        }

        > h4, > div {
          display: flex;
          align-items: center;
          > span {
            flex: none;
          }
          .text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .content .text {
          flex: 0 1 auto;
          margin-right: 10px;
        }
      }
    }
  }

  &.uploading {
    :deep(.el-dialog) {
      user-select: none;
      // pointer-events: none;

      &::after {
        // content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba($color: #fff, $alpha: 0.1);
        z-index: 9;
      }

      .el-dialog__footer, .menu {
        pointer-events: none;
      }
    }
  }
}
</style>
