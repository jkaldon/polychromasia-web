import { BoardDrawingService } from './board-drawing.service';
import { NextColorService } from './next-color.service';
import { Injectable } from '@angular/core';
import Canvasimo from 'canvasimo';
import { Board } from './board/board';
import { ConnectionColor } from './board/connection-color.enum';
import { Connection } from './board/connection';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class BoardInteractionService {

  constructor(private nextColorService: NextColorService, private boardDrawingService: BoardDrawingService) { }

  public setConnectionColor(connection: Connection, currentPlayer: Player, color: ConnectionColor): void {
    connection.color = color;
    connection.spots.forEach(s => {
      if (s.getColor() && ! s.player) {
        s.player = currentPlayer;
      }
    });
  }

  public onMouseMove(board: Board, canvas: Canvasimo, e: MouseEvent): void {
    const { mouseX, mouseY } = this.calculateCanvasXY(board, canvas, e);

    const connectionsInFocus = board.connections.filter(c => this.isInFocus(c, mouseX, mouseY));
    if (connectionsInFocus.length === 1 && !connectionsInFocus[0].color) {
      this.boardDrawingService.drawConnectionHighlight(connectionsInFocus[0], canvas);
    }
  }

  public onMouseClick(board: Board, canvas: Canvasimo, e: MouseEvent): void {
    // Calculate the x/y coordinates in canvas space.
    const { mouseX, mouseY } = this.calculateCanvasXY(board, canvas, e);

    const connectionsInFocus = board.connections.filter(c => this.isInFocus(c, mouseX, mouseY));
    if (connectionsInFocus.length === 1) {
      this.setConnectionColor(connectionsInFocus[0], board.players[board.currentPlayerIndex], board.currentColor);

      board.currentPlayerIndex = (board.currentPlayerIndex + 1) % board.players.length;
      board.currentColor = this.nextColorService.getNextColor(board.currentPlayerIndex);
    }
  }


  private calculateCanvasXY(board: Board, canvas: Canvasimo, e: MouseEvent): { mouseX: number; mouseY: number; } {
    const mouseX = (e.x - canvas.getCanvas().offsetLeft) - (canvas.getCanvas().width / 2);
    const mouseY = (e.y - canvas.getCanvas().offsetTop) - board.offsetTop;
    return {mouseX, mouseY};
  }

  private isInFocus(connection: Connection, mouseX: number, mouseY: number): boolean {
    // Based on the algorithm posted here:
    // https://stackoverflow.com/a/1088058
    const distanceFromStartToEnd = Math.sqrt(
      Math.pow(connection.xOffsetEnd - connection.xOffsetStart, 2) + Math.pow(connection.yOffsetEnd - connection.yOffsetStart, 2)
    );
    const dx = (connection.xOffsetEnd - connection.xOffsetStart) / distanceFromStartToEnd;
    const dy = (connection.yOffsetEnd - connection.yOffsetStart) / distanceFromStartToEnd;
    const t = dx * (mouseX - connection.xOffsetStart) + dy * (mouseY - connection.yOffsetStart);
    const nearestPointOnLineX = t * dx + connection.xOffsetStart;
    const nearestPointOnLineY = t * dy + connection.yOffsetStart;
    const distanceFromMouseToNearestPointOnLine = Math.sqrt(
        Math.pow(nearestPointOnLineX - mouseX, 2) + Math.pow(nearestPointOnLineY - mouseY, 2)
    );
    const distanceFromNearestPointOnLineToStart = Math.sqrt(
        Math.pow(nearestPointOnLineX - connection.xOffsetStart, 2) + Math.pow(nearestPointOnLineY - connection.yOffsetStart, 2)
    );
    const distanceFromNearestPointOnLineToEnd = Math.sqrt(
        Math.pow(nearestPointOnLineX - connection.xOffsetEnd, 2) + Math.pow(nearestPointOnLineY - connection.yOffsetEnd, 2)
    );
    return distanceFromMouseToNearestPointOnLine < 9
        && distanceFromNearestPointOnLineToEnd < distanceFromStartToEnd
        && distanceFromNearestPointOnLineToStart < distanceFromStartToEnd;
  }

}
