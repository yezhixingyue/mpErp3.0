import store from '@/store';


// ------------------------------------------- ↓ 下面为通过详情数据获取到产品详细信息
const getElementValueContentFromDetail = (target, isCraftUse) => {
  let Content = '';
  if (Array.isArray(target.CustomerInputValues) && target.CustomerInputValues.length > 0) {
    if (target.CustomerInputValues.length > 1) {
      Content = target.CustomerInputValues.map(it => it.Name).join('、');
    } else if (target.Attributes.Type === 3 && !target.CustomerInputValues[0].IsOpen) {
      Content = '';
    } else {
      Content = target.CustomerInputValues[0].Name;
      // if (target.Attributes.Unit) Content += target.Attributes.Unit;
    }
  }
  const Label = (target.Attributes.IsNameHidden || (isCraftUse && !(!target.Attributes.Unit && target.Attributes.Type === 1))) ? '' : target.Attributes.Name;
  return { Label, Content };
};

const getDisplayContentByElementFromDetailData = (ElementList, item, isCraftUse) => {
  if (item && item.Property && Array.isArray(ElementList) && ElementList.length > 0) {
    const target = ElementList.find(it => it.ElementID === item.Property.ID);
    if (target) {
      const { Label, Content } = getElementValueContentFromDetail(target, isCraftUse);
      if (Content) {
        return { Label, Content };
      }
    }
  }
  return null;
};

const getDisplayContentByGroupFromDetailData = (GroupList, item, isStringify, isCraftUse = false) => {
  if (Array.isArray(GroupList) && GroupList.length > 0 && item) {
    const target = GroupList.find(it => it.GroupID === item.Property.ID);
    if (target && target.List.length > 0) {
      let _list = [];
      target.List.forEach(valList => {
        const groupItemContent = valList.List
          .map(_it => {
            const t = getDisplayContentByElementFromDetailData(valList.List, { Property: { ID: _it.ElementID } }, isCraftUse);
            return t;
          })
          .filter(_it => _it && _it.Content)
          .map(({ Label, Content }) => `${Label}${Label ? '：' : ''}${Content}`);
        if (groupItemContent) {
          _list.push(groupItemContent);
        }
      });
      if (_list.length > 0) {
        _list = _list.map((Content, i) => {
          // eslint-disable-next-line no-nested-ternary
          let Label = _list.length > 1 && i > 0
            ? (isCraftUse ? `${target.Attributes.Name}${i + 1}` : `${target.Attributes.Name}-notFirst`)
            : _list.length > 1 && isCraftUse ? `${target.Attributes.Name}${i + 1}` : target.Attributes.Name;
          if (target.Attributes.IsNameHidden) Label = '';
          return { Label, Content };
        });
        if (!isStringify) return _list;

        let str = '';
        _list.forEach(_it => {
          const { Label, Content } = _it;
          str += `，${Label.replaceAll('-notFirst', '')}${Label ? '：（' : ''} ${Content} ${Label ? '）' : ''}`;
        });
        return str;
      }
    }
  }
  return null;
};

const getCraftItemContentNameFromDetailData = (Craft, isStringify) => {
  if (!Craft) {
    if (isStringify) return '';
    return { Name: '工艺' };
  }
  const { ElementList, GroupList } = Craft;
  if (
    (!Array.isArray(ElementList) || ElementList.length === 0)
      && (!Array.isArray(GroupList) || GroupList.length === 0)
  ) {
    if (isStringify) return Craft.Attributes.DisplayName;
    return { Name: Craft.Attributes.DisplayName };
  }
  const ElContent = [];
  const GroupContent = [];
  const hasElementList = Array.isArray(ElementList) && ElementList.length > 0;
  const hasGroupList = Array.isArray(GroupList) && GroupList.length > 0;
  const hiddenGroupName = !hasElementList && hasGroupList && GroupList.length === 1;
  if (hasElementList) {
    ElementList.forEach((it) => {
      const _data = getElementValueContentFromDetail(it, true);
      if (_data) {
        const { Label, Content } = _data;
        if (Content) {
          // ElContent.push(`${Label}${Label ? ' ' : ''}${Content}`);
          if (Content) ElContent.push({ type: 'ElementList', Label, Content });
        }
      }
    });
  }
  if (hasGroupList) {
    GroupList.forEach((it) => {
      if (it.List.length === 0) return;
      const _data = getDisplayContentByGroupFromDetailData(GroupList, { Property: { ID: it.GroupID } }, false, true);
      if (Array.isArray(_data) && _data.length > 0) {
        _data.forEach((_it) => {
          const { Label, Content } = _it;
          if (Content) {
            if (isStringify) {
              if (hiddenGroupName || !Label) GroupContent.push(`${Content.join('，')}`);
              else GroupContent.push(`${Label}：[ ${Content.join('，')} ]`);
            } else if (hiddenGroupName || !Label) GroupContent.push({ type: 'GroupList', Label: '', Content: `${Content.join('，')}` });
            else GroupContent.push({ type: 'GroupList', Label, Content: `${Content.join('，')}` });
          }
        });
      }
    });
  }
  if (ElContent.length > 0 || GroupContent.length > 0) {
    const temp = {
      Name: Craft.Attributes.DisplayName,
      Content: isStringify ? `${ElContent.join('，')}${ElContent.length > 0 && GroupContent.length > 0
        ? '；' : ''}${GroupContent.join('，')}`
        : [...ElContent, ...GroupContent],
    };
    if (!isStringify) return temp;
    return `，${temp.Name}：[ ${temp.Content} ]`;
  }
  if (!isStringify) return { Name: Craft.Attributes.DisplayName };
  return `，${Craft.Attributes.DisplayName}`;
};

const getDisplayContentByCraftFromDetailData = ({ CraftList, CraftGroupList }, item, isStringify) => {
  if (item && Array.isArray(CraftList) && Array.isArray(CraftGroupList) && item.Property && item.Property.ID) {
    const t = CraftGroupList.find(it => it.ID === item.Property.ID);
    if (t) {
      const list = CraftList.filter(it => t.List.includes(it.CraftID));
      if (list.length > 0) {
        const CraftGroupLabel = t.Name || '工艺';
        const temp = { Label: CraftGroupLabel, Content: [] };
        temp.Content = list.map(it => getCraftItemContentNameFromDetailData(it, isStringify)).filter(it => it);
        if (!isStringify) return temp;
        let str = `，${CraftGroupLabel}：`;
        temp.Content.forEach(_it => {
          str += _it;
        });
        return str;
      }
    }
  }
  return null;
};

/**
 * @description: 用产品详情展示的类
 * @param {*}
 * @return {*}
 */
export default class ProductDetailTypeShowClass {
  /**
   * @description: 购物车列表获取订单详情列表展示数据
   * @param {*} partData
   * @param {*} originPartData
   * @return {*}
   */
  static getDisplayContentFromPartDataByDetailData(DisplayList, ProductParams, isStringify) {
    if (!ProductParams || !DisplayList) return [];
    const arr = [];
    let str = '';
    const { ProductDisplayPropertyTypeList } = store.state.productManage;
    if (Array.isArray(DisplayList) && DisplayList.length > 0) {
      DisplayList.forEach(itemData => {
        const t = ProductDisplayPropertyTypeList.find(it => it.ID === itemData.Type);
        if (!t) return;
        let target;
        switch (t.Name) {
          case '元素':
            target = getDisplayContentByElementFromDetailData(ProductParams.ElementList, itemData);
            if (target && target.Content) {
              if (!isStringify) arr.push({ type: 'ElementList', Label: target.Label, Content: target.Content });
              else str += `，${target.Label}${target.Label ? '：' : ''}${target.Content}`;
            }
            break;
          case '元素组':
            target = getDisplayContentByGroupFromDetailData(ProductParams.GroupList, itemData, isStringify);
            // if (target && target.length > 0) {
            //   if (!isStringify) arr.push(...target.map(it => ({ type: 'GroupList', Label: it.Label, Content: it.Content })));
            //   else str += `${target}`;
            // }
            if (Array.isArray(target) && target.length > 0 && !isStringify) {
              target.forEach((_it) => {
                const { Label, Content } = _it;
                if (Content) {
                  // if (!Label) GroupContent.push(`${Content.join('，')}`);
                  // else GroupContent.push(`${Label}：[ ${Content.join('，')} ]`);
                  arr.push({ type: 'GroupList', Label, Content: `${Content.join('，')}` });
                }
              });
            } else if (target) str += `${target}`;
            break;
          case '尺寸组':
            if (ProductParams.Size?.DisplayContent) {
              const Label = ProductParams.Size.GroupName || '尺寸';
              if (!isStringify) arr.push({ type: 'Size', Label, Content: ProductParams.Size.DisplayContent });
              else str += `，${Label}：${ProductParams.Size.DisplayContent}`;
            }
            break;
          case '物料':
            if (ProductParams.Attributes?.MaterialName) {
              if (!isStringify) {
                arr.push({ type: 'MaterialID', Label: ProductParams.Attributes.MaterialTipsName || '物料', Content: ProductParams.Attributes.MaterialName });
              } else str += `，${ProductParams.Attributes.MaterialTipsName || '物料'}：${ProductParams.Attributes.MaterialName}`;
            }
            break;
          case '工艺':
            target = getDisplayContentByCraftFromDetailData(ProductParams, itemData, isStringify);
            if (target) {
              if (!isStringify) arr.push({ type: 'CraftList', Label: target.Label, Content: target.Content });
              else str += `${target}`;
            }
            break;
          case '工厂': // 工厂隐藏 不考虑
            break;
          default:
            break;
        }
      });
    }
    if (!isStringify) return arr;
    return str;
  }

  static getDisplayStringFromPartDataByDetailData(orderDetailData) {
    if (!orderDetailData) return '';
    let str = '';
    if (orderDetailData.ProductParams?.Attributes?.DisplayOrderList && orderDetailData.ProductParams.Attributes.DisplayOrderList.length > 0) {
      str += '产品名称：';
      if (orderDetailData.ProductParams.Attributes.ClassList?.length > 0) {
        const t = orderDetailData.ProductParams.Attributes.ClassList.find(it => it.Type === 1);
        if (t) {
          const { FirstLevel } = t;
          if (FirstLevel && FirstLevel.Name) str += `${FirstLevel.Name}-`;
        }
      }
      str += orderDetailData.ProductParams.Attributes.DisplayName;
      str += '；';
      if (orderDetailData.ProductParams.Attributes.FactoryName) {
        str += `生产工厂：${orderDetailData.ProductParams.Attributes.FactoryName}；`;
      }
      str += '产品参数：';
      // eslint-disable-next-line max-len
      let _productContent = this.getDisplayContentFromPartDataByDetailData(orderDetailData.ProductParams.Attributes.DisplayOrderList, orderDetailData.ProductParams, true);
      _productContent = _productContent && _productContent.length > 0 ? _productContent.slice(1) : _productContent;
      str += _productContent;
      if (orderDetailData.ProductParams.PartList && orderDetailData.ProductParams.PartList.length > 0) {
        orderDetailData.ProductParams.PartList.forEach(it => {
          if (Array.isArray(it.List)) {
            it.List.forEach((part, index) => {
              let ContentList = this.getDisplayContentFromPartDataByDetailData(it.Attributes.DisplayOrderList, part, true);
              const Name = it.List.length > 1 && index > 0 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
              str += '；';
              str += Name;
              str += '：';
              ContentList = ContentList && ContentList.length > 0 ? ContentList.slice(1) : ContentList;
              if (ContentList) str += '【 ';
              str += ContentList;
              if (ContentList) str += ' 】';
            });
          }
        });
      }
    }
    return str;
  }
}
