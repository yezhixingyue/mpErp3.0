import { Ref, ref } from 'vue';
import { useUserStore } from '@/pinia/modules/user';
import { ComputerForm } from '../model/Computer';
import { ComputerListManageClass } from '../model/ComputerListManageClass';
import { IComputer, IRemarkSubmitParams } from '../types/type';

export const useSaveDialog = (localManageListData: Ref<ComputerListManageClass>) => {
  const visible = ref(false);
  const row = ref<null | IComputer>(null);
  const isCopy = ref(false);

  const remarkVisible = ref(false);

  const onDialogSaveClick = (item: null | IComputer, _isCopy = false) => {
    row.value = item;
    isCopy.value = _isCopy;
    visible.value = true;
  };

  let _params: ReturnType<ComputerForm['getParams']> | null = null;

  const submit = (content = '') => {
    if (!_params) return;

    const callback = () => {
      visible.value = false;
      remarkVisible.value = false;
    };

    const remark: IRemarkSubmitParams | null = content ? { content, creator: useUserStore().UserDetail.StaffID, equipmentId: row.value?.id } : null;

    const data = {
      params: _params,
      remark,
    };

    localManageListData.value.save(data, callback);
  };

  const onDialogSubmitClick = (params: ReturnType<ComputerForm['getParams']>) => {
    _params = params;

    if (row.value && !isCopy.value) { // 编辑 有值且不是拷贝
      remarkVisible.value = true;
      return;
    }

    submit();
  };

  return { visible, row, isCopy, remarkVisible, onDialogSaveClick, onDialogSubmitClick, submit };
};
