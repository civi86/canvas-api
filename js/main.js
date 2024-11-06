const canvas = document.querySelector('canvas');

<<<<<<< Updated upstream
//import {map} from './map.js';
//map();
=======
canvas.width = innerWidth;
canvas.height = innerHeight;

export const c = canvas.getContext('2d');

import { functionality } from './functionality.js';

import { map } from './map.js';

window.addEventListener('load', () => {
    map();
    functionality();
});
>>>>>>> Stashed changes
