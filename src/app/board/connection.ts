import { ConnectionColor as ConnectionColor } from './connection-color.enum';
import { Spot } from './spot';

export class Connection {
  public color: ConnectionColor;
  public spots: Spot[] = [];

  constructor() {
  }
}
