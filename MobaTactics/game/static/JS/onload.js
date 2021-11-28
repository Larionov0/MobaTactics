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
}

function changeChat(e){
	var child = e;
	var parent = child.parentNode;
	var index = Array.prototype.indexOf.call(parent.children, child);
	switch (index){
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
			endTurn();
    		break;
	}
}

function endTurn(){
	var attempt = fetch('/api/v1/end_turn', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrf_token
			}
		}
		).then((response) => {return response.json()}
		).then((data) => {
			console.log(data)  // {"heroes": ...}
		})
	if (attempt.ok){
		waitMyMove();
	}
}