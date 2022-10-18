<template>
  <CommonDialogComp
    width="620px"
    :title="title"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submitForm"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <el-form :model="ruleForm" :rules="rules" hide-required-asterisk ref="oForm" label-width="0px" class="adapter-ruleForm" v-if="ruleForm" size="small">
      <el-form-item prop="Name" class="n">
        <span class="title">转换器名称：</span>
        <el-input v-model.trim="ruleForm.Name" autocomplete="off" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="SellSide.ID" class="r">
        <h4 class="title">销售端：</h4>
        <el-radio-group v-model="ruleForm.SellSide.ID">
          <el-radio v-for="it in sellServers" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="FactorySide.ID" class="r">
        <h4 class="title">生产端：</h4>
        <el-radio-group v-model="ruleForm.FactorySide.ID">
          <el-radio v-for="it in productionServers" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <p class="tip-box warning ft-12">
      <i class="el-icon-warning ft-14"></i>
      <span>注: 转换器一经创建后，便不能修改销售端和生产端，仅可编辑转换器名称</span>
      <span>删除转换器时，该转换器不能包含任何转换设置的数据（已转换的订单除外），否则删除失败</span>
    </p>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { SwitchListItemClass } from '@/views/serverManage/utils/SwitchListItemClass';
import { SwitchPageDataClassType } from '@/views/serverManage/utils/SwitchPageDataClassType';
import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import { Form } from 'element-ui';
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';

const props = defineProps<{
  pageTypeData: SwitchPageDataClassType
}>();

const title = computed(() => {
  const o = props.pageTypeData.curEditItem ? '编辑' : '添加';
  return `${o}转换器`;
});

const localVisible = computed({
  get() {
    return props.pageTypeData.visible;
  },
  set(val) {
    props.pageTypeData.setVisible(val);
  },
});

const oForm = ref<InstanceType<typeof Form>>();

const ruleForm = ref<null | SwitchListItemClass>(null);

const validateNameRepeat = (rule: unknown, value: string, callback: (arg0?: Error) => void) => {
  const t = props.pageTypeData.list.find(it => ruleForm.value && it.ID !== ruleForm.value.ID && it.Name === value);
  if (t) {
    callback(new Error('转换器名称重复，请检查'));
  } else {
    callback();
  }
};

const validateGroupRepeat = (rule: unknown, value: number, callback: (arg0?: Error) => void) => {
  const t = props.pageTypeData.list.find(it => ruleForm.value
   && it.ID !== ruleForm.value.ID && it.FactorySide.ID === value && it.SellSide.ID === ruleForm.value.SellSide.ID);
  if (t) {
    callback(new Error('已存在相同销售端-生产端组合'));
  } else {
    callback();
  }
};

const validateSellSide = (rule: unknown, value: number, callback: (arg0?: Error) => void) => {
  if (oForm.value) oForm.value.validateField('FactorySide.ID');
  callback();
};

const rules = {
  Name: [
    { required: true, message: '请输入转换器名称', trigger: 'change' },
    { validator: validateNameRepeat, trigger: 'change' },
  ],
  SellSide: {
    ID: [
      { required: true, message: '请选择销售端', trigger: 'change' },
      { validator: validateSellSide, trigger: 'change' },
    ],
  },
  FactorySide: {
    ID: [
      { required: true, message: '请选择生产端', trigger: 'change' },
      { validator: validateGroupRepeat, trigger: 'change' }, // 此处判断组合是否重新
    ],
  },
};

const serverList = ref<SaleAndProductionListItemPlainType[]>([]);

const sellServers = computed(() => serverList.value.filter(it => it.Type === ServerTypeEnum.sales));

const productionServers = computed(() => serverList.value.filter(it => it.Type === ServerTypeEnum.production));

const onOpen = async () => {
  ruleForm.value = new SwitchListItemClass(props.pageTypeData.curEditItem || undefined);
  const resp = await api.getServerList(undefined).catch(() => null);
  if (resp?.data.Status === 1000) {
    serverList.value = resp.data.Data;
  }
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  ruleForm.value = null;
};

const submitForm = () => {
  if (!oForm.value) return;
  oForm.value.validate(async (valid) => {
    if (valid && ruleForm.value) {
      // 此处更新销售和生产端Name值
      const t1 = sellServers.value.find(it => it.ID === ruleForm.value?.SellSide.ID);
      if (t1) {
        ruleForm.value.SellSide.Name = t1.Name;
      }
      const t2 = productionServers.value.find(it => it.ID === ruleForm.value?.FactorySide.ID);
      if (t2) {
        ruleForm.value.FactorySide.Name = t2.Name;
      }
      const result = await ruleForm.value.save();
      if (result) {
        props.pageTypeData.handleItemChange({ ...ruleForm.value });
      }
    }
  });
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding: 30px 50px;
    .el-form-item__label {
      display: none;
    }
    .tip-box {
      padding-left: 26px;
      position: relative;
      margin-top: 35px;
      margin-bottom: 10px;
      > i {
        position: absolute;
        top: 3px;
        left: 5px;
      }
      > span {
        display: block;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      }
    }
    .adapter-ruleForm {
      margin-left: 50px;
      .n {
        .el-input {
          width: 320px;
          height: 30px;
          input {
            height: 30px;
            font-size: 13px;
          }
        }
        span.title {
          font-size: 12px;
          color: #888E99;
          margin-right: 5px;
        }
        .el-form-item__error {
          margin-left: 78px;
        }
      }
      .r {
        h4.title {
          color: #444;
          margin-bottom: 4px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
        }
        .el-radio-group {
          @include scroll;
          max-height: 64px;
          overflow: auto;
          > label {
            margin-bottom: 5px;
            margin-right: 10px;
            .el-radio__label {
              width: 10em;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              // vertical-align: -1px;
            }
          }
        }
      }
    }
  }
}
</style>
