
module.exports = ProtoList

function ProtoList () {
  this.list = []
  var root = null
  Object.defineProperty(this, 'root', {
    get: function () { return root },
    set: function (r) {
      root = r
      if (this.list.length) {
        this.list[this.list.length - 1].__proto__ = r
      }
    },
    enumerable: true,
    configurable: true
  })
}

ProtoList.prototype =
  { get length () { return this.list.length }
  , get keys () {
      var k = []
      for (var i in this.list[0]) k.push(i)
      return k
    }
  , get snapshot () {
      var o = {}
      this.keys.forEach(function (k) { o[k] = this.get(k) }, this)
      return o
    }
  , get store () {
      return this.list[0]
    }
  , push : function (obj) {
      if (typeof obj !== "object") obj = {valueOf:obj}
      if (this.list.length >= 1) {
        this.list[this.list.length - 1].__proto__ = obj
      }
      obj.__proto__ = this.root
      return this.list.push(obj)
    }
  , pop : function () {
      if (this.list.length >= 2) {
        this.list[this.list.length - 2].__proto__ = this.root
      }
      return this.list.pop()
    }
  , unshift : function (obj) {
      obj.__proto__ = this.list[0] || this.root
      return this.list.unshift(obj)
    }
  , shift : function () {
      if (this.list.length >= 1) {
        this.list[0].__proto__ = this.root
      }
      return this.list.shift()
    }
  , get : function (key) {
      return this.list[0][key]
    }
  , set : function (key, val, save) {
      if (!this.length) this.push({})
      if (save && this.list[0].hasOwnProperty(key)) this.push({})
      return this.list[0][key] = val
    }
  , forEach : function (fn, thisp) {
      for (var key in this.list[0]) fn.call(thisp, key, this.list[0][key])
    }
  , slice : function () {
      return this.list.slice.apply(this.list, arguments)
    }
  , splice : function () {
      // handle injections
      var ret = this.list.splice.apply(this.list, arguments)
      for (var i = 0, l = this.list.length; i < l; i++) {
        this.list[i].__proto__ = this.list[i + 1] || this.root
      }
      return ret
    }
  }
