var extend = "extends";
function Class(child, operator, parent) {
  this[child.name] = child;

  if( operator == "extends" && parent != undefined ) {
    function F() {};
    F.prototype = parent.prototype;
    child.prototype = new F();
    //child.prototype = Object.create(parent.prototype);
    child.prototype._super = parent;
    child.prototype.constructor = child;

    var x = new child();
    var y = new parent();
    for( var i in y ) {
      if( x[i] != undefined && typeof x[i] == "function" ) {
        console.log("replacing: " + i);
        x[i] = (function(name, fn) {
          return function() {
            var tmp = this._super;
            this._super = parent.prototype[name];
            console.log("replaced function called");
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          }
        })(i, x[i]);
      }
    }
    child.prototype = x;
  }
};