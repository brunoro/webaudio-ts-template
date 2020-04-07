import { setupUnlockEventListeners } from './webaudio';
import { bleep } from './synths';


const onAudioContextReady = (audioCtx: AudioContext) => {
    let note = 64;
    let dur = 1;
    for (let i = 0; i < 8; i++) {
        bleep(audioCtx, note, dur, i * dur / 4);
        note = note * 1.5; // 5th
    }
    document.getElementById('initmsg').remove();
};

setupUnlockEventListeners(onAudioContextReady);