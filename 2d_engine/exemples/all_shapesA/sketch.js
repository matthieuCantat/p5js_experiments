import { gameEngine } from '../../core/gameEngine.js';
import { scene_info } from './scene_info.js';

var GameEngine = new gameEngine();
GameEngine.load_scene(scene_info);
GameEngine.setup();

window.onload = function() {GameEngine.setup_listeners();}

function game_loop(){
	
	GameEngine.update();
	GameEngine.draw();
	requestAnimationFrame(game_loop);
}

game_loop()
