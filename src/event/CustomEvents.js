// ============================================================== //
// =====================	CustomEvents	===================== //
// ============================================================== //

/**
 * CustomEvents 객체
 * 기본 Event Property : e.type, e.data
 * @param   {Boolean}   dataCheck (default:false)
 * @return	{Function}
 */
var CustomEvents = function ( dataCheck ) {
    this.__eventPool__ = {};
    this.__uId__ = $B.string.unique();
    this.__eventDataCheck__ = dataCheck || false;
};

CustomEvents.prototype = {
    /**
     * @param {String}    type      event type
     * @param {Function}  callback
     * @param {*}         data
     */
    addListener: function ( type, callback, data ) {
        if ( ($B.isString(type) && type) && $B.isFunction(callback) && !this.hasListener(type, callback, data) ) {
            var events = this.__eventPool__[type];
            if ( !events ) events = this.__eventPool__[type] = [];
            events.push({
                handler: callback,
                data: data
            });
        }

        return this;
    },

    /**
     * @param {String}    type      event type
     * @param {Function}  callback
     * @param {*}         data
     */
    removeListener: function ( type, callback, data ) {
        var events = this.__eventPool__[type];

        if ( events ) {
            if ( $B.isFunction(callback) ) {
                var evtLength = events.length, i;

                if ( !$B.isEmpty(data) && this.__eventDataCheck__ ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( callback === eData.handler && $B.isEqual(eData.data, data) ) {
                            events.splice( $B.array.indexOf(events, events[i]), 1 );
                            break;
                        }
                    }
                } else {
                    for ( i = 0; i < evtLength; ++i ) {
                        if ( callback === events[i].handler ) {
                            events.splice( $B.array.indexOf(events, events[i]), 1 );
                            break;
                        }
                    }
                }
            } else {
                delete this.__eventPool__[type];
            }
        } else {
            this.__eventPool__ = {};
        }

        return this;
    },

    /**
     * @param   {String}    type      event type
     * @param   {Function}  callback
     * @param   {*}         data
     * @return  {Boolean}
     */
    hasListener: function ( type, callback, data ) {
        var result = false,
            events = this.__eventPool__[type];

        if ( events ) {
            if ( $B.isFunction(callback) ) {
                var evtLength = events.length, i;

                if ( !$B.isEmpty(data) && this.__eventDataCheck__ ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( callback === eData.handler && $B.isEqual(eData.data, data) ) {
                            result = true;
                            break;
                        }
                    }
                } else {
                    for ( i = 0; i < evtLength; ++i ) {
                        if ( callback === events[i].handler ) {
                            result = true;
                            break;
                        }
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
                events[i].handler.call( _this, evt );
            }
        }

        return this;
    }
};