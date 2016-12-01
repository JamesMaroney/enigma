// UMD: https://github.com/umdjs/umd
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Enigma = factory();
  }
}(this, function () {

var alphabet  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    wheels = {
	'I'    : ['EKMFLGDQVZNTOWYHXUSPAIBRCJ','R'],
	'II'   : ['AJDKSIRUXBLHWTMCQGZNPYFVOE','F'],
	'III'  : ['BDFHJLCPRTXVZNYEIWGAKMUSQO','W'],
	'IV'   : ['ESOVPZJAYQUIRHXLNFTGKDCMWB','K'],
	'V'    : ['VZBRGITYUPSDNHLXAWMJQOFECK','A'],
	'RB'   : ['YRUHQSLDPXNGOKMIEBFZCWVJAT'],
	'RC'   : ['FVPJIAOYEDRZXWGCTKUQSBNMHL']
     };

var swap = function(str,pair){
  pair = pair.split('');
  var arr = str.split(''),
      i=str.indexOf(pair[0]),
      j=str.indexOf(pair[1]);
  var _i=arr[i];
  arr[i] = arr[j];
  arr[j] = _i;
  return arr.join('');
}

var Wheel = function(name, type, offset){
  this._name = name;
  this._mapping = [alphabet, type[0]];
  this._trigger = alphabet.indexOf(type[1]);
  this._initial_offset = offset || 0;
  this.reset();
}
  Wheel.prototype.map = function(i, dir){ 
    dir = (dir==-1) ? 1 : 0;
    var _index = ( i + this._ticks ) % alphabet.length,
        out_letter = this._mapping[1-dir][_index],
        out_index = this._mapping[dir].indexOf(out_letter) - this._ticks;
    if(out_index < 0) out_index = alphabet.length + out_index;
    return out_index;
  }
  Wheel.prototype.reset = function(){ this._ticks = this._initial_offset; }
  Wheel.prototype.tick = function(){ 
    this._ticks = (this._ticks + 1) % alphabet.length;
    return this._ticks == this._trigger;
  }

var Enigma = function(){
  this.configure.apply(this,arguments);
}
  Enigma.prototype.configure = function(_wheels,offsets,pegboard_map){
    _wheels = _wheels || ['RB','I','II','III'];
    offsets = offsets || [0,0,0];
    pegboard_map = pegboard_map || [];

    this.reflector     = new Wheel('reflector', wheels[_wheels[0]]);
    this.wheels = {};
    this.wheels.left   = new Wheel('left', wheels[_wheels[1]], offsets[0]);
    this.wheels.middle = new Wheel('middle', wheels[_wheels[2]], offsets[1]);
    this.wheels.right  = new Wheel('right', wheels[_wheels[3]], offsets[2]);
    this.pegboard = new Wheel(
      'pegboard',
      [pegboard_map.reduce(function(acc, pair){ return swap(acc, pair); }, alphabet)]
    );
  };
  Enigma.prototype.reset = function(){
    this.wheels.left.reset();
    this.wheels.middle.reset();
    this.wheels.right.reset();
  };
  Enigma.prototype.encode = function(input){
    input = input.toUpperCase();
    var output = '', _i, _r;
    this.reset();
    for(var i=0,j=input.length; i<j; i++){
      _r = this.wheels.right.tick();
      if(_r) _r = this.wheels.middle.tick();
      if(_r) _r = this.wheels.left.tick();

      _i = alphabet.indexOf(input[i]);
      _i = this.pegboard.map(_i);
      _i = this.wheels.right.map(_i);
      _i = this.wheels.middle.map(_i);
      _i = this.wheels.left.map(_i);
      _i = this.reflector.map(_i);
      _i = this.wheels.left.map(_i, -1);
      _i = this.wheels.middle.map(_i, -1); 
      _i = this.wheels.right.map(_i, -1);
      _i = this.pegboard.map(_i);

      output += alphabet[_i];
    }
    return output;
  };

return Enigma;

}));
