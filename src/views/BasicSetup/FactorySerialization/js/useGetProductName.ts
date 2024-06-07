import { useGlobalStore } from '@/pinia/modules/global';
import { storeToRefs } from 'pinia';
import { IMRProduct } from './types';

export const useGetProductName = () => {
  const globalStore = useGlobalStore();
  const { productClassLevelList4Staff } = storeToRefs(globalStore);

  /** 获取分类与产品组合名称 */
  const getProductName = (item: IMRProduct | null) => {
    if (!item) return '';

    const { First, Second } = item.ProductClass;

    let FirstLevelName = '';
    let SecondLevelName = '';

    const _lv1 = productClassLevelList4Staff.value.find(it => it.ID === First);
    if (_lv1) {
      FirstLevelName = _lv1.ClassName;
      const _lv2 = _lv1.children.find(it => it.ID === Second);
      if (_lv2) {
        SecondLevelName = _lv2.ClassName;
      }
    }

    return [FirstLevelName, SecondLevelName, item.Name].filter(it => it).join('-');
  };

  return { getProductName };
};
