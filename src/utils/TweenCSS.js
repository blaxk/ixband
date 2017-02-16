// ============================================================== //
// =====================	TweenCSS	========================= //
// ============================================================== //
/**
 * CSS기반 Tweener
 * ie7에서 동작하지 않을시 대상에 position을 설정하면 된다.
 * Event : tween, complete, seekcomplete
 * Event Property : type, target, progress=시간진행률, percent, currentCount, totalCount, data
 * @class	{TweenCSS}
 * @constructor
 * @param	{Selector, Element, jQuery}	target			대상
 * @param	{Number}			duration		동작되는 시간, 초
 * @param	{String}			begin_props		출발값들, null을 설정하면 대상의 스타일 속성을 검색(해당스타일 속성이 없으면 에러)
 * @param	{String}			finish_props	도착값들
 * @param	{Object}			option			ease: ixBand.utils.ease 선택, 추가 하여 사용
 * @param	{Object}			data			이벤트핸들러에서 전달받을수 있다. e.data
 */
ixBand.utils.TweenCSS = $B.utils.TweenCore.extend({
    initialize: function ( target, duration, begin_props, finish_props, option, data ) {
        this._tweenEventPool = {};
        this._target = $B( target ).element();
        this._b_props = [];
        this._f_props = [];
        this._propLength = 0;

        //스타일속성, 값, 단위 분리
        this.addProp( begin_props, finish_props );
        this._addEvents();
        $B.utils.TweenCore.prototype.initialize.call( this, duration, 0, 1, option, data );
        return this;
    },

    // ===============	Public Methods =============== //

    addListener: function ( type, handler, core ) {
        if ( core == 'core' ) {
            $B.utils.TweenCore.prototype.addListener.call( this, type, handler );
        } else {
            $B.utils.TweenCore.prototype.addListener.call( this, type, handler, this._tweenEventPool );
        }
        return this;
    },

    removeListener: function ( type, handler ) {
        $B.utils.TweenCore.prototype.removeListener.call( this, type, handler, this._tweenEventPool );
        return this;
    },

    hasListener: function ( type, handler ) {
        return $B.utils.TweenCore.prototype.hasListener.call( this, type, handler, this._tweenEventPool );
    },

    dispatch: function ( type, datas ) {
        $B.utils.TweenCore.prototype.dispatch.call( this, type, datas, this._tweenEventPool );
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
            var delIdx = this._propertyIndexOf( args[i] );

            if ( delIdx > -1 ) {
                this._b_props.splice( delIdx, 1 );
                this._f_props.splice( delIdx, 1 );
            }
        }

        this._propLength = this._f_props.length;
        return this;
    },

    // ===============	Private Methods =============== //
    _addEvents: function () {
        this._tweenHandler = $B.bind(function (e) {
            var i, c_value;
            for ( i = 0; i < this._propLength; ++i ) {
                var f_property = this._f_props[i],
                    b_property = this._b_props[i],
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
                    $B.style.opacity( this._target, fValue * e.percent + b_property.value );
                    //ScrollTop
                } else if ( fName == 'scrollTop' ) {
                    $B( this._target ).scrollTop( Number(c_value) );
                    //ScrollLeft
                } else if ( fName == 'scrollLeft' ) {
                    $B( this._target ).scrollLeft( Number(c_value) );
                } else {
                    this._target.style[f_property.styleName] = c_value;
                }
            }

            this.dispatch( e.type, e );
        }, this);

        this.addListener( 'tween', this._tweenHandler, 'core' );
        this.addListener( 'complete', this._tweenHandler, 'core' );
        this.addListener( 'seekcomplete', this._tweenHandler, 'core' );
    },

    //스타일속성이 있는지 체크후 index반환, 없을시 -1
    _propertyIndexOf: function ( propName ) {
        var result = -1, i;
        for ( i = 0; i < this._propLength; ++i ) {
            if ( this._f_props[i].name == propName ) {
                result = i;
                break;
            }
        }
        return result;
    },

    //스타일속성 배열에 넣기
    _addProperty: function ( begin_prop, finish_prop ) {
        var findIdx = this._propertyIndexOf( finish_prop.name ),
            styleName = $B.string.camelCase( finish_prop.name );

        begin_prop.styleName = styleName;
        finish_prop.styleName = styleName;

        if ( findIdx == -1 ) {
            this._b_props.push( begin_prop );
            this._f_props.push( finish_prop );
        } else {
            this._b_props[findIdx] = begin_prop;
            this._f_props[findIdx] = finish_prop;
        }

        this._propLength = this._f_props.length;
    },

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
    }
}, '$B.utils.TweenCSS');