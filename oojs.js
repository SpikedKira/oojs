var extens = "extends";
function Class(child, operation, parent, fn) {
  var name = child.name || child;
  var childfn = fn || (typeof operation == "function" ? operation : child);
  this[name] = childfn;

  if( operation == "extends" && parent != undefined ) {
    this[name].prototype = Object.create( parent.prototype );
    this[name].prototype._super = parent;

    var sc = new Array();
    if( parent.prototype._superChain )
      sc = parent.prototype._superChain.slice(0);
    sc.push(parent);
    this[name].prototype._superChain = sc;
    console.log("setting super chain " + sc.length + " :: " + sc);

    this[name].prototype.initialize = function(args) {
      if( this.initializing ) return;
      this.initializing = true;

      this._super = {};

      var scl = this._superChain.length;
      for( var i = 0; i < scl; i++ ) {
        this._superChain[i].apply(this, args);
        for( var j in this )
          if( typeof this[j] == "function" && j != "initialize" ) {
            console.log("saving super function: " + this[j]);
            this._super[j] = this[j]; // this gives only 1 level up for functional calling
          }
      }
      //parent.apply(this, args); // recursion loop occurs here if we don't set a flag

      this.initializing = false;
    };
  }
}