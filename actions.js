/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function attack(direction) {
    barbarianAttackTime = new Date().getTime();
    actionHelper(direction, undefined, ATTACK_FRAMES, ATTACK, 1);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function jump(direction) {
    actionHelper(direction, false, JUMP_FRAMES, JUMP, 1, function() {console.log('callback')});
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function run(direction) {
    actionHelper(direction, true, RUN_FRAMES, RUN);
}

/**
 * Starts the barbarian walking to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function walk(direction) {
    actionHelper(direction, false, WALK_FRAMES, WALK);
}

/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(direction) {
    var isRight = direction === RIGHT;

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * barbarian.width()) 
                    : (-1 * STOP_LEFT_POSITION * barbarian.width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET) 
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * barbarian.height();
    barbarian.css('background-position', x + 'px ' + y + 'px');
    barbarian.stop();
}

function actionHelper(direction, isRunning, frames, requestedAction, times = 0) {
    barbarian.stop();
    var isRight = direction === RIGHT;
    if (typeof isRunning !== 'undefined') {
        isRunning ? isRight ? runRight() : runLeft()
                  : isRight ? moveRight() : moveLeft();
    }
    
    animateSprite(barbarian, 'barbarian',  frames[direction]['FRAMES'], requestedAction, isRight ? RIGHT : LEFT, frames[direction]['HEIGHT_OFFSET'], times);
}

// TODP: break out into monster module
async function monsterAttack() {

    monster.css('background-position', -1*14*monster.width() + 'px ' + -1*monster.height() + 'px');
    var index = 0;
    var path = WALK_FRAMES[LEFT]['FRAMES'];
    var distance = windowWidth;
    monster.animate({left: (monster.offset().left - distance) + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    while(true) {
        
        frame = path[index];
        monster.css('background-position',(-1*frame*monster.width()) + 'px ' + -1*monster.height()*WALK_FRAMES[LEFT]['HEIGHT_OFFSET'] + 'px');
        index++;
        if (index == path.length) {
            index = 0;
        }
        //console.log('barbarian:' + barbarian.offset().left + ' monster:' + monster.offset().left);
        if (monster.offset().left - barbarian.offset().left < 200) {
            monster.stop();
            break;
        }
        await sleep(1000/SPRITE_FPS);
    }

    index = 0;
    path = ATTACK_FRAMES[LEFT]['FRAMES'];
    distance = 200;
    monsterAttackTime = new Date().getTime();
    var barbarianAttackDistance = monster.offset().left - barbarian.offset().left;
    console.log('barbarian attack time:' + (barbarianAttackTime - monsterAttackTime) + ' distance:' + barbarianAttackDistance);

    for (index in path) {
        console.log(index);
        if (index == 2) {
            console.log('now');
            if (barbarianAttackDistance < 200 && barbarianAttackTime < monsterAttackTime) {
                monster.css('display','none');
                monster.stop();
            } else {
                barbarian.css('display','none');
                barbarian.stop();
            }
        }
        frame = path[index];
        monster.css('background-position',(-1*frame*monster.width()) + 'px ' + -1*monster.height()*ATTACK_FRAMES[LEFT]['HEIGHT_OFFSET'] + 'px');
        await sleep(1000/SPRITE_FPS);
    }
    
}
