// var gameState = {
// 	"version": 1,
// 	"players": [
// 		{
// 			"name": "Xenu",
// 			"user_id": 1
// 		},
// 		{
// 			"name": "viplash4",
// 			"user_id": 2
// 		}
// 	],
// 	"heroes": [
// 		{
// 			"id": 1,
// 			"name": "Patches",
// 			"icon_name": "Patches_the_Pirate_full.jpg",
// 			"hp": 20,
// 			"attack": 3,
// 			"speed": 2,
// 			"moves_made": 0,
// 			"x": 2,
// 			"y": 1,
// 			"user_id": 2,
// 			"is_active": true
// 		},
// 		{
// 			"id": 2,
// 			"name": "zxKOT",
// 			"icon_name": "zxKOT.png",
// 			"hp": 37,
// 			"attack": 13,
// 			"speed": 1,
// 			"moves_made": 0,
// 			"x": 2,
// 			"y": 2,
// 			"user_id": 2,
// 			"is_active": true
// 		},
// 		{
// 			"id": 3,
// 			"name": "Detective Pepe",
// 			"icon_name": "Detective Pepe.png",
// 			"hp": 10,
// 			"attack": 5,
// 			"speed": 3,
// 			"moves_made": 0,
// 			"x": 5,
// 			"y": 4,
// 			"user_id": 1,
// 			"is_active": true
// 		},
// 		{
// 			"id": 4,
// 			"name": "Ricardo",
// 			"icon_name": "Ricardo.png",
// 			"hp": 7,
// 			"attack": 1,
// 			"speed": 8,
// 			"moves_made": 0,
// 			"x": 4,
// 			"y": 4,
// 			"user_id": 1,
// 			"is_active": true
// 		}
// 	],
// 	"messages": [
// 		"Вася ударил петю. Нанес 10 урона.",
// 		"Петя откинул копыта",
// 		"Здесь будут последние 10 сообщений"
// 	],
// 	"user_id_move": 1,
// 	"winner": null,
// 	"chat": [
// 		{
// 			"user_id": 1,
// 			"message": "невиплашам привет!",
// 			"datetime": "19:57"
// 		},
// 		{
// 			"user_id": 2,
// 			"message": "а?",
// 			"datetime": "19:58"
// 		},
// 		{
// 			"user_id": 2,
// 			"message": "дароу",
// 			"datetime": "19:58"
// 		},
// 		{
// 			"user_id": 1,
// 			"message": "в доту?",
// 			"datetime": "19:57"
// 		},
// 		{
// 			"user_id": 1,
// 			"message": "а патом работать.......",
// 			"datetime": "19:57"
// 		},
// 		{
// 			"user_id": 2,
// 			"message": "нуууууу",
// 			"datetime": "19:59"
// 		},
// 		{
// 			"user_id": 2,
// 			"message": "я щас презентацию с английского сдам",
// 			"datetime": "19:59"
// 		},
// 		{
// 			"user_id": 2,
// 			"message": "и можем работать",
// 			"datetime": "19:59"
// 		}
// 	]
// }


var gameState={}

async function load(){
	var result = await fetch('/api/v1/get_data', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrf_token
		},
		body: JSON.stringify({
			'update_id': update_id})
	})
	var data = await result.json()
	if (Object.keys(data).length){
		gameState = data
	}
}

function update_from_gameState() {
	var size = document.getElementById("ninja").value*0.5+"px";
	var field = document.getElementById("field");
	var heroes = gameState.heroes;
	for (i in heroes) {
		var hero = heroes[i];
		var id = hero.id;
		var name = hero.name;
		var icon = hero.icon;
		var hp = hero.hp;
		var damage = hero.damage;
		var armor = hero.armor;
		var speed = hero.speed;
		var movement = hero.movement;
		var user_id = hero.user_id;
		var x = hero.x + 1;
		var y = hero.y + 1;
		var is_active = hero.is_active;
		// console.log("SET HERO", name, x, y);


		var cell = field.querySelectorAll("tr:nth-of-type("+(y)+") td:nth-of-type("+x+")")[0];
		if (cell != null) {
			cell.title = name;

			var card_disp = document.createElement("div");
			card_disp.classList.toggle("card_disp");
			var image_disp = document.createElement("div");
			image_disp.classList.toggle("image_disp");
			var icon_disp = document.createElement("img");
			icon_disp.classList.toggle("icon_disp");
			var border_disp = document.createElement("img");
			border_disp.classList.toggle("border_disp");
			var attack_disp = document.createElement("div");
			attack_disp.classList.toggle("attack_disp");
			var hp_disp = document.createElement("div");
			hp_disp.classList.toggle("hp_disp");
			var armor_img = document.createElement("div");
			armor_img.classList.toggle("armor_img");
			var armor_disp = document.createElement("div");
			armor_disp.classList.toggle("armor_disp");
			var moves_disp = document.createElement("div");
			moves_disp.classList.toggle("moves_disp");
			var cell_overlay = document.createElement("div");
			cell_overlay.classList.toggle("cell_overlay");

			image_disp.appendChild(icon_disp);
			image_disp.appendChild(border_disp);
			card_disp.appendChild(image_disp);
			card_disp.appendChild(attack_disp);
			card_disp.appendChild(hp_disp);
			card_disp.appendChild(armor_img);
			card_disp.appendChild(armor_disp);
			card_disp.appendChild(moves_disp);
			cell.appendChild(card_disp);
			cell_overlay.setAttribute("name",id);
			card_disp.appendChild(cell_overlay);

			icon_disp.src = hero.img_src;
//			border_disp.src = "props/hs_icon.png";
			attack_disp.innerHTML = damage;
			hp_disp.innerHTML = hp;
			armor_disp.innerHTML = armor;
			moves_disp.innerHTML = movement;

			if(is_active){
				if(movement > 0){
					cell_overlay.addEventListener("mouseover", hoverOn, false);
					cell_overlay.addEventListener("mouseout", hoverOff, false);
					if(user_id == gameState.player_id && gameState.is_my_move){
						cell_overlay.addEventListener("click", clickOn, false);
					}
				}
				if(user_id == gameState.player_id && gameState.is_my_move){
					document.getElementById("end_turn").removeAttribute('disabled');
					cell_overlay.addEventListener("contextmenu", contextOn, false);
				} else {
					document.getElementById("end_turn").setAttribute('disabled', 'true');
				}
			}
			else{
				cell_overlay.style.backgroundColor = "rgb(228, 228, 228, 0.5)";
			}
			cell.style.fontSize = size;
			cell.style.fontFamily = "Noto";
			cell.style.color = "white";
		}
	}
}


async function update() {
	await load()
	if (Object.keys(gameState).length){
		update_from_gameState()
		drawPlayers()
		setChat(selected_message)
	}
}


function drawPlayers(){
	var players = getPlayers();
	current_user = gameState.player_id;
	var user1_name = document.querySelectorAll("#field_layout span.user_1")[0];
	user1_name.innerText = players[0][0];
	var user2_name = document.querySelectorAll("#field_layout span.user_2")[0];
	user2_name.innerText = players[0][1];
	if (players[1][0] == current_user){
		user1_name.style.textDecoration = "underline";	
	} else {
		user2_name.style.textDecoration = "underline";
	}
}


function hoverOn(){
	showMoves(this.getAttribute("name"));
}

function hoverOff(){
	hideMoves(this.getAttribute("name"));
}

function clickOn(){
	this.removeEventListener("mouseout", hoverOff, false);
	tryMove(this.getAttribute("name"));
}

function contextOn(event){
	event.preventDefault();
	tryAttack(this.getAttribute("name"));
}