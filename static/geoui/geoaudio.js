AudioContext    = window.AudioContext || window.webkitAudioContext;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class GeoAudio {
    gumStream       = null;     // stream from getUserMedia()
    rec             = null;     // Recorder.js object
    input           = null;     // MediaStreamAudioSourceNode we'll be recording

    bblob           = null
    blobLastIndex   = 0
    faudio          = null;
    callBack        = null
    sampleRate      = ""
    audioContext    = null
    url             = null

    constructor(callBack=()=>{}, control="faudio") {
        this.faudio = document.getElementById(control);
        if ( !this.faudio) {
            console.log("Control not found")
            return
        }
        this.callBack = callBack
    }

    isRecording() {
        return (this.rec && this.rec.recording)
    }
    startRecording() {
        if ( this.isRecording()) {
            console.log("Already recording ... stop it first!")
            return 0
        }

        var constraints = { audio: true, video:false }
        this.bblob = null
        this.blobLastIndex = 0
        
        var o = this

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

            var config = {sampleRate: 48000}
            config = {sampleRate: 16000}
            
            o.audioContext = new AudioContext(config);
            o.sampleRate   = o.audioContext.sampleRate/1000
            o.gumStream    = stream;
            o.input        = o.audioContext.createMediaStreamSource(stream);
            o.rec          = new Recorder(o.input,{numChannels:1})

            o.rec.record()
            o.callBack("Format: 1 channel pcm @ "+o.sampleRate+"kHz")
        }).catch(function(err) {
            console.log(err)
            o.callBack("ERROR: Audio failed to start, " + err)
        });
        return 0
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    clearRecording(){
        a.rec.clear()
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    toggleRecording(){
        console.log("pauseButton clicked rec.recording=", this.rec.recording );
        if (this.rec.recording){
            this.rec.stop();
            this.exportRecording()
        }else{
            this.rec.record()
        }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    async stopRecording() {
        if ( !this.rec ) {
            console.log("Recording may not have started...")
            return -1
        }
        console.log("Stopping the recording ...")
        this.exportRecording()
        this.gumStream.getAudioTracks()[0].stop();
        this.callBack("stopped", this.bblob)
        this.rec.stop();
        return 0
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    async exportRecording() {
        if ( !this.rec ) {
            console.log("Recording may not have started...")
            return null
        }
        var myself = this
        async function SetLink(blob) {
            myself.bblob   = blob;
            myself.url = URL.createObjectURL(blob);
            myself.faudio.src = myself.url
            //console.log("===>2", myself.bblob.size)
    }

        await this.rec.exportWAV(SetLink);
        this.callBack("exported", this.bblob)
        //console.log("===>1", this.bblob.size)
        return this.bblob
    }
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    *  SOME SPECIAL UTILITY FUNCTIONS HERE
    * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    // This shows how to get some interim audio and process it!!
    /*
    InterimAudio() {
        this.rec.exportWAV(this.SetLink) // , null, blobLastIndex);
        if (this.rec.recording)
            setTimeout(this.InterimAudio, 4000)
    }
    */
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // start and end are in seconds
    async getSegment(start=0, len=60*60, blob=null) {
        var ret = await fetchAudioBlobForRange(start, len, blob)
        return ret
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    async  fetchAudioBlobForRange(startTime, duration, blob) {
        blob = (blob == null ) ? this.bblob: blob
        if ( !blob) {
            return null;
        }
        
        var endTime = startTime + duration
        try {
            const audioContext = new AudioContext();
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
            // Calculate start and end frame indices
            const sampleRate = audioBuffer.sampleRate;
            const startFrame = Math.floor(startTime * sampleRate);
            const endFrame = Math.floor(endTime * sampleRate);
    
            // Extract the audio data for the range
            const numberOfChannels = audioBuffer.numberOfChannels;
            const durationFrames = endFrame - startFrame;
            const newBuffer = audioContext.createBuffer(
                numberOfChannels,
                durationFrames,
                sampleRate
            );
    
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sourceData = audioBuffer.getChannelData(channel);
                const destinationData = newBuffer.getChannelData(channel);
                destinationData.set(sourceData.subarray(startFrame, endFrame));
            }
    
            // Export the new audio data as a Blob
            const offlineContext = new OfflineAudioContext(
                numberOfChannels,
                newBuffer.length,
                sampleRate
            );
            const source = offlineContext.createBufferSource();
            source.buffer = newBuffer;
            source.connect(offlineContext.destination);
            source.start();
            const audioBuffer1 = await offlineContext.startRendering();
    
            const wavBlob = await encodeWAV(audioBuffer1);
            return (wavBlob);
    
        } catch (error) {
            console.error('Error fetching or processing audio:', error);
            return null;
        }
    }
    encodeWAVWS(audioBuffer) {
        return new Promise((resolve) => {
            const worker = new Worker('wavEncoder.js'); // Replace with your worker for WAV encoding
            worker.postMessage(audioBuffer);
            worker.onmessage = (event) => {
                resolve(event.data);
            };
        });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    playSegment(start=null, end=null) {
        var abbf = this.getSegment(start, end)
        var url = URL.createObjectURL(abbf);
        faudio.src = url
    }
}

// check if last few seconds have been silent
async function isSilent(audioFileUrl, duration=2, silenceThreshold=0.05) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Fetch and decode the audio file
    const response = await fetch(audioFileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const sampleRate = audioBuffer.sampleRate; // Samples per second
    const lastTwoSecondsStart = audioBuffer.length - sampleRate * 2; // Start index of the last 2 seconds
    
    if (lastTwoSecondsStart < 0) {
        //throw new Error("Audio file is less than 2 seconds long.");
        return 0
    }

    // Extract the last 2 seconds of data (assuming mono audio for simplicity)
    const channelData = audioBuffer.getChannelData(0).slice(lastTwoSecondsStart);

    const isSilent = channelData.every(sample => Math.abs(sample) < silenceThreshold);

    return isSilent;
}

function encodeWAV(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bitsPerSample = 16; // 16-bit PCM

    // Merge audio channels
    const samples = mergeBuffers(audioBuffer, bitsPerSample);

    // Calculate data size
    const dataSize = samples.length * (bitsPerSample / 8);
    const headerSize = 44;

    const buffer = new ArrayBuffer(headerSize + dataSize);
    const view = new DataView(buffer);

    // Write WAV header
    writeString(view, 0, "RIFF"); // ChunkID
    view.setUint32(4, headerSize + dataSize - 8, true); // ChunkSize
    writeString(view, 8, "WAVE"); // Format
    writeString(view, 12, "fmt "); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size (PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
    view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
    view.setUint16(34, bitsPerSample, true); // BitsPerSample
    writeString(view, 36, "data"); // Subchunk2ID
    view.setUint32(40, dataSize, true); // Subchunk2Size

    // Write audio data
    var offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        view.setInt16(offset, samples[i], true);
    }

    return new Blob([buffer], { type: "audio/wav" });
}

function mergeBuffers(audioBuffer, bitsPerSample) {
    const numChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const result = new Float32Array(length);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            result[i] += channelData[i] / numChannels; // Average multiple channels
        }
    }

    return convertToPCM(result, bitsPerSample);
}

function convertToPCM(float32Array, bitsPerSample) {
    const maxAmplitude = Math.pow(2, bitsPerSample - 1) - 1;
    const pcm = new Int16Array(float32Array.length);

    for (let i = 0; i < float32Array.length; i++) {
        pcm[i] = Math.max(-1, Math.min(1, float32Array[i])) * maxAmplitude;
    }

    return pcm;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}