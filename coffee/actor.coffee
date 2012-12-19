assert = chai.assert

# use syn everywhere possible because its most like real user input
window.actor = class actor # act with asynchronous assertion
  constructor: ->
    @async = new async
    @max_ms = 0
  after: (ms) ->
    @async.serial ->
      delay ms, @

  do: (cb) ->
    @async.serial =>
      done = arguments[arguments.length-1]
      if typeof cb is 'function' and cb.length is 1
        cb done
      else
        cb()
        done()
    @
  within: ->
    args = arguments
    @async.serial =>
      done = arguments[arguments.length-1]
      switch args.length
        when 1
          @max_ms = args[0]
          done()
        when 2
          @max_ms = args[1] - args[0]
          delay args[0], done
    @
  _wait_until: (human_test, test, cb) ->
    max_ms = @max_ms
    @max_ms = 0
    interval = 250
    total_ms = interval * -1
    async.whilst (-> total_ms += interval; not test() and total_ms <= max_ms ),
      ((cb)-> setTimeout cb, interval ), =>
        if total_ms <= max_ms
          console.log "#{human_test()} within #{total_ms}ms"
          cb()
        else
          cb assert false, "expected #{human_test()} within #{max_ms}ms."
    @
  _find: (e, cb) ->
    _e = []
    @_wait_until (-> "#{e} to appear"),
      (-> (_e = browser.find(e).filter(':visible')).length),
      ((err) -> cb err, _e)
    @
  read: (e, text) ->
    @async.serial =>
      done = arguments[arguments.length-1]
      #Debugger.log ["actor will now read \"#{text}\" from ", e]
      browser_text = undefined
      @_wait_until (-> "\"#{browser_text}\" to equal \"#{text}\""),
        (-> e = browser.find(e); (browser_text = e[if e.is('input, select') then 'val' else 'text']().toString()) is text.toString()),
        done
    @
  click: (e) ->
    @async.serial =>
      done = arguments[arguments.length-1]
      #Debugger.log ["actor will now click on ", e]
      @_find e, (err, e) =>
        done err if err
        Syn.click {}, e, -> done()
    @
  drag: (e, coords) ->
    @async.serial =>
      done = arguments[arguments.length-1]
      #Debugger.log ["actor will now drag #{coords} ", e]
      @_find e, (err, e) =>
        done err if err
        Syn.drag coords, e, -> done()
    @
  type: (e, keys) ->
    @async.serial =>
      done = arguments[arguments.length-1]
      #Debugger.log ["actor will now type \"#{keys}\" in ", e]
      @_find e, (err, e) =>
        done err if err
        Syn.type keys.toString(), e, -> done()
    @
  fill: (e, keys) ->
    @type e, '[ctrl]a[ctrl-up]' + keys
  select: (select, value) ->
    @async.serial (result, done) =>
      #Debugger.log ["actor will now select \"#{value}\" from ", select]
      @_find select, (err, select) =>
        done err if err
        browser.select select, value
        text = select.find('option:selected').text()
        if value is text
          assert.equal value, text
        else
          assert.equal value, select.val()
        done()
    @
  finally: (done) ->
    @async.finally done
