// ############################################################################ //
// ############################################################################ //
// 										api										//
// ############################################################################ //
// ############################################################################ //

ixBand.api = (function () {
    var _video = false,
        _audio = false,
        _canvas = false;

    /**
     * 특정 API 지원여부 (Modernizr - https://github.com/Modernizr/Modernizr)
     * @type	{$support}
     */
    var api = {
        /**
         * Canvas 태그 지원여부
         * @return	{Boolean}
         */
        supportCanvas: function () {
            var el = document.createElement( 'canvas' ),
                _canvas = !!( el.getContext && el.getContext( '2d' ) );

            this.supportCanvas = function () { return _canvas; };
            return this.supportCanvas();
        },

        /**
         * Video 태그 지원여부
         * @return	{Boolean}
         */
        supportVideo: function () {
            var el = document.createElement( 'video' ),
                bool = false;
            // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
            try {
                if ( bool = !!el.canPlayType ) {
                    bool      = new Boolean(bool);
                    bool.ogg  = el.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');
                    bool.h264 = el.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');
                    bool.webm = el.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
                }

            } catch(e) {}
            _video = bool;

            this.supportVideo = function () { return _video; };
            return this.supportVideo();
        },

        /**
         * Audio 태그 지원여부
         * @return	{Boolean}
         */
        supportAudio: function () {
            var el = document.createElement( 'audio' ),
                bool = false;

            try {
                if ( bool = !!el.canPlayType ) {
                    bool      = new Boolean(bool);
                    bool.ogg  = el.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                    bool.mp3  = el.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                    // Mimetypes accepted:
                    //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                    //   bit.ly/iphoneoscodecs
                    bool.wav  = el.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                    bool.m4a  = ( el.canPlayType('audio/x-m4a;')            ||
                    el.canPlayType('audio/aac;'))             .replace(/^no$/,'');
                }
            } catch(e) {}
            _audio = bool;

            this.supportAudio = function () { return _audio; };
            return this.supportAudio();
        }
    };

    return api;
}());