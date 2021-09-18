class Sounds {
    constructor() {
        this.isSoundOn = false;

        this.sounds = {
            THEME_SONG : this.isSoundOn ? new Audio('/sounds/theme.mp3') : undefined,
            FALL_SOUND : this.isSoundOn ? new Audio('/sounds/fall.mp3') : undefined,
            GRUNT_SOUND : this.isSoundOn ? new Audio('/sounds/grunt.mp3') : undefined,
            GROWL_SOUND : this.isSoundOn ? new Audio('/sounds/growl.mp3') : undefined,
            FIRE_SOUND : this.isSoundOn ? new Audio('/sounds/fire.mp3') : undefined,
            MONSTER_SOUND : this.isSoundOn ? new Audio('/sounds/monster.mp3') : undefined,
            SPLASH_SOUND : this.isSoundOn ? new Audio('/sounds/splash.mp3') : undefined
        };

    }

    playSound(sound) {
        if (this.isSoundOn) {
            this.sounds[sound].play();
        }
    }

    playThemeSong() {
        if (this.isSoundOn && this.sounds[THEME_SONG] !== undefined) {
            this.sounds[THEME_SONG].play();
        }
    }

    playGruntSound() {
        if (this.isSoundOn) {
            this.sounds[GRUNT_SOUND].play();
        }
    }

    playFireSound() {
        if (this.isSoundOn) {
            this.sounds[FIRE_SOUND].play();
            let self = this;
            setTimeout(function () {
                self.sounds[FIRE_SOUND].pause();
            }, 3000);
        }
    }

    stopAllSounds() {
        for (let sound of Object.values(this.sounds)) {
            sound.pause();
        }
    }


    setSoundsPauseState(isPaused) {
        if (this.isSoundOn) {
            if (isPaused) {
                this.stopAllSounds()
            } else if (this.sounds[THEME_SONG] !== undefined) {
                this.sounds[THEME_SONG].play();
            }
        }
    }

    getIsSoundOn() {
        return this.isSoundOn;
    }

    setIsSoundOn(flag) {
        this.isSoundOn = flag;
    }
}
