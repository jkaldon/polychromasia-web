import { ConnectionColor } from './board/connection-color.enum';
import { Injectable } from '@angular/core';
import { Player } from './player';
import { NextColorStrategy } from './next-color-strategy.enum';

@Injectable({
  providedIn: 'root'
})
export class NextColorService {
  private nextColorStrategy: NextColorStrategy = NextColorStrategy.RANDOM;
  private nextColorOverride: ConnectionColor;

  constructor() { }

  public setNextColorStrategy(strategy: NextColorStrategy): void {
    this.nextColorStrategy = strategy;
  }

  public getNextColor(playerIndex: number): ConnectionColor {
    let result: ConnectionColor;

    switch (this.nextColorStrategy) {
      case NextColorStrategy.RANDOM:
        result = this.randomColor();
        break;
    }

    if (this.nextColorOverride) {
      result = this.nextColorOverride;
      this.nextColorOverride = null;
    }

    return result;
  }

  public peekNextColor(currentPlayerIndex: number): ConnectionColor {
    if (this.nextColorOverride) {
      return this.nextColorOverride;
    }
    this.nextColorOverride = this.getNextColor(currentPlayerIndex);
    return this.nextColorOverride;
  }

  public setNextColor(playerIndex: number, color: ConnectionColor): void {
    this.nextColorOverride = color;
  }

  public randomColor(): ConnectionColor {
    const r = Math.trunc(Math.random() * 3.0);

    switch (r) {
      case 0:
        return ConnectionColor.RED;
        break;
      case 1:
        return ConnectionColor.GREEN;
        break;
      case 2:
        return ConnectionColor.BLUE;
        break;
    }
  }
}
