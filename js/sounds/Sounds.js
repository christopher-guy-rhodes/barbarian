const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const SPLASH_SOUND = 'SPLASH_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';

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

    /**
     * Get the splash sound object.
     * @returns {*}
     */
    getSplashSound() {
        return this.sounds[SPLASH_SOUND];
    }

    /**
     * Get the monster sound object.
     * @returns {*}
     */
    getMonsterSound() {
        return this.sounds[MONSTER_SOUND];
    }

    /**
     * Get the growl sound object.
     * @returns {*}
     */
    getGrowlSound() {
        return this.sounds[GROWL_SOUND];
    }

    /**
     * Get the grunt sound object.
     * @returns {*}
     */
    getGruntSound() {
        return this.sounds[GRUNT_SOUND];
    }

    /**
     * Get the fire sound object.
     * @returns {*}
     */
    getFireSound() {
        return this.sounds[FIRE_SOUND];
    }

    /**
     * Get the fall sound object.
     * @returns {*}
     */
    getFallSound() {
        return this.sounds[FALL_SOUND];
    }

    /**
     * Get the theme song sound object.
     * @returns {*}
     */
    getThemeSongSound() {
        return this.sounds[THEME_SONG];
    }

    /**
     * Play the theme song.
     */
    playThemeSong() {
        this.playSound(this.getThemeSongSound());
    }

    /**
     * Play the grunt sound.
     */
    playGruntSound() {
        this.playSound(this.getGruntSound());
    }

    /**
     * Play the fall sound.
     */
    playFallSound() {
        this.playSound(this.getFallSound());
    }

    /**
     * Play the fire sound.
     */
    playFireSound() {
        this.playSound(this.getFireSound());
    }

    /**
     * Play the monster sound.
     */
    playMonsterSound() {
        this.playSound(this.getMonsterSound());
    }

    /**
     * Stop all sounds.
     */
    stopAllSounds() {
        for (let sound of Object.values(this.sounds)) {
            sound.pause();
        }
    }

    /**
     * Returns true if the sound is on, false otherwise.
     * @returns {boolean}
     */
    getIsSoundOn() {
        return this.isSoundOn;
    }

    /**
     * Sets the sound flag.
     * @param flag
     */
    setIsSoundOn(flag) {
        this.isSoundOn = flag;
    }

    /* private */
    playSound(sound) {
        if (sound !== undefined && this.isSoundOn) {
            let playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    handlePromiseError(error);
                })
            }
        }
    }
}
