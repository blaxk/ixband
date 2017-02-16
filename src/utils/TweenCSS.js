// ============================================================== //
// =====================	TweenCSS	========================= //
// ============================================================== //
/**
 * CSS기반 Tweener<br>
 * ie7에서 동작하지 않을시 대상에 position을 설정하면 된다.<br>
 * Event Property : type, target, progress=시간진행률, percent, currentCount, totalCount, data
 * @class	{TweenCSS}
 * @constructor
 * @param	{Selector, Element, jQuery}	target			대상
 * @param	{Number}			duration		동작되는 시간, 초
 * @param	{String}			begin_props		출발값들, null을 설정하면 대상의 스타일 속성을 검색(해당스타일 속성이 없으면 에러)
 * @param	{String}			finish_props	도착값들
 * @param	{Object}			option			onTween: Function, onComplete: Function, onSeekComplete: Function, ease: ixBand.utils.ease 선택, 추가 하여 사용
 * @param	{Object}			data			이벤트핸들러에서 전달받을수 있다. e.data
 */
ixBand.utils.TweenCSS = function ( target, duration, begin_props, finish_props, option, data ) {
    var _onTween = ( option && option.onTween )? option.onTween : null,
        _onComplete = ( option && option.onComplete )? option.onComplete : null,
        _onSeekComplete = (option && option.onSeekComplete)? option.onSeekComplete : null,
        _ease = ( option && option.ease )? option.ease : null,
        _target = $B( target ).element(),
        _b_props = [], _f_props = [], _propLength = 0,
        _this = this;

    data = ( data || data == 0 )? data : null;

    this._target = _target;

    //스타일속성이 있는지 체크후 index반환, 없을시 -1
    this._propertyIndexOf = function ( propName ) {
        var result = -1, i;
        for ( i = 0; i < _propLength; ++i ) {
            if ( _f_props[i].name == propName ) {
                result = i;
                break;
            }
        }
        return result;
    };
    //스타일속성 배열에 넣기
    this._addProperty = function ( begin_prop, finish_prop ) {
        var findIdx = this._propertyIndexOf( finish_prop.name ),
            styleName = $B.string.camelCase( finish_prop.name );

        begin_prop.styleName = styleName;
        finish_prop.styleName = styleName;

        if ( findIdx == -1 ) {
            _b_props.push( begin_prop );
            _f_props.push( finish_prop );
        } else {
            _b_props[findIdx] = begin_prop;
            _f_props[findIdx] = finish_prop;
        }

        _propLength = _f_props.length;
    };
    //스타일속성 배열에서 삭제
    this._removeProperty = function ( propName ) {
        var delIdx = this._propertyIndexOf( propName );

        if ( delIdx > -1 ) {
            _b_props.splice( delIdx, 1 );
            _f_props.splice( delIdx, 1 );
        }

        _propLength = _f_props.length;
    };
    //스타일속성, 값, 단위 분리
    this.addProp( begin_props, finish_props );
    //tweenCore
    this._tweenCore = new $B.utils.TweenCore(duration, 0, 1, { onTween: tweenHandler, onComplete: tweenHandler, onSeekComplete: tweenHandler, ease: _ease }, data);

    function tweenHandler (e) {
        var i, c_value;
        for ( i = 0; i < _propLength; ++i ) {
            var f_property = _f_props[i],
                b_property = _b_props[i],
                fName = f_property.name,
                fValue = f_property.value;

            //Color
            if( f_property.unit == 'color' ) {
                c_value = $B.color.mix( b_property.value, fValue, e.percent, f_property.colorType );
            } else {
                c_value = ( fValue * e.percent + b_property.value ) + f_property.unit;
            }

            //Opacity
            if ( fName == 'opacity' ) {
                $B.style.opacity( _target, fValue * e.percent + b_property.value );
                //ScrollTop
            } else if ( fName == 'scrollTop' ) {
                $B( _target ).scrollTop( Number(c_value) );
                //ScrollLeft
            } else if ( fName == 'scrollLeft' ) {
                $B( _target ).scrollLeft( Number(c_value) );
            } else {
                _target.style[f_property.styleName] = c_value;
            }
        }

        var evt = { type: '', target: _this, progress: e.progress, percent: e.percent, currentCount: e.currentCount, totalCount: e.totalCount, data: e.data };

        switch ( e.type ) {
            case 'tween':
                if ( _onTween ) evt.type = e.type, _onTween.call( _this, evt );
                break;
            case 'complete':
                if ( _onComplete ) evt.type = e.type, _onComplete.call( _this, evt );
                break;
            case 'seekcomplete':
                if ( _onSeekComplete ) evt.type = e.type, _onSeekComplete.call( _this, evt );
                break;
        }
    }

};

ixBand.utils.TweenCSS.prototype = {
    /**
     * 현재 객체의 Style Property 를 파싱해서 반환
     * @private
     */
    _getTweenStyle: function ( target, propSet ) {
        var get_prop = {},
            cName = $B.string.camelCase( propSet.name ),
            value, valueSet;

        get_prop.name = propSet.name;

        if ( cName == 'scrollTop' ) {
            value = $B( target ).scrollTop();
        } else if ( cName == 'scrollLeft' ) {
            value = $B( target ).scrollLeft();
        } else {
            value = $B( target ).css( get_prop.name );
        }

        if ( value == 'transparent' || value == 'auto' || value == undefined ) {
            throw new Error('[ixBand] TweenCSS의 대상의 Style "' + get_prop.name + '"가 설정되어 있지않아 Tween 실행불가!');
        }

        if ( typeof value === 'number' ) value = String(value);

        valueSet = $B.style.parseValue( value );
        get_prop.value = valueSet.value;
        get_prop.unit = valueSet.unit;

        return get_prop;
    },

    /** 해당 초만큼 지연시킨후 다음 Method실행, 한명령줄에 하나의 delay만 사용한다.
     * @param	{Number}	time		초단위, 예) 0.5초
     * @param	{Function}	callback	delay가 끝나는 이벤트 전달
     * @return	this
     */
    delay: function ( time, callback ) {
        this._tweenCore.delay( time, callback );
        return this;
    },
    /** 시작(리셋후)
     * @return	this
     */
    start: function () {
        this._tweenCore.start();
        return this;
    },
    /** 정지
     * @return	this
     */
    stop: function () {
        this._tweenCore.stop();
        return this;
    },
    /** Stop후 0
     * @return	this
     */
    reset: function () {
        this._tweenCore.reset();
        return this;
    },
    /**
     * 해당탐색 구간으로 Tween
     * @param	{Number}	progress 0~1
     * @return	this
     */
    seek: function ( progress ) {
        this._tweenCore.seek( progress );
    },
    /**
     * 해당탐색 구간으로 즉시 이동
     * @param	{Number}	progress 0~1
     * @return	this
     */
    seekTo: function ( progress ) {
        this._tweenCore.seekTo( progress );
    },
    /** progress가 0이면 1, 1이면 0으로 Tween
     * @return	this
     */
    toggle: function () {
        this._tweenCore.toggle();
        return this;
    },
    /**
     * 스타일 속성들 추가<br>
     * 예)'width: 100px; z-index: 3;'
     * @param	{String}	begin_props
     * @param	{String}	finish_props
     * @return	this
     */
    addProp: function ( begin_props, finish_props ) {
        var b_props = ( begin_props )? $B.style.parse( begin_props ) : [],
            f_props = $B.style.parse( finish_props ), n;

        for ( n in f_props ) {
            var f_property = f_props[n],
                b_property = b_props[n];

            if ( !b_property ) b_property = this._getTweenStyle( this._target, f_property );
            //Color
            if( f_property.name.indexOf('color') > -1 ) {
                var cType = $B.color.type( f_property.value );

                if ( $B.ua.DOC_MODE_IE9_LT && cType == 'rgba' ) cType = 'rgb';

                f_property.unit = 'color';
                f_property.colorType = cType;
            } else {
                b_property.value = Number( b_property.value );
                f_property.value = Number( f_property.value ) - b_property.value;
            }

            //Scroll
            var cName = $B.string.camelCase( b_property.name );
            if ( cName == 'scrollTop' || cName == 'scrollLeft' ) {
                b_property.name = cName;
                f_property.name = $B.string.camelCase( f_property.name );
            }

            this._addProperty( b_property, f_property );
        }
        return this;
    },
    /**
     * 스타일속성들 삭제<br>
     * 'z-index' 표기법 사용
     * @param	{String...}		propName
     * @return	this
     */
    removeProp: function () {
        var args = arguments,
            argNum = args.length, i;

        for ( i = 0; i < argNum; ++i ) {
            this._removeProperty( args[i] );
        }

        return this;
    },
    /**
     * FPS설정
     * @param	{Int}	frame	기본 fps PC : 60, Mobile : 30
     * @return	this
     */
    fps: function ( frame ) {
        this._tweenCore.setFPS( frame );
        return this;
    }
};