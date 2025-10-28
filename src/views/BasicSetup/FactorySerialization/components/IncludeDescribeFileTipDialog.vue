<template>
  <CommonDialogComp width="465px" title="生产需求序列化设置" :visible.sync="localVisible" class="dialog" @cancle="close"
   hideHeader :showSubmit="false" cancelText="确定" top="18vh">
    <div class="content">
      <div class="title">
        <img src="@/assets/images/success.png" alt="">
        <div>
          <h2>{{ title }}</h2>
          <p>{{ ProductName }}</p>
        </div>
      </div>

      <div class="tips-box">
        <p>说明：1. 审稿无送出文件订单，无论是否设置均会生成文档。</p>
        <p style="margin-left: 3em;">2. 选中“生成文档“下载文件名上不再体现“生产序列化设置”内容，仅将“订单信息序列化设置”内容作为文件名。</p>
      </div>
    </div>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed } from 'vue';

const props = defineProps<{
  visible: boolean
  title: string
  ProductName: string
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

const close = () => {
  localVisible.value = false;
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';

.dialog {
  .content {
    margin-top: 26px;
    padding-left: 15px;
    padding-right: 10px;
    margin-bottom: -10px;
    min-height: 125px;

    .title {
      display: flex;
      min-height: 85px;

      > img {
        flex: none;
        margin-right: 15px;
        margin-left: 45px;
        width: 36px;
        height: 36px;
      }

      > div {
        flex: 1;
        overflow: hidden;

        h2 {
          font-size: 20px;
          color: #444;
          font-weight: 700;
          margin-bottom: 10px;
        }

        p {
          font-size: 13px;
        }
      }
    }

    .tips-box {
      width: 400px;
      background-color: #fff;
      font-size: 13px;
      margin-left: 5px;
      line-height: 16px;

      p {
        margin-bottom: 6px;
        text-indent: -1.15em;
        letter-spacing: 0.2px;
      }
    }
  }
}
</style>
