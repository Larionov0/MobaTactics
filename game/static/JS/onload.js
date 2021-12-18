window.onload = function() {
	// whoMoves();
	generate();
	// user2_name.addEventListener("click", function(){gameState.user_id_move = players[1][1]; generate()}, false);

	var chat_selector = document.querySelectorAll("#icon_display img");
	chat_selector.forEach(function(e){
		e.addEventListener("click", function(){changeChat(e)}, false);
	})

	var message_box = document.getElementById("message_box");
	message_box.addEventListener("submit", sendMessage);

	var end_turn = document.getElementById("end_turn");
	end_turn.addEventListener("click", endTurn);
	askForUpdates();
}

function changeChat(e){
	var child = e;
	var parent = child.parentNode;
	var index = Array.prototype.indexOf.call(parent.children, child);
	selected_message = index;
	setChat(selected_message);
}

function setChat(i){
	switch (selected_message){
		case 0:
			loadLog();
    		break;
		case 1:
			loadMessages();
    		break;
		case 2:
			loadPrivate();
    		break;
		case 3:
			loadGlobal();
    		break;
	}
}

function askForUpdates(){
	setInterval (async function() {
		await load()
		console.log('asking update at '+gameState.update_id+' at '+update_id);
		if (Object.keys(gameState).length){
			if (update_id != gameState.update_id){
				update_id = gameState.update_id
				// console.log(update_id)
				// console.log(gameState.update_id)
				generate()
			}
		}
	}, 250);
}

function endTurn(){
	if (gameState.is_my_move){
		fetch('/api/v1/end_turn', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrf_token
				}
			}
			).then((response) => {return response.json()}
			).then((data) => {
				console.log(data)  // {"heroes": ...}
				if (data.ok){
					current_user = gameState.player_id;
					// waitMyMove();
				}
			})
	}
}