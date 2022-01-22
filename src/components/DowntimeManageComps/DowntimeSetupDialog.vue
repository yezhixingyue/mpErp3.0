<template>
   <CommonDialogComp
      width="800px"
      top="20vh"
      :title="title"
      :visible.sync="visible"
      @cancle="onCancleClick"
      @open="onOpen"
      @closed="onClosed"
      @submit="onSubmitClick"
      class="mp-erp-down-time-manage-page-item-setup-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <ul class="set-content">
        <li>
          <span class="title">开始时间：</span>
          <div class="content-item">
            <el-date-picker
              v-model="itemData.StartTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日" size="small">
            </el-date-picker>
            <el-time-picker
              v-model="itemData.StartTime.Second"
              :clearable='false'
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{ format: 'HH:mm' }"
              size="small"
              :default-value='defaultBeginTime'
              placeholder="00:00"
            >
            </el-time-picker>
          </div>
        </li>
        <li>
          <span class="title">结束时间：</span>
          <div class="content-item">
            <el-date-picker
              v-model="itemData.EndTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日" size="small">
            </el-date-picker>
            <el-time-picker
              v-model="itemData.EndTime.Second"
              :clearable='false'
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{ format: 'HH:mm' }"
              size="small"
              :default-value='defaultBeginTime'
              placeholder="00:00"
            >
            </el-time-picker>
          </div>
        </li>
        <li>
          <span class="title">给客户提示：</span>
          <div>
            <el-input v-model="itemData.tips" placeholder="" size="small" class="tip" maxlength="40" show-word-limit></el-input>
          </div>
        </li>
      </ul>
    </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    title() {
      return this.type === 'edit' ? '编辑停机维护' : '添加停机维护';
    },
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0));
    },
  },
  data() {
    return {
      itemData: {
        StartTime: {
          First: '',
          Second: '',
        },
        EndTime: {
          First: '',
          Second: '',
        },
        tips: '',
      },
    };
  },
  methods: {
    onCancleClick() {
      this.$emit('update:visible', false);
    },
    onOpen() {

    },
    onClosed() {

    },
    checker() {
      const { StartTime, EndTime, tips } = this.itemData;
      if (!StartTime.First || !StartTime.Second) {
        this.messageBox.failSingleError('保存失败', '开始时间不完整');
        return false;
      }
      if (!EndTime.First || !EndTime.Second) {
        this.messageBox.failSingleError('保存失败', '结束时间不完整');
        return false;
      }
      if (!tips) {
        this.messageBox.failSingleError('保存失败', '请填写对客户的提示信息');
        return false;
      }
      const startTime = new Date(`${StartTime.First}T${StartTime.Second}`).getTime();
      const endTime = new Date(`${EndTime.First}T${EndTime.Second}`).getTime();
      if (startTime >= endTime || startTime < Date.now()) {
        this.messageBox.failSingleError('保存失败', '开始时间不能早于当前时间且不能晚于结束时间');
        return false;
      }
      return true;
    },
    onSubmitClick() {
      const bool = this.checker();
      if (bool) {
        // 验证通过
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-down-time-manage-page-item-setup-dialog-comp-wrap {
  .el-dialog__body {
    height: 200px;
    ul.set-content {
      > li {
        display: flex;
        align-items: center;
        padding-left: 47px;
        margin-top: 15px;
        > span.title {
          min-width: 6em;
          text-align: right;
          color: #888E99;
          margin-right: 5px;
        }
        .el-input {
          > input {
            border-radius: 5px;
            border-color: #e5e5e5;
            height: 30px;
            &::placeholder {
              color: #ccc;
            }
            padding-right: 20px;
          }
          &.tip {
            width: 600px;
          }
        }
        .el-date-editor--date {
          width: 130px;
          margin-right: 20px;
        }
        .el-date-editor--time {
          width: 100px;
        }
        &:last-of-type {
          margin-top: 20px;
        }
      }
    }
  }
  .el-dialog__footer {
    padding-top: 0;
    height: 90px;
  }
}
</style>
