import { ComputerUseStateEnum } from './enum';

export interface IComputer {
  id: string
  index: number
  code: string
  displayNumber: number
  displayCode: string
  displayModel: string
  ip: string
  mac: string
  cpu: string
  memorySlotsNumber: number
  memory: string
  disk: string
  diskNumber: number
  graphicsCard: string
  networkCard: string
  os: string
  systermDiskType: string
  source: string
  purchaseAt: string
  warrantyExpiredAt: string
  state: ComputerUseStateEnum
  user: string
  creator: string
  createdAt: string
  updatedAt: string
}

export interface IRemarkSubmitParams {
  equipmentId: string;
  creator: string;
  content: string;
}

export interface IComputerEditHistory {
  id: number;
  content: string;
  creator: string;
  createdAt: string
}
