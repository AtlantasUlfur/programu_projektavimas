export class PlayerDecorator {
    static addBleedingEffect(player) {
        player.isBleeding = true;
    }

    static removeBleedingEffect(player) {
        player.isBleeding = false;
    }

    static addCrippledEffect(player) {
        player.isCrippled = true;
    }

    static removeCrippledEffect(player) {
        player.isCrippled = false;
    }
  }
  