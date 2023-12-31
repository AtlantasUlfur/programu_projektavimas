export default class flyweight {
    private  assets: { [key: string]: any } = {};
  
     load(key: string, type: string, path: string, options: any, scene: Phaser.Scene) {
      if (!this.assets[key]) {
        console.log(this.assets)
        switch (type) {
          case 'image':
            this.assets[key] = scene.load.image(key, path);
            break;
          case 'audio':
            this.assets[key] = scene.load.audio(key, path);
            break;
          case 'spritesheet':
            this.assets[key] = scene.load.spritesheet(key, path, options);
            break;
          default:
            break;
        }
      }
      return this.assets[key];
    }
  }