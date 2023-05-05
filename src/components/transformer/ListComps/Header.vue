<template>
  <header class="header">
    <p class="danger" v-if="!props.loading4Servers && props.convertServerList.length === 0">
      <i class="el-icon-warning mr-5"></i>
      <span class="ft-12">暂无转换器数据</span>
    </p>
    <el-radio-group v-else v-model="radio" size="mini" class="mp-radio-group">
      <el-radio-button v-for="it in props.convertServerList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio-button>
    </el-radio-group>
    <div v-if="classList.length > 0" class="box">
      <div class="left">
        <EpCascader
          showLine
          title="产品分类"
          :fiexdWidth="240"
          :list="classList"
          :defaultProps="{ID: 'ID',Name: 'ClassName',children: 'children'}"
          :level="2"
          v-model="EpCascaderProductValue"
        />
        <span class="blue-span" v-show="UserDetail&&UserDetail.PermissionList.PermissionManageConvert.Obj.Setup" @click="onClick(menuTypeEnum.log)">操作日志</span>
      </div>
      <div class="right" v-show="UserDetail && UserDetail.PermissionList.PermissionManageConvert.Obj.Setup">
        <mp-button type="primary" @click="onClick(menuTypeEnum.assist)">辅助文件映射</mp-button>
        <mp-button type="primary" @click="onClick(menuTypeEnum.makeup)">拼版文件映射</mp-button>
        <mp-button type="primary" @click="onClick(menuTypeEnum.color)">专色文件映射</mp-button>
        <mp-button type="primary" @click="onClick(menuTypeEnum.material)">物料映射</mp-button>
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { EpCascader } from '@/components/common/mpzj-sell-lib/lib';
import { TransformerListPageDataPlainType } from '@/pinia/modules/transformer/TransformerListPageDataClass';
import { computed } from 'vue';
import { menuTypeEnum } from '@/pinia/modules/transformer/types';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { IUser } from '@/pinia/modules/user/type';

const props = defineProps<{
  TransformerListPageData: TransformerListPageDataPlainType | null,
  convertServerList: SaleAndProductionListItemPlainType[]
  loading4Servers: boolean
  UserDetail: null | IUser
}>();

const emit = defineEmits(['changeServer', 'menuClick']);

const radio = computed({
  get() {
    return props.TransformerListPageData?.ServerID || '';
  },
  set(val) {
    if (val === props.TransformerListPageData?.ServerID) return;
    emit('changeServer', val);
  },
});

const classList = computed(() => {
  if (!props.TransformerListPageData) return [];
  return props.TransformerListPageData.productClassLevelList;
});

const EpCascaderProductValue = computed({
  get() {
    const list = [
      props.TransformerListPageData?.condition.FirstLevel,
      props.TransformerListPageData?.condition.SecondLevel,
    ];
    return list.filter(it => it || it === 0);
  },
  set(ids) {
    if (!props.TransformerListPageData) return;
    const [_First, _Second] = ids;
    const First = _First || _First === 0 ? _First : '';
    const Second = _Second || _Second === 0 ? _Second : '';
    props.TransformerListPageData.setCondtion([['FirstLevel'], First]);
    props.TransformerListPageData.setCondtion([['SecondLevel'], Second]);
    props.TransformerListPageData.getProductList();
  },
});

const onClick = (type: menuTypeEnum) => { emit('menuClick', type); };

</script>

<style scoped lang='scss'>
.header {
  min-height: 120px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  > .danger {
    line-height: 28px;
    height: 28px;
    color: #ff3769;
  }
  > .box {
    margin-top: 22px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    :deep(.mpzj-sell-lib-comps-ep-cascader-comp-wrap) {
      margin-right: 30px;
      > label {
        font-weight: 400;
      }
    }
    .blue-span {
      font-weight: 100;
      white-space: nowrap;
      margin-right: 10px;
      font-size: 14px;
    }
    > div {
      height: 100%;
      display: flex;
      align-items: flex-end;
      line-height: 25px;
      button {
        height: 30px;
        padding: 0 10px;
        & + .el-button {
          margin-left: 30px;
        }
      }
    }
  }
}
</style>
