var Extend = "extends";

/**
 * Returns a class definition
 * @param {string} [fnName=Object] - Name for your class (this will output in console when debugging an instance of a class)
 * @param {string} [operation] - Operation to perform {extend(s)}
 * @param {class} [related] - Related class; for operation: extend, this is the parent
 * @param {function} - The class constructor
 */
var Class = function( fnName, operation, related, func ) {
  var a = arguments;
  var name = a[0],
      operation = a[1],
      parent = a[2],
      fn = a[a.length - 1], // last argument
      isExtend,
      ret; // the return

  // optional name not given //
  if( typeof name != "string" ) {
    name = "Object";
    operation = a[0];
    parent = a[1];
  }

  isExtend = ( typeof operation == "string" && (operation.toLowerCase() == "extends" || operation.toLowerCase() == "extend") ) ? true : false;

  var createClass = function(c, ext, isExtend) {
    var cls = new Function('c', 'ext', 'isExtend',                   // http://stackoverflow.com/a/9947842
      "return function " + fnName + "(){" +
        "if( isExtend )" +
          "ext.apply(this, arguments);" +
        "return c.apply(this, arguments);" +
      "}"
    )(c, ext, isExtend);
    if( isExtend )
      cls.prototype = Object.create( ext.prototype );
    cls.prototype.constructor = cls;
    return cls;
  };

  ret = createClass(fn, parent, isExtend);

  if( isExtend ) {
    ret.prototype._super = function() {
      var s = new parent();
      for( var i in s )
        if( typeof s[i] == 'function' )
          s[i] = s[i].bind(this);
      return s;
    };
  }

  return ret;
};