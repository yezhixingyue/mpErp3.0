<template>
  <CommonDialogComp
    width="750px"
    top='12vh'
    :title="title"
    :visible="visible"
    :disabled='!selectValue'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-common-sub-formula-add-and-select-dialog-comp-wrap"
  >
    <div class="empty" v-if="!loading && selectDataList.length === 0">
      <div>
        <img src="@/assets/images/null.png" alt="">
        <span class="is-font-size-12 is-gray">暂无数据</span>
      </div>
    </div>
    <div v-for="it in selectDataList" :key="it.ID" class="item">
      <p>
        <el-radio v-if="it.Part" v-model="selectValue" :label="it.Part">{{it.Name}}</el-radio>
        <span v-else>{{it.Name}}</span>
      </p>
      <div>
        <el-radio v-model="selectValue" v-for="group in it.GroupList" :key="group.Group.ID" :label="group">{{group.Group.Name}}</el-radio> <!-- 普通元素组 -->
      </div>
      <ul>
        <li v-for="craft in it.CraftList" :key="craft.ID"> <!-- 工艺元素组 -->
          <span>{{craft.Name}}：</span>
          <el-radio v-model="selectValue" v-for="group in craft.GroupList" :key="group.Group.ID" :label="group">{{group.Group.Name}}</el-radio> <!-- 普通元素组 -->
        </li>
      </ul>
    </div>
    <template v-if="!loading && selectDataList.length > 0">
      <p class="tips-box is-pink" v-if="warnTitle"><i class="el-icon-warning"></i> 注：{{warnTitle}}目标设定后不允许更改</p>
      <p class="tips-box is-pink" v-else-if="isEdit"><i class="el-icon-warning"></i> 注：目标如果修改后，原已设置的条件中将会筛选清除掉不存在的属性条件</p>
    </template>
    <p class="tips-box is-pink" v-if="!loading && selectDataList.length === 0"> <i class="el-icon-warning"></i> 当前产品上没有可设置的元素组或部件</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    PropertyList: {
      type: Array,
      default: null,
    },
    warnTitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '添加子公式',
    },
    initDataStr: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    selectDataList() { // 用于页面渲染的处理过后的数据列表
      if (!this.PropertyList || !Array.isArray(this.PropertyList) || this.PropertyList.length === 0) return [];
      const list = [];
      this.PropertyList.forEach((it) => {
        const { Product, Part, Group, Craft } = it;
        if (Product) {
          const ID = Part ? Part.ID : Product.ID;
          const Name = Part ? Part.Name : '产品';
          let item = list.find(_it => _it.ID === ID);
          if (!item) {
            item = { ID, Name, Part: null, GroupList: [], CraftList: [] };
            list.push(item);
          }
          if (Craft && Group) { // 工艺元素组
            const t = item.CraftList.find(_it => _it.ID === Craft.ID);
            if (t) t.GroupList.push(it);
            else item.CraftList.push({ ...Craft, GroupList: [it] });
          }
          if (!Craft && Group) item.GroupList.push(it); // 普通元素组
          if (!Craft && !Group && Part) item.Part = it; // 多次使用的部件
        }
      });
      return list;
    },
  },
  data() {
    return {
      selectValue: '',
      isEdit: false,
    };
  },
  methods: {
    async onSubmit() {
      this.$emit('submit', this.selectValue);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      if (this.initDataStr) {
        const t = this.PropertyList.find(it => JSON.stringify(it) === this.initDataStr);
        this.selectValue = t || '';
        this.isEdit = true;
      } else {
        this.isEdit = false;
        this.selectValue = '';
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-common-sub-formula-add-and-select-dialog-comp-wrap {
  // position: relative;
  .el-dialog__body {
    padding-left: 55px;
    padding-top: 35px;
    padding-bottom: 50px;
    height: 460px;
    overflow-y: auto;
    .item {
      margin-bottom: 8px;
      > p {
        position: relative;
        padding-left: 15px;
        margin-bottom: 25px;
        font-weight: 700;
        color: #585858;
        .el-radio__label {
          font-weight: 700;
          color: #585858;
        }
        .el-radio__input {
          position: relative;
          top: -1px;
        }
        &::before {
          content: '';
          position: absolute;
          width: 3px;
          height: 15px;
          left: 0;
          background-color: #26bcf9;
        }
      }
      > ul > li {
        > span {
          margin-bottom: 20px;
          font-size: 14px;
          color: #888E99;
          margin-right: 4px;
        }
      }
      > div, > ul > li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        label {
          margin-bottom: 20px;
          width: 157px;
          margin-right: 0;
          display: flex;
          align-items: center;
          .el-radio__input {
            position: relative;
            top: 1px;
          }
          .el-radio__label {
            color: #585858;
            font-size: 12px;
            display: inline-block;
            max-width: 125px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 15px;
          }
        }
      }
    }
    > .tips-box {
      position: absolute;
      bottom: 85px;
      width: 500px;
      left: calc(50% - 250px);
    }
    .empty {
      padding: 25px 0;
      margin-left: -25px;
      height: 100%;
      position: relative;
      box-sizing: border-box;
      > div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        > span {
          margin-left: 15px;
          vertical-align: 5px;
        }
      }
      > p {
        position: absolute;
        bottom: -50px;
        left: calc(50% - 254px);
        width: 500px;
      }
    }
  }
  .el-dialog__footer {
    padding-top: 50px;
  }
}
</style>
