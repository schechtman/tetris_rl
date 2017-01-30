var Qtable = []
for (var j = 0; j < 4096; j++){
	Qtable.push(Math.random())
}

var pieces=[[1,1,0,0],[1,0,0,0],[1,0,0,1],[1,1,1,1],[1,1,1,0]]
var state3 = [];
var state3Q = [];
for ( var j = 0; j < 36; j++){
	state3.push(0);
	state3Q.push(0);
}
var state4 = state3.slice();

var state4Q = state3Q.slice();


var timeout = 1000;
function select_posQ(x,y){
	return $(".brick#x"+y.toString()+x.toString()+"Q");
}
function select_pos(x,y){
	return $(".brick#x"+y.toString()+x.toString());
}

function rotate(piece,n=1){
	var piece1 = piece.slice();
	var piece2 = piece.slice();
	for ( var i = 0; i < n; i++){
		var piece2=[0,0,0,0];
		piece2[0] = piece1[2];
		piece2[1] = piece1[0];
		piece2[3] = piece1[1];
		piece2[2] = piece1[3];
		
		piece1=piece2.slice()

		
	}
	return piece2;
}

function Gravity(piece){
	var piece2 = piece.slice()
	if (piece[2] + piece[3] < 1){
		piece2[2] = piece[0];
		piece2[3] = piece[1];
		piece2[1] = 0;
		piece2[0] = 0;
	}
	return piece2;
}

function Draw_piece(x,y,rot,piece,on_or_now,Q){
	if(Q == 0){
		select_function = select_pos;
	}
	else{
		select_function = select_posQ;
	}
	for( var i = 0; i < rot; i++){
		piece = rotate(piece);
	}
	if(!select_function(x,y).hasClass(on_or_now)){
	select_function(x,y).addClass(piece[0] ? on_or_now : "" );}
	if(!select_posQ(x+1,y).hasClass(on_or_now)){
	select_function(x+1,y).addClass(piece[1] ? on_or_now : "" );}
	if(!select_posQ(x,y+1).hasClass(on_or_now)){
	select_function(x,y+1).addClass(piece[2] ? on_or_now : "" );}
	if(!select_function(x+1,y+1).hasClass(on_or_now)){
	select_function(x+1,y+1).addClass(piece[3] ? on_or_now : "" );}
}



function check(x,rot,piece,state){
	for ( var i = 0; i<rot; i++){
		piece = rotate(piece);
	}
	if ( ((state[x + 12] + piece[2]) < 2) && ((state[x + 13] + piece[3]) < 2) && ((state[x + 18] + piece[0]) < 2) && ((state[x + 19] + piece[1]) < 2) ){

		if (((state[x + 18] + piece[2]) < 2) && ((state[x + 19] + piece[3]) < 2)){
			return 1;
			}
		else{
			return 2;
			}
	}
	else{
		if ( ((state[x + 18] + piece[2]) < 2) && ((state[x + 19] + piece[3]) < 2)){
		return 3;
		}
		else{
			return 4;
		}
	}

}

function check_if_possible(x,rot,piece,state){
	if (check(x,rot,piece,state) == 1){
		return 1;
	}
	else if (check(x,rot,piece,state) > 2){
		return check(x,rot,piece,state)*10;
		}
	else if (check(x,rot,piece,state) == 2){
		if(x < 5 && check(x + 1, rot, piece,state) == 1)
			return 2;
			
		else if (x > 0 && check(x - 1,rot,piece,state) == 1){
			return 3;

			}
		else{
			return 40;
		}
		}


}

function check_state(h,state){
	var h_mod = 0;
	var first_level = 0;
	var second_level = 0;
	for ( var i = 0; i < 6; i++){
		first_level += state[i + 12];
		second_level += state[i + 18];
	}
	if ( second_level == 6){
		h_mod += 1;
		for ( var i = 0; i < 6; i++){
			state[i + 18] = state[i + 24];
			state[i + 24] = 0;
			state[i + 30] = 0;

		}
	}

	if ( first_level == 6){
		h_mod += 1;
		for (var i = 0; i < 6; i++){
			state[i + 12] = state[i + 18];
			state[i + 18] = state[i + 24];
			state[i + 24] = 0;
			state[i + 30] = 0;
		}
	}

	if ( h > h_mod){
		for ( var i = 0; i < 6; i++){
			state[i] = state[i + 6*(h - h_mod)];
			state[i + 6] = state[i + 6 + 6*(h - h_mod)];
			state[i + 12] = state[i + 12 + 6*(h - h_mod)];
			state[i + 18] = state[i + 18 + 6*(h - h_mod)];
			state[i + 24] = 0;
			state[i + 30] = 0;
		}
	}
	return state
}


function Clean_Game(h,Q){
	
	if(Q == 0){
		select_function = select_pos;
		var state = state4;
	}
	else{
		select_function = select_posQ;
		var state = state4Q
	}
	check_state(h,state);
	for( var i = 0; i< 6; i++){
		select_function(i,6).removeClass("but");
		select_function(i,6).addClass(state[i] ? "but" : "");
		select_function(i,5).removeClass("but");
		select_function(i,5).addClass(state[i + 6] ? "but" : "");
		select_function(i,4).removeClass("on");
		select_function(i,4).addClass(state[i + 12] ? "on" : "");

		select_function(i,3).removeClass("on");
		select_function(i,3).addClass(state[i + 18] ? "on" : "");

		select_function(i,2).removeClass("on");
		select_function(i,1).removeClass("on");


	}
	console.log("c'est fait");
}


function Put_a_piece(x,y,piece,right_or_left,i,callback,Q){
	var r_l = 0;
	if(Q == 1){
		var state2 = state3Q;
		var state = state4Q;
		var class_string = ".Q.now";
	}
	else{
		var state2 = state3;
		var state = state4;
		var class_string = ".now"
	}
	if( right_or_left == 2){
		r_l = 1;
	}
	else if ( right_or_left == 3){
		r_l = -1;
	}

	$(class_string).each(function(){$(this).removeClass("now");})
	if( i !=y ){
		Draw_piece(x+r_l,i,0,piece,"now",Q)
		setTimeout(function(){Put_a_piece(x, y,piece, right_or_left, i + 1, callback,Q);},timeout/10);
	}
	else{
		Draw_piece(x + r_l,y,0,piece,"now",Q);
		Draw_piece(x,y,0,piece,"on",Q);

		$(class_string).each(function(){$(this).removeClass("now");})
		/*state[x + 6] = piece[0];
		state[x + 7] = piece[1];
		state[x] = piece[2];
		state[x + 1] = piece[3];*/

		state[x + 6*(6 - y)] += piece[0];
		state[x + 6*(6 - y) + 1] += piece[1];
		state[x + 6*(6 - y - 1)] += piece[2];
		state[x + 6*(6 - y - 1) + 1] += piece[3];

		state2 = state.slice()
		console.log(state3.slice(30,36),"aaa0");
		console.log(state3.slice(24,30),"aaa1");
		console.log(state3.slice(18,24),"aaa2");
		console.log(state3.slice(12,18),"aaa3");
		first+=1;
		setTimeout(callback,timeout/10);
	}
}



var first = 0;
var second = 0;

var piece = pieces[0];
var pieceQ = pieces[0];
function Game_round(){

	state3 = state4.slice()
	second += 1;
	var rand = Math.floor(Math.random() * 4 );
	console.log(piece,"vvvvvvvvvvvvvvvvvvvvv")


	//random algorithm
	rand=Math.floor(Math.random() * 4);
	piece = rotate(piece,rand);


	console.log(piece,"dddddddddddddddddddd")
	piece = Gravity(piece);
	rand = Math.floor(Math.random()*5)
	var right_or_left=check_if_possible(rand,0,piece,state4);


	console.log(state3.slice(30,36));
	console.log(state3.slice(24,30));
	console.log(state3.slice(18,24));
	console.log(state3.slice(12,18));
	console.log(piece,rand,right_or_left);
	if(right_or_left<10){

		Put_a_piece(rand,3,piece,right_or_left,0,function(){Clean_Game(0,0);},0);
		console.log(piece,";;;;;;;;;;;;;;;;;;;");

	}

	else if (right_or_left==30){
		if(piece[0]+piece[1]>0){
			console.log("la hauteur augmente de 1");
			$("#height").text(Number($("#height").text())+1);
			Put_a_piece(rand,2,piece,1,0,function(){Clean_Game(1,0);},0)
			}


		

		else{
			console.log("la pièce peut tomber mais attention");
			Put_a_piece(rand,2,piece,1,0,function(){Clean_Game(0,0)},0);

		}
	}

	else{
		$("#height").text(Number($("#height").text())+2);
		Put_a_piece(rand,1,piece,1,0,function(){Clean_Game(2,0);},0)

	}

	
}
function state_to_int(state){
	var int_representation = 0;
	for ( var i = 0; i < 6; i++){
		int_representation += Math.pow(2, state[i + 12])
		int_representation += Math.pow(2, state[i + 18])
	}
	return int_representation
}
function Game_roundQ(){
	$(".state1").text(state4Q.slice(18,24));
	$(".state2").text(state4Q.slice(12,18));
	state3Q=state4Q.slice();
	var state_index = 0;
	var position = 0;
	var rotation = 0;
	var min = Number.MIN_SAFE_INTEGER;
	var next_state = state4Q.slice();
	var piece2 = pieceQ.slice();
	var r_lQ = check_if_possible(0,0,piece2,next_state);

	for (var i = 0; i < 5; i++){
		for( var j = 0; j < 4; j++){
			piece2 = rotate(pieceQ,j);
			piece2 = Gravity(piece2);
			next_state = state4Q.slice();
			var r_l = check_if_possible(i,0,piece2,next_state)
			if (r_l <5){
				next_state[12 + i] += piece2[2];
				next_state[13 + i] += piece2[3];
				next_state[18 + i] += piece2[0];
				next_state[19 + i] += piece2[1];

			}
			else if (r_l == 30){
				next_state[18 + i] += piece2[2];
				next_state[19 + i] += piece2[3];
				next_state[24 + i] += piece2[0];
				next_state[25 + i] += piece2[1];
			}
			else if (r_l == 40){
				next_state[24 + i] += piece2[2];
				next_state[25 + i] += piece2[3];
				next_state[30 + i] += piece2[0];
				next_state[31 + i] += piece2[1];
			}

			next_state = check_state(0,next_state);
			var int_representation = state_to_int(next_state)

			if (Qtable[int_representation] > min){
				min = Qtable[int_representation]
				state_index = int_representation;
				position = i;
				rotation = j;
				r_lQ = r_l;
			}
			}
		}

	piece2=Gravity(piece);
	for( var i = 0; i < rotation; i++){
		piece2=rotate(piece2);
	}
	if(r_lQ<10){

			Put_a_piece(position,3,piece2,r_lQ,0,function(){Clean_Game(0,1);},1);
			console.log(first)

		}

		else if (r_lQ==30){
			if(piece2[0]+piece2[1]>0){
				console.log("la hauteur augmente de 1");
				$("#heightQ").text(Number($("#height").text())+1);
				Put_a_piece(position,2,piece2,1,0,function(){Clean_Game(1,1);},1)
				}


			

			else{
				console.log("la pièce peut tomber mais attention");
				Put_a_piece(position,2,piece2,1,0,function(){Clean_Game(0,1)},1);

			}
		}

		else{
			$("#heightQ").text(Number($("#height").text())+2);
			Put_a_piece(position,1,piece2,1,0,function(){Clean_Game(2,1);},1)

		}


	

}

function Double_Game_round(){
	var rand = Math.floor(Math.random() * 5 );
	
	piece = pieces[rand].slice();
	pieceQ = pieces[rand].slice();
	console.log(rand,"rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
	console.log(piece,pieceQ);

	Game_round();
	Game_roundQ();
}

setInterval(Double_Game_round,timeout);