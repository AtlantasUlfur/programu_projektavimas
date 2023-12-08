import { TileTypeEnum } from '../../Models/Enums'

export interface TileHandler {
  setNext(handler: TileHandler): TileHandler

  handle(entityId: string, theme: string): TileTypeEnum
}

abstract class AbstractTileHandler implements TileHandler {
  private nextHandler: TileHandler

  public setNext(handler: TileHandler): TileHandler {
    this.nextHandler = handler
    return handler
  }

  public handle(entityId: string, theme: string): TileTypeEnum {
    if (this.nextHandler) {
      return this.nextHandler.handle(entityId, theme)
    }

    return TileTypeEnum.ERROR
  }
}

export class WallTileHandler extends AbstractTileHandler {
  public handle(entityId: string, theme: string): TileTypeEnum {
    if (entityId === 'wall') {
      switch (theme) {
        case 'cloud_background':
          return TileTypeEnum.WALL
        case 'hell_background':
          return TileTypeEnum.WALL_HELL
        case 'city_background':
          return TileTypeEnum.WALL_CITY
        case 'jungle_background':
          return TileTypeEnum.WALL_JUNGLE
        default:
          return TileTypeEnum.ERROR
      }
    }
    return super.handle(entityId, theme)
  }
}

export class GroundTileHandler extends AbstractTileHandler {
  public handle(entityId: string, theme: string): TileTypeEnum {
    if (entityId === 'ground') {
      switch (theme) {
        case 'cloud_background':
          return TileTypeEnum.GROUND
        case 'hell_background':
          return TileTypeEnum.GROUND_HELL
        case 'city_background':
          return TileTypeEnum.GROUND_CITY
        case 'jungle_background':
          return TileTypeEnum.GROUND_JUNGLE
        default:
          return TileTypeEnum.ERROR
      }
    }
    return super.handle(entityId, theme)
  }
}

export class PlayerTileHandler extends AbstractTileHandler {
  public handle(entityId: string, theme: string): TileTypeEnum {
    if (entityId === 'player') {
      switch (theme) {
        case 'cloud_background':
          return TileTypeEnum.GROUND
        case 'hell_background':
          return TileTypeEnum.GROUND_HELL
        case 'city_background':
          return TileTypeEnum.GROUND_CITY
        case 'jungle_background':
          return TileTypeEnum.GROUND_JUNGLE
        default:
          return TileTypeEnum.ERROR
      }
    }
    return super.handle(entityId, theme)
  }
}
