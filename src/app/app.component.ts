import { Player } from './player';
import { ConnectionColor } from './board/connection-color.enum';
import { BoardCreationService } from './board-creation.service';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Canvasimo from 'canvasimo';
import { Board } from './board/board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvasElementRef: ElementRef;
  title = 'Polychromasia';
  board: Board;

  constructor(private boardCreationService: BoardCreationService) {
    this.board = this.boardCreationService.createBoard(5);
    this.board.setPlayerCount(2);
  }

  ngAfterViewInit(): void {
    const canvasElement: HTMLCanvasElement = this.canvasElementRef.nativeElement;
    const canvas: Canvasimo = new Canvasimo(canvasElement);

    const draw = () => {
      const width = canvas.getBoundingClientRect().width;
      const height = width;

      this.board.setSize(width, height);

      canvas
        .clearCanvas()
        .setSize(width, height)
        .fillCanvas('#000000')
        .translate(width / 2, this.board.offsetTop)
        .setStrokeWidth(1)
        .save();

      this.board.update();
      this.board.draw(canvas);
    };

    draw();

    window.addEventListener('resize', draw);

    canvasElement.onmousemove = (e) => {
      draw();
      this.board.onMouseMove(canvas, e);
    };

    canvasElement.onclick = (e) => {
      this.board.onMouseClick(canvas, e);
      draw();
    };
  }

  public onRedClick(): void {
    this.board.setNextColor(ConnectionColor.RED);
  }
  public onGreenClick(): void {
    this.board.setNextColor(ConnectionColor.GREEN);
  }
  public onBlueClick(): void {
    this.board.setNextColor(ConnectionColor.BLUE);
  }
}
