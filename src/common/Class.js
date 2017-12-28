// ============================================================== //
// =====================	Class			===================== //
// ============================================================== //

/**
 * Class 객체
 * extend, addListener, removeListener, hasListener, dispatch, methods 기본 제공 (extend시 override 주의)
 * initialize 는 기본실행
 * 주의 : instance 를 extend 하게되면 오류가 발생한다.
 * @return	{Function}
 */
ixBand.Class = function () {};
ixBand.Class.prototype = (function () {
    var proto = {
        __className__: '$B.Class'
    };

    for ( var key in CustomEvents.prototype ) {
        proto[key] = CustomEvents.prototype[key];
    }

    return proto;
}());

/**
 * Class.extend()
 * @param   {Object}    methods
 * @param   {String}    className
 * @returns {Function}
 */
ixBand.Class.extend = function ( methods, className ) {
    var EXCEPTION_REG = new RegExp( '^(__parentClass__|__className__|__extends__|__override__)$' );

    var _parent = this,
        _className = ( typeof className === 'string' )? className : '$B.Class_' + __classCount++,
        _properties = {};

    if ( typeof methods === 'object' ) {
        var Class = function () {
            this.__uId__ = $B.string.unique();
            this.__eventPool__ = {};

            for ( var key in _properties ) {
                this[key] = deepClone( _properties[key] );
            }

            if ( typeof this.initialize === 'function' ) {
                this.initialize.apply( this, arguments );
            }
        };

        Class.prototype = {
            __parentClass__: _parent,
            __className__: _className,
            __extends__: ( _parent.prototype.__extends__ || _parent.prototype.__className__ ) + ' > ' + _className
        };

        var overwride = '';

        for ( var key in this.prototype ) {
            if ( !EXCEPTION_REG.test(key) ) {
                var prop = this.prototype[key];
                Class.prototype[key] = prop;

                if ( !$B.isFunction(prop) ) {
                    _properties[key] = prop;
                }
            }
        }

        for ( var key in methods ) {
            if ( !EXCEPTION_REG.test(key) ) {
                var prop = methods[key];

                if ( Class.prototype.hasOwnProperty(key) ) {
                    overwride += overwride? ', ' + key : key;
                }

                Class.prototype[key] = prop;

                if ( !$B.isFunction(prop) ) {
                    _properties[key] = prop;
                }
            }
        }

        Class.prototype.__override__ = overwride;
        Class.extend = ixBand.Class.extend;
        return Class;
    }
};