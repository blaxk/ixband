// ============================================================== //
// =====================	Matrix		========================= //
// ============================================================== //

/**
 * 3x3 변형행렬, 2D Matrix
 * @class	{Matrix}
 * @constructor
 * @param	{Number}	a	크기를 조절하거나 회전할 때 x축의 픽셀 위치에 영향을 주는 값.
 * @param	{Number}	b	회전하거나 기울일 때 y축의 픽셀 위치에 영향을 주는 값.
 * @param	{Number}	c	회전하거나 기울일 때 x축의 픽셀 위치에 영향을 주는 값.
 * @param	{Number}	d	크기를 조절하거나 회전할 때 y축의 픽셀 위치에 영향을 주는 값.
 * @param	{Number}	tx	x축을 따라 각 점이 평행 이동할 거리.
 * @param	{Number}	ty	y축을 따라 각 점이 평행 이동할 거리.
 */
ixBand.geom.Matrix = $B.Class.extend({
    //degrees to radians
    DEG_TO_RAD: Math.PI / 180,

    initialize: function ( a, b, c, d, tx, ty ) {
        this.a = a || 1;
        this.b = b || 0;
        this.u = 0;
        this.c = c || 0;
        this.d = d || 1;
        this.v = 0;
        this.tx = tx || 0;
        this.ty = ty || 0;
        this.w = 1;
    },

    // ===============	Public Methods =============== //

    /**
     * matrix를 CSS3에서 사용할 수 있도록 문자열로 반환
     * @return {Matrix}
     */
    toString: function () {
        var m = this;
        return m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.tx + ',' + m.ty;
    },
    /**
     * 행렬을 현재 행렬과 연결하여 두 행렬의 기하학적 효과를 효율적으로 결합
     * @param	{Matrix}	mtx
     * @return {Matrix}
     */
    concat: function ( mtx ) {
        var result = {},
            m = this;

        result.a = m.a * mtx.a + m.b * mtx.c + m.u * mtx.tx;
        result.b = m.a * mtx.b + m.b * mtx.d + m.u * mtx.ty;
        result.u = m.a * mtx.u + m.b * mtx.v + m.u * mtx.w;
        result.c = m.c * mtx.a + m.d * mtx.c + m.v * mtx.tx;
        result.d = m.c * mtx.b + m.d * mtx.d + m.v * mtx.ty;
        result.v = m.c * mtx.u + m.d * mtx.v + m.v * mtx.w;
        result.tx = m.tx * mtx.a + m.ty * mtx.c + m.w * mtx.tx;
        result.ty = m.tx * mtx.b + m.ty * mtx.d + m.w * mtx.ty;
        result.w = m.tx * mtx.u + m.ty * mtx.v + m.w * mtx.w;
        m.a = result.a;
        m.b = result.b;
        m.u = result.u;
        m.c = result.c;
        m.d = result.d;
        m.v = result.v;
        m.tx = result.tx;
        m.ty = result.ty;
        m.w = result.w;
        return m;
    },
    /**
     * 이 행렬의 복제본인 새 Matrix 객체와, 포함된 객체의 동일한 복사본을 함께 반환.
     * @return	{Matrix}	복제본 Matrix
     */
    clone: function () {
        var m = this;
        return	new $B.geom.Matrix( m.a, m.b, m.c, m.d, m.tx, m.ty );
    },
    /**
     * 행렬에 크기 조절 변형을 적용. x 축에는 sx가 곱해지고 y 축에는 sy가 곱해짐.
     * @param	{Number}	sx	scaleX
     * @param	{Number}	sy	scaleY.
     * @return {Matrix}
     */
    scale: function ( sx, sy ) {
        var mtx = new $B.geom.Matrix( sx, 0, 0, sy, 0, 0 );
        return this.concat( mtx );
    },
    /**
     * Matrix 객체에 회전 변형을 적용
     * @param	{Number}	angle	Degree
     * @return {Matrix}
     */
    rotate: function ( angle ) {
        var rad = this.DEG_TO_RAD * angle,
            cosVal = Math.cos( rad ),
            sinVal = Math.sin( rad ),
            mtx = new $B.geom.Matrix( cosVal, sinVal, -sinVal, cosVal, 0, 0 );
        return this.concat( mtx );
    },
    /**
     * Matrix 객체에 기울이기 또는 시어링 변형을 적용
     * @param	{Number}	rx	Degree
     * @param	{Number}	ry	Degree
     * @return {Matrix}
     */
    skew: function ( rx, ry ) {
        var radx = this.DEG_TO_RAD * rx,
            rady = this.DEG_TO_RAD * ry,
        //mtx = new $B.geom.Matrix( 1, rady, radx, 1, 0, 0 );
            mtx = new $B.geom.Matrix( 1, Math.tan(rady), Math.tan(radx), 1, 0, 0 );
        return this.concat( mtx );
    },
    /**
     * dx 및 dy 매개 변수에 지정된 대로 x 및 y 축을 따라 행렬을 평행 이동
     * @param	{Number}	dx	x 축을 따라 오른쪽으로 이동할 크기
     * @param	{Number}	dy	y 축을 따라 아래쪽으로 이동할 크기
     * @return {Matrix}
     */
    translate: function ( dx, dy ) {
        dy = dy || 0;
        var mtx = new $B.geom.Matrix( 1, 0, 0, 1, dx, dy );
        return this.concat( mtx );
    },
    /**
     * Matrix 객체가 나타내는 기하학적 변형을 지정된 점에 적용한 결과를 반환
     * @param	{Point}		point	x와 y를 가지고 있는 Object
     * @return	{Point}		x와 y좌표를 가지고 있는 Point 객체 반환
     */
    transform: function ( point ) {
        var result = {},
            m = this;

        result.x = m.a * point.x + m.c * point.y + m.tx;
        result.y = m.b * point.x + m.d * point.y + m.ty;
        return result;
    }
}, '$B.geom.Matrix');