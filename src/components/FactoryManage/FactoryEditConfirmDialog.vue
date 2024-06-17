<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    hideHeader
    class="dialog"
    @submit="submit"
    @cancle="cancel"
    top="20vh"
  >
   <div class="content" v-if="editData">
    <div v-if="toChecked">
      <h2 class="ellipsis">{{ editData.FactoryName }}</h2>
      <h4>将变更为“订单自动对接”工厂，</h4>
      <h4>已设置的<i class="is-pink">“外购价格、生产需求”将会失效</i></h4>
    </div>
    <div v-else>
      <h2 class="blueness">
        <i class="iconfont icon-jiedangongchangda"></i>
        <span class="ellipsis">{{ editData.FactoryName }}</span>
      </h2>
      <h4>将变更为未ERP对接工厂，</h4>
      <h4> <i class="is-pink">订单将不会再自动对接</i>给{{ editData.FactoryName }}</h4>
    </div>
   </div>
   <template #footer>
    <div class="footer">
      <p>请确认是否继续执行！！！</p>
      <div class="btns">
        <Button class="blue" @click="submit">确定</Button>
        <Button type="primary" class="is-blue-button linear-reverse" @click="cancel">取消</Button>
      </div>
    </div>
   </template>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp, Button } from '@/components/common/mpzj-sell-lib/lib';
import { computed } from 'vue';
import FactoryClass from './FactoryClass';

const props = defineProps<{
  visible: boolean
  editData: FactoryClass // 待保存的编辑数据
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const toChecked = computed(() => !!props.editData?.Convert?.ID);

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  emit('submit');
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';
.dialog {

  :deep(.el-dialog__body) {
    .content {
      margin-top: 10px;
      text-align: center;
      color: #444;

      .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      h2 {
        font-size: 18px;
        font-weight: 700;
        padding-top: 5px;
        padding-bottom: 12px;

        &.blueness {
          color: #26bcf9;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          i {
            font-size: 32px;
            font-weight: 400;
            margin-right: 6px;
            flex: none;
          }
          span {
            flex: 0 1 auto;
            position: relative;
            padding-bottom: 4px;
            &::after {
              content: '';
              left: 0;
              right: 0;
              bottom: 0;
              height: 1px;
              background-color: #26bcf9;
              position: absolute;
            }
          }
        }
      }

      h4 {
        font-weight: 700;
        line-height: 22px;
      }
    }
  }

  .footer {
    margin-bottom: 5px !important;
    p {
      text-align: center;
      color: #F4A307;
      margin-bottom: 12px;
      margin-top: -8px;
      font-size: 14px;
    }
    button {
      width: 120px;
      height: 35px;
      border-radius: 4px;
      vertical-align: top;
      margin: 0 15px;
      padding: 0;
    }
  }
}
</style>
