import { AssistMapItemClass } from './AssistMapItemClass';
import { AssistMappingTypeEnum } from './enum';
import { MapDataClass } from './MapDataClass';

/**
 * 抽象类 - 辅助信息相关映射父类
 *
 * @export
 * @abstract
 * @class AssistMapDataClass
 * @template L
 * @template R
 * @template P
 */
export abstract class AssistMapDataClass<L, R, P> extends MapDataClass<L, R, P, AssistMapItemClass> {
  visible = false

  setVisible = (bool: boolean) => {
    this.visible = bool;
  }

  /** 当前选中的左侧列表中的项 */
  curEditItem: L | null = null

  /**
   * 获取映射结果 用于右侧展示 - 子类实现
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof MapDataClass
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract getItemMapResult(id: string, mapList: AssistMapItemClass[], other: any): string

  public handleItemChange = (temp: Partial<AssistMapItemClass>) => {
    const i = this.mapDataList.findIndex(it => it.SourceID === temp.SourceID || it.SourceID === `${temp.SourceID}`);
    if (i > -1) {
      const _temp = { ...this.mapDataList[i], ...temp };
      this.mapDataList.splice(i, 1, _temp);
    } else {
      this.mapDataList.push(new AssistMapItemClass(temp));
      if (this.curPageData) {
        const target = this.curPageData.curPart || this.curPageData.curEditItem;
        if (target) {
          switch (temp.Type) {
            case AssistMappingTypeEnum.WordsInfo:
              if (this.curPageData.curInstance) {
                target.WordsInfoCount += 1;
              } else {
                this.curPageData.curEditItem.UnionWordsInfoCount += 1; // 数值映射需多考虑一种情况：在非产品或部件实例上的数值映射
              }
              break;

            case AssistMappingTypeEnum.WorkTimes:
              if (this.curPageData.curInstance) {
                target.WorkTimesCount += 1;
              } else {
                this.curPageData.curEditItem.UnionWorkTimesCount += 1; // 数值映射需多考虑一种情况：在非产品或部件实例上的数值映射
              }
              break;

            case AssistMappingTypeEnum.Numberic:
              if (this.curPageData.curInstance) {
                target.NumbericInfoCount += 1;
              } else {
                this.curPageData.curEditItem.UnionNumbericInfoCount += 1; // 数值映射需多考虑一种情况：在非产品或部件实例上的数值映射
              }
              break;

            default:
              break;
          }
        }
      }
    }
  }
}
