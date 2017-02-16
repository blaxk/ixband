// ============================================================== //
// =====================	Class			===================== //
// ============================================================== //

/**
 * Class 객체
 * extend, addListener, removeListener, hasListener, dispatch 기본 제공 (extend시 override 되지 않도록 주의)
 * initialize 는 기본실행
 * extend 주의 : 초기에 선언시 instant를 사용하면 오류가 발생한다.
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

ixBand.Class.extend = function ( methods, className ) {
    var EXCEPTION_REG = new RegExp( '^(__eventPool__|__parentClass__|__className__|__extends__)$' );

    var _parent = this,
        _className = ( typeof className === 'string' )? className : '$B.Class_' + __classCount++;

    if ( typeof methods === 'object' ) {
        var Class = function () {
            if ( typeof this.initialize === 'function' ) {
                this.initialize.apply( this, arguments );
            }
        };

        Class.prototype = {
            __eventPool__: {},
            __parentClass__: _parent,
            __className__: _className,
            __extends__: ( _parent.prototype.__extends__ || _parent.prototype.__className__ ) + ' > ' + _className
        };

        var overwride = '';

        for ( var key in this.prototype ) {
            if ( !EXCEPTION_REG.test(key) ) {
                Class.prototype[key] = deepClone( this.prototype[key] );
            }
        }

        for ( var key in methods ) {
            if ( !EXCEPTION_REG.test(key) ) {
                if ( Class.prototype.hasOwnProperty(key) ) {
                    overwride += overwride? ', ' + key : key;
                }

                Class.prototype[key] = methods[key];
            }
        }

        Class.prototype.__overwride__ = overwride;
        Class.extend = ixBand.Class.extend;
        return Class;
    }
};