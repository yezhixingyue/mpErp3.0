<template>
  <CommonDialogComp
    width="660px"
    :visible.sync="localVisible"
    :submitText="localFileListData && localFileListData.loading ? '正在上传...' : '确定'"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog anew-upload-dialog"
    :class="{uploading: localFileListData && localFileListData.loading}"
    top="20vh"
  >
    <div class="main-area">
      <div class="header">
        <h2>上传文件/选择证书</h2>
      </div>

      <div class="content">
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
          <MpFileUploader :accept="accept" multiple :width="610" :height="215" :fileList.sync="fileList" :disabled="localFileListData?.loading">
            <ul v-if="localFileListData">
              <QuestionFileComp v-for="it in localFileListData.list" :key="it.key"
                :item="it"
                :listLoading="localFileListData.loading"
                @change="(bool) => it.isPrintFile = bool"
              />
            </ul>
          </MpFileUploader>
        </div>
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
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  visible: boolean,
  CustomerID: string,
  handerFunc:(args: unknown[]) => Promise<boolean>
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const accept = '.jpg,.jpeg,.png,.cdr,.pdf,.ai,.zip,.rar,.7z';

const localFileListData = ref<QuestionManageCLass | null>(null);

const fileList = computed({
  get() {
    return localFileListData.value?.list.map(it => it.file) || [];
  },
  set(list: File[]) {
    if (localFileListData.value?.loading) return;
    localFileListData.value.updateFileList(list);
  },
});

const onOpen = () => {
  localFileListData.value = new QuestionManageCLass([], props.CustomerID, '');
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
};

const submit = () => {
  if (!props.CustomerID) return;

  if (!localFileListData.value || localFileListData.value.list.length === 0) {
    MpMessage.error({ title: '请先上传文件' });
    return;
  }

  localFileListData.value.submit(props.handerFunc, cancel);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog.anew-upload-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }
  :deep(.el-dialog__body) {
    height: 280px;
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

      > .content {
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
              &::before {
                content: '*';
                display: inline-block;
                color: #ff3769;
              }
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
    }
  }

  &.uploading {
    color: red;

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
