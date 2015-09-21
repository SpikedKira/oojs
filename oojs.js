var Extend = "extends";
var Class = function(operation, parent, fn) {
  var childfn = fn || operation;

  // singleton operation //
  if( operation == "singleton" ) {
    childfn = parent;
    var temp = function() {
      if( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
      arguments.callee._singletonInstance = this;
      return childfn.apply(this);
    };
    return temp;
  }

  // extend operation //
  if( operation == "extends" && parent != undefined ) {
    childfn.prototype = Object.create( parent.prototype );
    //childfn.prototype._super = parent;
    childfn.prototype.initializing = false;
    childfn.prototype.constructor = childfn;

    var sc = new Array();
    if( parent.prototype._superChain )
      sc = parent.prototype._superChain.slice(0);
    sc.push(parent);
    childfn.prototype._superChain = sc;

    childfn.prototype.initialize = function(args) {
      this.initializing = true;
      if( this._scInit == undefined )
        this._scInit = this._superChain.length;

      this._superChain[--this._scInit].apply(this, args);

      _super = {};
      for( var j in this )
        if( typeof this[j] == "function" && j != "initialize" )
          _super[j] = this[j];

      this.initializing = false;
      return _super;
    };
  }
  return childfn;
}