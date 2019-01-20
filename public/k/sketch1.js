function setup() {
	createCanvas(500, 500);
	background(51);
	unique_id = "";
	socket = io.connect('http://192.168.3.101:3000');
	socket.on('response', onResponse);
}

function onResponse(data){
	// noStroke();
	// fill(255, 0, 100);
	// ellipse(data.x, data.y, 36, 36);
	console.log(data)
	unique_id = data;
	console.log("sdjhkjsfdnhkhfsih"+unique_id);
}

function mouseDragged(){
	console.log(mouseX+','+mouseY);
	var data = {
		x : mouseX,
		y : mouseY
	}
    
	socket.emit('sendResponse', data);

	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 50, 50);
}

function draw() {   

}	
