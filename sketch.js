//Create variables here



var dog 
var happydog 
var database
var foodS
var foodStock
var foodObject
var fedTime,lastFed
var feed
var addFood
var gameState=0;
var bedroomImage
var gardenImage
var washroomImage
function preload()
{
  dogImage = loadImage("images/dogImg.png")
  happydogImage= loadImage("images/dogImg1.png")

  bedroomImage=loadImage("images/Bed Room.png");
  gardenImage=loadImage("images/Garden.png");
  washroomImage=loadImage("images/Wash Room.png");

	//load images here
}

function setup() {
	createCanvas(500, 500);
  
  foodObject=new Food()

  feed= createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood= createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
  dog= createSprite(250,250,20,20);
  dog.addImage(dogImage)
  dog.scale=0.3

  database=firebase.database()

  foodStock=database.ref("Food");
  foodStock.on("value",readStock);

  fedTime=database.ref("FeedTime")
  fedTime.on("value",(data)=>{
    lastFed=data.val();
  })
  
  gameStateRef=database.ref("gameState");
  gameStateRef.on("value",(data)=>{
    gameState = data.val();
  });
}


function draw() {  
  background(46,139,87)

  
  
 if (gameState !="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 } else{
   feed.show();
   addFood.show();
   dog.addImage(dogImage);
 }
 
 //add styles here
 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("playing");
   foodObject.garden();
}else if (currentTime==(lastFed+2)){
  update("sleeping");
  foodObject.bedroom();
}else  {
  update("Hungry");
  foodObject.display();
}
  drawSprites();

}

function readStock(data){
  foodS=data.val();
 foodObject.updateFoodStock(foodS);
}



function addFoods(){

   foodS++
   database.ref("/").update({
     Food: foodS
   })



}

function feedDog(){
  dog.addImage(happydogImage);

  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObject.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"

  })
}


function update(state){
  database.ref("/").update({
    gameState :state
  })
}
