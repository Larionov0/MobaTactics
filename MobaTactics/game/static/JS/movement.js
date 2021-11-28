
function showMoves(id){
	var field = document.getElementById("field");
	
	var hero = getHeroById(id);

	if (current_user == hero.user_id){

		var hero_cell = field.querySelectorAll("tr:nth-of-type("+(5-hero.y)+") td:nth-of-type("+hero.x+")")[0];
		hero_cell.oldcolor = hero_cell.style.backgroundColor;
		hero_cell.style.backgroundColor = "rgba(180, 201, 254, 0.9)";

		// var movement = hero.movement.split(';');
		// console.log(movement)
		var availableMoves = calculateMoves(hero.x, hero.y);
		// console.log(availableMoves)

		// console.log(availableMoves);
		for (let i in availableMoves) {

			try {
				var cellToHighlight = field.querySelectorAll("tr:nth-of-type("+(5-availableMoves[i][1])+") td:nth-of-type("+availableMoves[i][0]+")")[0];
				// console.log(cellToHighlight.id);
				if (cellToHighlight.childNodes[0] == null){
					cellToHighlight.oldcolor = cellToHighlight.style.backgroundColor;
					cellToHighlight.style.backgroundColor = "rgba(124, 212, 132, 0.9)";
				}
			} catch (error) {
				// console.log(error);
			}
		}
		// console.log(gameState)
	}
}

function hideMoves(id){
	var field = document.getElementById("field");
	if (id == null){
		id = Number(this.name);
	}

	var hero = getHeroById(id);

	if (current_user == hero.user_id){

		var hero_cell = field.querySelectorAll("tr:nth-of-type("+(5-hero.y)+") td:nth-of-type("+hero.x+")")[0];
		hero_cell.style.backgroundColor = hero_cell.oldcolor;

		// var movement = hero.movement.split(';');
		// console.log(movement)
		var availableMoves = calculateMoves(hero.x, hero.y);
		// console.log(availableMoves)

		for (let i in availableMoves) {

			try {
				var cellToHighlight = field.querySelectorAll("tr:nth-of-type("+(5-availableMoves[i][1])+") td:nth-of-type("+availableMoves[i][0]+")")[0];
				// console.log(cellToHighlight.id);
				if (cellToHighlight.childNodes[0] == null){
					cellToHighlight.style.backgroundColor = cellToHighlight.oldcolor;
					cellToHighlight.removeEventListener("click", makeMove, false);
					cellToHighlight.removeEventListener("click", makeAttack, false);
				}
			} catch (error) {
				// console.log(error);
			}
		}
		// console.log(gameState)
	}
}

function cancelAction(){
	generate();
}

function tryMove(id){
	var field = document.getElementById("field");
	
	var hero = getHeroById(id);

	if (current_user == hero.user_id){

		var hero_cell = field.querySelectorAll("tr:nth-of-type("+(5-hero.y)+") td:nth-of-type("+hero.x+")")[0];
		var active = hero_cell.querySelectorAll(".cell_overlay")[0];
		active.addEventListener("click", cancelAction, false);
		// hero_cell.style.backgroundColor = "rgba(192, 192, 192, 0.9)";

		var availableMoves = calculateMoves(hero.x, hero.y);
		// console.log(availableMoves)

		// console.log(availableMoves);
		for (let i in availableMoves) {

			try {
				var cellToHighlight = field.querySelectorAll("tr:nth-of-type("+(5-availableMoves[i][1])+") td:nth-of-type("+availableMoves[i][0]+")")[0];
				// console.log(cellToHighlight.id);
				if (cellToHighlight.childNodes[0] == null){
					cellToHighlight.removeEventListener("click", makeAttack, false);
					cellToHighlight.addEventListener("click", makeMove, false);
					cellToHighlight.name = [availableMoves[i][0],availableMoves[i][1],id];
				}
			} catch (error) {
				// console.log(error);
			}
		}
		// console.log(gameState)
	}
}

function makeMove(){
	var field = document.getElementById("field");
	let pos = this.name;
	this.removeAttribute("name");
	var attempt = fetch('/api/v1/make_move', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrf_token
			},
			body: JSON.stringify({
				'hero_id': pos[2],
				'x': pos[0]-1,
				'y': pos[1]-1})
		}
		).then((response) => {return response.json()}
		).then((data) => {
			console.log(data)  // {"heroes": ...}
		})
	if (attempt.ok){
		waitMyMove();
	}
}

function tryAttack(id){
	cancelAction();
	var field = document.getElementById("field");
	
	var hero = getHeroById(id);

	if (current_user == hero.user_id){

		var hero_cell = field.querySelectorAll("tr:nth-of-type("+(5-hero.y)+") td:nth-of-type("+hero.x+")")[0];
		hero_cell.style.backgroundColor = "rgba(180, 201, 254, 0.9)";
		var active = hero_cell.querySelectorAll(".cell_overlay")[0];
		active.addEventListener("click", cancelAction, false);
		active.addEventListener("contextmenu", cancelAction, false);
		active.removeEventListener("mouseover", hoverOn, false);
		active.removeEventListener("mouseout", hoverOff, false);

		var availableMoves = calculateMoves(hero.x, hero.y);
		// console.log(availableMoves)

		var li = 0
		// console.log(availableMoves);
		for (let i in availableMoves) {

			try {
				var cellToHighlight = field.querySelectorAll("tr:nth-of-type("+(5-availableMoves[i][1])+") td:nth-of-type("+availableMoves[i][0]+")")[0];
				// console.log(cellToHighlight.id);
				cellToHighlight.style.backgroundColor = cellToHighlight.oldcolor;
				// if (cellToHighlight.childNodes[0] != null){
					cellToHighlight.style.backgroundColor = "rgba(232, 172, 134, 0.9)";
					cellToHighlight.removeEventListener("click", makeMove, false);
					cellToHighlight.addEventListener("click", makeAttack, false);
					cellToHighlight.name = [availableMoves[i][0],availableMoves[i][1],id];
					li += 1;
				// }
			} catch (error) {
				// console.log(error);
			}
		}
		if (li == 0){
			hero_cell.style.backgroundColor = "rgba(180, 201, 254, 0.9)";
		}
	}
}

function makeAttack(){
	var field = document.getElementById("field");
	let pos = this.name;
	this.removeAttribute("name");
	var hero = getHeroById(pos[2]);
	var enemy_hero = getHeroByPos([pos[0], pos[1]]);
	// hero.moves_made = 100;
	// hero.is_active = false;
	// whoMoves();
	var attempt = fetch('/api/v1/attack', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrf_token
			},
			body: JSON.stringify({
				'hero_id': hero.id,
				'target_id': enemy_hero.id})
		}
		).then((response) => {return response.json()}
		).then((data) => {
			console.log(data)  // {"heroes": ...}
		})
	if (attempt.ok){
		waitMyMove();
	}
}


function calculateMoves(heroX, heroY){
	var coords = [[1,0],[-1,0],[0,1],[0,-1]];
	var res = []
	for (let i in coords) {
		res.push([heroX+coords[i][0],heroY+coords[i][1]]);
	}
	res = Array.from(new Set(res.map(JSON.stringify)), JSON.parse)
	// console.log(res)
	return res
}
