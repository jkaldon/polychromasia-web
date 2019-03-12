import { ConnectionColor } from './board/connection-color.enum';
export interface NextColorStrategyIface {
  getPercentRed(): number;
  getNumberRed(totalConnectionCount: number): number;

  getPercentGreen(): number;
  getNumberBlue(totalConnectionCount: number): number;

  getPercentBlue(): number;
  getNumberBlue(totalConnectionCount: number): number;
}
