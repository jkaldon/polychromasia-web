import { BoardInteractionService } from './board-interaction.service';
import { BoardDrawingService } from './board-drawing.service';
import { BoardUpdatingService } from './board-updating.service';
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

  constructor(
    public boardCreationService: BoardCreationService,
    public boardUpdatingService: BoardUpdatingService,
    public boardDrawingService: BoardDrawingService,
    public boardInteractionService: BoardInteractionService
  ) {
    this.board = this.boardCreationService.createBoard(2, 5);
  }

  ngAfterViewInit(): void {
    const canvasElement: HTMLCanvasElement = this.canvasElementRef.nativeElement;
    const canvas: Canvasimo = new Canvasimo(canvasElement);

    const draw = () => {
      const width = canvas.getBoundingClientRect().width;
      const height = width;

      this.boardUpdatingService.setSize(this.board, width, height);

      canvas
        .clearCanvas()
        .setSize(width, height)
        .fillCanvas('#000000')
        .translate(width / 2, this.board.offsetTop)
        .setStrokeWidth(1)
        .save();

      this.boardUpdatingService.update(this.board);
      this.boardDrawingService.draw(this.board, canvas);
    };

    draw();

    window.addEventListener('resize', draw);

    canvasElement.onmousemove = (e) => {
      draw();
      this.boardInteractionService.onMouseMove(this.board, canvas, e);
    };

    canvasElement.onclick = (e) => {
      this.boardInteractionService.onMouseClick(this.board, canvas, e);
      draw();
    };
  }
}
