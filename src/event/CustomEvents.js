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
     * @param {String}          type      event type
     * @param {Function}        listener
     * @param {Object|Boolean}  options   useCapture, passive 등의 설정 용도
     */
    addListener: function ( type, listener, options ) {
        if ( ($B.isString(type) && type) && $B.isFunction(listener) && !this.hasListener(type, listener, options) ) {
            var events = this.__eventPool__[type];
            if ( !events ) events = this.__eventPool__[type] = [];
            events.push({
                listener: listener,
                options: options
            });
        }

        return this;
    },

    /**
     * @param {String}          type      event type
     * @param {Function}        listener
     * @param {Object|Boolean}  options   useCapture, passive 등
     */
    removeListener: function ( type, listener, options ) {
        var events = this.__eventPool__[type];

        if ( events ) {
            if ( $B.isFunction(listener) ) {
                var evtLength = events.length, i;

                if ( !$B.isEmpty(options) && this.__eventOptionCheck__ ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( listener === eData.listener && $B.isEqual(eData.options, options) ) {
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
			if (!type) {
				this.__eventPool__ = {};
			}
		}

        return this;
    },

    /**
     * @param   {String}            type      event type
     * @param   {Function}          listener
     * @param   {Object|Boolean}    options   useCapture, passive 등
     * @return  {Boolean}
     */
    hasListener: function ( type, listener, options ) {
        var result = false,
            events = this.__eventPool__[type];

        if ( events ) {
            if ( $B.isFunction(listener) ) {
                var evtLength = events.length, i;

                if ( !$B.isEmpty(options) && this.__eventOptionCheck__ ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( listener === eData.listener && $B.isEqual(eData.options, options) ) {
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

                events[i].listener.call( _this, evt );
            }
        }

        return this;
    }
};