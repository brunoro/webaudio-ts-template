/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const webaudio_1 = __webpack_require__(/*! ./webaudio */ "./src/webaudio.ts");
const synths_1 = __webpack_require__(/*! ./synths */ "./src/synths.ts");
const onAudioContextReady = (audioCtx) => {
    let note = 64;
    let dur = 1;
    for (let i = 0; i < 8; i++) {
        synths_1.bleep(audioCtx, note, dur, i * dur / 4);
        note = note * 1.5; // 5th
    }
    document.getElementById('initmsg').remove();
};
webaudio_1.setupUnlockEventListeners(onAudioContextReady);


/***/ }),

/***/ "./src/synths.ts":
/*!***********************!*\
  !*** ./src/synths.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bleep = (audioCtx, freq, dec, start) => {
    // console.log('play!', freq, dec);
    const osc = audioCtx.createOscillator();
    osc.type = freq < 250 ? 'sawtooth' : freq < 440 ? 'sine' : 'triangle';
    if ('webkitAudioContext' in window) {
        // @ts-ignore
        osc.type = freq < 250 ? 2 : freq < 440 ? 0 : 3;
    }
    const adsr = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    osc.connect(adsr);
    adsr.connect(filter);
    filter.connect(audioCtx.destination);
    // adsr
    const t0 = start ? audioCtx.currentTime + start : audioCtx.currentTime;
    osc.start(t0);
    // vol:0
    adsr.gain.setValueAtTime(0, t0);
    // attack
    const t1 = t0 + 0.01;
    adsr.gain.linearRampToValueAtTime(0.4, t1);
    // decay
    const t2 = t1 + dec;
    const sus = 0.01;
    adsr.gain.exponentialRampToValueAtTime(sus, t2);
    // gate
    const stop = setInterval(() => {
        if (adsr.gain.value < 0.01) {
            osc.stop();
            clearInterval(stop);
        }
    }, 100);
    osc.frequency.value = freq;
    filter.frequency.value = freq * 2;
};
exports.bleep = bleep;


/***/ }),

/***/ "./src/webaudio.ts":
/*!*************************!*\
  !*** ./src/webaudio.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let documentEventListener;
const createAudioContext = () => {
    if ('webkitAudioContext' in window) {
        // @ts-ignore
        return new webkitAudioContext();
    }
    else {
        return new AudioContext();
    }
};
exports.createAudioContext = createAudioContext;
const unlockAudioContext = (callback) => (ev) => {
    const ctx = createAudioContext();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    if (typeof ctx.resume === 'function') {
        ctx.resume();
    }
    source.onended = () => {
        source.disconnect();
        if (documentEventListener) {
            document.removeEventListener('touchstart', documentEventListener, true);
            document.removeEventListener('touchend', documentEventListener, true);
        }
    };
    callback(ctx);
};
exports.unlockAudioContext = unlockAudioContext;
const setupUnlockEventListeners = (callback) => {
    documentEventListener = documentEventListener ? documentEventListener : unlockAudioContext(callback);
    document.addEventListener('touchstart', documentEventListener);
    document.addEventListener('touchend', documentEventListener);
    document.addEventListener('click', documentEventListener);
};
exports.setupUnlockEventListeners = setupUnlockEventListeners;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N5bnRocy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2ViYXVkaW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLDhFQUF1RDtBQUN2RCx3RUFBaUM7QUFHakMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFFBQXNCLEVBQUUsRUFBRTtJQUNuRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDZCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hCLGNBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcs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RSxFQUFFO0lBQ3pFLHFCQUFxQixHQUFHLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQy9ELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztJQUM3RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDO0FBRStDLDhEQUF5QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiaW1wb3J0IHsgc2V0dXBVbmxvY2tFdmVudExpc3RlbmVycyB9IGZyb20gJy4vd2ViYXVkaW8nO1xuaW1wb3J0IHsgYmxlZXAgfSBmcm9tICcuL3N5bnRocyc7XG5cblxuY29uc3Qgb25BdWRpb0NvbnRleHRSZWFkeSA9IChhdWRpb0N0eDogQXVkaW9Db250ZXh0KSA9PiB7XG4gICAgbGV0IG5vdGUgPSA2NDtcbiAgICBsZXQgZHVyID0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICBibGVlcChhdWRpb0N0eCwgbm90ZSwgZHVyLCBpICogZHVyIC8gNCk7XG4gICAgICAgIG5vdGUgPSBub3RlICogMS41OyAvLyA1dGhcbiAgICB9XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRtc2cnKS5yZW1vdmUoKTtcbn07XG5cbnNldHVwVW5sb2NrRXZlbnRMaXN0ZW5lcnMob25BdWRpb0NvbnRleHRSZWFkeSk7IiwiY29uc3QgYmxlZXAgPSAoYXVkaW9DdHg6IEF1ZGlvQ29udGV4dCwgZnJlcTogbnVtYmVyLCBkZWM6IG51bWJlciwgc3RhcnQ/OiBudW1iZXIpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncGxheSEnLCBmcmVxLCBkZWMpO1xuICAgIGNvbnN0IG9zYyA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICBvc2MudHlwZSA9IGZyZXEgPCAyNTAgPyAnc2F3dG9vdGgnIDogZnJlcSA8IDQ0MCA/ICdzaW5lJyA6ICd0cmlhbmdsZSc7XG4gICAgaWYgKCd3ZWJraXRBdWRpb0NvbnRleHQnIGluIHdpbmRvdykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG9zYy50eXBlID0gZnJlcSA8IDI1MCA/IDIgOiBmcmVxIDwgNDQwID8gMCA6IDM7XG4gICAgfVxuICAgIGNvbnN0IGFkc3IgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XG4gICAgY29uc3QgZmlsdGVyID0gYXVkaW9DdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5cbiAgICBvc2MuY29ubmVjdChhZHNyKTtcbiAgICBhZHNyLmNvbm5lY3QoZmlsdGVyKTtcbiAgICBmaWx0ZXIuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cbiAgICAvLyBhZHNyXG4gICAgY29uc3QgdDAgPSBzdGFydCA/IGF1ZGlvQ3R4LmN1cnJlbnRUaW1lICsgc3RhcnQgOiBhdWRpb0N0eC5jdXJyZW50VGltZTtcbiAgICBvc2Muc3RhcnQodDApO1xuICAgIC8vIHZvbDowXG4gICAgYWRzci5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHQwKTtcbiAgICAvLyBhdHRhY2tcbiAgICBjb25zdCB0MSA9IHQwICsgMC4wMTtcbiAgICBhZHNyLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC40LCB0MSk7XG4gICAgLy8gZGVjYXlcbiAgICBjb25zdCB0MiA9IHQxICsgZGVjO1xuICAgIGNvbnN0IHN1cyA9IDAuMDE7XG4gICAgYWRzci5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoc3VzLCB0Mik7XG4gICAgLy8gZ2F0ZVxuICAgIGNvbnN0IHN0b3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChhZHNyLmdhaW4udmFsdWUgPCAwLjAxKSB7XG4gICAgICAgICAgICBvc2Muc3RvcCgpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChzdG9wKTtcbiAgICAgICAgfVxuICAgIH0sIDEwMCk7XG5cbiAgICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gZnJlcTtcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gZnJlcSAqIDI7XG59O1xuXG5leHBvcnQgeyBibGVlcCB9OyIsInR5cGUgRXZlbnRMaXN0ZW5lciA9IChldjogRXZlbnQpID0+IHZvaWQ7XG5sZXQgZG9jdW1lbnRFdmVudExpc3RlbmVyOiBFdmVudExpc3RlbmVyIHwgbnVsbDtcblxuY29uc3QgY3JlYXRlQXVkaW9Db250ZXh0OiAoKSA9PiBBdWRpb0NvbnRleHQgPSAoKSA9PiB7XG4gICAgaWYgKCd3ZWJraXRBdWRpb0NvbnRleHQnIGluIHdpbmRvdykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBuZXcgd2Via2l0QXVkaW9Db250ZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG59O1xuXG5jb25zdCB1bmxvY2tBdWRpb0NvbnRleHQgPSAoY2FsbGJhY2s/OiAoY3R4OiBBdWRpb0NvbnRleHQpID0+IHZvaWQpID0+IChldjogRXZlbnQpID0+IHtcbiAgICBjb25zdCBjdHggPSBjcmVhdGVBdWRpb0NvbnRleHQoKTtcbiAgICBjb25zdCBidWZmZXIgPSBjdHguY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgICBjb25zdCBzb3VyY2UgPSBjdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICBzb3VyY2UuY29ubmVjdChjdHguZGVzdGluYXRpb24pO1xuICAgIHNvdXJjZS5zdGFydCgwKTtcblxuICAgIGlmICh0eXBlb2YgY3R4LnJlc3VtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjdHgucmVzdW1lKCk7XG4gICAgfVxuXG4gICAgc291cmNlLm9uZW5kZWQgPSAoKSA9PiB7XG4gICAgICAgIHNvdXJjZS5kaXNjb25uZWN0KCk7XG4gICAgICAgIGlmIChkb2N1bWVudEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBkb2N1bWVudEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBkb2N1bWVudEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNhbGxiYWNrKGN0eCk7XG59O1xuXG5cbmNvbnN0IHNldHVwVW5sb2NrRXZlbnRMaXN0ZW5lcnMgPSAoY2FsbGJhY2s/OiAoY3R4OiBBdWRpb0NvbnRleHQpID0+IHZvaWQpID0+IHtcbiAgICBkb2N1bWVudEV2ZW50TGlzdGVuZXIgPSBkb2N1bWVudEV2ZW50TGlzdGVuZXIgPyBkb2N1bWVudEV2ZW50TGlzdGVuZXIgOiB1bmxvY2tBdWRpb0NvbnRleHQoY2FsbGJhY2spO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBkb2N1bWVudEV2ZW50TGlzdGVuZXIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZG9jdW1lbnRFdmVudExpc3RlbmVyKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRvY3VtZW50RXZlbnRMaXN0ZW5lcik7XG59O1xuXG5leHBvcnQgeyBjcmVhdGVBdWRpb0NvbnRleHQsIHVubG9ja0F1ZGlvQ29udGV4dCwgc2V0dXBVbmxvY2tFdmVudExpc3RlbmVycyB9OyJdLCJzb3VyY2VSb290IjoiIn0=