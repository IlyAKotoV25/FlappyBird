// SELECT CANVAS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// ИГРОВЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ
let frames = 0;
let birdFlapped = false;
let gamePaused = false;
let pPressed = false;
let nWasPressed = false;
let mouseDown = false;
let mute = false;
let night = false;
const DEGREE = Math.PI/180;

// ЗАГРУЗКА SPRITE SHEET
const sprite_sheet = new Image();
sprite_sheet.src = "img/sprite_sheet.png"

// ЗАГРУЗКА ЗВУКОВ
const DIE = new Audio();
DIE.src = "audio/audio_die.wav";

const FLAP = new Audio();
FLAP.src = "audio/audio_flap.wav";

const HIT = new Audio();
HIT.src = "audio/audio_hit.wav";

const POINT = new Audio();
POINT.src = "audio/audio_point.wav";

const SWOOSH = new Audio();
SWOOSH.src = "audio/audio_swooshing.wav";

// GAME STATES
const state = 
{
    current  : 0,
    home     : 0,
    getReady : 1,
    game     : 2,
    gameOver : 3
}

// УПРАВЛЕНИЕ
// УПРАВЛЕНИЕ,КОГДА ИГРОК КЛИКАЕТ
cvs.addEventListener("click", function(event) 
{ 
    let rect = cvs.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    switch (state.current) 
    {
        case state.home:
            // ВКЛ.ВЫКЛ ЗВУКА
            if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
            {
                mute = !mute;
                if(!mute)
                {
                    SWOOSH.currentTime = 0;
                    SWOOSH.play();
                }
            }
             
            // КНОПКА СТАРТ
            else if(clickX >= gameButtons.start_button.x && clickX <= gameButtons.start_button.x + gameButtons.start_button.w &&
                    clickY >= gameButtons.start_button.y && clickY <= gameButtons.start_button.y + gameButtons.start_button.h)
            {
                state.current = state.getReady;
                if(!mute)
                {
                    SWOOSH.currentTime = 0;
                    SWOOSH.play();
                }
            }         
            break;
        case state.getReady:
            bird.flap();
            if(!mute)
            {
                FLAP.play();
            }
            birdFlapped = true;            
            state.current = state.game;
            break;
        case state.game:
            // Кнопка паузы или возобновления
            if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
            {
                gamePaused = !gamePaused;
            }
            else if(!gamePaused)
            {
                bird.flap();
                if(!mute)
                {
                    FLAP.currentTime = 0;
                    FLAP.play();
                }
            }
            break;
        case state.gameOver:
            // КНОПКА РЕСТАРТ
            if(clickX >= gameButtons.restart_button.x && clickX <= gameButtons.restart_button.x + gameButtons.restart_button.w &&
               clickY >= gameButtons.restart_button.y && clickY <= gameButtons.restart_button.y + gameButtons.restart_button.h)
            {
                pipes.pipesReset();
                bird.speedReset();
                score.scoreReset();
                gameButtons.restart_button.isPressed = false;
                state.current = state.getReady;
                if(!mute)
                {
                    SWOOSH.currentTime = 0;
                    SWOOSH.play();
                }
            }
            // КНОПКА ДОМОЙ
            else if(clickX >= gameButtons.home_button.x && clickX <= gameButtons.home_button.x + gameButtons.home_button.w &&
                    clickY >= gameButtons.home_button.y && clickY <= gameButtons.home_button.y + gameButtons.home_button.h)
            {
                pipes.pipesReset();
                bird.speedReset();
                score.scoreReset();
                gameButtons.home_button.isPressed = false;
                state.current = state.home;
                if(!mute)
                {
                    SWOOSH.currentTime = 0;
                    SWOOSH.play();
                }
            }
            break;
    }        
});

// УПРАВЛЕНИЕ, КОГДА ИГРОК КЛИКАЕТ ЛЕВУЮ КЛАВИШУ МЫШИ
cvs.addEventListener("mousedown", function(event) 
{
    let rect = cvs.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    switch (state.current) 
    {
        case state.home: 
            mouseDown = true;
            // КНОПКА ВКЛ.ВЫКЛ ЗВУКА
            if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
            {
                // Если проигрыватель нажимает на кнопку отключения звука или включения
                gameButtons.isPressed = true;
            } 
            
            // КНОПКА СТАРТ
            else if(clickX >= gameButtons.start_button.x && clickX <= gameButtons.start_button.x + gameButtons.start_button.w &&
                    clickY >= gameButtons.start_button.y && clickY <= gameButtons.start_button.y + gameButtons.start_button.h)
            {
                // ЕСЛИ ИГРОК НАЖАЛ НА СТАРТ
                gameButtons.start_button.isPressed = true;
            } 
            break;
        case state.game:
            mouseDown = true;
            // Кнопка паузы или возобновления
            if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
            {
                // ЕСЛИ ИГРОК НАЖАЛА НА Кнопку паузы или возобновления
                gameButtons.isPressed = true;
            }
            break;
        case state.gameOver:
            mouseDown = true;
            // КНОПКА РЕСТАРТ   
            if(mouseDown &&
               clickX >= gameButtons.restart_button.x && clickX <= gameButtons.restart_button.x + gameButtons.restart_button.w &&
               clickY >= gameButtons.restart_button.y && clickY <= gameButtons.restart_button.y + gameButtons.restart_button.h)
            {
                // Если игрок нажал на кнопку рестарт
                gameButtons.restart_button.isPressed = true;
            }
            // Кнопка домой
            else if(mouseDown &&
                    clickX >= gameButtons.home_button.x && clickX <= gameButtons.home_button.x + gameButtons.home_button.w &&
                    clickY >= gameButtons.home_button.y && clickY <= gameButtons.home_button.y + gameButtons.home_button.h)
            {
                // Если игрок нажал на кнопку домой
                gameButtons.home_button.isPressed = true;
            }
            break;
    }
});


cvs.addEventListener("mouseup", function(event) 
{
    let rect = cvs.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    switch (state.current) 
    {
        case state.home: 
            mouseDown = false;
            // Кнопка отключения или включения звука
            if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
            {
                
                gameButtons.isPressed = false;
            }  
           
            // Кнопка старт
            else if(clickX >= gameButtons.start_button.x && clickX <= gameButtons.start_button.x + gameButtons.start_button.w &&
                    clickY >= gameButtons.start_button.y && clickY <= gameButtons.start_button.y + gameButtons.start_button.h)
            {
                // Если игрок перестает нажимать на кнопку "Домой"
                gameButtons.start_button.isPressed = false;
            }
            break;
        case state.game:
            mouseDown = false;
            // Кнопка паузы/возобновления
            if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
            {
               
                gameButtons.isPressed = false;
            }
            break;
        case state.gameOver:
            mouseDown = false;
            // Кнопка рестарт
            if(mouseDown &&
               clickX >= gameButtons.restart_button.x && clickX <= gameButtons.restart_button.x + gameButtons.restart_button.w &&
               clickY >= gameButtons.restart_button.y && clickY <= gameButtons.restart_button.y + gameButtons.restart_button.h)
            {
               
                gameButtons.restart_button.isPressed = false;
            }
            // Кнопка Дом
            else if(mouseDown &&
                    clickX >= gameButtons.home_button.x && clickX <= gameButtons.home_button.x + gameButtons.home_button.w &&
                    clickY >= gameButtons.home_button.y && clickY <= gameButtons.home_button.y + gameButtons.home_button.h)
            {
                
                gameButtons.home_button.isPressed = false;
            }
            break;
    }
});

// Управление, когда игрок отводит мышь от кнопок
cvs.addEventListener("mousemove", function(event) 
{
    let rect = cvs.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    switch (state.current) 
    {
        case state.home:
            if(mouseDown)
            {
                // Кнопка отключения или включения звука
                if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                    clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
                {
                    
                    gameButtons.isPressed = true;
                }  
                else
                {
                    
                    gameButtons.isPressed = false;

                }
                
                // Кнопка старт
                if(clickX >= gameButtons.start_button.x && clickX <= gameButtons.start_button.x + gameButtons.start_button.w &&
                   clickY >= gameButtons.start_button.y && clickY <= gameButtons.start_button.y + gameButtons.start_button.h)
                {
                    
                    gameButtons.start_button.isPressed = true;
                }
                else
                {
                    
                    gameButtons.start_button.isPressed = false;
                }
            }
            break;
        case state.game:
            if(mouseDown)
            {
                // Pause or Resume button
                if (clickX >= gameButtons.x && clickX <= gameButtons.x + gameButtons.w &&
                    clickY >= gameButtons.y && clickY <= gameButtons.y + gameButtons.h) 
                {
                    
                    gameButtons.isPressed = true;
                }
                else
                {
                    
                    gameButtons.isPressed = false;
                }
            }
            break;
        case state.gameOver:
            // Restart button
            if(mouseDown)
            {
                if(clickX >= gameButtons.restart_button.x && clickX <= gameButtons.restart_button.x + gameButtons.restart_button.w &&
                   clickY >= gameButtons.restart_button.y && clickY <= gameButtons.restart_button.y + gameButtons.restart_button.h)
                {
                    
                    gameButtons.restart_button.isPressed = true;
                }
                else
                {
                    
                    gameButtons.restart_button.isPressed = false;
                }
            }
            // Home button
            if(mouseDown)
            {
                if(clickX >= gameButtons.home_button.x && clickX <= gameButtons.home_button.x + gameButtons.home_button.w &&
                   clickY >= gameButtons.home_button.y && clickY <= gameButtons.home_button.y + gameButtons.home_button.h)
                {
                    
                    gameButtons.home_button.isPressed = true;
                }
                else
                {
                    
                    gameButtons.home_button.isPressed = false;
                }
            }
            break;
    }
});

// BACKGROUND
const background = 
{
    day_spriteX   : 0,
    night_spriteX : 1211,
    spriteY : 392,
    spriteW : 552,
    spriteH : 408,
    x : 0,
    y : 0,
    w : 0,
    h : 0,

    stars : 
    {
        spriteX : 1211,
        spriteY : 0,
        spriteW : 552,
        spriteH : 392,
        y: 0,
        h : 0
    },

    draw : function() 
    {
        let spriteX = night ? this.night_spriteX : this.day_spriteX;

        ctx.drawImage(
                        sprite_sheet, 
                        spriteX, this.spriteY, 
                        this.spriteW, this.spriteH, 
                        this.x, this.y, 
                        this.w, this.h
                     );
        if(night)
        {
            ctx.drawImage(
                            sprite_sheet, 
                            this.stars.spriteX, this.stars.spriteY, 
                            this.stars.spriteW, this.stars.spriteH, 
                            this.x, this.stars.y, 
                            this.w, this.stars.h
                         );
        }
    }
}

// FOREGROUND
const foreground = 
{
    spriteX : 553,
    spriteY : 576,
    spriteW : 447,
    spriteH : 224,
    x : 0,
    y : 0,
    w : 0,
    h : 0,

    dx : 0,

    draw : function() 
    {
        // Рисование 2 изображений переднего плана, поскольку ширина спрайта меньше ширины холста
        ctx.drawImage(
                        sprite_sheet, 
                        this.spriteX, this.spriteY, 
                        this.spriteW, this.spriteH, 
                        this.x, this.y, 
                        this.w, this.h
                     );
        ctx.drawImage(
                        sprite_sheet, 
                        this.spriteX, this.spriteY, 
                        this.spriteW, this.spriteH, 
                        (this.x + this.w)-0.7, this.y, 
                        this.w, this.h
                     );
    },

    update : function() 
    {
        if(state.current != state.gameOver) 
        {
            // Продолжает уменьшать x на dx до тех пор, пока передний план не переместится на свою ширину / 2
            this.x = (this.x - this.dx) % (this.w/2);
        }
    }
}

// BIRD
const bird = 
{
    animation : 
    [
        {spriteX: 932, spriteY: 429, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 478, spriteW: 68, spriteH: 48},
        {spriteX: 932, spriteY: 527, spriteW: 68, spriteH: 48}
    ],
    x : 0, 
    y : 0, 
    w : 0, 
    h : 0,

    frame    : 0,
    gravity  : 0,
    jump     : 0,
    speed    : 0,
    rotation : 0,
    radius_x : 0,
    radius_y : 0,

    draw : function() 
    {
        let bird = this.animation[this.frame];

        // Сохранение состояния холста таким образом, чтобы вращалась только птица
        ctx.save();
        // Перевод из начала координат (0, 0) в начало координат птицы таким образом, чтобы центр вращения был центром птицы
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation);

        if(state.current != state.home)
        {
            ctx.drawImage(
                            sprite_sheet, 
                            bird.spriteX, bird.spriteY, 
                            bird.spriteW, bird.spriteH, 
                            -this.w/2, -this.h/2, // Центрируем птицу
                            this.w, this.h
                         );
        }

        // Восстановить состояние после поворота
        ctx.restore();
    },

    flap : function() 
    {
        this.speed = -this.jump;
    },

    update: function() 
    {
        // Птица взмахивает крыльями в состоянии готовности
        this.period = (state.current == state.getReady) ? 6 : 4;
        // Увеличивая кадр на 1, каждый период
        this.frame += frames % this.period == 0 ? 1 : 0;
        // Кадр переходит от 0 к 3, затем снова к 0
        this.frame = this.frame % this.animation.length; 

        if(state.current == state.getReady)
        {
            // Сбрасывание положение птицы после окончания игры
            this.y = cvs.height * 0.395;
            this.rotation = 0 * DEGREE;
        } 
        else
        {
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= foreground.y)
            {
                // Положение птицы при столкновении с передним планом
                this.y = foreground.y - this.h/2;
                if(state.current == state.game)
                {
                    state.current = state.gameOver;
                    if(!mute)
                    {
                        HIT.play();
                        setTimeout(function()
                        {
                            SWOOSH.currentTime = 0;
                            SWOOSH.play();
                        }, 500)
                    }
                }
            }

            // Если скорость больше, чем при прыжке, это означает, что птица падает вниз
            if(this.speed >= this.jump)
            {
                this.rotation = 90 * DEGREE;
                // Прекращение анимации взмахов крыльями, когда птица погибает
                this.frame = 0;
            }
            else
            {
                this.rotation = -25 * DEGREE;
            }
        }  
    },

    speedReset : function()
    {
        this.speed = 0;
    }
}

// PIPES
const pipes =
{
    position : [],
    
    top :
    {
        spriteX: 1001, spriteY: 0, 
        spriteW: 104, spriteH: 800,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    bottom : 
    {
        spriteX: 1105, spriteY: 0, 
        spriteW: 104, spriteH: 800,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    dx      : 0,
    gap     : 0,
    maxYPos : 0,
    scored  : false,

    draw : function()
    {
        if(state.current == state.game || state.current == state.gameOver)
        {
            for(let i = 0; i < this.position.length; i++)
            {
                let p = this.position[i];
                
                let topYPos = p.y;
                let bottomYPos = p.y + this.h + this.gap;
    
                ctx.drawImage( 
                                sprite_sheet, 
                                this.top.spriteX, this.top.spriteY, 
                                this.top.spriteW, this.top.spriteH, 
                                p.x, topYPos, 
                                this.w, this.h
                             ); 
                ctx.drawImage( 
                                sprite_sheet, 
                                this.bottom.spriteX, this.bottom.spriteY, 
                                this.bottom.spriteW, this.bottom.spriteH, 
                                p.x, bottomYPos, 
                                this.w, this.h
                             );
            }
        }
    },

    update : function()
    {
        
        if(state.current != state.game) 
        {
            return;
        }

        // Каждые 80 кадров добавляем новую позицию в наш массив позиций
        if(frames%80 == 0) 
        {
            this.position.push(
            {
                x : cvs.width,
                y : this.maxYPos * (Math.random() + 1),
                scored : false
            });
        }
        
        for(let i = 0; i < this.position.length; i++)
        {
            let p = this.position[i];
            let bottomYPos = p.y + this.h + this.gap;

            // ОБНАРУЖЕНИЕ СТОЛКНОВЕНИЙ
            // Top pipe
            if(bird.x + bird.radius_x > p.x && bird.x - bird.radius_x < p.x + this.w &&
               bird.y + bird.radius_y > p.y && bird.y - bird.radius_y < p.y + this.h)
            {
                state.current = state.gameOver;
                if(!mute)
                {
                    HIT.play();
                    setTimeout(function() 
                    {
                        if (state.current == state.gameOver) 
                        {
                            DIE.currentTime = 0;
                            DIE.play();
                        }
                    }, 500)
                }
            }
            // Bottom pipe
            if(bird.x + bird.radius_x > p.x && bird.x - bird.radius_x < p.x + this.w &&
               bird.y + bird.radius_y > bottomYPos && bird.y - bird.radius_y < bottomYPos + this.h)
            {
                state.current = state.gameOver;
                if(!mute)
                {
                    HIT.play();
                    setTimeout(function() 
                    {
                        if (state.current == state.gameOver) 
                        {
                            DIE.currentTime = 0;
                            DIE.play();
                        }
                    }, 500)   
                }               
            }
            
            if(bird.x + bird.radius_x > p.x && bird.x - bird.radius_x < p.x + this.w &&
               bird.y <= 0)
            {
                state.current = state.gameOver;
                if(!mute)
                {
                    HIT.play();
                    setTimeout(function() 
                    {
                        if (state.current == state.gameOver) 
                        {
                            DIE.currentTime = 0;
                            DIE.play();
                        }
                    }, 500)   
                }   
            }

            // Движение труб
            p.x -= this.dx;

            
            if (this.position.length == 6) 
            {
                this.position.splice(0, 2);
            }
            
            // Обновление счета, когда птица пролетает мимо трубы
            if (p.x + this.w < bird.x - bird.radius_x && !p.scored) 
            {
                score.game_score++;
                if(!mute)
                {
                    POINT.play();
                }
                
                if(score.game_score > score.best_score)
                {
                    score.best_score = score.game_score;
                    score.new_best_score = true;
                }

                localStorage.setItem("best_score", score.best_score);
                p.scored = true;
            }
        }
    },

    pipesReset : function()
    {
        this.position = [];
    }
}

// HOME
const home = 
{
    logo : 
    {
        spriteX: 552, spriteY: 233, 
        spriteW: 384, spriteH: 87,
        x: 0, y: 0,
        w: 0, h: 0,
        MAXY: 0, MINY: 0, dy: 0
    },

    animation : 
    [
        {spriteX: 931, spriteY: 429, spriteW: 68, spriteH: 48},
        {spriteX: 931, spriteY: 478, spriteW: 68, spriteH: 48},
        {spriteX: 931, spriteY: 527, spriteW: 68, spriteH: 48}
    ],

    bird : 
    {
        x: 0, y: 0, 
        w: 0, h: 0
    },

    studio_name : 
    {
        spriteX: 172, spriteY: 284, 
        spriteW: 380, spriteH: 28,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    frame    : 0,
    logoGoUp : true,

    draw : function() 
    {
        let bird = this.animation[this.frame];

        if(state.current == state.home)
        {
            ctx.drawImage(
                            sprite_sheet,
                            this.logo.spriteX, this.logo.spriteY, 
                            this.logo.spriteW, this.logo.spriteH, 
                            this.logo.x, this.logo.y, 
                            this.logo.w, this.logo.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            bird.spriteX, bird.spriteY, 
                            bird.spriteW, bird.spriteH, 
                            this.bird.x, this.bird.y,
                            this.bird.w, this.bird.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.studio_name.spriteX, this.studio_name.spriteY, 
                            this.studio_name.spriteW, this.studio_name.spriteH, 
                            this.studio_name.x, this.studio_name.y, 
                            this.studio_name.w, this.studio_name.h
                         );
        }
    },

    update: function() 
    {
        if (state.current == state.home) 
        {
            if (this.logoGoUp) 
            {
                this.logo.y -= this.logo.dy;
                this.bird.y -= this.logo.dy;
                if(this.logo.y <= this.logo.MAXY) 
                {
                    this.logoGoUp = false;
                }
            }
            if (!this.logoGoUp) 
            {
                this.logo.y += this.logo.dy;
                this.bird.y += this.logo.dy;
                if(this.logo.y >= this.logo.MINY) 
                {
                    this.logoGoUp = true;
                }
            }
        }

        this.period = 6;
        
        this.frame += frames % this.period == 0 ? 1 : 0;
        
        this.frame = this.frame % this.animation.length; 
    }
}

// GET READY MESSAGE
const getReady = 
{
    get_ready : 
    {
        spriteX: 552, spriteY: 321, 
        spriteW: 349, spriteH: 87,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    tap : 
    {
        spriteX: 0, spriteY: 0, 
        spriteW: 155, spriteH: 196,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    draw : function() 
    {
        if(state.current == state.getReady)
        {
                ctx.drawImage(
                                sprite_sheet, 
                                this.get_ready.spriteX, this.get_ready.spriteY, 
                                this.get_ready.spriteW, this.get_ready.spriteH, 
                                this.get_ready.x, this.get_ready.y,
                                this.get_ready.w, this.get_ready.h
                             );
                ctx.drawImage(
                                sprite_sheet, 
                                this.tap.spriteX, this.tap.spriteY, 
                                this.tap.spriteW, this.tap.spriteH, 
                                this.tap.x, this.tap.y,
                                this.tap.w, this.tap.h
                             );
        }
    }
}

// ИГРОВЫЕ КНОПКИ
const gameButtons = 
{
    mute_button : 
    {
        spriteX: 171, spriteY: 63, 
        spriteW: 55, spriteH: 62,
    },

    unmute_button : 
    {
        spriteX: 171, spriteY: 0, 
        spriteW: 55, spriteH: 62,
    },

    start_button : 
    {
        spriteX: 227, spriteY: 0, 
        spriteW: 160, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0,
        y_pressed : 0,
        isPressed : false
    },

    pause_button : 
    {
        spriteX: 280, spriteY: 114, 
        spriteW: 52, spriteH: 56,
    },

    resume_button : 
    {
        spriteX: 227, spriteY: 114, 
        spriteW: 52, spriteH: 56,
    },

    home_button : 
    {
        spriteX: 388, spriteY: 171, 
        spriteW: 160, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0,
        y_pressed : 0,
        isPressed : false
    },

    restart_button : 
    {
        spriteX: 227, spriteY: 57, 
        spriteW: 160, spriteH: 56,
        x: 0, y: 0, 
        w: 0, h: 0,
        y_pressed : 0,
        isPressed : false
    },

    night_button :
    {
        spriteX: 280, spriteY: 171, 
        spriteW: 56, spriteH: 60,
        x: 0,
        isPressed : false
    },

    day_button :
    {
        spriteX: 223, spriteY: 171, 
        spriteW: 56, spriteH: 60,
        x: 0,
        isPressed : false
    },

    
    x: 0, 
    y: 0, 
    w: 0, 
    h: 0,
    y_pressed : 0,
    isPressed : false,

    draw : function() 
    {
        // Кнопка паузы, возобновления, отключения звука или включения
        let button_y = this.isPressed ? this.y_pressed : this.y;
        // Night or Day button
        let night_button_y = this.night_button.isPressed ? this.y_pressed : this.y;
        // Start Button
        let start_button_y = this.start_button.isPressed ? this.start_button.y_pressed : this.start_button.y;
        // Restart button
        let restart_button_y = this.restart_button.isPressed ? this.restart_button.y_pressed : this.restart_button.y;
        // Home button
        let home_button_y = this.home_button.isPressed ? this.home_button.y_pressed : this.home_button.y;

        if(state.current == state.home)
        {
            if(!mute)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.unmute_button.spriteX, this.unmute_button.spriteY, 
                                this.unmute_button.spriteW, this.unmute_button.spriteH, 
                                this.x, button_y, 
                                this.w, this.h
                             );
            }
            else if(mute)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.mute_button.spriteX, this.mute_button.spriteY, 
                                this.mute_button.spriteW, this.mute_button.spriteH, 
                                this.x, button_y, 
                                this.w, this.h
                             ); 
            } 

            if(!night)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.day_button.spriteX, this.day_button.spriteY, 
                                this.day_button.spriteW, this.day_button.spriteH, 
                                this.night_button.x, night_button_y, 
                                this.w, this.h
                             );
            }
            else if(night)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.night_button.spriteX, this.night_button.spriteY, 
                                this.night_button.spriteW, this.night_button.spriteH, 
                                this.night_button.x, night_button_y, 
                                this.w, this.h
                             );
            }  
                       
            ctx.drawImage(
                            sprite_sheet, 
                            this.start_button.spriteX, this.start_button.spriteY, 
                            this.start_button.spriteW, this.start_button.spriteH, 
                            this.start_button.x, start_button_y, 
                            this.start_button.w, this.start_button.h
                         );
        }
        else if(state.current == state.game)
        {
            if(!gamePaused)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.pause_button.spriteX, this.pause_button.spriteY, 
                                this.pause_button.spriteW, this.pause_button.spriteH, 
                                this.x, button_y, 
                                this.w, this.h
                             );
            }
            else if(gamePaused)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.resume_button.spriteX, this.resume_button.spriteY, 
                                this.resume_button.spriteW, this.resume_button.spriteH, 
                                this.x, button_y, 
                                this.w, this.h
                             ); 
            }
        }
        else if(state.current == state.gameOver)
        {
            ctx.drawImage(
                            sprite_sheet, 
                            this.restart_button.spriteX, this.restart_button.spriteY, 
                            this.restart_button.spriteW, this.restart_button.spriteH, 
                            this.restart_button.x, restart_button_y, 
                            this.restart_button.w, this.restart_button.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.home_button.spriteX, this.home_button.spriteY, 
                            this.home_button.spriteW, this.home_button.spriteH, 
                            this.home_button.x, home_button_y, 
                            this.home_button.w, this.home_button.h
                         );
        }
    }
}

// GAME OVER
const gameOver = 
{
    game_over : 
    {
        spriteX: 553, spriteY: 410, 
        spriteW: 376, spriteH: 75,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    scoreboard : 
    {
        spriteX: 548, spriteY: 0, 
        spriteW: 452, spriteH: 232,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    draw : function() 
    {
        if(state.current == state.gameOver)
        {

            ctx.drawImage(
                            sprite_sheet, 
                            this.game_over.spriteX, this.game_over.spriteY, 
                            this.game_over.spriteW, this.game_over.spriteH, 
                            this.game_over.x, this.game_over.y, 
                            this.game_over.w, this.game_over.h
                         );
            ctx.drawImage(
                            sprite_sheet, 
                            this.scoreboard.spriteX, this.scoreboard.spriteY, 
                            this.scoreboard.spriteW, this.scoreboard.spriteH, 
                            this.scoreboard.x, this.scoreboard.y, 
                            this.scoreboard.w, this.scoreboard.h
                         );
        }
    }
}

// SCORE
const score = 
{
    new_best :
    {
        spriteX: 921, spriteY: 349, 
        spriteW: 64, spriteH: 28,
        x: 0, y: 0, 
        w: 0, h: 0
    },

    number : 
    [
        {spriteX :  98}, // 0
        {spriteX : 127}, // 1
        {spriteX : 156}, // 2
        {spriteX : 185}, // 3
        {spriteX : 214}, // 4
        {spriteX : 243}, // 5
        {spriteX : 272}, // 6 
        {spriteX : 301}, // 7
        {spriteX : 330}, // 8
        {spriteX : 359}  // 9
    ],
    spriteY : 243, 
    spriteW : 28, 
    spriteH : 40,
    x : 0,
    y : 0,
    w : 0,
    y : 0,
    one_w : 0,
    space : 0,
    score : {x: 0, y: 0, w: 0, h: 0},
    best  : {x: 0, y: 0, w: 0, h: 0},

    // Если localStorage пусто для best_score, то best_score равно 0
    best_score : parseInt(localStorage.getItem("best_score")) || 0,
    game_score : 0,
    new_best_score : false,

    draw : function()
    {
        let game_score_s = this.game_score.toString();
        let best_score_s = this.best_score.toString();

        if(state.current == state.game)
        {
            let total_width = 0;
            for (let i = 0; i < game_score_s.length; i++) 
            {
                if (game_score_s[i] == 1) 
                {
                    total_width += this.one_w + this.space;
                } 
                else 
                {
                    total_width += this.w + this.space;
                }
            }

            // Смещение игрового счета для центрирования его по горизонтали
            let offset = this.x - total_width / 2 + (this.w / 2);
            
            for(let i = 0; i < game_score_s.length; i++)
            {
                
                if (i < game_score_s.length - 1 && game_score_s[i+1] == 1) 
                {
                    ctx.drawImage(
                                    sprite_sheet, 
                                    this.number[parseInt(game_score_s[i])].spriteX, this.spriteY, 
                                    this.spriteW, this.spriteH, 
                                    offset, this.y,
                                    this.w, this.h
                                 );
                    offset = offset + this.one_w + this.space;
                } 
                
                else 
                {
                    ctx.drawImage(
                                    sprite_sheet, 
                                    this.number[parseInt(game_score_s[i])].spriteX, this.spriteY, 
                                    this.spriteW, this.spriteH, 
                                    offset, this.y,
                                    this.w, this.h
                                 );
                    offset = offset + this.w + this.space;
                }
            }            
        }
        else if(state.current == state.gameOver)
        {
            let offset_1 = 0;
            // Game score on Game Over screen
            for(let i = game_score_s.length - 1; i >= 0; i--)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.number[parseInt(game_score_s[i])].spriteX, this.spriteY, 
                                this.spriteW, this.spriteH, 
                                this.score.x + offset_1, this.score.y, 
                                this.w, this.h
                            );
                if(parseInt(game_score_s[i]) == 1)
                {
                    offset_1 = offset_1 - this.one_w - this.space;
                }
                else
                {
                    offset_1 = offset_1 - this.w - this.space;
                }
            }

            let offset_2 = 0;
            // Best score on Game Over screen
            for(let i = best_score_s.length - 1; i >= 0; i--)
            {     
                ctx.drawImage(
                                sprite_sheet, 
                                this.number[parseInt(best_score_s[i])].spriteX, this.spriteY, 
                                this.spriteW, this.spriteH, 
                                this.best.x + offset_2, this.best.y, 
                                this.w, this.h
                            );
                if(parseInt(best_score_s[i]) == 1)
                {
                    offset_2 = offset_2 - this.one_w - this.space;
                }
                else
                {
                    offset_2 = offset_2 - this.w - this.space;
                }
            }
            
            if(this.new_best_score)
            {
                ctx.drawImage(
                                sprite_sheet, 
                                this.new_best.spriteX, this.new_best.spriteY, 
                                this.new_best.spriteW, this.new_best.spriteH, 
                                this.new_best.x, this.new_best.y, 
                                this.new_best.w, this.new_best.h
                             ); 
            }            
        }
    },

    scoreReset : function()
    {
        this.game_score = 0;
        this.new_best_score = false;
    }
}

// SCORE MEDALS
const medal = 
{
    // Medal's variables
    bronze   : {spriteX: 554},
    silver   : {spriteX: 642},
    gold     : {spriteX: 731},
    platinum : {spriteX: 820},
    spriteY: 487,
    spriteW: 88, 
    spriteH: 87,
    x : 0,
    y : 0,
    w : 0,
    h : 0,

    medal: "",

    // Shine animation's variables
    animation : 
    [
        {spriteX: 922, spriteY: 386, spriteW: 20, spriteH: 20},
        {spriteX: 943, spriteY: 386, spriteW: 20, spriteH: 20},
        {spriteX: 964, spriteY: 386, spriteW: 20, spriteH: 20},
        {spriteX: 943, spriteY: 386, spriteW: 20, spriteH: 20},
        {spriteX: 922, spriteY: 386, spriteW: 20, spriteH: 20}
    ],
    animation_w : 0,
    animation_h : 0,
    shine_position : [],
    frame  : 0,
    radius : 0,      

    draw: function () 
    {
        let medalSpriteX;
        
        if (score.game_score >= 10 && score.game_score < 20) 
        {
            this.medal = "bronze";
            medalSpriteX = this.bronze;
        } 
        else if (score.game_score >= 20 && score.game_score < 30) 
        {
            this.medal = "silver";
            medalSpriteX = this.silver;
        }
        else if (score.game_score >= 30 && score.game_score < 40) 
        {
            this.medal = "gold";
            medalSpriteX = this.gold;
        } 
        else if (score.game_score >= 40) 
        {
            this.medal = "platinum";
            medalSpriteX = this.platinum;
        }

        if (state.current == state.gameOver && score.game_score >= 10) 
        {
            ctx.drawImage(
                            sprite_sheet,
                            medalSpriteX.spriteX, this.spriteY, 
                            this.spriteW, this.spriteH, 
                            this.x, this.y, 
                            this.w, this.h
                         ); 

            let shine = this.animation[this.frame];
            for (let i = 0; i < this.shine_position.length; i++) 
            {
                let position = this.shine_position[i];

                ctx.drawImage(
                                sprite_sheet,
                                shine.spriteX, shine.spriteY,
                                shine.spriteW, shine.spriteH,
                                position.x, position.y,
                                this.animation_w, this.animation_h
                             );  
            }
        }
    },
    
    update: function() 
    {
        // Как часто следует обновлять эффект блеска, в кадрах
        this.period = 7;
        // Увеличивая кадр на 1, каждый период
        this.frame += frames % this.period == 0 ? 1 : 0;
        // Кадр переходит от 0 к 5, затем снова к 0
        this.frame = this.frame % this.animation.length; 

        // Сброс массива shine_position после последнего кадра, чтобы одновременно отображалась только 1 анимация
        if (this.frame == this.animation.length - 1)
            this.shine_position = [];

        if (frames % (this.period * this.animation.length) == 0) 
        {
            
            const limit = 0.9 * this.radius;
            
            const angle = Math.random() * Math.PI * 2;
            
            const distance = Math.random() * limit;
    
            this.shine_position.push(
            {
                x: this.centerX + Math.cos(angle) * distance,
                y: this.centerY + Math.sin(angle) * distance
            });
        }
    }
}

// CANVAS SCALE
function canvasScale() 
{
    // CANVAS HEIGHT & WIDTH
    cvs.height = window.innerHeight - 2;
    cvs.width  = cvs.height * 0.72 - 2;

    // BACKGROUND
    background.x = 0;
    background.y = cvs.height * 0.631;
    background.w = cvs.width;
    background.h = background.w * 0.74;
    

    // FOREGROUND
    foreground.x = 0;
    foreground.y = cvs.height * 0.861;
    foreground.w = cvs.width * 0.7;
    foreground.h = foreground.w * 0.46;
    foreground.dx = cvs.width * 0.007;

    // BIRD
    bird.x = cvs.width * 0.290;
    bird.y = cvs.height * 0.395;
    bird.w = cvs.width * 0.117;
    bird.h = cvs.height * 0.059;
    bird.gravity = cvs.height * 0.0006;
    bird.jump = cvs.height * 0.01;
    bird.radius_x = cvs.width * 0.052;
    bird.radius_y = cvs.height * 0.026;

    // PIPES
    for(let i = 0; i < pipes.position.length; i++)
    {
        let w = pipes.w / 0.164;
        let h = pipes.h / 0.888;
        let p = pipes.position[i];

        pipes.position[i] = 
        {
            x : p.x * cvs.width / w,
            y : p.y * cvs.height / h
        }
    }
    pipes.w = cvs.width * 0.164;
    pipes.h = cvs.height * 0.888;
    pipes.gap = cvs.height * 0.177;
    pipes.maxYPos = -(cvs.height * 0.350);
    pipes.dx = cvs.width * 0.007;

    // HOME
    // Logo
    home.logo.x = cvs.width * 0.098;
    home.logo.y = cvs.height * 0.279;
    home.logo.w = cvs.width * 0.665;
    home.logo.h = cvs.height * 0.109; 
    home.logo.MAXY = cvs.height * 0.279 - home.logo.h/7;
    home.logo.MINY = cvs.height * 0.279 + home.logo.h/7;
    home.logo.dy = cvs.width * 0.0012;
    // Bird
    home.bird.x = cvs.width * 0.803;
    home.bird.y = cvs.height * 0.294;
    home.bird.w = cvs.width * 0.117;
    home.bird.h = cvs.height * 0.059;
    // Studio Name
    home.studio_name.x = cvs.width * 0.171;
    home.studio_name.y = cvs.height * 0.897;
    home.studio_name.w = cvs.width * 0.659;
    home.studio_name.h = cvs.height * 0.034; 

    // GET READY
    // "Get Ready" message
    getReady.get_ready.x = cvs.width * 0.197;
    getReady.get_ready.y = cvs.height * 0.206;
    getReady.get_ready.w = cvs.width * 0.602;
    getReady.get_ready.h = cvs.height * 0.109;  
    // Tap
    getReady.tap.x = cvs.width * 0.433;
    getReady.tap.y = cvs.height * 0.435;
    getReady.tap.w = cvs.width * 0.270;
    getReady.tap.h = cvs.height * 0.244;

    // GAME BUTTONS 
    // Pause, Resume, Mute, Unmute, Night and Day buttons
    gameButtons.x = cvs.width * 0.087;
    gameButtons.y = cvs.height * 0.045;
    gameButtons.y_pressed = cvs.height * 0.049;
    gameButtons.w = cvs.width * 0.088;
    gameButtons.h = cvs.height * 0.069;
    // Night or Day button's x
    gameButtons.night_button.x = cvs.width * 0.189;
    // Start Button
    gameButtons.start_button.x = cvs.width * 0.359;
    gameButtons.start_button.y = cvs.height * 0.759;
    gameButtons.start_button.y_pressed = cvs.height * 0.763;
    gameButtons.start_button.w = cvs.width * 0.276;
    gameButtons.start_button.h = cvs.height * 0.068;
    // Restart button
    gameButtons.restart_button.x = cvs.width * 0.147;
    gameButtons.restart_button.y = cvs.height * 0.759;
    gameButtons.restart_button.y_pressed = cvs.height * 0.763;
    gameButtons.restart_button.w = cvs.width * 0.276;
    gameButtons.restart_button.h = cvs.height * 0.068;
    // Home button
    gameButtons.home_button.x = cvs.width * 0.576;
    gameButtons.home_button.y = cvs.height * 0.759;
    gameButtons.home_button.y_pressed = cvs.height * 0.763;
    gameButtons.home_button.w = cvs.width * 0.276;
    gameButtons.home_button.h = cvs.height * 0.068;

    // GAME OVER
    // "Game Over" message
    gameOver.game_over.x = cvs.width * 0.182;
    gameOver.game_over.y = cvs.height * 0.243;
    gameOver.game_over.w = cvs.width * 0.645;
    gameOver.game_over.h = cvs.height * 0.095; 
    // Scoreboard
    gameOver.scoreboard.x = cvs.width * 0.107;
    gameOver.scoreboard.y = cvs.height * 0.355;
    gameOver.scoreboard.w = cvs.width * 0.782;
    gameOver.scoreboard.h = cvs.height * 0.289;

    // SCORE
    // New best score label
    score.new_best.x = cvs.width * 0.577;
    score.new_best.y = cvs.height * 0.500;
    score.new_best.w = cvs.width * 0.112;
    score.new_best.h = cvs.height * 0.035;
    // Width & height for every number
    score.w = cvs.width * 0.048;
    score.h = cvs.height * 0.046;
    score.one_w = cvs.width * 0.032
    // Score on game screen
    score.x = cvs.width * 0.476;
    score.y = cvs.height * 0.045;
    // Score on game over screen
    score.score.x = cvs.width * 0.769;
    score.score.y = cvs.height * 0.441;
    // Best score on game screen
    score.best.x = cvs.width * 0.769;
    score.best.y = cvs.height * 0.545;
    // Space between numbers
    score.space = cvs.width * 0.016;

    // SCORE MEDALS
    // Medals
    medal.x = cvs.width * 0.197;
    medal.y = cvs.height * 0.461;
    medal.w = cvs.width * 0.152;
    medal.h = cvs.height * 0.108;
    // Animation
    for(let i = 0; i < medal.shine_position.length; i++)
    {
        let w = medal.animation_w / 0.034;
        let h = medal.animation_w / 0.023;
        let position = medal.shine_position[i];

        medal.shine_position[i] = 
        {
            x : position.x * cvs.width / w,
            y : position.y * cvs.height / h
        }
    }
    medal.radius = cvs.width * 0.061;
    medal.centerX = cvs.width * 0.257;
    medal.centerY = cvs.height * 0.506;
    medal.animation_w = cvs.width * 0.034;
    medal.animation_h = cvs.height * 0.023;
}

// Когда окно загружается или изменяет размер
window.addEventListener("load", () => {
    canvasScale();
    window.addEventListener("resize", canvasScale);
});


function draw() 
{
    // Background color  
    ctx.fillStyle = !night ? "#7BC5CD" : "#12284C"; 
    ctx.fillRect(0, 0, cvs.width, cvs.height); 

    background.draw();
    pipes.draw();
    foreground.draw();
    bird.draw();
    home.draw();
    getReady.draw();
    gameButtons.draw();
    gameOver.draw();
    medal.draw();
    score.draw();
}

// UPDATE
function update() 
{
    // Положение и состояние птицы, переднего плана и труб только в том случае, если игра не приостановлена
    if(!gamePaused)
    {
        bird.update();
        foreground.update();
        pipes.update();
    }
    home.update();
    medal.update();
}

// LOOP
function loop() 
{
    // Update rate: 75FPS
    setTimeout(function() 
    {
        update();
        draw();
        // Увеличение количество кадров только в том случае, если игра не приостановлена
        if(!gamePaused)
        {
            frames++;
        }
        requestAnimationFrame(loop);
    }, (1 / 75) * 1000);
}

loop();