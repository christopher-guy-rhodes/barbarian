const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const SPLASH_SOUND = 'SPLASH_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';
const FIRE_SOUND_DURATION = 2800;

const IS_SOUND_DISABLED = false;

const THEME_SONG_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/theme.mp3');
const FALL_SOUND_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/fall.mp3');
const GRUNT_SOUND_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/grunt.mp3');
const GROWL_SOUND_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/growl.mp3');
const FIRE_SOUND_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/fire.mp3');
const MONSTER_SOUND_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/monster.mp3');
const SPLASH_SOUND_FILE = IS_SOUND_DISABLED ? undefined : new Audio('/sounds/splash.mp3');

class Sounds {
    constructor() {
        this.isSoundOn = IS_SOUND_DISABLED;

        this.sounds = {
            THEME_SONG : THEME_SONG_FILE,
            FALL_SOUND : FALL_SOUND_FILE,
            GRUNT_SOUND : GRUNT_SOUND_FILE,
            GROWL_SOUND : GROWL_SOUND_FILE,
            FIRE_SOUND : FIRE_SOUND_FILE,
            MONSTER_SOUND : MONSTER_SOUND_FILE,
            SPLASH_SOUND : SPLASH_SOUND_FILE
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
        if (IS_SOUND_DISABLED) {
            return;
        }
        this.playSound(this.getFireSound());
        let self = this;
        setTimeout(function () {
            self.getFireSound().pause();
        }, FIRE_SOUND_DURATION);
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
        if (IS_SOUND_DISABLED) {
            return;
        }
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
