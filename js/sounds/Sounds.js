class Sounds {
    constructor() {
        this.isSoundOn = true;

        this.sounds = {
            THEME_SONG : new Audio('/sounds/theme.mp3'),
            FALL_SOUND : new Audio('/sounds/fall.mp3'),
            GRUNT_SOUND : new Audio('/sounds/grunt.mp3'),
            GROWL_SOUND : new Audio('/sounds/growl.mp3'),
            FIRE_SOUND : new Audio('/sounds/fire.mp3'),
            MONSTER_SOUND : new Audio('/sounds/monster.mp3'),
            SPLASH_SOUND : new Audio('/sounds/splash.mp3')
        };

    }

    playThemeSong() {
        this.playSound(THEME_SONG);
    }

    playSound(sound) {
        if (sound !== undefined && this.isSoundOn) {
            let playPromise = this.sounds[sound].play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    handlePromiseError(error);
                })
            }
        }
    }

    playFireSound() {
        if (this.isSoundOn) {
            let playPromise = this.sounds[FIRE_SOUND].play();
            let self = this;
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    setTimeout(function () {
                        self.sounds[FIRE_SOUND].pause();
                    }, 3000);
                }).catch(error => {
                    handlePromiseError(error);
                })
            }
        }
    }

    stopAllSounds() {
        for (let sound of Object.values(this.sounds)) {
            sound.pause();
        }
    }

    getIsSoundOn() {
        return this.isSoundOn;
    }

    setIsSoundOn(flag) {
        this.isSoundOn = flag;
    }
}
