class User{

    constructor(name, amt_avail, socket_id, list_of_cards){
        this.name = name;
        this.amt_avail = amt_avail;
        this.list_of_cards = [];
        this.has_packed = false;
        this.socket_id = socket_id;
    }

    addCard(card){
        this.list_of_cards.push(card);
    }

    showCard(){
        console.log(this.list_of_cards);
    }

}

class Table{

    constructor(users, initial_amt){
        this.users = users;
        this.cards = this.card_generation();
        this.initial_amt = initial_amt;
        this.turn_of_player = 0;
        this.current_bet_amt = this.initial_amt;
        this.total_bet = 0;
    }

    card_generation(){

        var cards = [];
        for(var ch of ['S','H','C','D']){
            for (var i of ['2','3','4','5','6','7','8','9','10','J','Q','K','A']) {
                cards.push(i+ch);
            }
        }
        return cards;
    }

    generate_random_card_from_deck(){
        var max = this.cards.length-1; var min = 0;
        var random_number = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.cards.splice(random_number, 1)[0];
    }

}


var rank = require('./rank.js');
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("our server is running");
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

var stage_str = '';
var winner = -1;
var users = [];
var name = ['user1', 'user2'];
var table,i=0;
map = {};

function newConnection(socket){
	
	console.log(socket.id);
	map[socket.id] = i;
	socket.emit('response',{_id:socket.id, _name:name[i], _index:i});

	users.push(new User(name[i], 1000, socket.id)); i++;
	if(users.length ==2 ){
		io.sockets.emit('init', users);
		// table initialization.
		table = new Table(users, 20);
		fetch_initial_bet();
		io.sockets.emit('response',sendDataToClient(stage_str));
	}

	socket.on('sendResponse', userResponse);
}

function sendDataToClient(){

	data = {
		'total_bet':table.total_bet,
		'current_bet_amt':table.current_bet_amt,
		'turn_of_player':table.turn_of_player,
		'user1':users[0],
		'user2':users[1],
		'stage':stage_str,
		'winner':winner
		};

	stage_str = '';  // set stage back to empty
	return data;	
}


function userResponse(data){
	// socket.broadcast.emit('response', data);
	if(map[data.id] == table.turn_of_player){
		handleUsersAction(map[data.id], data.action);
		table.turn_of_player =! Number(table.turn_of_player);
		io.sockets.emit('response', sendDataToClient());
		// console.log(data);
	}	
}

function fetch_initial_bet(){

	for(var usr of table.users){
		usr.amt_avail -= table.initial_amt;
		table.total_bet += table.initial_amt;
		// assigning 3 cards to user.
		for (var i=0; i<3; i++) {
			usr.addCard(table.generate_random_card_from_deck());	
		}		
	}
}

function handleUsersAction(user_index, action){

	if(action == 'chaal'){
		users[user_index].amt_avail -= table.current_bet_amt;
		table.total_bet += table.current_bet_amt;
	
	}else if(action == 'raise'){
		table.current_bet_amt *= 2;
		users[user_index].amt_avail -= table.current_bet_amt;
		table.total_bet += table.current_bet_amt;
	
	}else if(action == 'pack'){
		// oponent player won
		users[user_index].has_packed = true;
		winner = Number(!user_index);
		stage_str = "player "+(user_index)+" has packed";
		console.log();
	}else if(action == 'show'){
		users[user_index].amt_avail -= table.current_bet_amt*2;
		table.total_bet += table.current_bet_amt*2;
		input = [users[0].list_of_cards,
				 users[1].list_of_cards];
		winner = rank.getWinner(input);	
		stage_str = "player "+(user_index)+" won";
	}
}

