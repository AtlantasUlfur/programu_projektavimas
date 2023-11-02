export class PlayerDecorator {
    static addBleedingEffect(player) {
        player.isBleeding = true;
    }

    static addCrippledEffect(player) {
        player.isCrippled = true;
    }
  }
  