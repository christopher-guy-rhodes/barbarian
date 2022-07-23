const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const SPLASH_SOUND = 'SPLASH_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';
const ROCK_SOUND = 'ROCK_SOUND';
const DRAGON_SOUND = 'DRAGON_SOUND';
const SWING_SOUND = '/sounds/swing.mp3';

const FIRE_SOUND_DURATION = 2800;

/**
 * Class to handle the playing of audio.
 */
class Sounds {
    constructor() {
        this.isSoundOn = false;

        this.sounds = {
            THEME_SONG : new Audio('/sounds/theme.mp3'),
            FALL_SOUND : new Audio('/sounds/fall.mp3'),
            GRUNT_SOUND : new Audio('/sounds/grunt.mp3'),
            GROWL_SOUND : new Audio('/sounds/growl.mp3'),
            FIRE_SOUND :  new Audio('/sounds/fire.mp3'),
            MONSTER_SOUND : new Audio('/sounds/monster.mp3'),
            SPLASH_SOUND : new Audio('/sounds/splash.mp3'),
            ROCK_SOUND : new Audio('/sounds/rock.mp3'),
            DRAGON_SOUND : new Audio('/sounds/dragon.mp3')
        };

    }

    /**
     * Plays a "stacked sound" meaning that the sounds are not singletons and can be played simultaneously with
     * themselves or other stacked sounds.
     *
     * @param sound the sound to play
     */
    static playStackedSound(sound) {
        new Audio(sound).play().catch(e => handlePromiseError(e));
    }

    /**
     * Plays the fire sound for FIRE_SOUND_DURATION milli seconds
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

    /**
     * Play a sound
     * @param sound the name of the sound to play
     */
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

    /**
     * Stop a sound
     * @param sound the name of the sound to stop
     */
    stopSound(sound) {
        let soundFile = this.sounds[sound];
        if (soundFile !== undefined) {
            this.sounds[sound].pause();
        }
    }
}
