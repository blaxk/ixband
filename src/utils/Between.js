// ============================================================== //
// =====================	Between			===================== //
// ============================================================== //

/**
 * 구간을 설정하고, 구간에 해당되면 이벤트를 발생시킨다.
 * Event : activate (구간에 진입시 한번만 발생), deactivate (구간에 진입시 한번만 발생), between (구간에 진입시 계속해서 발생)
 * Event Properties : e.percent, e.totalPercent, e.index, e.value, e.data
 * @param   {Array} positions   포지션 데이타 배열, [{min:Number, max:Number, data:*}, ...
 */
ixBand.utils.Between = $B.Class.extend({
    _startValue: 0,
    _endValue: 0,
    _disabled: false,
    _activeIndex: -1,

    initialize: function ( positions ) {
        this.update( positions );
        this._evtData = {empty: true};
        return this;
    },

    // ==================== Public Methods ==================== //
    /**
     * 포지션 데이타 갱신
     * @param   {Array} positions   포지션 데이타 배열, [{min:Number, max:Number, data:*}, ...
     */
    update: function ( positions ) {
        if ( $B.isArray(positions) && !$B.isEmpty(positions) ) {
            this._startValue = positions[0].min;
            this._endValue = positions[positions.length - 1].max;
            this._positions = positions.concat([]);
        }
        return this;
    },
    /**
     * 기준 수치를 갱신하여 이벤트를 발생시킨다. (positions, baseValue 둘중에 하나라도 값의 변화가 있어야 동작한다.)
     * @param   {Number} baseValue   기준이 되는 수치 갱신
     */
    trigger: function ( baseValue ) {
        //TODO: baseValue, positions 가 변했을때만 실행
        if ( !$B.isEmpty(baseValue) ) {
            this._calculate( baseValue );
        }
        return this;
    },
    /**
     * 이벤트 발생 허용
     */
    enable: function () {
        this._disabled = false;
        return this;
    },
    /**
     * 이벤트 발생 차단
     */
    disable: function () {
        this._disabled = true;
        return this;
    },

    // ==================== Private Methods ==================== //

    _isEqual: function ( datas ) {
        var result = true;

        for ( var key in datas ) {
            if ( key !== 'data' ) {
                if ( this._evtData[key] !== datas[key] ) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    },

    _calculate: function ( value ) {
        if ( !$B.isArray(this._positions) ) return;
        var activeData = this._getActiveData( value );

        if ( activeData.activeIndex > -1 ) {
            //activate
            this._dispatch( 'activate', activeData, value );
        } else {
            //deactivate
            this._dispatch( 'deactivate', activeData, value );
        }
    },

    _getActiveData: function ( value ) {
        var result = {activeIndex: -1},
            posLength = this._positions.length;

        for ( var i = 0; i < posLength; ++i ) {
            var pos = this._positions[i];
            if ( pos.min <= value && pos.max >= value ) {
                result.activeIndex = i;
                result.data = pos;
                break;
            }
        }

        return result;
    },

    _valueToPercent: function ( min, max, value ) {
        return (value - min) / (max - min);
    },

    _dispatch: function ( type, datas, value ) {
        if ( this._disabled ) return;

        var evtData, isBetween;

        if ( type === 'activate' ) {
            evtData = {
                percent: this._valueToPercent( datas.data.min, datas.data.max, value ),
                totalPercent: this._valueToPercent( this._startValue, this._endValue, value ),
                value: value,
                index: datas.activeIndex,
                data: datas.data
            };
        } else {
            evtData = {};
        }

        isBetween = type === 'activate' && !this._isEqual( evtData );

        if ( this._activeIndex !== datas.activeIndex ) {
            this.dispatch( type, evtData );
            if ( !isBetween ) this._evtData = evtData;
        }

        if ( isBetween ) {
            this.dispatch( 'between', evtData );
            this._evtData = evtData;
        }

        this._activeIndex = datas.activeIndex;
    }

}, '$B.utils.Between');