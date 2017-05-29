// ============================================================== //
// =====================	Responsive		===================== //
// ============================================================== //

/**
 * 설정한 사이즈에 따라 window resize이벤트를 통해서 해당 이벤트를 발생시킨다. (IE9~)
 * Event : responsive, resize
 * Event Properties : e.responsiveType
 * @param   {String}    type        ex) 'width' or 'height'
 * @param   {Array}     positions   포지션 데이타 배열, [{min:Number, max:Number, type:String}, ...
 */
ixBand.event.Responsive = $B.Class.extend({
    _disabled: false,
    _hasEvents: false,
    _positions: [],

    initialize: function ( type, positions ) {
        if ( $B.ua.SAFARI || $B.ua.MOBILE_IOS || $B.ua.ANDROID || $B.ua.WINDOWS_PHONE ) {
            //safari, mobile
            this._sizeTarget = document.documentElement;
            this._sizeProp = ( type === 'height' )? 'clientHeight' : 'clientWidth';
        } else {
            //pc
            this._sizeTarget = window;
            this._sizeProp = ( type === 'height' )? 'innerHeight' : 'innerWidth';
        }

        this._setPositions( positions );
        return this;
    },

    // ==================== Public Methods ==================== //
    /**
     * 현재 해상도의 Type을 반환.
     * positions 데이타 등록시 설정한 type속성 중에 해당하는 값을 반환
     * @return	{String}
     */
    responsiveType: function () {
        if ( $B.ua.WINDOWS_PHONE || !$B.ua.DOC_MODE_IE9_LT ) {
            return this._getSizeType( this._sizeTarget[this._sizeProp] );
        } else {
            return this._positions[this._positions.length - 1].type;
        }
    },
    /**
     * 이벤트 발생 허용
     */
    enable: function () {
        this._disabled = false;
        return this;
    },
    /**
     * 이벤트 발생 비허용
     */
    disable: function () {
        this._disabled = true;
        return this;
    },
    /**
     * 이벤트 및 기본설정 삭제
     */
    clear: function () {
        this._removeEvents();
        return this;
    },

    //override
    addListener: function ( type, callback ) {
        this._setEvents();
        $B.Class.prototype.addListener.call( this, type, callback );
        return this;
    },

    // ==================== Private Methods ==================== //

    _setPositions: function ( positions ) {
        if ( $B.isArray(positions) && !$B.isEmpty(positions) ) {
            this._positions = positions.concat([]);
        }
        return this;
    },

    _setEvents: function () {
        if ( this._hasEvents ) return;

        var sizeType = '';

        this._resizeHandler = $B.bind( function (e) {
            if ( this._disabled ) return;
            var rType = this.responsiveType();

            if ( rType !== sizeType ) {
                this.dispatch( 'responsive', {responsiveType: rType} );
            }

            this.dispatch( 'resize', {responsiveType: rType} );
            sizeType = rType;
        }, this);

        $B( window ).addEvent( 'resize', this._resizeHandler );
        this._hasEvents = true;
    },

    _getSizeType: function ( current ) {
        var result = '';

        var length = this._positions.length;

        for ( var i = 0; i < length; ++i ) {
            var pos = this._positions[i];

            if ( pos.min <= current && pos.max >= current ) {
                result = pos.type;
                break;
            }
        }

        return result;
    },

    _removeEvents: function () {
        if ( !this._hasEvents ) return;

        $B( window ).removeEvent( 'resize', this._resizeHandler );
        this._hasEvents = false;
    }

}, '$B.event.Responsive');