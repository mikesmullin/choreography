var actor, assert;

assert = chai.assert;

window.actor = actor = (function() {

  function actor() {
    this.async = new async;
    this.max_ms = 0;
  }

  actor.prototype.after = function(ms) {
    return this.async.serial(function() {
      return delay(ms, this);
    });
  };

  actor.prototype["do"] = function(cb) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      if (typeof cb === 'function' && cb.length === 1) {
        return cb(done);
      } else {
        cb();
        return done();
      }
    });
    return this;
  };

  actor.prototype.within = function() {
    var args,
      _this = this;
    args = arguments;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      switch (args.length) {
        case 1:
          _this.max_ms = args[0];
          return done();
        case 2:
          _this.max_ms = args[1] - args[0];
          return delay(args[0], done);
      }
    });
    return this;
  };

  actor.prototype._wait_until = function(human_test, test, cb) {
    var interval, max_ms, total_ms,
      _this = this;
    max_ms = this.max_ms;
    this.max_ms = 0;
    interval = 250;
    total_ms = interval * -1;
    async.whilst((function() {
      total_ms += interval;
      return !test() && total_ms <= max_ms;
    }), (function(cb) {
      return setTimeout(cb, interval);
    }), function() {
      if (total_ms <= max_ms) {
        console.log("" + (human_test()) + " within " + total_ms + "ms");
        return cb();
      } else {
        return cb(assert(false, "expected " + (human_test()) + " within " + max_ms + "ms."));
      }
    });
    return this;
  };

  actor.prototype._find = function(e, cb) {
    var _e;
    _e = [];
    this._wait_until((function() {
      return "" + e + " to appear";
    }), (function() {
      return (_e = browser.find(e).filter(':visible')).length;
    }), (function(err) {
      return cb(err, _e);
    }));
    return this;
  };

  actor.prototype.read = function(e, text) {
    var _this = this;
    this.async.serial(function() {
      var browser_text, done;
      done = arguments[arguments.length - 1];
      browser_text = void 0;
      return _this._wait_until((function() {
        return "\"" + browser_text + "\" to equal \"" + text + "\"";
      }), (function() {
        e = browser.find(e).filter(':visible');
        return (browser_text = e[e.is('input, select') ? 'val' : 'text']().toString()) === text.toString();
      }), done);
    });
    return this;
  };

  actor.prototype.expects_element_to_be = function(e) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      return _this._wait_until((function() {
        return "" + e + " expect to exists in the dom";
      }), (function() {
        var _e;
        return _e = browser.find(e).filter(':visible').length;
      }), done);
    });
    return this;
  };

  actor.prototype.click = function(e) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      return _this._find(e, function(err, e) {
        if (err) {
          done(err);
        }
        return Syn.click({}, e, function() {
          return done();
        });
      });
    });
    return this;
  };

  actor.prototype.moveBw = function(a, b) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      return _this._find(a, function(err, a) {
        if (err) {
          done(err);
        }
        return Syn.move({
          to: b
        }, a, function() {
          return done();
        });
      });
    });
    return this;
  };

  actor.prototype.drag = function(e, coords) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      return _this._find(e, function(err, e) {
        if (err) {
          done(err);
        }
        return Syn.drag(coords, e, function() {
          return done();
        });
      });
    });
    return this;
  };

  actor.prototype.type = function(e, keys) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      return _this._find(e, function(err, e) {
        if (err) {
          done(err);
        }
        return Syn.type(keys.toString(), e, function() {
          return done();
        });
      });
    });
    return this;
  };

  actor.prototype.fill = function(e, keys) {
    return this.type(e, '[ctrl]a[ctrl-up]' + keys);
  };

  actor.prototype.select = function(select, value) {
    var _this = this;
    this.async.serial(function() {
      var done;
      done = arguments[arguments.length - 1];
      return _this._find(select, function(err, select) {
        var text;
        if (err) {
          done(err);
        }
        browser.select(select, value);
        text = select.find('option:selected').text();
        if (value === text) {
          assert.equal(value, text);
        } else {
          assert.equal(value, select.val());
        }
        return done();
      });
    });
    return this;
  };

  actor.prototype["finally"] = function(done) {
    return this.async["finally"](done);
  };

  return actor;

})();
