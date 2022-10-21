import { AssistMapItemClass } from './AssistMapItemClass';

/**
 * 抽象类 - 映射父类
 *
 * @export
 * @abstract
 * @class MapDataClass
 * @template L
 * @template R
 * @template P
 */
export abstract class MapDataClass<L, R, P> {
  /**
   * 转换器ID
   *
   * @protected
   * @memberof MapDataClass
   */
  public ServerID = ''

  /**
   * 左侧列表数据
   *
   * @type {L[]}
   * @memberof MapDataClass
   */
  leftDataList: L[] = []

  /**
   * 右侧列表数据
   *
   * @type {R[]}
   * @memberof MapDataClass
   */
  rightDataList: R[] = []

  /**
   * 映射信息列表数据
   *
   * @type {AssistMapItemClass[]}
   * @memberof MapDataClass
   */
  mapDataList: AssistMapItemClass[] = []

  loading = false

  curEditItem: L | null = null

  /**
   * 获取左侧数据的方法-子类实现
   *
   * @protected
   * @abstract
   * @returns {(Promise<null | L[]>)}
   * @memberof MapDataClass
   */
  protected abstract getLeftList(): Promise<null | L[]>

  /**
   * 获取右侧数据的方法-子类实现
   *
   * @protected
   * @abstract
   * @returns {(Promise<null | R[]>)}
   * @memberof MapDataClass
   */
  protected abstract getRightList(): Promise<null | R[]>

  /**
   * 获取映射数据的方法-子类实现
   *
   * @protected
   * @abstract
   * @returns {(Promise<null | AssistMapItemClass[]>)}
   * @memberof MapDataClass
   */
  protected abstract getMapList(): Promise<null | AssistMapItemClass[]>

  /**
   * 获取映射结果 用于右侧展示 - 子类实现
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof MapDataClass
   */
  public abstract getItemMapResult(id: string, mapList: AssistMapItemClass[], rightList: R[]): string

  /**
   * 单个项目保存
   *
   * @abstract
   * @param {P} data
   * @returns {Promise<void>}
   * @memberof MapDataClass
   */
  public abstract saveItem(data: P): Promise<void>

  constructor(ServerID: string) {
    this.ServerID = ServerID;
    this.getData(); // 获取数据
  }

  public handleItemChange = (temp: Partial<AssistMapItemClass>) => {
    const i = this.mapDataList.findIndex(it => it.SourceID === temp.SourceID || it.SourceID === `${temp.SourceID}`);
    if (i > -1) {
      const _temp = { ...this.mapDataList[i], ...temp };
      this.mapDataList.splice(i, 1, _temp);
    } else {
      this.mapDataList.push(new AssistMapItemClass(temp));
    }
  }

  /** 获取全部数据： 左侧、右侧及映射数据 */
  protected async getData() {
    this.loading = true;
    const respArr = await Promise.all([this.getLeftList(), this.getRightList(), this.getMapList()]);
    this.loading = false;

    const [leftResArr, rightResArr, mapResArr] = respArr;

    this.leftDataList = leftResArr || [];
    this.rightDataList = rightResArr || [];
    this.mapDataList = mapResArr || [];
  }
}
