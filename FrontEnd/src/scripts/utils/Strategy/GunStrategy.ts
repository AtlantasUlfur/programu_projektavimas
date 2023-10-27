//Strategy interface
export interface IGunDamageStrategy {
  calculateDamage(distance: number, baseDamage: number): number
}

//ShortRange Strategy
export class ShortRangeGunStrategy implements IGunDamageStrategy {
  calculateDamage(distance: number, baseDamage: number): number {
    let maxDistance = 3
    if (distance > maxDistance) {
      return 0
    }
    return Math.round(baseDamage + (maxDistance / 2 - distance))
  }
}

//MediumRange Strategy
export class MediumRangeGunStrategy implements IGunDamageStrategy {
  calculateDamage(distance: number, baseDamage: number): number {
    let maxDistance = 6
    if (distance > maxDistance) {
      return 0
    }
    return Math.round(baseDamage + (maxDistance / 2 - distance))
  }
}

//LongRange Strategy
export class LongRangeGunStrategy implements IGunDamageStrategy {
  calculateDamage(distance: number, baseDamage: number): number {
    let maxDistance = 9
    if (distance > maxDistance) {
      return 0
    }
    return Math.round(baseDamage + (maxDistance / 2 - distance))
  }
}
//MaxRange Strategy
export class MaxRangeGunStrategy implements IGunDamageStrategy {
  calculateDamage(distance: number, baseDamage: number): number {
    return baseDamage
  }
}
