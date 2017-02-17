// ============================================================== //
// =====================	TweenCore	========================= //
// ============================================================== //
/**
 * TweenCore
 * Event : tween, complete, seekcomplete
 * Event Property : type, target, currentValue, progress=시간진행률, percent, currentCount, totalCount, data
 * @class	{TweenCore}
 * @constructor
 * @param	{Number}		duration	동작되는 시간, 초
 * @param	{Number}		begin		출발값
 * @param	{Number}		finish		도착값
 * @param	{Object}		option		ease: ixBand.utils.ease 선택, 추가 하여 사용
 * @param	{Object}		data		이벤트핸들러에서 전달받을수 있다. e.data
 */
ixBand.utils.TweenCore = $B.Class.extend({
    initialize: function ( duration, begin, finish, option, data ) {
        this._duration = duration;
        this._begin = begin;
        this._finish = finish;
        this._option = option || {};
        this._ease = this._option.ease || $B.utils.ease.quadOut;
        this._data = ( $B.isEmpty(data) )? null : data;

        this._finishValue = 0;
        this._cValue = 0;
        this._fps = 0;
        this._loopTime = 0;
        this._currentCount = 0;
        this._interval = null;
        this._progress = 0;
        this._percent = 0;
        this._totalCount = 0;
        this._seekCount = 0;
        this._forward = null;
        this._delay = null;

        this._delayTime = 0;
        this._delayCallback = null;
        this._seekCom = false;//true면 seekcomplete 발생

        this._setValue( this._begin, this._finish );
        //기본 fps PC : 60, Mobile : 30
        this._setFPS( ($B.ua.MOBILE_IOS || $B.ua.ANDROID) ? 30 : 60 );
        this._setEventsHandler();
        return this;
    },

    // ===============	Public Methods =============== //

    /** 해당 초만큼 지연시킨후 다음 Method실행, 한명령줄에 하나의 delay만 사용한다.
     * @param	{Number}	time		초단위, 예) 0.5초
     * @param	{Function}	callback	delay가 끝나는 이벤트 전달
     * @return	this
     */
    delay: function ( time, callback ) {
        this._delayTime = time * 1000;
        if ( callback ) this._delayCallback = callback;
        return this;
    },
    /** 시작(리셋후)
     * @return	this
     */
    start: function () {
        this.reset();
        this.seek( 1, 'not' );
        return this;
    },
    /** 정지
     * @return	this
     */
    stop: function () {
        this._clearDelay();
        this._timerStop();
        return this;
    },
    /** Stop후 0
     * @return	this
     */
    reset: function () {
        this._clearDelay();
        this._timerStop();
        this._reset();
        return this;
    },
    /**
     * 해당탐색 구간으로 Tween
     * @param	{Number}	progress 0~1
     * @return	this
     */
    seek: function ( progress, seekCom ) {
        if ( progress < 0 ) {
            progress = 0;
        } else if ( progress > 1 ) {
            progress = 1;
        }

        this._seekCom = ( seekCom === 'not' )? false : true;
        this._setSeekValue( progress );
        //this._clearDelay();

        if ( this._delayTime > 0 ) {
            this._startDelay( this._timerStart, this._delayTime );
        } else {
            this._timerStart();
        }
        return this;
    },
    /**
     * 해당탐색 구간으로 즉시 이동
     * @param	{Number}	progress 0~1
     * @return	this
     */
    seekTo: function ( progress ) {
        if ( progress < 0 ) {
            progress = 0;
        } else if ( progress > 1 ) {
            progress = 1;
        }

        this._seekCom = true;
        this._setSeekValue( progress );
        //this._clearDelay();

        if ( this._delayTime > 0 ) {
            this._startDelay( this._to, this._delayTime );
        } else {
            this._to();
        }
        return this;
    },
    /** progress가 0이면 1, 1이면 0으로 Tween
     * @return	this
     */
    toggle: function () {
        var per = 0;

        if ( this._forward == null ) {
            per = ( this._progress == 0 )? 1 : 0;
        } else {
            per = ( this._forward )? 0 : 1;
        }

        this.seek( per );
        return this;
    },
    /**
     * value 재설정
     * @param	{Number}	begin	출발값
     * @param	{Number}	finish	도착값
     * @param	{Object}	data	이벤트핸들러에서 전달받을수 있다. e.data
     * @return	this
     */
    value: function ( begin, finish, data ) {
        this._setValue( begin, finish, data );
        return this;
    },
    /**
     * FPS설정
     * @param	{Int}	frame	기본 fps PC : 60, Mobile : 30
     * @return	{Int, this}
     */
    fps: function ( frame ) {
        if ( $B.isNumber(frame) ) {
            this._setFPS( frame );
            return this;
        } else {
            return this._fps;
        }
    },

    // ===============	Private Methods =============== //
    _setEventsHandler: function () {
        this._timerStart = $B.bind(function () {
            //delayComplete
            if ( this._delayCallback ) this._delayCallback.call( this, {type: 'delay', data: this._data} );
            this._clearDelay();

            if ( this._duration <= 0 ) {
                this._cValue = finish;
                this._progress = 1;
                this._percent = 1;

                this.dispatch( 'tween', {target: this, currentValue: this._cValue, progress: this._progress, percent: this._percent, currentCount: this._currentCount, totalCount: this._totalCount, data: this._data} );
                this.dispatch( 'complete', {target: this, currentValue: this._cValue, progress: this._progress, percent: this._percent, currentCount: this._currentCount, totalCount: this._totalCount, data: this._data});
            } else {
                if ( !this._interval ) this._interval = setInterval( this._intervalHandler, this._loopTime );
            }
        }, this);

        this._to = $B.bind(function () {
            //delayComplete
            if ( this._delayCallback ) this._delayCallback.call( this, {type: 'delay', data: this._data} );
            this._clearDelay();

            this._currentCount = this._seekCount;
            this._intervalHandler();
        }, this);

        this._intervalHandler = $B.bind(function (e) {
            this._cValue = this._ease.call( this, this._currentCount, this._begin, this._finishValue, this._totalCount );
            this._percent = ( this._finishValue == 0 )? 1 : ( this._cValue - this._begin ) / this._finishValue;
            this._progress = this._currentCount / this._totalCount;

            var evt = {target: this, currentValue: this._cValue, progress: this._progress, percent: this._percent, currentCount: this._currentCount, totalCount: this._totalCount, data: this._data };
            //tween
            this.dispatch( 'tween', evt );
            //complete
            if ( this._currentCount >= this._totalCount && this._seekCount == this._totalCount ) {
                this._timerStop();
                this.dispatch( 'complete', evt );
                if ( this._seekCom ) this.dispatch( 'seekcomplete', evt );
            //seek
            } else {
                if ( this._currentCount == this._seekCount ) {
                    this._timerStop();
                    if ( this._seekCom ) this.dispatch( 'complete', evt );
                    return;
                }
                if ( this._forward != null ) this._currentCount = ( this._forward )? ++this._currentCount : --this._currentCount;
            }
        }, this);
    },

    _setValue: function ( v_begin, v_finish, v_values ) {
        this._begin = ( $B.isNumber(v_begin) )? v_begin : this._cValue;
        if ( $B.isNumber(v_finish) ) this._finish = v_finish;
        if ( !$B.isEmpty(v_values) ) this._data = v_values;

        this._finishValue = this._finish - this._begin;
    },

    _timerStop: function () {
        if ( this._interval ) {
            clearInterval( this._interval );
            this._interval = null;
        }
    },

    _reset: function () {
        this._forward = null;
        this._cValue = this._begin;
        this._progress = 0;
        this._percent = 0;
        this._currentCount = 0;
    },

    _setSeekValue: function ( per ) {
        this._seekCount = Math.round( this._totalCount * per );

        if ( this._seekCount > this._currentCount ) {
            this._forward = true;
        } else if ( this._seekCount < this._currentCount ) {
            this._forward = false;
        } else {
            this._forward = null;
        }
    },

    _startDelay: function ( callBack, time ) {
        if ( !this._delay ) this._delay = setTimeout( callBack, time );
    },

    _clearDelay: function () {
        if ( this._delay ) {
            clearTimeout( this._delay );
            this._delay = null;
        }
        this._delayTime = 0;
        this._delayCallback = null;
    },

    _setFPS: function ( val ) {
        this._fps = val;
        this._loopTime = Math.ceil( 1000 / this._fps );
        this._totalCount = Math.ceil( (this._duration * 1000) / this._loopTime );
    }
}, '$B.utils.TweenCore');