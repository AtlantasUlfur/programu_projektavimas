import Adaptee from "./Adaptee";

export default class MathAdapter{
    constructor(){}
    private adaptee : Adaptee = new Adaptee()
    public calculate(vector : Phaser.Math.Vector2, funct: string, coord: string): number{
         var result = this.adaptee.Calculation(funct, vector, coord)
         return result;
    }
    public calculateEuclidean(vector : Phaser.Math.Vector2, vector2 : Phaser.Math.Vector2): number{
        var result = this.adaptee.CalculateEuclidean(vector, vector2)
        return result;
   }
  }