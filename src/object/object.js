// ############################################################################ //
// ############################################################################ //
// 									object										//
// ############################################################################ //
// ############################################################################ //

ixBand.object = {
    /**
     * 해당 값이 Object인지 여부 반환 (배열은 false)
     * @param	{Object}	obj
     * @returns {Boolean}
     */
    is: function ( obj, errorMsg ) {
        var result = Object.prototype.toString.call( obj ) === '[object Object]';

        if ( errorMsg && !result ) {
            warning( errorMsg );
            return false;
        } else {
            return result;
        }
    },

    /**
     * 순환 참조가 되지 않도록 Object 복사본을 반환.
     * 주의) instance는 제대로 복사되지 않는다.
     * @param	{Object}	value
     * @returns {Object}
     */
    clone: deepClone,

    /**
     * 두개의 Object를 확장 해서 (합쳐) 반환
     * @param {Object}	fromObj
     * @param {Object}	toObj	fromObj 와 같은 key를 가지고 있으면 toObj의 값이 우선이 된다.
     * @param {Boolean}	circularReference
     * 	순환참조를 유지할지 설정 (기본값 true)
     * 	순화참조를 하지 않을경우 object.clone()으로 복사된다.
     */
    extend: function ( fromObj, toObj, circularReference ) {
        circularReference = typeof circularReference === 'boolean' ? circularReference : true;

        var result = fromObj;

        if ( !circularReference ) {
            result = deepClone( fromObj );
            toObj = deepClone( toObj );
        }

        for ( var key in toObj ) {
            result[key] = toObj[key];
        }

        return result;
    },

    /**
     * Object를 배열로 변환하여 반환
     * @param   {Object}   obj
     * @param   {String}   target  ("value", "key") 기본값 "value"
     * @returns {Array}
     */
    toArray: function ( obj, target ) {
        var result = [];
        for ( var n in obj ) {
            result.push( target === 'key' ? n : obj[n] );
        }

        return result;
    },

    /**
     * Object의 key를 value로 value는 key로 변환하여 반환
     * @param   {Object}   obj
     * @returns {Object}
     */
    replaceKeyValue: function ( obj ) {
        var result = {};
        for ( var key in obj ) {
            var value = obj[key];
            result[value] = key;
        }

        return result;
    },

    length: function ( obj ) {
        var count = 0;

        for ( var n in obj ) {
            count++;
        }

        return count;
    }
};