'use babel';

export default {
    squareSize(h, w){
       return h * w;
    },
    middlePointInRect(w, h, x, y){
        var middleSize = this.squareSize(Number(h), Number(w)) / (Number(h) + Number(w));
        return {"x": Number(x)+middleSize, "y": Number(y)+middleSize };
    },
    getXY(element) {
       var box = element.getBoundingClientRect();
       var x = box.left ;
       var y = box.top;
       return {"x": x, "y": y, "height": box.height, "width": box.width}
   },
    getTransform(transform) {
        var b={};
        for (var i in transform = transform.match(/(\w+\((-?\d+.?\d*e?-?\d*,?)+\))+/g))
        {
            var c = transform[i].match(/[\w.-]+/g);
            var key = c.shift();
            b[key] = c;
        }
        return b;
    }
}
