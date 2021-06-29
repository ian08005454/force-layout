/**
 * @module colorPanelSetting
 * @description 調色盤模組
 * @author Wei-Jie Li
 * @createDate 2021-01-21
 * @see  github {@link https://github.com/Simonwep/pickr} 
 */
import { lineColorChanger } from "./mainSetting.js"
import '@simonwep/pickr/dist/themes/nano.min.css';      // 'nano' theme
import Pickr from '@simonwep/pickr';
let pickr = null;
/**
 * when function call by listGenerator it will init the colorpanel
 * @param {string} name 物件名稱
 * @param {string} initColor 原本的顏色
 * @param {string} id node or line
 * @returns lineColorChanger function to change the color
 */
export function colorPanelInit(name, initColor, id){
    // Delete previous instance
    if (pickr) {
        pickr.destroyAndRemove();
    }
    // Create fresh instance
    pickr = new Pickr(Object.assign({
        el: '.color-lump',
        theme: 'nano', // or 'monolith', or 'nano'
        default: initColor,
        defaultRepresentation: 'HEX',
        useAsButton: true ,
        autoReposition: true,
        position: 'bottom-middle',
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)'
        ],
    
        components: {
            // Main components
            preview: true,
            opacity: true,
            hue: true,
    
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: true
            }
        }
    }));
    pickr.show();
    // Set events
    pickr.on('init', instance => {
        // console.log('Event: "init"', instance);
    }).on('hide', instance => {
        // console.log('Event: "hide"', instance);
    }).on('show', (color, instance) => {
        console.log('Event: "show"', color, instance);
    }).on('save', (color, instance) => {
        console.log(color.toHEXA().toString());
        // console.log('Event: "save"', color, instance);
        lineColorChanger(name, color.toHEXA().toString(), id);
        pickr.hide();
    }).on('change', (color, source, instance) => {
        // console.log('Event: "change"', color, source, instance);
    }).on('changestop', (source, instance) => {
        console.log('Event: "changestop"', source, instance);
    }).on('cancel', instance => {
        console.log('Event: "cancel"', instance);
    }).on('swatchselect', (color, instance) => {
        console.log('Event: "swatchselect"', color, instance);
    });
};