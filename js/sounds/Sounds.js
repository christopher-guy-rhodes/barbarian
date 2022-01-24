const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const SPLASH_SOUND = 'SPLASH_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';
const ROCK_SOUND = 'ROCK_SOUND';
const FIRE_SOUND_DURATION = 2800;

const THEME_SONG_FILE = new Audio('/sounds/theme.mp3');
const FALL_SOUND_FILE = new Audio('/sounds/fall.mp3');
const GRUNT_SOUND_FILE = new Audio('/sounds/grunt.mp3');
const GROWL_SOUND_FILE = new Audio('/sounds/growl.mp3');
const FIRE_SOUND_FILE = new Audio('/sounds/fire.mp3');
const MONSTER_SOUND_FILE = new Audio('/sounds/monster.mp3');
const SPLASH_SOUND_FILE = new Audio('/sounds/splash.mp3');
const ROCK_SOUND_FILE = new Audio('/sounds/rock.mp3');

class Sounds {
    constructor() {
        this.isSoundOn = true;

        this.sounds = {
            THEME_SONG : THEME_SONG_FILE,
            FALL_SOUND : FALL_SOUND_FILE,
            GRUNT_SOUND : GRUNT_SOUND_FILE,
            GROWL_SOUND : GROWL_SOUND_FILE,
            FIRE_SOUND : FIRE_SOUND_FILE,
            MONSTER_SOUND : MONSTER_SOUND_FILE,
            SPLASH_SOUND : SPLASH_SOUND_FILE,
            ROCK_SOUND : ROCK_SOUND_FILE
        };

    }

    /**
     * Get the rolling rock sound object
     * @returns {Audio} the audio object
     */
    getRockSound() {
        return this.sounds[ROCK_SOUND];
    }

    /**
     * Get the splash sound object.
     * @returns {Audio} the audio object
     */
    getSplashSound() {
        return this.sounds[SPLASH_SOUND];
    }

    /**
     * Get the monster sound object.
     * @returns {Audio} the audio object
     */
    getMonsterSound() {
        return this.sounds[MONSTER_SOUND];
    }

    /**
     * Get the growl sound object.
     * @returns {Audio} the audio object
     */
    getGrowlSound() {
        return this.sounds[GROWL_SOUND];
    }

    /**
     * Get the grunt sound object.
     * @returns {Audio} the audio object
     */
    getGruntSound() {
        return this.sounds[GRUNT_SOUND];
    }

    /**
     * Play the theme song.
     */
    playThemeSong() {
        this.playSound(THEME_SONG);
    }

    /**
     * Play the grunt sound.
     */
    playGruntSound() {
        this.playSound(GRUNT_SOUND);
    }

    /**
     * Play the fall sound.
     */
    playFallSound() {
        this.playSound(FALL_SOUND);
    }

    /**
     * Play the fire sound.
     */
    playFireSound() {
        this.playSound(FIRE_SOUND);
        let self = this;
        setTimeout(function () {
            self.sounds[FIRE_SOUND].pause();
        }, FIRE_SOUND_DURATION);
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
        let soundFile = this.sounds[sound];
        if (soundFile !== undefined && this.isSoundOn) {
            let playPromise = soundFile.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    handlePromiseError(error);
                })
            }
        }
    }

    stopSound(sound) {
        this.sounds[sound].pause();
    }
}
