import Canvasimo from 'canvasimo';

export interface DrawableClass {
  update(): void;
  draw(canvas: Canvasimo): void;
}
