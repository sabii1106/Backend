var PI = Math.PI;
//console.log("El valor de PI:", PI);
exports.area = (radio) => {
    
    return PI * radio * radio;
    }
exports.perimetro = (radio) => {
    return 2 * PI * radio;
    }