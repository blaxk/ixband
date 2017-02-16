// ============================================================== //
// =====================	CustomEvents	===================== //
// ============================================================== //

/**
 * CustomEvents 객체
 * @return	{Function}
 */
var CustomEvents = function () {};
CustomEvents.prototype = {
    __eventPool__: {},
    /**
     * @param {String}    type      event type
     * @param {Function}  callback
     * @param {Object}    eventPool 대체할 eventPool, 상속 관계에서 별도의 eventPool을 지정할때 사용한다.
     */
    addListener: function ( type, callback, eventPool ) {
        if ( typeof type === 'string' && typeof callback === 'function' && !this.hasListener(type, callback) ) {
            var evtPool = $B.isObject( eventPool ) || this.__eventPool__,
                events = evtPool[type];
            if ( !events ) events = evtPool[type] = [];
            events.push( callback );
        }

        return this;
    },

    /**
     * @param {String}    type      event type
     * @param {Function}  callback
     * @param {Object}    eventPool 대체할 eventPool, 상속 관계에서 별도의 eventPool을 지정할때 사용한다.
     */
    removeListener: function ( type, callback, eventPool ) {
        var evtPool = $B.isObject( eventPool ) || this.__eventPool__,
            events = evtPool[type];

        if ( events ) {
            if ( typeof callback === 'function' ) {
                var evtLength = events.length;
                for ( var i = 0; i < evtLength; ++i ) {
                    if ( callback === events[i] ) {
                        events.splice( i, 1 );
                        break;
                    }
                }
            } else if ( type ) {
                delete evtPool[type];
            } else {
                evtPool = {};
            }
        }

        return this;
    },

    /**
     * @param   {String}    type      event type
     * @param   {Function}
     * @param   {Object}    eventPool 대체할 eventPool, 상속 관계에서 별도의 eventPool을 지정할때 사용한다.
     * @return  {Boolean}
     */
    hasListener: function ( type, callback, eventPool ) {
        var result = false,
            evtPool = $B.isObject( eventPool ) || this.__eventPool__,
            events = evtPool[type];

        if ( events ) {
            if ( typeof callback === 'function' ) {
                var evtLength = events.length;
                for ( var i = 0; i < evtLength; ++i ) {
                    if ( callback === events[i] ) {
                        result = true;
                        break;
                    }
                }
            } else {
                result = true;
            }
        }

        return result;
    },

    /**
     * @param {String}  type     event type
     * @param {Object}  datas
     * @param {Object}  eventPool 대체할 eventPool, 상속 관계에서 별도의 eventPool을 지정할때 사용한다.
     */
    dispatch: function ( type, datas, eventPool ) {
        var _this = this,
            evtPool = $B.isObject( eventPool ) || this.__eventPool__,
            events = evtPool[type];

        if ( events ) {
            var evtLength = events.length;
            for ( var i = 0; i < evtLength; ++i ) {
                var evt = {type: type};

                if ( typeof datas === 'object' ) {
                    for ( var key in datas ) {
                        if ( key !== 'type' ) evt[key] = datas[key];
                    }
                }
                events[i].call( _this, evt );
            }
        }

        return this;
    }
};