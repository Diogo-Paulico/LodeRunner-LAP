if( dist > 0){
			if(distance(this.x + 1, this.y, hero.x, hero.y) < dist){
				this.left = false;
				//this.imageName = "robot_runs_right";

				if(this.animationNumber >= 56 && this.hasGold()){
					if(control.world[this.x - 1][this.y + 1].isWalkable() && !control.world[this.x - 1][this.y + 1].isClimable() && !control.world[this.x - 1][this.y].canGrabOnto() && !control.world[this.x - 1][this.y].isClimable()){
						this.gold = false;
						this.animationNumber = 0;
						control.world[this.x - 1][this.y] = new Gold(this.x - 1, this.y);
						control.world[this.x - 1][this.y].show();
					}
				}
				if(control.worldActive[this.x +1][this.y].isFriendly()){
					this.hide();
					this.move(1,0);
					this.show();
				}
				
				return;
			}
			if(distance(this.x - 1, this.y, hero.x, hero.y) < dist ){
				
				this.left = true;
				//this.imageName = "robot_runs_left";
				if(this.animationNumber >= 56 && this.hasGold()){
					if(control.world[this.x + 1][this.y + 1].isWalkable() && !control.world[this.x + 1][this.y + 1].isClimable() && !control.world[this.x + 1][this.y].canGrabOnto() && !control.world[this.x + 1][this.y].isClimable()){
						this.gold = false;
						this.animationNumber = 0;
						control.world[this.x + 1][this.y] = new Gold(this.x +1, this.y);
						control.world[this.x + 1][this.y].show();
					}
				}
				if(control.worldActive[this.x -1][this.y].isFriendly()){
					this.hide();
					this.move(-1,0);
					this.show();
				}
				return;
			}
			if(distance(this.x, this.y + 1, hero.x, hero.y) < dist){
				if( control.world[this.x][this.y +1].canGoThrou()){
					if(this.animationNumber >= 56 && this.hasGold()){
						if(control.world[this.x + 1][this.y + 1].isWalkable() && !control.world[this.x + 1][this.y + 1].isClimable() && !control.world[this.x + 1][this.y].canGrabOnto() && !control.world[this.x + 1][this.y].isClimable()){
							this.gold = false;
							this.animationNumber = 0;
							control.world[this.x][this.y - 1] = new Gold(this.x, this.y -1);
							control.world[this.x][this.y - 1].show();
						}
					}
					if(control.worldActive[this.x][this.y + 1].isFriendly()){
						this.hide();
						this.move(0,1);
						this.show();
					}
				}
				else{
					if(distance(this.x - 1, this.y, hero.x, hero.y) < dist ){
				
						this.left = true;
						//this.imageName = "robot_runs_left";
						if(this.animationNumber >= 56 && this.hasGold()){
							if(control.world[this.x + 1][this.y + 1].isWalkable() && !control.world[this.x + 1][this.y + 1].isClimable() && !control.world[this.x + 1][this.y].canGrabOnto() && !control.world[this.x + 1][this.y].isClimable()){
								this.gold = false;
								this.animationNumber = 0;
								
								control.world[this.x + 1][this.y] = new Gold(this.x + 1, this.y);
								control.world[this.x + 1][this.y].show();
							}
						}
						if(control.worldActive[this.x -1][this.y].isFriendly()){
							this.hide();
							this.move(-1,0);
							this.show();
						}
					}
					if(distance(this.x + 1, this.y, hero.x, hero.y) < dist){
						this.left = false;
						//this.imageName = "robot_runs_right";
						if(this.animationNumber >= 56 && this.hasGold()){
							if(control.world[this.x - 1][this.y + 1].isWalkable() && !control.world[this.x - 1][this.y + 1].isClimable() && !control.world[this.x - 1][this.y].canGrabOnto() && !control.world[this.x - 1][this.y].isClimable()){
								this.gold = false;
								this.animationNumber = 0;
								control.world[this.x - 1][this.y] = new Gold(this.x -1, this.y);
								control.world[this.x - 1][this.y].show();
							}
						}
						if(control.worldActive[this.x +1][this.y].isFriendly()){
							this.hide();
							this.move(1,0);
							this.show();
						}

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
}

