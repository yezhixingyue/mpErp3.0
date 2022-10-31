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
              target.WordsInfoCount += 1;
              break;

            case AssistMappingTypeEnum.WorkTimes:
              target.WorkTimesCount += 1;
              break;

            case AssistMappingTypeEnum.Numberic:
              target.NumbericInfoCount += 1;
              break;

            default:
              break;
          }
        }
      }
    }
  }
}
