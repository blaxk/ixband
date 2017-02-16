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
     */
    addListener: function ( type, callback ) {
        if ( typeof type === 'string' && typeof callback === 'function' && !this.hasListener(type, callback) ) {
            var events = this.__eventPool__[type];
            if ( !events ) events = this.__eventPool__[type] = [];
            events.push( callback );
        }

        return this;
    },

    /**
     * @param {String}    type      event type
     * @param {Function}  callback
     */
    removeListener: function ( type, callback ) {
        var events = this.__eventPool__[type];

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
                delete this.__eventPool__[type];
            } else {
                this.__eventPool__ = {};
            }
        }

        return this;
    },

    /**
     * @param   {String}    type      event type
     * @param   {Function}
     * @return  {Boolean}
     */
    hasListener: function ( type, callback ) {
        var result = false,
            events = this.__eventPool__[type];

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
     */
    dispatch: function ( type, datas ) {
        var _this = this,
            events = this.__eventPool__[type];

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