type EventListener = (ev: Event) => void;
let documentEventListener: EventListener | null;

const createAudioContext: () => AudioContext = () => {
    if ('webkitAudioContext' in window) {
        // @ts-ignore
        return new webkitAudioContext();
    } else {
        return new AudioContext();
    }
};

const unlockAudioContext = (callback?: (ctx: AudioContext) => void) => (ev: Event) => {
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


const setupUnlockEventListeners = (callback?: (ctx: AudioContext) => void) => {
    documentEventListener = documentEventListener ? documentEventListener : unlockAudioContext(callback);
    document.addEventListener('touchstart', documentEventListener);
    document.addEventListener('touchend', documentEventListener);
    document.addEventListener('click', documentEventListener);
};

export { createAudioContext, unlockAudioContext, setupUnlockEventListeners };