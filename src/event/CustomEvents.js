// ============================================================== //
// =====================	CustomEvents	===================== //
// ============================================================== //

/**
 * CustomEvents 객체
 * 기본 Event Property : e.type
 * @param   {Boolean}   optionCheck (default:false)
 * @return	{Function}
 */
var CustomEvents = function ( optionCheck ) {
    this.__eventPool__ = {};
    this.__uId__ = $B.string.unique();
    this.__eventOptionCheck__ = optionCheck || false;
};

CustomEvents.prototype = {
    /**
     * @param {String}    type      event type
     * @param {Function}  listener
     * @param {*}         data
     */
    addListener: function ( type, listener, data ) {
        if ( ($B.isString(type) && type) && $B.isFunction(listener) && !this.hasListener(type, listener, data) ) {
            var events = this.__eventPool__[type];
            if ( !events ) events = this.__eventPool__[type] = [];
            events.push({
                listener: listener,
                data: data
            });
        }

        return this;
    },

    /**
     * @param {String}    type      event type
     * @param {Function}  listener
     * @param {*}         data
     */
    removeListener: function ( type, listener, data ) {
        var events = this.__eventPool__[type];

        if ( events ) {
            if ( $B.isFunction(listener) ) {
                var evtLength = events.length, i;

                if ( !$B.isEmpty(data) && this.__eventOptionCheck__ ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( listener === eData.listener && $B.isEqual(eData.data, data) ) {
                            events.splice( $B.array.indexOf(events, events[i]), 1 );
                            break;
                        }
                    }
                } else {
                    for ( i = 0; i < evtLength; ++i ) {
                        if ( listener === events[i].listener ) {
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
     * @param   {Function}  listener
     * @param   {*}         data
     * @return  {Boolean}
     */
    hasListener: function ( type, listener, data ) {
        var result = false,
            events = this.__eventPool__[type];

        if ( events ) {
            if ( $B.isFunction(listener) ) {
                var evtLength = events.length, i;

                if ( !$B.isEmpty(data) && this.__eventOptionCheck__ ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( listener === eData.listener && $B.isEqual(eData.data, data) ) {
                            result = true;
                            break;
                        }
                    }
                } else {
                    for ( i = 0; i < evtLength; ++i ) {
                        if ( listener === events[i].listener ) {
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
                //addListener 에서 등록한 data는 callback 되지 않는다.
                events[i].listener.call( _this, evt );
            }
        }

        return this;
    }
};