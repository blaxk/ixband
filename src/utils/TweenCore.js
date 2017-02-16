// ============================================================== //
// =====================	TweenCore	========================= //
// ============================================================== //
/**
 * TweenCore<br>
 * Event Property : type, target, currentValue, progress=시간진행률, percent, currentCount, totalCount, data
 * @class	{TweenCore}
 * @constructor
 * @param	{Number}		duration	동작되는 시간, 초
 * @param	{Number}		begin		출발값
 * @param	{Number}		finish		도착값
 * @param	{Object}		option		onTween: Function, onComplete: Function, onSeekComplete: Function, ease: ixBand.utils.ease 선택, 추가 하여 사용
 * @param	{Object}		data		이벤트핸들러에서 전달받을수 있다. e.data
 */
ixBand.utils.TweenCore = function ( duration, begin, finish, option, data ) {
    var _ease = ( option && option.ease )? option.ease : $B.utils.ease.quadOut,
        _onTween = ( option && option.onTween )? option.onTween : null,
        _onComplete = ( option && option.onComplete )? option.onComplete : null,
        _onSeekComplete = ( option && option.onSeekComplete )? option.onSeekComplete : null,
        _finishValue = 0, _cValue = 0, _fps = 0, _loopTime = 0, _currentCount = 0, _interval = null,
        _progress = 0, _percent = 0, _totalCount = 0, _seekCount = 0, _forward = null, _delay = null, _this = this;

    data = ( data || data == 0 )? data : null;

    this._delayTime = 0;
    this._delayCallback = null;
    this._seekCom = false;//true면 seekcomplete 발생

    this._setValue = function ( v_begin, v_finish, v_values ) {
        begin = ( typeof v_begin === 'number' )? v_begin : _cValue;
        if ( typeof v_finish === 'number' ) finish = v_finish;
        if ( v_values || v_values == 0 ) data = v_values;

        _finishValue = finish - begin;
    };

    this._setValue( begin, finish );

    this._timerStart = function () {
        //delayComplete
        if ( _this._delayCallback ) _this._delayCallback.call( _this, {type: 'delay', data: data} );
        _this._clearDelay();

        if (duration <= 0) {
            _cValue = finish;
            _progress = 1;
            _percent = 1;
            if ( _onTween ) _onTween.call(_this, { type: 'tween', target: _this, currentValue: _cValue, progress: _progress, percent: _percent, currentCount: _currentCount, totalCount: _totalCount, data: data });
            if ( _onComplete ) _onComplete.call(_this, { type: 'complete', target: _this, currentValue: _cValue, progress: _progress, percent: _percent, currentCount: _currentCount, totalCount: _totalCount, data: data });
        } else {
            if ( !_interval ) _interval = setInterval( intervalHandler, _loopTime );
        }
    };
    this._timerStop = function () {
        if ( _interval ) {
            clearInterval( _interval );
            _interval = null;
        }
    };
    this._to = function () {
        //delayComplete
        if ( _this._delayCallback ) _this._delayCallback.call( _this, {type: 'delay', data: data} );
        _this._clearDelay();

        _currentCount = _seekCount;
        intervalHandler();
    };
    this._reset = function () {
        _forward = null;
        _cValue = begin;
        _progress = 0;
        _percent = 0;
        _currentCount = 0;
    };
    this._setSeekValue = function ( per ) {
        _seekCount = Math.round( _totalCount * per );

        if ( _seekCount > _currentCount ) {
            _forward = true;
        } else if ( _seekCount < _currentCount ) {
            _forward = false;
        } else {
            _forward = null;
        }
    };
    this._startDelay = function ( callBack, time ) {
        if ( !_delay ) _delay = setTimeout( callBack, time );
    };
    this._clearDelay = function () {
        if ( _delay ) {
            clearTimeout( _delay );
            _delay = null;
        }
        _this._delayTime = 0;
        _this._delayCallback = null;
    };
    this._setFPS = function ( val ) {
        _fps = val;
        _loopTime = Math.ceil( 1000 / _fps );
        _totalCount = Math.ceil( (duration * 1000) / _loopTime );
    };
    this._getForward = function () {
        return _forward;
    };
    this._getProgress = function () {
        return _progress;
    };
    //기본 fps PC : 60, Mobile : 30
    this._setFPS( $B.ua.MOBILE_IOS || $B.ua.ANDROID ? 30 : 60 );

    function intervalHandler (e) {
        _cValue = _ease.call( _this, _currentCount, begin, _finishValue, _totalCount );
        _percent = ( _finishValue == 0 )? 1 : ( _cValue - begin ) / _finishValue;
        _progress = _currentCount / _totalCount;

        var evt = { type: '', target: _this, currentValue: _cValue, progress: _progress, percent: _percent, currentCount: _currentCount, totalCount: _totalCount, data: data };
        //tween
        if ( _onTween ) evt.type = 'tween', _onTween.call( _this, evt );
        //complete
        if ( _currentCount >= _totalCount && _seekCount == _totalCount ) {
            _this._timerStop();

            if ( _onComplete ) evt.type = 'complete', _onComplete.call( _this, evt );
            if ( _onSeekComplete && _this._seekCom ) evt.type = 'seekcomplete', _onSeekComplete.call( _this, evt );
            return;
            //seek
        } else {
            if ( _currentCount == _seekCount ) {
                _this._timerStop();
                if ( _onSeekComplete && _this._seekCom ) evt.type = 'seekcomplete', _onSeekComplete.call( _this, evt );
                return;
            }
            if ( _forward != null ) _currentCount = ( _forward )? ++_currentCount : --_currentCount;
        }

    }
};

ixBand.utils.TweenCore.prototype = {
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
        var forword = this._getForward(),
            progress = this._getProgress(),
            per = 0;

        if ( forword == null ) {
            per = ( progress == 0 )? 1 : 0;
        } else {
            per = ( forword )? 0 : 1;
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
     * @return	this
     */
    fps: function ( frame ) {
        this._setFPS( frame );
        return this;
    }
};