const BARBARIAN_FRAMES = {
    attack : {
        left : {
            frames : [7, 6, 5, 4, 3, 2, 1, 0],
            heightOffset : 5},
        right : {
            frames :  [0, 1, 2, 3, 4, 5, 6, 7],
            heightOffset : 4}},
    jump : {
        left : {
            frames : [62, 61, 60, 59, 58, 57, 56 ],
            heightOffset : 7},
        right : {
            frames :  [48, 49, 50, 51, 52, 53, 54],
            heightOffset : 6}},
    run : {
        left : {
            frames : [24, 25, 26, 27, 28, 29],
            heightOffset : 3},
        right : {
            frames : [16, 17, 18, 19, 20, 21],
            heightOffset : 2}},
    walk : {
        left : {
            frames :  [13, 12, 11, 10, 9, 8],
            heightOffset : 1},
        right : {
            frames : [1, 2, 3, 4, 5, 6],
            heightOffset : 0}},
    swim : {
        left : {
            frames :  [3, 2, 1, 0],
            heightOffset : 17},
        right : {
            frames : [0, 1, 2, 3],
            heightOffset : 16}},
    fall : {
        left: {
            frames : [3, 2, 1, 0],
            heightOffset : 15},
        right: {
            frames : [0, 1, 2, 3],
            heightOffset: 14}},
    stop: {
        left : {
            frames :  [3, 2, 1, 0],
            heightOffset : 17},
        right : {
            frames : [0, 1, 2, 3],
            heightOffset : 16}
    },
    death: {
        right: {
            frames: [96, 97, 98, 99, 100],
            heightOffset: 12
        },
        left: {
            frames: [108, 107, 106, 105, 104],
            heightOffset: 13
        }
    }
};

const DOG_FRAMES = {
    sit : {
        left : {
            frames: [3, 2, 1, 0],
            heightOffset : 1
        },
        right : {
            frames : [0, 1, 2, 3],
            heightOffset : 0
        }
    },
    attack : {
        left : {
            frames: [4, 3, 2, 1, 0],
            heightOffset : 3
        },
        right : {
            frames : [0, 1, 2, 3, 4],
            heightOffset : 2
        }
    },
    walk : {
        left : {
            frames: [4, 3, 2, 1, 0],
            heightOffset : 3
        },
        right : {
            frames : [0, 1, 2, 3, 4],
            heightOffset : 2
        }
    },
    death : {
        right: {
            frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            heightOffset: 0
        },
        left: {
            frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            heightOffset: 0
        },
    }
};

const MONSTER_FRAMES = {
    walk : {
        left : {
            frames: [13, 12, 11, 10, 9, 8],
            heightOffset: 1
        },
        right : {
            frames: [0, 1, 2, 3, 4, 5],
            heightOffset: 0
        }
    },
    attack : {
        left : {
            frames: [31, 30, 29, 28, 27, 26, 25, 24],
            heightOffset: 3
        },
        right : {
            frames: [16, 17 , 18, 19, 20, 21, 23, 23],
            heightOffset: 2
        }
    },
    death : {
        right: {
            frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            heightOffset: 0
        },
        left: {
            frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            heightOffset: 0
        },
    }
};

const ROCK_FRAMES = {
    sit : {
        left : {
            frames: [5, 4],
            heightOffset : 0
        },
        right : {
            frames : [0, 1],
            heightOffset : 0
        }
    },
    attack : {
        left : {
            frames: [5, 4, 3, 2, 1, 0],
            heightOffset : 0
        },
        right : {
            frames : [0, 1, 2, 3, 4, 5],
            heightOffset : 0
        }
    },
    walk : {
        left : {
            frames: [5, 4, 3, 2, 1, 0],
            heightOffset : 0
        },
        right : {
            frames : [0, 1, 2, 3, 4, 5],
            heightOffset : 0
        }
    },
};

const SHARK_FRAMES = {
    attack: {
        left: {
            frames: [2, 1, 0],
            heightOffset: 3
        },
        right: {
            frames: [0, 1, 2],
            heightOffset: 2
        }
    },
    walk: {
        left: {
            frames: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
            heightOffset: 1
        },
        right: {
            frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            heightOffset: 0
        }
    },
};

const BARBARIAN_DEATH_FRAMES = {
    right: {
        frames: [96, 97, 98, 99, 100],
        heightOffset: 12
    },
    left: {
        frames: [108, 107, 106, 105, 104],
        heightOffset: 13
    }
};
