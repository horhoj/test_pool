import { Color } from './color';

export interface BallData {
  x: number;
  y: number;
  r: number;
  color: Color;
  moveAngle: number;
  movePower: number;
}

export class Ball {
  public data: BallData;
  public constructor(ballData: BallData) {
    this.data = ballData;
  }

  public render(ctx: CanvasRenderingContext2D, isCurrent: boolean) {
    ctx.beginPath();

    ctx.arc(this.data.x, this.data.y, this.data.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.data.color;
    ctx.fill();
    if (isCurrent) {
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.closePath();
  }
}
