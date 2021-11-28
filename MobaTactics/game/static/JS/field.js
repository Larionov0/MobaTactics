function generate(){
	var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	var field = document.getElementById("field");
	field.innerHTML = "";
	var x = 4;
	var y = 5;

	var sideSize = document.body.clientHeight/6;
	var sideSizePerc = 20;

    var tbody = document.createElement('tbody');
	for (let i = 0; i < x; i++) {
    	var tr = document.createElement('tr');
		for (let j = 0; j < y; j++) {
			var td = document.createElement('td');
			td.style.width = sideSize+"px";
			td.style.height = sideSize+"px";
			td.style.maxWidth = sideSize+"px";
			td.style.maxHeight = sideSize+"px";
			let id = alphabet[j]+(i+1).toString();
			td.id = id;
			// td.innerHTML = id;
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	field.appendChild(tbody);
	document.getElementById("ninja").value = sideSize;
	update();
}