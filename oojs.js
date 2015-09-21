var Extend = "extends";
function Class(child, operation, parent, fn) {
  var name = child.name || child;
  var childfn = fn || (typeof operation == "function" ? operation : child);
  this[name] = childfn;

  if( operation == "extends" && parent != undefined ) {
    this[name].prototype = Object.create( parent.prototype );
    //this[name].prototype._super = parent;

    var sc = new Array();
    if( parent.prototype._superChain )
      sc = parent.prototype._superChain.slice(0);
    sc.push(parent);
    this[name].prototype._superChain = sc;
    //console.log("setting super chain " + sc.length + " :: " + sc);

    this[name].prototype.initialize = function(args) {
      if( this._scInit == undefined )
        this._scInit = this._superChain.length;

      this._superChain[--this._scInit].apply(this, args);

      _super = {};
      for( var j in this )
        if( typeof this[j] == "function" && j != "initialize" )
          _super[j] = this[j];

      return _super;
    };
  }
}