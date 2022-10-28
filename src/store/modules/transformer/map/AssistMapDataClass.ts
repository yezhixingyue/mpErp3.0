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
