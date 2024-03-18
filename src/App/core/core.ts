import { ContextMenuDataSetter } from '../App.types';
import { Ball, BallData } from './ball';
import { Color } from './color';

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

const FRICTION_COEFFICIENT = 0.02;
const RANDOMIZE_ANGLE_COEFFICIENT = 5;
const PUNCH_MOVE_POWER = 20;

export class Core {
  private root: HTMLDivElement;
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private balls: Ball[] = [];
  private isMoving = false;
  private currentBallIndex: number | null = null;
  private isLeftMouseDown: boolean = false;
  private moveStartPoint: { x: number; y: number } | null = null;
  private contextMenuDataSetter: ContextMenuDataSetter | null = null;

  public constructor(root: HTMLDivElement) {
    this.root = root;
    this.canvas = document.createElement('canvas');
    this.root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.frame();
    this.canvas.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
    this.canvas.addEventListener('contextmenu', this.contextMenu);
  }

  private clear = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  private frame = () => {
    if (this.ctx) {
      this.clear();
      for (const ball of this.balls) {
        const angle = (ball.data.moveAngle / 360) * 2 * Math.PI;
        //движение с замедлением
        if (ball.data.movePower > 0) {
          ball.data.x += ball.data.movePower * Math.cos(angle);
          ball.data.y -= ball.data.movePower * Math.sin(angle);
          ball.data.movePower -= FRICTION_COEFFICIENT;
          if (ball.data.movePower < 0) {
            ball.data.movePower = 0;
            ball.data.moveAngle = 0;
          }
        }
        //отскок от стенки
        if (
          ball.data.y + ball.data.r >= CANVAS_HEIGHT ||
          ball.data.y - ball.data.r <= 0
        ) {
          ball.data.moveAngle =
            360 - ball.data.moveAngle + RANDOMIZE_ANGLE_COEFFICIENT;
          ball.data.x -= ball.data.movePower * Math.cos(angle);
          ball.data.y += ball.data.movePower * Math.sin(angle);
        }

        if (
          ball.data.x + ball.data.r >= CANVAS_WIDTH ||
          ball.data.x - ball.data.r <= 0
        ) {
          ball.data.moveAngle =
            180 - ball.data.moveAngle + RANDOMIZE_ANGLE_COEFFICIENT;
          ball.data.x -= ball.data.movePower * Math.cos(angle);
          ball.data.y += ball.data.movePower * Math.sin(angle);
        }
      }

      //столкновение
      for (let i = 0; i < this.balls.length; i++) {
        for (let j = i + 1; j < this.balls.length; j++) {
          const delta = Math.sqrt(
            Math.pow(this.balls[i].data.x - this.balls[j].data.x, 2) +
              Math.pow(this.balls[i].data.y - this.balls[j].data.y, 2),
          );
          if (delta <= this.balls[i].data.r + this.balls[j].data.r) {
            this.balls[i].data.x -=
              this.balls[i].data.movePower *
              Math.cos((this.balls[i].data.moveAngle / 360) * 2 * Math.PI);
            this.balls[i].data.y +=
              this.balls[i].data.movePower *
              Math.sin((this.balls[i].data.moveAngle / 360) * 2 * Math.PI);
            this.balls[j].data.x -=
              this.balls[j].data.movePower *
              Math.cos((this.balls[j].data.moveAngle / 360) * 2 * Math.PI);
            this.balls[j].data.y +=
              this.balls[j].data.movePower *
              Math.sin((this.balls[j].data.moveAngle / 360) * 2 * Math.PI);

            //вот здесь надо придумать как быть с углами при столкновении
            const tmp = this.balls[i].data.moveAngle;
            this.balls[i].data.moveAngle =
              this.balls[j].data.moveAngle + RANDOMIZE_ANGLE_COEFFICIENT;
            this.balls[j].data.moveAngle = tmp - RANDOMIZE_ANGLE_COEFFICIENT;

            const iMovePower = this.balls[i].data.movePower;
            const jMovePower = this.balls[j].data.movePower;
            this.balls[i].data.movePower = jMovePower * 0.8 + iMovePower * 0.2;
            this.balls[j].data.movePower = iMovePower * 0.8 + jMovePower * 0.2;
          }
        }
      }
      let isMoving = false;
      this.balls.forEach((ball, index) => {
        if (this.ctx) {
          if (!isMoving && ball.data.movePower > 0) {
            isMoving = true;
          }
          ball.render(this.ctx, this.currentBallIndex === index);
        }
      });
      this.isMoving = isMoving;
      if (isMoving) {
        this.currentBallIndex = null;
        if (this.contextMenuDataSetter) {
          this.contextMenuDataSetter(null);
        }
      }

      requestAnimationFrame(this.frame);
    }
  };

  private mouseDown = (e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }
    if (this.canvas) {
      this.isLeftMouseDown = true;
      const { left, top } = this.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      this.moveStartPoint = { x, y };
    }
  };

  private mouseUp = (e: MouseEvent) => {
    // console.log(e.button);
    if (e.button !== 0) {
      return;
    }

    if (this.canvas && this.moveStartPoint && this.currentBallIndex !== null) {
      const { left, top } = this.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const deltaX = x - this.moveStartPoint.x;
      const deltaY = y - this.moveStartPoint.y;
      if (deltaX === 0 && deltaY === 0) {
        this.moveStartPoint = null;
        this.isLeftMouseDown = false;
        return;
      }
      const angleAbs = Math.atan(Math.abs(deltaY / deltaX)) * (180 / Math.PI);
      let angle = 0;
      if (deltaX >= 0 && deltaY <= 0) {
        angle = angleAbs;
      }
      if (deltaX <= 0 && deltaY <= 0) {
        angle = 180 - angleAbs;
      }
      if (deltaX <= 0 && deltaY >= 0) {
        angle = 180 + angleAbs;
      }
      if (deltaX >= 0 && deltaY >= 0) {
        angle = 270 + (90 - angleAbs);
      }
      this.balls[this.currentBallIndex].data.moveAngle = angle;
      this.balls[this.currentBallIndex].data.movePower = PUNCH_MOVE_POWER;
    }
    this.moveStartPoint = null;
    this.currentBallIndex = null;
    this.isLeftMouseDown = false;
  };

  private mouseMove = (e: MouseEvent) => {
    if (this.canvas) {
      const { left, top } = this.canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      if (!this.isMoving && !this.isLeftMouseDown) {
        let currentBallIndex: number | null = null;
        this.balls.forEach((ball, index) => {
          const delta = Math.sqrt(
            Math.pow(ball.data.x - x, 2) + Math.pow(ball.data.y - y, 2),
          );
          if (delta < ball.data.r) {
            currentBallIndex = index;
          }
        });

        this.currentBallIndex = currentBallIndex;
      }
    }
  };

  private contextMenu = (e: MouseEvent) => {
    e.preventDefault();
    if (this.currentBallIndex !== null && this.contextMenuDataSetter !== null) {
      this.contextMenuDataSetter({
        ballIndex: this.currentBallIndex,
        x: e.x,
        y: e.y,
      });
    }
  };

  public setContextMenuDataSetter(
    contextMenuDataSetter: ContextMenuDataSetter,
  ) {
    this.contextMenuDataSetter = contextMenuDataSetter;
  }

  public addBall(ballData: BallData) {
    this.balls.push(new Ball(ballData));
  }

  public setBallColor(index: number, color: Color) {
    if (this.balls[index]) {
      this.balls[index].data.color = color;
    }
  }
}
