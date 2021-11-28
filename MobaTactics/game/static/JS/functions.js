function getHeroById(id){
	var GSheroes = gameState.heroes;
	var players = [];
	var hero = null;
	for (let i in GSheroes) {
		if (GSheroes[i].id == id) {
			hero = GSheroes[i];
		}
	}
	return hero
}
function getHeroByPos(pos){
	var GSheroes = gameState.heroes;
	var x = pos[0];
	var y = pos[1];
	var hero = null;
	for (let i in GSheroes) {
		if (GSheroes[i].x == x && GSheroes[i].y == y) {
			hero = GSheroes[i];
		}
	}
	return hero
}
function getHeroesByUserId(user_id){
	var GSheroes = gameState.heroes;
	var heroes = [];
	for (let i in GSheroes) {
		if (GSheroes[i].user_id == user_id) {
			heroes.push(GSheroes[i]);
		}
	}
	return heroes
}

function getPlayers(){
	var players = [];
	var ids = [];
	for (let i in gameState.players) {
		players.push(gameState.players[i].name);
		ids.push(gameState.players[i].user_id);
	}
	return [players,ids]
}

var waitMyMoveInterval;
function waitMyMove(){
	waitMyMoveInterval = setInterval (async function() {
		generate()
		console.log('waiting my move, got json with length '+Object.keys(gameState).length);
		if (Object.keys(gameState).length){
			if (update_id != gameState.update_id){
				update_id = gameState.update_id
				generate()
			}
			if (update_id == gameState.update_id && gameState.is_my_move){
				clearInterval(waitMyMoveInterval);
			}
		}
	}, 1000);
}
