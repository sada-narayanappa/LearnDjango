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
        if ( !this.faudio)
            throw "Control not found"
        this.callBack = callBack
    }

    IsRecording() {
        return (this.rec && this.rec.recording)
    }
    startRecording() {
        if ( this.IsRecording()) {
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
    stopRecording() {
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
        blob = (blob == null ) ? this.bblob: blob
        if ( !blob) {
            return null;
        }
        var HEADER_LEN = 44

        var abbb = await new Response(blob).arrayBuffer();
        var ab32 = new Uint32Array(abbb.slice(0, HEADER_LEN))   // extract Header
        var alen = (blob.size - HEADER_LEN)/32000                               //audio length in seconds

        var end = start + len
        end = ( end < 0 || end > alen ) ? Math.floor(alen) : end;
        len = end - start

        // If blob has less data than the start or if the data is less than 1 second
        if (blob.size < start || len < 2 ) { 
            console.log("?? start too large or size too small ", start, end, " <=>", blob.size)
            return null
        }
        console.log("blob:", blob.size, " file size: ", ab32[1], ab32[10], " start: ", start, " end: ", end, alen)


        var start_data = start * 32000 + HEADER_LEN
        var end_data   = end * 32000 + HEADER_LEN
        end_data   = Math.min( end_data, blob.size-HEADER_LEN);

        var ab08 = new Uint8Array(abbb.slice(start_data, end_data))
        ab32[10] = ab08.length
        ab32[1]  = ab32[10] + 36
        var h08  = new Uint8Array(ab32.buffer)  // header for new data

        var arbf = new Uint8Array(h08.length + ab08.length);
        arbf.set(h08);
        arbf.set(ab08, h08.length);

        var abbf = new Blob([arbf], {type: "audio/wav"});
        return abbf
        // WAV format has header length of 44:  https://docs.fileformat.com/audio/wav/
        ab32[10] = len
        ab32[1 ] = ab32[10] * 32000 + 44
        var h08  = new Uint8Array(ab32.buffer)
        start = start * 32000 + HEADER_LEN
        end   = end * 32000 + HEADER_LEN
        end   = Math.min( end, blob.size-HEADER_LEN);
    
        var ab08 = new Uint8Array(abbb.slice(start+HEADER_LEN, end+HEADER_LEN))

        var arbf = new Uint8Array(h08.length + ab08.length);
        arbf.set(h08);
        arbf.set(ab08, h08.length);
    
        var abbf = new Blob([arbf], {type: "audio/wav"});
        return abbf
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    playSegment(start=null, end=null) {
        var abbf = this.getSegment(start, end)
        var url = URL.createObjectURL(abbf);
        faudio.src = url
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    INPROGRESS = 0;
    TranscribeCB(responseTxt) {
        INPROGRESS = 0
        console.log(responseTxt)
    }
    Transcribe(blob=null, from=0) {
        blob = blob || bblob
        if ( INPROGRESS )
            return;
        INPROGRESS = Date.now()
    }
}
