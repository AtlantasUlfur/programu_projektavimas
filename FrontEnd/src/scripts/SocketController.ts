import { io, Socket } from 'socket.io-client'
import { MainMenuScene } from './scenes/MainMenuScene'
import MainScene from './scenes/MainScene'
import { sceneEvents } from './Events/EventsController'
import { Player } from './Models/Player'
import _ from 'lodash'
import { PlayerChangeWeapon } from './utils/Command/Command'
import { PlayerDecorator } from './utils/Decorator/PlayerDecorator'


//Singleton
export default class SocketController {
  private static _instance: SocketController | null = null
  private socket: Socket | null = null
  private scene: MainMenuScene | MainScene

  private constructor() {}

  public static getInstance(): SocketController {
    if (!SocketController._instance) {
      SocketController._instance = new SocketController()
    }
    return SocketController._instance
  }

  public connect(url: string, Scene: MainMenuScene | MainScene): void {
    if (!this.socket) {
      this.socket = io(url)
      this.scene = Scene

      this.socket.on('playerCount', payload => {
        const mainMenuScene = this.scene as MainMenuScene
        mainMenuScene.playerCount = payload
      })
      this.socket.on('lobbyStatus', payload => {
        const mainMenuScene = this.scene as MainMenuScene
        mainMenuScene.lobbyStatus = payload
      })
      this.socket.on('gameStart', payload => {
        const mainMenuScene = this.scene as MainMenuScene
        mainMenuScene.startGame(payload)
        //mainMenuScene.scene.start("MainScene", payload);
      })
      this.socket.on('turn', payload => {
        const mainScene = this.scene as MainScene
        mainScene.playersTurnId = payload
        sceneEvents.emit('turnChanged', payload)
      })
      this.socket.on('playerMove', payload => {
        const mainScene = this.scene as MainScene
        console.log(mainScene)
        mainScene.playerList.forEach(playerObj => {
          if (playerObj.id == payload.player) {
            playerObj.setTilePos(payload.x, payload.y)
          }
        })
      })
      this.socket.on('playersState', payload => {
        console.log(payload)
        const mainScene = this.scene as MainScene
        mainScene.playerList.forEach(playerObj => {

          if (playerObj.id == payload.socketId) {
            
            playerObj.setTilePos(payload.x, payload.y)
            console.log(playerObj)
            playerObj.setHP(payload.currentHP)
            sceneEvents.emit('hpChange')
            console.log(playerObj)
          }
        })
      })
      //TODO: ^^^^
      this.socket.on('playerDamage', payload => {
        const mainScene = this.scene as MainScene
        mainScene.playerList.forEach(playerObj => {
          if (playerObj.id == payload.player) {
            playerObj.setTint(0xff0000)
            setTimeout(() => {
              playerObj.clearTint()
            }, 250)
            playerObj.setHP(payload.currentHP)
            //If enemy dies
            if (playerObj.getCurrentHealth() == 0) {
              mainScene.alivePlayerCount--
              playerObj.die()
            }
            if (playerObj.getCurrentHealth() <= 75 && !playerObj.isBleeding) {
              PlayerDecorator.addBleedingEffect(playerObj);
            }
            if (playerObj.getCurrentHealth() <= 30 && !playerObj.isCrippled) {
              PlayerDecorator.addCrippledEffect(playerObj);
            }
          }
          if (mainScene.player.id == payload.player) {
            sceneEvents.emit('hpChange')
            //If player dies
            if (mainScene.player.getCurrentHealth() == 0) {
              sceneEvents.emit('gameOver', { victory: false })
              mainScene.player.die()
              mainScene.alivePlayerCount--
              this.endTurn()
              this.removeTurn()
            }
          }
        })
      })
      this.socket.on('attackAmount', payload => {
        const mainScene = this.scene as MainScene
        mainScene.player.attackPower = payload.currentAttack
      })
      this.socket.on('lobbies', payload => {
        const mainMenuScene = this.scene as MainMenuScene
        mainMenuScene.lobbies = payload.sessions
      })


      
      this.socket.on('gunChange', payload => { 
        console.log(payload);
        const mainScene = this.scene as MainScene;
 
        if (payload !== null) {
          let player = _.find(mainScene.playerList, (player: Player) => player.id === payload);
          if (player !== undefined) {
            var switchWeaponCommand = new PlayerChangeWeapon(player);
            if (player.selectedGun == player.mainGun)
              switchWeaponCommand.execute();
            else
              switchWeaponCommand.undo();
          }
        }
      });
    }
  }

  public getSocket(): Socket | null {
    return this.socket
  }

  public setScene(Scene: MainMenuScene | MainScene) {
    this.scene = Scene
  }

  public createLobby(name: string | null) {
    this.socket?.emit('createLobby', { name })
  }
  public loadState() {
    console.log("socketController")
    this.socket?.emit('loadState') 
  }

  public joinLobby(name: string | null, playerName: string | null) {
    this.socket?.emit('joinLobby', { name, playerName })
  }

  public startGame(name: string | null, theme: string | null) {
    this.socket?.emit('startGame', { name, theme })
  }

  public endTurn() {
    this.socket?.emit('endTurn')
  }

  public movePlayer(x: number, y: number) {
    this.socket?.emit('movePlayer', x, y)
  }
  public damagePlayer(damage: number, targetId: string) {
    this.socket?.emit('damagePlayer', damage, targetId)
  }
  public getAttackAmount() {
    this.socket?.emit('getAttackAmount')
  }
  public getLobbies() {
    this.socket?.emit('getLobbies')
  }
  public removeTurn() {
    this.socket?.emit('disconnect')
  }

  public changeGun() {
    this.socket?.emit('changeGun')
  }
}
