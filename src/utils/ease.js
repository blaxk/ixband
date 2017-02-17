// ============================================================== //
// =====================		Ease	========================= //
// ============================================================== //
/**
 * Easing
 * http://code.google.com/p/tweener/
 * @type	{ease}
 * @param	{Number}	t	Current time (in frames or seconds).
 * @param	{Number}	b	Starting value.
 * @param	{Number}	c	Change needed in value.
 * @param	{Number}	d	Expected easing duration (in frames or seconds).
 * @return	{Number}	The correct value.
 */
ixBand.utils.ease = {
    none: function(t, b, c, d) {
        return c*t/d + b;
    },
    yoyo: function(t, b, c, d) {
        return ixBand.utils.ease.quadOut(t, b, c, d/2);
    },
    bounceIn: function(t, b, c, d) {
        return c - ixBand.utils.ease.bounceOut(d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d) {
        if((t/=d) <(1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if(t <(2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if(t <(2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    bounceInOut: function(t, b, c, d) {
        if(t < d/2) return ixBand.utils.ease.bounceIn(t*2, 0, c, d) * .5 + b;
        else return ixBand.utils.ease.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    },
    cubicIn: function(t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    cubicOut: function(t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    cubicInOut: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
        return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
    },
    elasticInOut: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
        if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
        if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    quadIn: function(t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    //Default
    quadOut: function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    quadInOut: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 *((--t)*(t-2) - 1) + b;
    },
    backIn: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backInOut: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }
};