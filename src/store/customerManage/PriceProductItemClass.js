import restoreInitDataByOrigin from '../../assets/js/utils/reduction';
import messageBox from '../../assets/js/utils/message';

export default class PriceProductItemClass {
  ProductClass = {
    First: '',
    Second: '',
  }

  Category = {
    CategoryID: '',
  }

  key = Math.random().toString(36).slice(-8)

  constructor(data) {
    restoreInitDataByOrigin(this, data);
  }

  static checker(PolicyList) {
    if (!Array.isArray(PolicyList) || PolicyList.length === 0) {
      messageBox.failSingleError('保存失败', '未设置产品和等级条目');
      return false;
    }
    const t = PolicyList.find(({ ProductClass, Category }) => {
      if (!ProductClass || !Category) return true;
      const { First, Second } = ProductClass;
      const { CategoryID } = Category;
      return (!First && First !== 0) || (!Second && Second !== 0) || (!CategoryID && CategoryID !== 0);
    });
    if (t) {
      messageBox.failSingleError('保存失败', '存在不完整的产品等级条目，请检查');
      return false;
    }
    const list = PolicyList.map(it => JSON.stringify(it.ProductClass));
    const len1 = list.length;
    const len2 = [...new Set(list)].length;
    if (len1 > len2) {
      messageBox.failSingleError('保存失败', '产品类别不能重复');
      return false;
    }
    return true;
  }
}
