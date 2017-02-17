// ############################################################################ //
// ############################################################################ //
// 								ua (userAgent)									//
// ############################################################################ //
// ############################################################################ //

ixBand.ua = (function () {
    var nua = navigator.userAgent.toLowerCase(),
        docMode = document.documentMode,
        isWindows = nua.indexOf('windows') > -1,
        isLinuxPlatform = ( '' + navigator.platform ).toLowerCase().indexOf( 'linux' ) > -1;

    /**
     * 브라우져, OS 체크
     * @type	{ua}
     */
    var ua = {
        IE_VERSION: 0,
        DOC_MODE: docMode || 0,
        MSIE: false,
        EDGE: nua.indexOf('edge') > -1,
        IE7_LT: false,//ie7미만 (~6)
        IE8_LT: false,//ie8미만 (~7)
        IE9_LT: false,//ie9미만 (~8)
        IE10_LT: false,//ie10미만 (~9)
        IE11_LT: false,//ie10미만 (~10)
        DOC_MODE_IE8_LT: false,//문서모드 8미만
        DOC_MODE_IE9_LT: false,//문서모드 9미만
        DOC_MODE_IE10_LT: false,//문서모드 10미만
        DOC_MODE_IE11_LT: false,//문서모드 11미만
        DOC_MODE_IE12_LT: false,//문서모드 12미만
        IE_COMPATIBLE: false,//호환성모드
        SAFARI: nua.indexOf('safari') > -1 && nua.indexOf('chrome') == -1 && !isLinuxPlatform,
        FIREFOX: nua.indexOf('firefox') > -1 && !/compatible|webkit/.test(nua),
        OPERA: /\b(opera|opr)/.test(nua),
        OPERA_MINI: /\b(opera mini)/.test(nua),
        CHROME: nua.indexOf('chrome') > -1,
        MOBILE_IOS: /ipod|iphone|ipad/.test(nua) && !isWindows && !isLinuxPlatform,
        IPHONE: nua.indexOf('iphone') > -1 && !isWindows && !isLinuxPlatform,
        IPAD: nua.indexOf('ipad') > -1 && !isWindows && !isLinuxPlatform,
        ANDROID: nua.indexOf('android') > -1 && !isWindows,
        MAC: nua.indexOf('mac') > -1 && !isWindows && !isLinuxPlatform,
        WINDOWS: isWindows,
        WINDOWS_PHONE: nua.indexOf('windows phone') > -1 && isWindows,
        LINUX: nua.indexOf('linux') > -1,
        WEBKIT: nua.indexOf('webkit') > -1,
        MOZILLA: nua.indexOf('mozilla') > -1,
        TOUCH_DEVICE: ('ontouchstart' in window) || nua.indexOf('touch') > -1,
        MOBILE: nua.indexOf('mobile') > -1,
        ANDROID_TABLET: false,
        WINDOWS_TABLET: false,
        TABLET: false,
        SMART_PHONE: false,
        VERSION: 0,//브리우저 버전 (IE의 경우 8~는 DOC_MODE를 참조한다.)
        OS_VERSION: 0,
        WEBKIT_VERSION: 0
    };

    ua.CHROME = ua.CHROME && !ua.SAFARI && !ua.OPERA && !ua.EDGE;

    //IE11부터는 appName이 Netscape로 나오기때문에 docMode도 체크
    ua.MSIE = navigator.appName == 'Microsoft Internet Explorer' || docMode > 10;

    if ( ua.MSIE ) {
        var re = new RegExp( 'msie ([0-9]{1,}[\.0-9]{0,})' );
        if ( re.exec(nua) ) {
            ua.IE_VERSION = parseFloat(RegExp.$1);
            if ( ua.IE_VERSION < 7 ) ua.IE7_LT = true;
            if ( ua.IE_VERSION < 8 ) ua.IE8_LT = true;
            if ( ua.IE_VERSION < 9 ) ua.IE9_LT = true;
            if ( ua.IE_VERSION < 10 ) ua.IE10_LT = true;
            if ( ua.IE_VERSION < 11 ) ua.IE11_LT = true;
        }

        if ( docMode ) {
            if ( docMode < 8 ) ua.DOC_MODE_IE8_LT = true;
            if ( docMode < 9 ) ua.DOC_MODE_IE9_LT = true;
            if ( docMode < 10 ) ua.DOC_MODE_IE10_LT = true;
            if ( docMode < 11 ) ua.DOC_MODE_IE11_LT = true;
            if ( docMode < 12 ) ua.DOC_MODE_IE12_LT = true;
        } else {
            ua.DOC_MODE_IE8_LT = true;
            ua.DOC_MODE_IE9_LT = true;
            ua.DOC_MODE_IE10_LT = true;
            ua.DOC_MODE_IE11_LT = true;
            ua.DOC_MODE_IE12_LT = true;
        }

        ua.IE_COMPATIBLE = /msie 7.*trident/.test(nua);
    }

    ua.ANDROID_TABLET = ua.ANDROID && !ua.MOBILE;
    ua.WINDOWS_TABLET = ua.WINDOWS && /tablet/.test(nua) && !ua.IE_COMPATIBLE;
    ua.TABLET = ua.IPAD || ua.ANDROID_TABLET || ua.WINDOWS_TABLET;
    ua.SMART_PHONE = ( ua.MOBILE && !ua.TABLET ) || ua.WINDOWS_PHONE;

    if ( ua.EDGE ) {
        ua.TOUCH_DEVICE = navigator.pointerEnabled || navigator.msPointerEnabled;
    }

    var osMatch = nua.match( /(mac os x|os|windows phone|windows nt|android)\s([0-9\._]+)/i );
    if ( osMatch && osMatch.length > 2 ) ua.OS_VERSION = String( osMatch[2] ).replace( '_', '.' );

    if ( ua.WEBKIT ) ua.WEBKIT_VERSION = getVersion( 'webkit' );

    if ( ua.MSIE ) {
        ua.VERSION = String(ua.DOC_MODE) || ua.IE_VERSION;
    } else if ( ua.CHROME ) {
        ua.VERSION = getVersion( 'chrome' );
    } else if ( ua.FIREFOX ) {
        ua.VERSION = getVersion( 'firefox' );
    } else if ( ua.SAFARI ) {
        ua.VERSION = getVersion();
    } else if ( ua.OPERA ) {
        if ( ua.OPERA_MINI ) {
            ua.VERSION = getVersion( 'opera mini' );
        } else {
            ua.VERSION = getVersion( 'opr' ) || getVersion();
        }
    } else if ( ua.EDGE ) {
        ua.VERSION = getVersion( 'edge' );
    } else {
        ua.VERSION = getVersion();
    }

    // 버전이 없으면 '0'을 반환
    function getVersion ( browserName ) {
        var matchs = nua.match( /version\/([\d.]*)/ );

        if ( browserName ) {
            var reg = new RegExp( browserName + '/([\\d.]*)' );
            matchs = nua.match( reg );
        }

        if ( matchs && matchs.length > 1 ) {
            return matchs[1];
        } else {
            return 0;
        }
    }

    return ua;
}());