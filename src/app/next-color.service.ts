import { ConnectionColor } from './board/connection-color.enum';
import { Injectable } from '@angular/core';
import { NextColorQueueType } from './next-color-queue-type.enum';
import { NextColorStrategy } from './next-color-strategy';
import { NextColorStrategyIface } from './next-color-strategy-iface';

@Injectable({
  providedIn: 'root'
})
export class NextColorService {
  private nextColorStrategy: NextColorStrategyIface = NextColorStrategy.COMPLETELY_RANDOM;
  private colorQueue: Array<ConnectionColor[]>;

  constructor() { }

  public configure(
      totalConnectionCount: number,
      playerCount: number,
      strategy: NextColorStrategyIface,
      queueType: NextColorQueueType
  ): void {
    this.nextColorStrategy = strategy;
    const connectionsPerPlayer = Math.trunc(totalConnectionCount / playerCount);
    const connectionsLastPlayer = totalConnectionCount - (connectionsPerPlayer * (playerCount - 1));

    switch (queueType) {
      case NextColorQueueType.PER_PLAYER:
        this.colorQueue = new Array<ConnectionColor[]>(playerCount);

        this.colorQueue[playerCount - 1] = strategy.getNext(connectionsLastPlayer);

        for (let i = 0; i < playerCount; i++) {
          this.colorQueue[i] = strategy.getNext()
        }
        break;

      case NextColorQueueType.SINGLE:
        this.colorQueue = new Array<ConnectionColor[]>(1);
        break;
    }

  }
}
