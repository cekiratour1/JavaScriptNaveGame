	var nivel = 1;
	var contador = 0;
	var scored = 0;
	var cant = 0;
	var bossLife = 25;
	var bossStage = 0;
	var bossDead = false;
	
	function sound(src) 
	{
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function()
		{
			this.sound.play();
		}
		this.stop = function()
		{
			this.sound.pause();
		}    
	}

    //retorna un objeto enemigo
	function GetEnemies()
	{
        var enemiespic1  	= new Image(); // enemigo 1
        var enemiespic2		= new Image(); // enemigo 2
        var meteoro			= new Image(); // enemigo 3
         // Enemigos fotos
        enemyI1 			=["Imagenes/enemy2.png","Imagenes/enemy.png","Imagenes/enemy1.png"];
        enemyI2 			=["Imagenes/enemy3.png","Imagenes/enemy4.png","Imagenes/enemy5.png"];
        enemiespic1.src     = enemyI1[bossStage];
        enemiespic2.src     = enemyI2[bossStage]; //Enemies picture
        let imagenes = [enemiespic1,enemiespic2];
    
        // template for naves
        var enemyTemplate = function(options){
            return {
                id: options.id || '',
                x: options.x || '',
                y: options.y || '',
                w: options.w || '',
                h: options.h || '',
                image: options.image || enemiespic1,
                v: options.v || ''
            }
        }
        
        //Arreglos de las coordenadas
        var xValues=[10,135,260,385,560];
        var yValues1=[-300,-200,-100];
        var yValues2=[-400,-300,-200];
        var wValues = [110,110];
        
        //return random values
        function random(min, max) 
        {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function ySpeed(nivel)
        {
            var speed = random(0,100);   
            if(nivel < 5)
            {
                if(speed > 90 )
                {
                    return 0.75;
                }
                else
                {
                    return 0.5;
                }
            }
            if(nivel > 5 && nivel < 10)
            {
                if(speed > 70 )
                {
                    return 0.75;
                }
                else
                {
                    return 0.5;
                }
            }   
            if(nivel > 10 && nivel < 15)
            {
                if(speed > 90 )
                {
                    return 1;
                }
                else if(speed > 70 && speed < 90)
                {
                    return 0.75;
                }
                else
                {
                    return 0.5;
                }
            }      
        
        }
            
        if(random(1,2)%2 === 0)
        {
            var enemy = new enemyTemplate({id: "enemy1", x: xValues[random(0,4)], y: yValues1[random(0,2)], w: wValues[random(0,1)], h: 50 , image: imagenes[1],v: ySpeed(nivel)});
        }
        else
        {
            var enemy = new enemyTemplate({id: "enemy1", x: xValues[random(0,4)], y: yValues2[random(0,2)], w: wValues[random(0,1)], h: 50 , image: imagenes[0],v: ySpeed(nivel)});
        }
        
        return enemy;
	}
	
function initCanvas(){
	
    var ctx = document.getElementById('myCanvas').getContext('2d');	
	var impactSound = new sound("Audio/shield.wav");
	var shootSound = new sound("Audio/shoot.wav");
	var lvUptSound = new sound("Audio/success.mp3");
	var gameOverSound = new sound("Audio/gameOver.mp3");
	var stageSound = new sound("Audio/stage2.mp3");
	var bossSound = new sound("Audio/bossStage.mp3");
	var aletSound = new sound("Audio/alert1.wav")
	
	//imagen seccion
    var backgroundImage = new Image();
    var naveImage   	= new Image(); // nave
	let backgroundStage = ["Imagenes/stage1.png","Imagenes/stage2.png","Imagenes/stage3.png"];
    // backgroundImage y naveImage
    //backgroundImage.src = "Imagenes/background-pic.jpg"; //Background picture
	backgroundImage.src = backgroundStage[bossStage]; 
    naveImage.src       = "Imagenes/spaceship-pic.png"; //Spaceship picture
    // width and height (canvas)
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

	
    // To reduce a repetitive function or two I've made some slight changes to how you create enemies.
    var enemies = [];	
	//cantidad de enemigos que se van a crear por niveles
	if(nivel < 5)
	{
		cant = cant + 5;
	}
	else
	{
		cant = 30;
	}
	
	for(var i = 0; i < cant; i++)
	{
		enemies.unshift(GetEnemies());
		var enemy = GetEnemies();
		enemies.push(enemy);
	}
	         	
    // This allows for more enemies to be rendered without needing a function per set of enemies.
    // This also forces enemies to check if THEY are hitting the player 
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += enemyList[i].v, enemyList[i].w, enemyList[i].h);
            // Detects when ships hit lower level
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

	stageSound.play();
    function Launcher(){
        // bullet location (ubicación de balas)
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", // bullet color (color de bala)
        this.misiles = [];

         // If you wanted to use different fonts or messages for the player losing you can change it accordingly.
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 28px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                if(this.x > 10){this.x-=5;}
            } else if(this.direccion === 'right'){
                if(this.x < 600){this.x+=5;}
            }/*else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }*/
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); // background image
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); // we need to make sure spaceship is at the same location as the bullets

            for(var i=0; i < this.misiles.length; i++)
			{
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // bullet direction
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0)
				{ // If a missile goes past the canvas boundaries, remove it
                    this.misiles.splice(i,1); // splice that missile out of the misiles array
                }
            }
            // This happens if you win
            if (enemies.length === 0) 
			{
				stageSound.stop();
				
				if(((nivel+1)%5) === 0)
				{ 
					
					ctx.fillStyle = 'yellow';
					ctx.font = this.gameStatus.font;
					ctx.fillText('Level '+nivel+' Passed', cW * .5 - 80, 50);
					clearInterval(animateInterval); // Stop the game animation loop
					nivel+=1;
					aletSound.play();
					const myTimeout = setTimeout(initCanvasBoss, 3000);
				}
				else
				{
					ctx.fillStyle = 'yellow';
					ctx.font = this.gameStatus.font;
					ctx.fillText('Level '+nivel+' Passed', cW * .5 - 80, 50);
					clearInterval(animateInterval); // Stop the game animation loop
					nivel+=1;
					lvUptSound.play();
					const myTimeout = setTimeout(initCanvas, 3000);
				}				
			}				
        }
		
        // Detectar impacto de bullet (bala)
		
        this.hitDetect = function (m, mi) {
            console.log('crush');
			
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
				 
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
					impactSound.play();
					//destroySound.play();
					contador+=1;
					scored +=5;
                    this.misiles.splice(this.misiles[mi],1); // Remove the missile
                    enemies.splice(i, 1);
					// Remove the enemy that the missile hit
                    document.querySelector('.barra').innerHTML = " Enemies Destroyed:"+contador+ "			Scored:"+scored+"				Nivel:"+nivel;
                }
            }
        }
        // Ask player ship if an enemy has passed or has hit the player ship
        this.hitDetectLowerLevel = function(enemy){
            // If location of ship is greater than 550 then we know it passed lower level
            if(enemy.y > 600){
				stageSound.stop();
				gameOverSound.play();
                this.gameStatus.over = true;
                this.gameStatus.message = 'Enemy have passed!';
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> where is spaceship location
            if(enemy.id === 'enemy1'){
                //console.log(this.y);
                console.log(this.x);
            }
            // a) If enemy y is greater than this.y - 25 => then we know there's a collision
            // b) If enemy x is gless than this.x + 45 && enemy x > this.x - 45 then we know theres a collision
            if ((enemy.y < this.y + 30 && enemy.y > this.y - 30) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // Checking if enemy is on the left or right of spaceship
                    stageSound.stop();
					gameOverSound.play();
					this.gameStatus.over = true;
                    this.gameStatus.message = 'You Died!'
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // Stop the game animation loop
                ctx.fillStyle = this.gameStatus.fillStyle; // set color to text
                ctx.font = this.gameStatus.font;
                // To show text on canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // text x , y
            }
        }
    }
    
    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6); 

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // left arrow
        {
             launcher.direccion = 'left';   
        }     
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
			launcher.x+=0;
			launcher.direccion = '';
        }
    }); 
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // right arrow
        {
			launcher.direccion = 'right';
        }
    });
    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39)
        {
			launcher.x-=0;
			launcher.direccion = '';
        }
    }); 
        // This fires when clicking on space button from keyboard
        document.addEventListener('keydown', function(event) {
            if(event.keyCode == 32) {
                shootSound.play();
                const myTimeout = setTimeout(launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10}), 1000);
            }
        });
	//keyword to move up and down
    /*document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });*/
	// the target Movie Clip instance you want to pause
    document.addEventListener('keydown', function(event)
	{
         if(event.keyCode == 82) // restart game
         {
			location.reload();
         }
    });
	var pausa = false;
	document.addEventListener('keydown', function(event)
	{
         if(event.keyCode == 13) // restart game
         {
			if(pausa === false )
			{
				pausa = true;
			}
			else
			{
				pausa = false;	
			}
         }
    });

}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function initCanvasBoss(){
	
    var ctx = document.getElementById('myCanvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); // nave
    var boss1 		= new Image();
	
	var impactSound = new sound("Audio/shield.wav");
	var shootSound = new sound("Audio/shoot.mp3");
	var lvUptSound = new sound("Audio/success.mp3");
	var gameOverSound = new sound("Audio/gameOver.mp3");
	var destroySound = new sound("Audio/boom.mp3");
	var boosStageSound = new sound("Audio/bossStage.mp3");
	
	let backgroundStage = ["Imagenes/stage1.png","Imagenes/stage2.png","Imagenes/stage3.png"];
    // backgroundImage y naveImage
	backgroundImage.src = backgroundStage[bossStage];  //Background picture
    naveImage.src       = "Imagenes/spaceship-pic.png"; //Spaceship picture
    // Enemigos fotos
 	let bossImage = ["Imagenes/boss1.png","Imagenes/boss2.png","Imagenes/boss3.png"];
	boss1.src 			= bossImage[bossStage];
	//let imagenes = [enemiespic1,enemiespic2];
    
    // width and height (canvas)
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

    // template for naves
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || boss1
        }
    }
	
    // To reduce a repetitive function or two I've made some slight changes to how you create enemies.
    var bosses = [];	

	var enemy = new enemyTemplate({id: "enemy1", x: 250, y: -200 , w: 300, h: 250 ,image: boss1});
	bosses.push(enemy);
	    
	bossLife += 25;	
	
    // This allows for more enemies to be rendered without needing a function per set of enemies.
    // This also forces enemies to check if THEY are hitting the player 
    var renderEnemies = function (enemyList) 
	{
        for (var i = 0; i < enemyList.length; i++) 
		{
            console.log(enemyList[0]);
            ctx.drawImage(enemyList[0].image, enemyList[0].x, enemyList[0].y += .2, enemyList[0].w, enemyList[0].h);
            // Detects when ships hit lower level
            launcher.hitDetectLowerLevel(enemyList[0]);
        }
    }
	boosStageSound.play();

    function Launcher(){
        // bullet location (ubicación de balas)
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", // bullet color (color de bala)
        this.misiles = [];

         // If you wanted to use different fonts or messages for the player losing you can change it accordingly.
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 28px Arial, sans-serif',
        }

        this.render = function () 
		{
            if(this.direccion === 'left'){
                if(this.x > 10){this.x-=5;}
            } else if(this.direccion === 'right'){
                if(this.x < 600){this.x+=5;}
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); // background image
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); // we need to make sure spaceship is at the same location as the bullets

            for(var i=0; i < this.misiles.length; i++)
			{
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // bullet direction
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0)
				{ // If a missile goes past the canvas boundaries, remove it
                    this.misiles.splice(i,1); // splice that missile out of the misiles array
                }
            }
           
        }
		
        // Detectar impacto de bullet (bala)
        this.hitDetect = function (m, mi) 
		{
           console.log('crush');
           var e = bosses[0];
				 
           if(m.x + m.w >= e.x && m.x <= e.x+e.w && m.y >= e.y && m.y <= e.y+e.h)
		   {		
				scored +=1;
				bossLife -=1;
				impactSound.play();
                this.misiles.splice(this.misiles[mi],1); // Remove the missile
					// Remove the enemy that the missile hit
				if(bossLife <= 0)
				{	
					contador+=1;
					scored +=100;
					bosses.splice(0, 1);
					destroySound.play();
					bossDead = true;
                     // This happens if you win
            if (bossDead === true) {
				
				boosStageSound.stop();
				
				if(bossStage === 2)
				{ 
					clearInterval(animateInterval); // Stop the game animation loop
					ctx.fillStyle = 'yellow';
					ctx.font = this.gameStatus.font;
					ctx.fillText('You win!', cW * .5 - 80, 50);
					ctx.fillText('Scored : '+scored, cW * .5 - 80, 80);
					ctx.fillText('Enemies: '+contador, cW * .5 - 80, 110);
				}
				else
				{	
					ctx.fillStyle = 'yellow';
					ctx.font = this.gameStatus.font;
					ctx.fillText('Level '+nivel+' Passed', cW * .5 - 80, 50);
					clearInterval(animateInterval); // Stop the game animation loop
					nivel+=1;
					bossStage+=1;
					bossDead = false;
					lvUptSound.play();
					const myTimeout = setTimeout(initCanvas, 3000);
				}
			}
			
				}
                document.querySelector('.barra').innerHTML = "Boss Live: "+bossLife;
            }
        }
        // Ask player ship if an enemy has passed or has hit the player ship
        this.hitDetectLowerLevel = function(enemy)
		{
            // If location of ship is greater than 550 then we know it passed lower level
            if(enemy.y > 600)
			{
				gameOverSound.play();
                this.gameStatus.over = true;
                this.gameStatus.message = 'Enemy have passed!';
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> where is spaceship location
            if(enemy.id === 'enemy1')
			{
                //console.log(this.y);
                console.log(this.x);
            }
            // a) If enemy y is greater than this.y - 25 => then we know there's a collision
            // b) If enemy x is gless than this.x + 45 && enemy x > this.x - 45 then we know theres a collision
            if ((enemy.y <= this.y + 1 && enemy.y >= this.y - 1) &&
                (enemy.x <= this.x + 1 && enemy.x >= this.x - 1)) 
				{ // Checking if enemy is on the left or right of spaceship
                    gameOverSound.play();
					this.gameStatus.over = true;
                    this.gameStatus.message = 'You Died!'
                }

            if(this.gameStatus.over === true)
			{  
                clearInterval(animateInterval); // Stop the game animation loop
                ctx.fillStyle = this.gameStatus.fillStyle; // set color to text
                ctx.font = this.gameStatus.font;
                // To show text on canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // text x , y
            }
        }
    }
    
    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(bosses);
    }
    var animateInterval = setInterval(animate, 6);

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // left arrow
        {
            launcher.direccion = 'left';  
        }    
    });
    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
			launcher.x+=0;
			launcher.direccion = '';
        }
    }); 
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // right arrow
        {
			launcher.direccion = 'right';
        }
    });
    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39)
        {
			launcher.x-=0;
			launcher.direccion = '';
        }
    }); 

	//keyword to move up and down
    /*document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });*/
	// the target Movie Clip instance you want to pause
    document.addEventListener('keydown', function(event)
	{
         if(event.keyCode == 82) // restart game
         {
			location.reload();
         }
    });
	var pausa = false;
	document.addEventListener('keydown', function(event)
	{
         if(event.keyCode == 13) // restart game
         {
			if(pausa === false )
			{
				pausa = true;
			}
			else
			{
				pausa = false;	
			}
         }
    });
    // This fires when clicking on space button from keyboard
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
			shootSound.play();
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

window.addEventListener('load', function(event) {
    initCanvas();
}); 