export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface ObstacleData {
  id: string;
  x: number;
  gapY: number; // Y position of the center of the gap
  passed: boolean;
}

export const CONSTANTS = {
  GRAVITY: 18,
  JUMP_FORCE: 7,
  SPEED: 6,
  OBSTACLE_SPAWN_RATE: 2.0, // Reduced from 2.5 for better pacing
  OBSTACLE_GAP_HEIGHT: 3.5,
  OBSTACLE_WIDTH: 1.5,
  CEILING: 8,
  FLOOR: -8,
};