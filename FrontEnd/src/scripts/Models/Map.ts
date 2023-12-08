import { List } from 'lodash';
import * as Phaser from 'phaser'
import { TileComponent } from '../utils/Composite/TileComponent';
import { Tile } from '../utils/Composite/Tile';
import { TileTypeEnum } from './Enums';
import { CompositeTile } from '../utils/Composite/CompositeTile';

export class Map {
    public tileMap: Phaser.Tilemaps.Tilemap
    private tiles: Array<Array<TileComponent>>
    constructor(tileMap: Phaser.Tilemaps.Tilemap){
        this.tileMap = tileMap
        const tileData = this.tileMap.layer.data
        var tileArray:TileComponent[][] = []

        for (let i = 0; i < tileData.length; i++) {
            var tileRow:TileComponent[] = new Array(tileData[i].length);
            for (let j = 0; j < tileData[i].length; j++) {
                var tile =  tileData[i][j];
                if(tile.index == TileTypeEnum.WALL)
                {
                    var tileComponent = new CompositeTile(tile.layer, tile.index, tile.x, tile.y,
                        tile.width, tile.height, tile.baseWidth,tile.baseHeight);
                    tileComponent.replaceChild(
                        new Tile(tile.layer, TileTypeEnum.GROUND, tile.x, tile.y,
                            tile.width, tile.height, tile.baseWidth,tile.baseHeight)
                    )
                    tileRow[j] = tileComponent;
                }
                else if(tile.index == TileTypeEnum.WALL_CITY)
                {
                    var tileComponent = new CompositeTile(tile.layer, tile.index, tile.x, tile.y,
                        tile.width, tile.height, tile.baseWidth,tile.baseHeight);
                    tileComponent.replaceChild(
                        new Tile(tile.layer, TileTypeEnum.GROUND_CITY, tile.x, tile.y,
                            tile.width, tile.height, tile.baseWidth,tile.baseHeight)
                    )
                    tileRow[j] = tileComponent;
                }
                else if(tile.index == TileTypeEnum.WALL_HELL)
                {
                    var tileComponent = new CompositeTile(tile.layer, tile.index, tile.x, tile.y,
                        tile.width, tile.height, tile.baseWidth,tile.baseHeight)
                    tileComponent.replaceChild(
                        new Tile(tile.layer, TileTypeEnum.GROUND_HELL, tile.x, tile.y,
                            tile.width, tile.height, tile.baseWidth,tile.baseHeight)
                    )
                    tileRow[j] = tileComponent;
                }
                else if(tile.index == TileTypeEnum.WALL_JUNGLE)
                {
                    var tileComponent = new CompositeTile(tile.layer, tile.index, tile.x, tile.y,
                        tile.width, tile.height, tile.baseWidth,tile.baseHeight);
                    tileComponent.replaceChild(
                        new Tile(tile.layer, TileTypeEnum.GROUND_JUNGLE, tile.x, tile.y,
                            tile.width, tile.height, tile.baseWidth,tile.baseHeight)
                    )
                    tileRow[j] = tileComponent;
                }
                else{
                    new Tile(tile.layer, tile.index, tile.x, tile.y,
                        tile.width, tile.height, tile.baseWidth,tile.baseHeight)
                }
            }
            tileArray[i] = tileRow;
        }
        this.tiles = tileArray;
    }

    tryDestroyTile(x: number | undefined, y: number | undefined)
    {
        if(x != undefined && y!= undefined)
        {
            console.log(`trying to destroy: ${x}, ${y}`);
            let tile = this.tiles[x][y];
            this.tiles[x][y] = tile.tryDestroy();
            this.tileMap.putTileAt(this.tiles[x][y].index, x, y);
        }
    }
}


