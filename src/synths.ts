const bleep = (audioCtx: AudioContext, freq: number, dec: number, start?: number) => {
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

export { bleep };