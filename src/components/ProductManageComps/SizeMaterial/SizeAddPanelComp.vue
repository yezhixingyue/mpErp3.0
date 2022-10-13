<template>
  <div class="mp-erp-comps-pruduct-module-general-size-set-dialog-size-add-panel-comp-wrap">
    <p class="btn-box">
      <el-button size="mini" class="border-blue-btn" @click="onAddClick">+ 添加一行</el-button>
    </p>
    <div v-if="ElementList.length > 0">
      <div class="header">
        <span style="width:150px;padding-right: 6px;" v-if="!hiddenName">名称</span>
        <div>
          <span :style="`width:${autoWidth}`" v-for="it in ElementList" :key="it.ID" :title="it.Name">{{it.Name}}<i v-if="it.Unit">（{{it.Unit}}）</i></span>
        </div>
        <span style="width:90px" v-if="!hiddenCustomerSet">客户隐藏</span>
        <span style="width:210px">操作</span>
      </div>
      <ul>
        <li class="content-item" v-for="(item, index) in SizeList" :key="item.key || item.ID" >
          <el-input v-if="!hiddenName" v-model.trim="item.Name" maxlength="30" size="small" class="name"></el-input>
          <ul class="flex-content">
            <li :style="`width:${autoWidth}`" v-for="(it,i) in ElementList" :key="it.ID">
              <NumberTypeItemComp
                v-if="it.Type === 1"
                v-model="item.List[i].Second"
               InputContent=''
               :Allow='it.NumbericAttribute.Allow' />
              <OptionTypeItemComp
               v-if="it.Type === 2"
               v-model="item.List[i].Second"
               :options='it.OptionAttribute.OptionList'
               :Allow='it.OptionAttribute.Allow'
               :canRadio='false' />
            </li>
          </ul>
          <el-checkbox v-model="item.HiddenToCustomer" v-if="!hiddenCustomerSet">隐藏</el-checkbox>
          <div class="ctrl">
            <span class="del-btn" @click="onItemRemove(index)"><i></i> 删除</span>
            <div v-if="!hiddenSort">
              <span v-show="index < SizeList.length - 1" @click="onOptionMove('down', index)"><i class="el-icon-bottom"></i> 下移</span>
            </div>
            <div v-if="!hiddenSort">
              <span v-show="index > 0" @click="onOptionMove('up', index)"><i class="el-icon-top"></i> 上移</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NumberTypeItemComp from '@/components/common/ElementDisplayTypeComps/NumberTypeItemComp.vue';
import OptionTypeItemComp from '@/components/common/ElementDisplayTypeComps/OptionTypeItemComp.vue';
import { elementValChecker } from '@/assets/js/checker';
import { normalNameReg } from '@/assets/js/utils/regexp';

export default {
  props: {
    Elements: {
      type: Array,
      default: () => [],
    },
    List: {
      type: Array,
      default: () => [],
    },
    sizeTemp: {
      type: Object,
      default: null,
    },
    hiddenName: {
      type: Boolean,
      default: false,
    },
    hiddenSort: {
      type: Boolean,
      default: false,
    },
    hiddenCustomerSet: {
      type: Boolean,
      default: false,
    },
    canEmpty: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NumberTypeItemComp,
    OptionTypeItemComp,
  },
  computed: {
    autoWidth() {
      if (this.ElementList.length === 0) return '100%';
      return `${100 / this.ElementList.length}%`;
    },
  },
  data() {
    return {
      SizeList: [],
      ElementList: [],
      sizeTemplate: null,
    };
  },
  methods: {
    onSubmit() {
      if (this.SizeList.length === 0 && !this.canEmpty) return this.setErrorAndReturn('至少需设置一行固定尺寸');
      let i;
      if (!this.hiddenName) {
        i = this.SizeList.findIndex(it => !it.Name);
        if (i > -1) return this.setErrorAndReturn(`第${i + 1}行未设置名称`);

        i = this.SizeList.findIndex(it => !normalNameReg.test(it.Name));
        if (i > -1) return this.setErrorAndReturn(`第${i + 1}行名称不正确，名称仅支持中文、英文(全角/半角)、+-_(全角/半角)、数字(全角/半角)`);

        const names = this.SizeList.map(it => it.Name);
        if (names.length > [...new Set(names)].length) return this.setErrorAndReturn('存在重复名称，请检查');
      }

      for (let index = 0; index < this.SizeList.length; index += 1) {
        const { List } = this.SizeList[index];
        for (let index2 = 0; index2 < List.length; index2 += 1) {
          const { First, Second } = List[index2];
          const element = this.ElementList.find(({ ID }) => First === ID);
          if (element) {
            const { result, msg } = elementValChecker(Second, element);
            if (!result) return this.setErrorAndReturn(`第${index + 1}行${element.Name}${msg}`);
          }
        }
      }
      const eleStrs = this.SizeList.map(it => it.List).map(list => list.map(({ Second }) => Second).join(''));
      if (eleStrs.length > [...new Set(eleStrs)].length) return this.setErrorAndReturn('存在设置项重复，请检查');
      // this.$emit('submit', this.SizeList);
      return this.SizeList;
    },
    setErrorAndReturn(msg) {
      this.messageBox.failSingleError('保存失败', msg);
      return false;
    },
    onAddClick() {
      const _temp = JSON.parse(JSON.stringify(this.sizeTemplate));
      const Index = this.SizeList.length;
      const key = Math.random().toString(36).slice(-10);
      const item = { ..._temp, Index, key };
      this.SizeList.push(item);
    },
    onOptionMove(type, index) { // 排序
      const [item] = this.SizeList.splice(index, 1);
      const newIndex = type === 'up' ? index - 1 : index + 1;
      this.SizeList.splice(newIndex, 0, item);
      this.SizeList.forEach((it, i) => {
        const _it = it;
        _it.Index = i;
      });
    },
    onItemRemove(i) {
      this.SizeList.splice(i, 1);
    },
  },
  mounted() {
    this.SizeList = JSON.parse(JSON.stringify(this.List));
    this.ElementList = JSON.parse(JSON.stringify(this.Elements));
    this.sizeTemplate = JSON.parse(JSON.stringify(this.sizeTemp));
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-general-size-set-dialog-size-add-panel-comp-wrap {
  p.btn-box {
    padding-left: 20px;
    button {
      font-size: 14px;
      padding: 0;
      width: 100px;
      height: 28px;
    }
  }
  > div {
    > div.header {
      display: flex;
      align-items: center;
      height: 39px;
      border-bottom: 1px solid #DCDFE6;
      margin-bottom: 16px;
      > span, > div > span {
        text-align: center;
        color: #a2a2a2;
        line-height: 20px;
        flex: none;
        white-space: nowrap;
        overflow: hidden;
      }
      > div { // 标题伸缩区域
        flex: 1;
        display: flex;
        align-items: center;
        max-width: 424px;
      }
    }
    > ul {
      max-height: 440px;
      min-height: 220px;
      overflow-y: auto;
      > li.content-item {
        display: flex;
        align-content: center;
        margin-bottom: 12px;
        > .ctrl {
          font-size: 12px;
          user-select: none;
          color: #A2A2A2;
          width: 210px;
          flex: none;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-bottom: 2px;
          > div {
            width: 46px;
            > span {
              cursor: pointer;
              transition: color 0.05s ease-in-out;
              &:hover {
                color: #444;
              }
              > i {
                font-size: 18px;
                color: #1dc742;
                position: relative;
                top: 3px;
              }
            }
          }
          .del-btn {
            font-size: 12px;
            user-select: none;
            display: flex;
            align-items: center;
            position: relative;
            top: 2px;
            > i {
              display: inline-block;
              width: 12px;
              height: 18px;
              vertical-align: middle;
              margin-right: 6px;
              background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
            }
            cursor: pointer;
            transition: color 0.05s ease-in-out;
            &:hover {
              color: #444 !important;
            }
          }
        }
        > .el-checkbox {
          line-height: 32px;
          text-align: center;
          display: block;
          padding-left: 19px;
          padding-right: 23px;
          flex: none;
        }
        > .name {
          width: 150px;
          flex: none;
          padding-right: 6px;
          .el-input__inner {
            font-size: 12px;
          }
        }
        > .flex-content { // 表体伸缩区域
          flex: 1;
          display: flex;
          align-items: center;
          > li {
            flex: none;
            padding: 0 6px;
            box-sizing: border-box;
            text-align: center;
            > .el-input, > .el-select {
              max-width: 160px;
            }
          }
        }
      }
    }
  }
}
</style>
