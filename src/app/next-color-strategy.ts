import { ConnectionColor } from './board/connection-color.enum';
import { NextColorStrategyIface } from './next-color-strategy-iface';

export class NextColorStrategy {
  public static COMPLETELY_RANDOM: NextColorStrategyIface = {
    getNext(): ConnectionColor {
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
  };

  public static RANDOM_R30_G30_B40: NextColorStrategyIface = {
    getNext(): ConnectionColor {
      return null;
    }
  };

  public static RANDOM_R33_G33_B34: NextColorStrategyIface = {
    getNext(): ConnectionColor {
      return null;
    }
  };

  public static PRE_STACKED_R30_G30_B40: NextColorStrategyIface = {
    getNext(): ConnectionColor {
      return null;
    }
  };

  public static PRE_STACKED_R33_G33_B34: NextColorStrategyIface = {
    getNext(): ConnectionColor {
      return null;
    }
  };
}
