function loadLog(){
	clearMessages();
	var message_display = document.getElementById("message_display");
	for (let i in gameState.messages) {
		var log = gameState.messages[Number(i)];

		var message = document.createElement("div");
		message.classList.toggle("message");

		var text_message = document.createElement("span");
		text_message.classList.toggle("text_message");
		text_message.innerText = log;

		message.appendChild(text_message);
		message_display.appendChild(message);
	}
}

function loadMessages() {
	clearMessages();
	var message_display = document.getElementById("message_display");
	for (let i in gameState.chat) {
		var log = gameState.chat[Number(i)];
		var players = getPlayers();

		// console.log(players);
		var message = document.createElement("div");
		message.classList.toggle("message");
		message.classList.toggle("user_"+(players[1].indexOf(log.from_id)+1));

		var time_message = document.createElement("span");
		time_message.classList.toggle("time_message");
		time_message.innerText = log.datetime;

		var nickname_message = document.createElement("span");
		nickname_message.classList.toggle("nickname_message");
		nickname_message.innerText = log.from + ":";

		var text_message = document.createElement("span");
		text_message.classList.toggle("text_message");
		text_message.innerText = log.message;

		message.appendChild(time_message);
		message.appendChild(nickname_message);
		message.appendChild(text_message);
		message_display.appendChild(message);
	}
}

function loadPrivate(){
	clearMessages();	
	var message_display = document.getElementById("message_display");
	var message = document.createElement("div");
	message.classList.toggle("message");

	var text_message = document.createElement("span");
	text_message.classList.toggle("text_message");
	text_message.innerText = 'I am Private!';

	message.appendChild(text_message);
	message_display.appendChild(message);
}

function loadGlobal(){	
	clearMessages();	
	var message_display = document.getElementById("message_display");
	var message = document.createElement("div");
	message.classList.toggle("message");

	var text_message = document.createElement("span");
	text_message.classList.toggle("text_message");
	text_message.innerText = 'I am Global!';

	message.appendChild(text_message);
	message_display.appendChild(message);
}

function clearMessages(){
	var message_display = document.getElementById("message_display");
	message_display.innerHTML = null;
}

function sendMessage(event){
	try{event.preventDefault();}
	catch{};
	var message_box = document.getElementById("message_box");
	var input_field = document.querySelectorAll("#message_box input")[0];
	var players = getPlayers();
	var name = players[0][players[1].indexOf(current_user)]
	if (input_field.value != ''){
		fetch('/api/v1/send_message', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrf_token
			},
			body: JSON.stringify({
				'message': input_field.value})
		}
		).then((response) => {return response.json()}
		).then((data) => {
			console.log(data)
		})
		input_field.value = null;
		loadMessages();
	}
}

function customAddMessage(text){
	var message_display = document.getElementById("message_display");
	var message = document.createElement("div");
	message.classList.toggle("message");

	var text_message = document.createElement("span");
	text_message.classList.toggle("text_message");
	text_message.innerText = text;

	message.appendChild(text_message);
	message_display.appendChild(message);

}