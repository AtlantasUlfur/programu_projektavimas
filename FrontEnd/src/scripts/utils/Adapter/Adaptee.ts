import * as math from 'mathjs'

export default class Adaptee{

    constructor(){}

    CalculateEuclidean(vector: Phaser.Math.Vector2, vector2: Phaser.Math.Vector2) : number {
        var tmp = math.distance([vector.x, vector.y], [vector2.x, vector2.y]) as number
        return Math.round(tmp)
    }
    public Calculation(funct: string, vector : Phaser.Math.Vector2, coord: string): number{
        var result = 0;
        switch(funct) { 
            case "abs": { 
               switch(coord){
                case "x":{
                    result = this.abs(vector.x)
                }
                case "y":{
                    result = this.abs(vector.y)
                }
               }
               break; 
            } 
            case "sqrt": { 
                switch(coord){
                    case "x":{
                        result = this.sqrt(vector.x)
                    }
                    case "y":{
                        result = this.sqrt(vector.y)
                    }
                   } 
               break; 
            } 
            case "round": { 
                switch(coord){
                    case "x":{
                        result = this.round(vector.x)
                    }
                    case "y":{
                        result = this.round(vector.y)
                    }
                   } 
               break; 
            } 
         } 
        return result;
    }
    public sqrt(number: number): number{
        var result = math.sqrt(number) as number
        return result
    }
    public abs(number: number): number{
        var result = math.abs(number)
        return result
    }
    public round(number: number): number{
        var result = math.round(number)
        return result
    }
  }