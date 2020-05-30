/*     Lode Runner

Autores: Diogo Paulico (56187), Miguel Ramalhete (55833)

Testamos o programa em vários níveis e segundo o que conseguimos determinar,
 todas as funcionalidades pedidas pelo enunciado foram implementadas à exceção
 do movimento ascendente de robôs devido ao facto de serem priorizados
 os movimentos descendente, esquerda e direita pois são os mais importantes
 para garantir que estes se cruzam com o herói. Para além das funcionalidades 
 pedidas implementamos ainda o restauro automático de tijolos que não contém 
 robôs de modo a que o herói não pudesse "esburacar" o mundo. Implementamos 
 ainda o recomeço do nível caso o herói ficasse preso num buraco que criou, 
 havendo raras situações em que este evento não se verifica. Em certos blocos 
 de escada escondida a queda é interrompida. Existem raras situações em que 
 recuo causa a substituição do robô pelo herói na matriz world active 
 motivadas pela desaceleração da animação do herói necessária para tornar 
 os níveis jogáveis. Caso um robô alcance o herói é apresentada uma mensagem 
 no browser, e ao clicar 'OK' o nível recomeça; Quando terminamos o nível 
 somos encaminhados para o nível seguinte. Quando terminamos o último nível 
 é nos apresentada uma mensagem de parabéns e somos encaminhados para 
 o 1º nível. No HTML adicionamos um contador de níveis que apresenta 
 o nível corrente e número de níveis totais; um contador de ouro que 
 apresenta o ouro que o herói tem e todo o ouro do nível. 
 Existe um botão ("Recomeçar nível") que recarrega o nível atual.
 Adicionamos ainda um elemento <select> que permite escolher um dos níveis da 
 lista (todos os níveis válidos e caso sejam adicionados mais, 
 surgirão nesta lista), ao carregar em 'IR' o nível escolhido é carregado.


01234567890123456789012345678901234567890123456789012345678901234567890123456789

*/

// GLOBAL VARIABLES

// tente não definir mais nenhuma variável global

let empty, hero, control;


// ACTORS

class Actor {
    constructor(x, y, imageName) {
		this.x = x;
		this.y = y;
		this.imageName = imageName;
		this.show();
	}
	draw(x, y) {
		control.ctx.drawImage(GameImages[this.imageName],
				x * ACTOR_PIXELS_X, y* ACTOR_PIXELS_Y);
	}
    move(dx, dy) {
		this.hide();
		this.x += dx;
		this.y += dy;
		this.show();
	}
}

class PassiveActor extends Actor {
	show() {
		control.world[this.x][this.y] = this;
		this.draw(this.x, this.y);
	}
	hide() {
		control.world[this.x][this.y] = empty;
		empty.draw(this.x, this.y);
	}
	isWalkable(){return false;}
	isClimable(){return false;}
	canBeTaken(){return false;}
	isDestroyable(){return false;}
	canGrabOnto(){return false;}
	canGoThrou(){return false;}
	canFallThrou(){return false;}

}

class ActiveActor extends Actor {
    constructor(x, y, imageName) {
		super(x, y, imageName);
		this.left = true;
		this.time = 0;	// timestamp used in the control of the animations
	}
	show() {
		control.worldActive[this.x][this.y] = this;
		this.draw(this.x, this.y);
	}
	hide() {
		control.worldActive[this.x][this.y] = empty;
		control.world[this.x][this.y].draw(this.x, this.y);
	}
	isFriendly(){return false;}
	isCharacter(){return true;}

	animation() {
	}
	isFalling() { 
		if(control.insideWorld(this.x,this.y + 1)){
		if(control.world[this.x][this.y + 1].canGrabOnto() ||
		 control.world[this.x][this.y + 1].canFallThrou() ||
		 control.world[this.x][this.y + 1].canBeTaken()){
			if(!(control.world[this.x][this.y].canGrabOnto()) &&
			 !(control.world[this.x][this.y].isClimable()))
			return true;
			else return false;
		}
		else return false;
	}else
		return false;
}

	move(dx,dy){
		if(control.insideWorld(this.x + dx, this.y + dy)){
		if(dx == -1){
			if((this.y == (WORLD_HEIGHT -1) &&
			 control.world[this.x - 1][this.y].canGoThrou())||
			  control.world[this.x - 1][this.y].canGoThrou()||
			   control.world[this.x - 1][this.y].canBeTaken()){
				if(!this.isFriendly())
					this.imageName = "robot_runs_left";
				else{
					this.imageName = "hero_runs_left";
					if(!this.left){
						this.left = true;
						return;
					}
				}
				this.left = true;
				if(this.y != (WORLD_HEIGHT -1)){
				if(control.world[this.x - 1][this.y + 1].canFallThrou() &&
				 !this.isFriendly()){
					if(control.world[this.x - 1][this.y].canGrabOnto()){
						this.imageName = "robot_on_rope_left";
						this.x -= 1;
						return;
					}
				}
				else{
					if(control.world[this.x -1][this.y].canGrabOnto() &&
					 this.isFriendly()){
						this.imageName = "hero_on_rope_left";
					}
				
				this.x -= 1;
				return;
			}
				}
				this.x -= 1;
				return;
		}
		}
		if(dx == 1){
			if((this.y == (WORLD_HEIGHT -1) &&
			 control.world[this.x + 1][this.y].canGoThrou()) ||
			  control.world[this.x + 1][this.y].canGoThrou() ||
			   control.world[this.x + 1][this.y].canBeTaken()){ 
				if(!this.isFriendly())
					this.imageName = "robot_runs_right";
				else{
					this.imageName = "hero_runs_right";
					if(this.left){
						this.left = false;
						return;
					}
				}
				this.left = false;
				if(this.y != (WORLD_HEIGHT -1)){
				if((control.world[this.x + 1][this.y + 1].canFallThrou()) &&
				 !this.isFriendly()){
					if(control.world[this.x + 1][this.y].canGrabOnto()){
						this.imageName = "robot_on_rope_right";
						this.x += 1;
					}
				}
				else{
				if(control.world[this.x + 1][this.y].canGrabOnto() &&
				 this.isFriendly()){
					this.imageName = "hero_on_rope_right";
				}
				this.x += 1;
				return;
			}
		}
			this.x += 1;
			return;
			}
		}
		if(dy == -1){
			if((control.world[this.x][this.y].isClimable() &&
			 (control.world[this.x][this.y -1].canGoThrou() ||
			  control.world[this.x][this.y -1].canBeTaken()))){
				if(!this.isFriendly()){
					if(this.left){
					this.imageName = "robot_on_ladder_left";
					this.left = false;
				}
					else{
					this.imageName = "robot_on_ladder_right";
					this.left = true;}

				}
				else{
					if(this.left){
					this.imageName = "hero_on_ladder_left";
					this.left = false;
				}
					else{
					this.imageName = "hero_on_ladder_right";
					this.left = true;}
				}
				this.y -= 1;
				return;
			}
		}
		if(dy == 1){
			if(control.world[this.x][this.y + 1].canBeTaken()||
			 control.world[this.x][this.y + 1].canFallThrou()|| 
			 control.world[this.x][this.y + 1].isClimable() ||
			  (control.world[this.x][this.y].canGrabOnto() &&
			   (control.world[this.x][this.y + 1].canGoThrou()))){
				if(!this.isFriendly()){
					if(this.left){
					this.imageName = "robot_on_ladder_left";
					this.left = false;
				}
					else{
					this.imageName = "robot_on_ladder_right";
					this.left = true;}

				}
				else{
					if(this.left){
					this.imageName = "hero_on_ladder_left";
					this.left = false;
				}
					else{
					this.imageName = "hero_on_ladder_right";
					this.left = true;
				}
				}
				this.y += 1;
				return;
			}
		}
	}
}
}

class Brick extends PassiveActor {
	constructor(x, y) { 
		super(x, y, "brick"); 
		this.destroyed = false;
		this.timer = 0;
	}
	isDestroyable() {return true;}
	isWalkable(){return true;}
}

class Chimney extends PassiveActor {
	constructor(x, y) { super(x, y, "chimney"); 
}
	canFallThrou(){return true;}
	canGoThrou(){return true;}
}

class Empty extends PassiveActor {
	constructor() { super(-1, -1, "empty"); }
	show() {}
	hide() {}
	canGoThrou(){return true;}
	canFallThrou(){return true;}
	isFriendly(){return true;}
}

class Gold extends PassiveActor {
	constructor(x, y) { super(x, y, "gold"); }
	canBeTaken(){return true;}
}

class Invalid extends PassiveActor {
	constructor(x, y) { super(x, y, "invalid"); }
}

class Ladder extends PassiveActor {
        constructor(x, y) {
            super(x, y, "empty");
        }
        makeVisible() {
            this.imageName = "ladder";
            this.show();
		}
		isClimable(){
			if(this.imageName === "ladder")return true; else return false;}
		canGoThrou(){return true;}
    }


class Rope extends PassiveActor {
	constructor(x, y) { super(x, y, "rope"); }
	canGrabOnto(){return true;}
	canGoThrou(){return true;}
}

class Stone extends PassiveActor {
	constructor(x, y) { super(x, y, "stone"); }
	isWalkable(){return true;}
}

class Hero extends ActiveActor {
	constructor(x, y) {
		super(x, y, "hero_runs_left");
		this.gold = 0;
		this.destroyedBricks = [];
	}
	isFriendly(){return true;}
	numberGold(){
		return this.gold;
	}
	checkIfRestore(brick){
		return  brick.timer >= 5 * ANIMATION_EVENTS_PER_SECOND;
	}
	isInHole(dx,dy){
		let found = false;
		for(let i = 0; i< this.destroyedBricks.length; i++){
			found = (this.destroyedBricks[i].x == dx &&
				 this.destroyedBricks[i].y == dy);
			if(found){
				let brick =this.destroyedBricks[i];
				control.world[brick.x][brick.y] = brick;
				return true;}
		}
		return false;
	}
	surrounded(){
		if(control.insideWorld(this.x + 1,this.y) &&
		 control.insideWorld(this.x - 1, this.y)){
			if(control.world[this.x + 1][this.y].isWalkable() &&
			 control.world[this.x - 1][this.y].isWalkable() &&
			  control.world[this.x][this.y + 1].isWalkable()){
				return true;
			}
		}
		return false;
	}
	animation() {
		
		if(( (this.y == (WORLD_HEIGHT - 1) && this.isInHole(this.x,this.y))||
		 (this.surrounded())) && this.isInHole(this.x,this.y) ){
			control.resetLevel(); 
			return;
		}

		if(control.isLevelDone(this.gold) && (this.y == 0) &&
		 control.world[this.x][this.y].isClimable()){
			control.OutOfLevelDone(this.x,this.y);
			return;
		}
		
		for(let i = 0; i < this.destroyedBricks.length; i++){
				this.destroyedBricks[i].timer++;
				if(this.checkIfRestore(this.destroyedBricks[i])){
				if(control.worldActive[this.destroyedBricks[i].x]
					[this.destroyedBricks[i].y-1] == empty){
				var bricks = this.destroyedBricks.splice(i,1);
				var brick = bricks[0];
				control.world[(brick.x)][(brick.y)] = brick; 
				brick.show();
				if(control.worldActive[brick.x][brick.y] != empty &&
					 !control.worldActive[brick.x][brick.y].isFriendly()){
					let pers = control.worldActive[brick.x][brick.y];
					pers.hide();
					pers.y -= 1;
					pers.show();
				}
				}
			}
			}
		

		if(control.world[this.x][this.y].canBeTaken()){
			control.world[this.x][this.y].hide();
			this.gold ++;
		}
		var k = control.getKey();
		
		
		if(this.isFalling()){
			this.hide();
			if(this.left)
				this.imageName = "hero_falls_left";
			else
				this.imageName = "hero_falls_right";
			this.y += 1;
			if(!this.isFalling()){
				if(this.left)
				this.imageName = "hero_runs_left";
			else
				this.imageName = "hero_runs_right";
			}
			if(control.worldActive[this.x][this.y] != empty &&
				 !control.worldActive[this.x][this.y].isFriendly()){
				control.resetLevel();
				return;
			}
			this.show();
			return;
		}

        if( k == ' ' ) { 
			if((control.world[this.x][this.y].isClimable() &&
			 !control.world[this.x][this.y+1].isWalkable()) ||
			  control.world[this.x][this.y].canGrabOnto()){
				return;
			}
			if((this.imageName === "hero_runs_right" ||
			 this.imageName === "hero_shoots_right")){
				if(control.world[this.x + 1][this.y +1].isDestroyable() &&
				 !(control.world[this.x + 1][this.y].isWalkable()) &&
				  !(control.world[this.x + 1][this.y].isClimable())){
				let brick = control.world[this.x + 1][this.y + 1]; 	
				brick.destroyed = true;
				brick.timer = 0;
				this.destroyedBricks.push(brick);
				brick.hide();
				this.imageName = "hero_shoots_right";
				if(control.insideWorld(this.x -1, this.y)){
				this.hide();
				this.x -= 1;
				if(!(control.world[this.x][this.y].isWalkable()) &&
				 (!this.isFalling()) &&
				  !control.world[this.x][this.y].canGrabOnto()){
					this.x -= 1;
				}
				this.x +=1;
				this.show();
			}
				return;
			}
		}
			else{
				if(this.imageName === "hero_runs_left" ||
				 this.imageName === "hero_shoots_left"){
					if(control.world[this.x - 1][this.y +1].isDestroyable() &&
					 !(control.world[this.x - 1][this.y].isWalkable()) &&
					  !(control.world[this.x - 1][this.y].isClimable())){
						this.imageName = "hero_shoots_left";
						let brick = control.world[this.x  - 1][this.y +1]; 	
						brick.destroyed = true;
						brick.timer = 0;
						this.destroyedBricks.push(brick);
						brick.hide();
					if(control.insideWorld(this.x +1, this.y)){
						this.hide();
					this.x += 1;
					if(!(control.world[this.x][this.y].isWalkable()) &&
					 (!this.isFalling()) &&
					  !(control.world[this.x][this.y].canGrabOnto())){
						this.x += 1;
					}
					this.x -= 1;
					this.show();
					return;
					}
				}
		}
	}
	
return;
}

		
		if( k == null ) return;
		let [dx, dy] = k;
		this.hide(); 
		if(control.insideWorld(this.x + dx,this.y + dy)){
		if(control.worldActive[this.x + dx][this.y + dy] != empty &&
			 !control.worldActive[this.x + dx][this.y + dy].isFriendly() &&
			  !control.world[this.x + dx][this.y + dy].isWalkable()){
			control.resetLevel();
			return;
		}
		}
		this.move(dx,dy);
		this.show();
		document.getElementById('text1').value = this.gold;
		return;
	}
}

class Robot extends ActiveActor {
	constructor(x, y) {
		super(x, y, "robot_runs_left");
		this.dx = 1;
		this.dy = 0;
		this.gold = false;
		this.animationNumber = 0;
	}
	hasGold(){
		return this.gold;
	}
	returnGold(x,y){
		this.gold = false;
		this.animationNumber = 0;
		control.world[x][y] = new Gold(x,y);
		control.world[x][y].show();
	}

	handleFloor(dx){
			if(control.worldActive[this.x + dx][this.y].isFriendly()){
				this.hide();
				this.move(dx,0);
				this.show();
			}
	}
	
	
	animation(){
		if(hero.x == this.x && hero.y == this.y){
			control.resetLevel();
			return;
		}

		if(control.world[this.x][this.y].canBeTaken() && !this.hasGold()){
			control.world[this.x][this.y].hide();
			this.gold = true;
		}
		let dist = distance(this.x, this.y, hero.x, hero.y);
		if(this.hasGold()){
			this.animationNumber ++;
		}
		
		if( this.time % 2 == 0 )
        	return;
		
		if( dist > 0){
			if(hero.isInHole(this.x,this.y))
				return;

			if(this.isFalling() && !hero.isInHole(this.x,this.y) &&
			 control.worldActive[this.x][this.y+1].isFriendly()){
				this.hide();
				if(this.left)
					this.imageName = "robot_falls_left";
				else
					this.imageName = "robot_falls_right";
				this.y += 1;
				this.show();
				return;
			}
				if(distance(this.x + 1, this.y, hero.x, hero.y) < dist){
					if(this.y == (WORLD_HEIGHT -1) && !hero.isInHole(this.x,this.y)){
						this.handleFloor(1);
						return;
					}

					this.left = false;
					if(this.animationNumber >= 56 && this.hasGold() &&
					 control.insideWorld(this.x-1,this.y+1)){
						if(control.world[this.x - 1][this.y + 1].isWalkable() &&
						 !control.world[this.x - 1][this.y].isWalkable() &&
						  !control.world[this.x - 1][this.y + 1].isClimable() &&
						   !control.world[this.x - 1][this.y].canGrabOnto() &&
						    !control.world[this.x - 1][this.y].isClimable()){
							this.returnGold(this.x -1, this.y);
						}
					}
					if(control.worldActive[this.x +1][this.y].isFriendly()){
						this.hide();
						if(!control.world[this.x +1][this.y+1].isWalkable() &&
						 hero.isInHole(this.x+1,this.y+1)){
							if(this.hasGold()){
								this.returnGold(this.x+1,this.y);
							}
							this.x +=1;
							this.y+=1;
						}
						else{
						this.move(1,0);
						}
						this.show();
					}
					return;
				}
			
			if(distance(this.x - 1, this.y, hero.x, hero.y) < dist ){
				if(this.y == (WORLD_HEIGHT -1) && !hero.isInHole(this.x,this.y)){
					this.handleFloor(-1);
					return;
				}	
				this.left = true;
				if(this.animationNumber >= 56 && this.hasGold() &&
				 control.insideWorld(this.x+1,this.y+1)){
					if(control.world[this.x + 1][this.y + 1].isWalkable() &&
					 !control.world[this.x +1][this.y].isWalkable() &&
					  !control.world[this.x + 1][this.y + 1].isClimable() &&
					   !control.world[this.x + 1][this.y].canGrabOnto() &&
					    !control.world[this.x + 1][this.y].isClimable()){
						this.returnGold(this.x+1, this.y);
					}
				}
				if(control.worldActive[this.x -1][this.y].isFriendly()){
					this.hide();
					if(!control.world[this.x -1][this.y+1].isWalkable() &&
					 hero.isInHole(this.x-1,this.y+1)){
						if(this.hasGold()){
							this.returnGold(this.x-1,this.y);
						}
						this.x -=1;
						this.y+=1;
					}else{
					this.move(-1,0);
					}
					this.show();
				}
				return;
			}
			if(distance(this.x, this.y + 1, hero.x, hero.y) < dist){
					if(this.y == (WORLD_HEIGHT -1) &&
					 !hero.isInHole(this.x,this.y)){
						return;
					}
					if(this.animationNumber >= 56 && this.hasGold() &&
					 control.insideWorld(this.x+1,this.y+1)){
						if(control.world[this.x + 1][this.y + 1].isWalkable() &&
						 !control.world[this.x + 1][this.y].isWalkable() &&
						  !control.world[this.x + 1][this.y + 1].isClimable() &&
						   !control.world[this.x + 1][this.y].canGrabOnto() &&
						    !control.world[this.x + 1][this.y].isClimable()){	
							this.returnGold(this.x+1, this.y);
					}
				}
					if(control.worldActive[this.x][this.y + 1].isFriendly()){
						this.hide();
						this.move(0,1);
						this.show();
					}
				}
			return;
			}

			if(distance(this.x, this.y - 1, hero.x, hero.y) < dist ){
				
				if(control.worldActive[this.x][this.y - 1].isFriendly()){
					this.hide();
					this.move(0,-1);
					this.show();
				}
				return;
			}
		}
	}



// GAME CONTROL

class GameControl {
	constructor() {
		control = this;
		this.key = 0;
		this.time = 0;
		this.totalGold = 0;
		this.levelCompleted = false;
		this.levelNum = 1;
		this.ctx = document.getElementById("canvas1").getContext("2d");
		empty = new Empty();	// only one empty actor needed
		this.world = this.createMatrix();
		this.worldActive = this.createMatrix();
		this.loadLevel(1);
		this.setupEvents();
	}
	createMatrix() { // stored by columns
		let matrix = new Array(WORLD_WIDTH);
		for( let x = 0 ; x < WORLD_WIDTH ; x++ ) {
			let a = new Array(WORLD_HEIGHT);
			for( let y = 0 ; y < WORLD_HEIGHT ; y++ )
				a[y] = empty;
			matrix[x] = a;
		}
		return matrix;
	}
	loadLevel(level) {
		if( level < 1 || level > MAPS.length )
			fatalError("Invalid level " + level)
		let map = MAPS[level-1];  // -1 because levels start at 1
        for(let x=0 ; x < WORLD_WIDTH ; x++)
            for(let y=0 ; y < WORLD_HEIGHT ; y++) {
					// x/y reversed because map stored by lines
				if(map[y][x] === "o"){
					this.totalGold++;
				}
				GameFactory.actorFromCode(map[y][x], x, y);
			}
			document.getElementById('text2').value = this.totalGold;
			document.getElementById('text3').value = this.levelNum;
			document.getElementById('text4').value = MAPS.length;
	}
	insideWorld(x,y){
		if(x >= 0 && x < WORLD_WIDTH && y < WORLD_HEIGHT)
			return true;
		else
			return false;
	}
	isLevelDone(ngold){
		if(this.totalGold == ngold){
			this.showExit();
			this.levelCompleted = true;
			return true;
		}
	}
	resetLevel(){
		alert("Perdeu. Para recomeçar o nível prima 'OK'");
		this.levelNum--;
		this.loadNextLevel();
	}

	showExit(){
		for(let x=0 ; x < WORLD_WIDTH ; x++)
			for(let y=0 ; y < WORLD_HEIGHT ; y++) {
				if (this.world[x][y] instanceof Ladder &&
					 !this.world[x][y].isClimable()){
					this.world[x][y].makeVisible();
				}
			}
	}

	clearLevel(){
		for(let x=0 ; x < WORLD_WIDTH ; x++)
			for(let y=0 ; y < WORLD_HEIGHT ; y++) {
				this.world[x][y].hide();
				this.worldActive[x][y].hide();
			}
	}

	loadNextLevel(){
		this.totalGold = 0;
		this.levelNum++;
		if(this.levelNum > MAPS.length){
			alert("Parabéns! Completou o último nível." 
			+ "Prima 'OK' para voltar ao 1º Nível.");
			this.loadCustomLevel(1);
			return;
		}
		this.levelCompleted = false;
		this.clearLevel();
		this.loadLevel(this.levelNum);
		
	}
	loadCustomLevel(level){
		this.totalGold = 0;
		this.levelNum = level;
		this.levelCompleted = false;
		this.clearLevel();
		this.loadLevel(level);
	}
		
	OutOfLevelDone(x,y){
		if(y <=0 && this.world[x][y].isClimable() && this.levelCompleted){
			this.worldActive[x][y].hide();
			hero = null;
			this.loadNextLevel();
		}
	}

	getKey() {
		let k = control.key;
		control.key = 0;
		switch( k ) {
			case 37: case 79: case 74: return [-1, 0]; //  LEFT, O, J
			case 38: case 81: case 73: return [0, -1]; //    UP, Q, I
			case 39: case 80: case 76: return [1, 0];  // RIGHT, P, L
			case 40: case 65: case 75: return [0, 1];  //  DOWN, A, K
			case 0: return null;
			default: return String.fromCharCode(k);
		// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		};
	}
	setupEvents() {
		addEventListener("keydown", this.keyDownEvent, false);
		addEventListener("keyup", this.keyUpEvent, false);
		setInterval(this.animationEvent, 1000 / ANIMATION_EVENTS_PER_SECOND);
	}
	animationEvent() {
		control.time++;
		for(let x=0 ; x < WORLD_WIDTH ; x++)
			for(let y=0 ; y < WORLD_HEIGHT ; y++) {
				let a = control.worldActive[x][y];
				if( a.time < control.time ) {
					a.time = control.time;
					a.animation();
				}
            }
	}
	keyDownEvent(k) {
		control.key = k.keyCode;
	}
	keyUpEvent(k) {
	}
}


// HTML FORM

function onLoad() {
  // Asynchronously load the images an then run the game
	GameImages.loadAll(function() { new GameControl(); });
	let myList = document.getElementById("list");
	let selectList = document.createElement("select");
	selectList.setAttribute("id", "mySelect");
	myList.appendChild(selectList);
	for(let i = 1; i <=MAPS.length; i++){
		let option = document.createElement("option");
		option.setAttribute("value", i);
		option.text = i;
		selectList.appendChild(option);
	}
}

let audio = null;
function b1() { 
	control.levelNum--;
	control.loadNextLevel();
 }

function b2() {
	var e = document.getElementById("mySelect");
	var value = e.options[e.selectedIndex].value;
	control.loadCustomLevel(value);
	

}



