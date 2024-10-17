AudioContext    = window.AudioContext || window.webkitAudioContext;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class GeoAudio {
    gumStream       = null;      //stream from getUserMedia()
    rec             = null;    //Recorder.js object
    input           = null; //MediaStreamAudioSourceNode we'll be recording

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
            return
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
            return
        }
        console.log("Stopping the recording ...")
        this.exportRecording()
        this.gumStream.getAudioTracks()[0].stop();
        this.callBack("stopped", this.bblob)
        this.rec.stop();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    async exportRecording() {
        if ( !this.rec ) {
            console.log("Recording may not have started...")
            return
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
    async getSegment(start=null, end=null) {
        if ( !this.blob) {
            return null;
        }
        var abbb = await new Response(this.bblob).arrayBuffer();
        var ab32=new Uint32Array(abbb.slice(0,44))

        // multiply by 32000 to get index assuming 16000 rate
        start = start != null || parseFloat($('#start').val()) *32000
        end   = end   != null || parseFloat($('#end').val())*32000

        start = Math.floor(start)
        end   = Math.ceil(end)

        var len = ab32[1]
        var alen= ab32[10]
        console.log("blob : ", bblob.size, len, alen)

        end = ( end < 0 || end > alen ) ? alen : end;
        end = ( end < start ) ? start : end   

        // WAV format has header length of 44:  https://docs.fileformat.com/audio/wav/
        ab32[10] = end - start
        ab32[1 ] = ab32[10] + 36
        var h08  = new Uint8Array(ab32.buffer)
        var ab08 = new Uint8Array(abbb.slice(start+44, end+44))

        var arbf = new Uint8Array(h08.length + ab08.length);
        arbf.set(h08);
        arbf.set(ab08, h08.length);
    
        var abbf = new Blob([arbf], {type: "audio/wav"});
        return abbf
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    playSegment(start=null, end=null) {
        var abbf = getSegment(start, end)
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
