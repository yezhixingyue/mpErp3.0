<template>
  <CommonDialogComp
    width="741px"
    :visible.sync="localVisible"
    appendBody
    title="选择证书"
    submitText="确定"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog c-select-dialog"
    top="14vh"
  >
    <div class="main">
      <div class="header">
        <!-- 搜索名称 -->
        <div>
          <span class="label">搜索名称：</span>
          <el-input class="inp" clearable v-model.trim="Condition.Keywords" maxlength="20" size="mini"></el-input>
        </div>

        <!-- 证书类型 -->
        <div>
          <span class="label">证书类型：</span>
          <el-select class="select" v-model="Condition.Type" placeholder="" size="mini">
            <el-option v-for="item in CertificateTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <!-- 刷新按钮 -->
        <div class="blue-span refresh" @click="onRefreshClick">
          <i class="el-icon-refresh ft-15 is-bold mr-4"></i>
          <span class="ft-14">刷新</span>
        </div>
      </div>

      <!-- 列表表格部分 -->
      <div class="content">
        <table>
          <thead>
            <tr>
              <th style="width: 181px;">名称</th>
              <th style="width: 146px;">类型</th>
              <th style="width: 131px;">有效期</th>
              <th style="width: 211px;">缩略图</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="it in localCertificateList" :key="it.CertificateID">
              <!-- 名称 -->
              <td>
                <div class="radio">
                  <el-radio v-model="localValue" :label="it.CertificateID" :title="it.CertificateName">{{ it.CertificateName }}</el-radio>
                </div>
              </td>

              <!-- 类型 -->
              <td>
                <div class="type">{{ getNameFromListByIDs(it.CertificateType, CertificateTypeList, { label: 'label', value: 'value' }) }}</div>
              </td>

              <!-- 有效期 -->
              <td>
                <div class="expire" v-if="it.Expire">至{{ it.Expire.slice(0, 10) }}</div>
              </td>

              <!-- 缩略图 -->
              <td>
                <div class="imgs">
                  <el-image v-for="pic in it.CertificatePics" :key="pic" :src="pic" :preview-src-list="it.CertificatePics"></el-image>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { getNameFromListByIDs } from '@/assets/js/utils/util';
import { ICertificate } from './type';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  visible: boolean,
  CertificateList: ICertificate[]
  CertificateTypeList: { label: string, value: '' | number }[]
  id: string
}>();

const emit = defineEmits(['update:visible', 'update:id', 'refresh']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

/** 证书筛选条件 */
const Condition = ref<{ Keywords: string, Type: '' | number }>({ Keywords: '', Type: '' });
const localValue = ref('');
const onOpen = () => {
  Condition.value = { Keywords: '', Type: '' };
  localValue.value = props.id;

  if (props.CertificateList.length === 0) {
    onRefreshClick();
  }
};

/** 筛选后的证书列表 */
const localCertificateList = computed(() => {
  const { Keywords, Type } = Condition.value;

  const list1 = props.CertificateList.filter(it => it.CertificateName.includes(Keywords)); // 第一步筛查

  const list2 = Type === '' ? list1 : list1.filter(it => it.CertificateType === Type);

  // 筛选掉不要的状态

  return list2.filter(it => it.CertificateStatus !== 0 && it.CheckStatus !== 2);
});

const onRefreshClick = () => {
  emit('refresh');
  Condition.value = { Keywords: '', Type: '' };
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
};

const submit = () => {
  if (!localValue.value) {
    MpMessage.error({
      title: '请选择证书',
    });
    return;
  }
  emit('update:id', localValue.value);
  cancel();
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog.c-select-dialog {
  :deep(.el-dialog__body) {
    height: 380px;
    padding: 20px 25px;

    .main {
      > .header {
        display: flex;
        align-items: center;
        padding-bottom: 20px;

        > div {
          display: flex;
          align-items: center;
          font-size: 14px;
          .label {
            color: #888;
          }

          .inp, .select {
            margin-right: 30px;
            width: 160px;
            input {
              height: 30px;
              line-height: 30px;
              border-radius: 2px;
              font-size: 13px;
            }
          }
        }

      }

      > .content {
        height: 320px;
        overflow: auto;
        overflow: overlay;
      }

      table {
        font-size: 12px;
        border-collapse: collapse;
        color: #444;

        thead {
          position: sticky;
          top: 0;
          z-index: 9;
          box-sizing: border-box;
          &::before {
            content: '';
            height: 1px;
            background-color: #e5e5e5;
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
          }
        }

        th {
          border: 1px solid #e5e5e5;
          line-height: 36px;
          font-size: 14px;
          font-weight: 700;
          background-color: #f5f5f5;
        }

        td {
          padding: 7px 5px;
          height: 40px;
          box-sizing: border-box;
          border: 1px solid #e5e5e5;
          vertical-align: middle;
        }

        .radio {
          width: 170px;
          box-sizing: border-box;
          padding: 0 10px;
          > label {
            width: 100%;
            display: flex;
            align-items: center;
            > span {
              flex: none;
              &:first-of-type {
                position: relative;
                top: 1px;
              }
              &:last-of-type {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }

        .type {
          width: 135px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .expire {
          width: 120px;
          text-align: center;
        }

        .imgs {
          width: 200px;
          box-sizing: border-box;
          padding-left: 30px;
          height: 40px;
          > div {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            img {
              object-fit: cover;
            }
          }
        }
      }
    }

  }
}
</style>
