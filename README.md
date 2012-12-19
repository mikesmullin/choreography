# Choreography

As seen on [YouTube](http://www.youtube.com/watch?v=QGy2ItNo7rI).

Inspired by [Selenium](http://seleniumhq.org/),
 [Capybara](https://github.com/jnicklas/capybara),
 [Zombie.js](http://zombie.labnotes.org/),
 [Jasmine](http://pivotal.github.com/jasmine/),
 [Mocha](http://visionmedia.github.com/mocha/),
 [Chai](http://chaijs.com/) and
 [Syn.js](http://cloud.github.com/downloads/bitovi/syn/syn.js).


## Installation

```bash
npm install choreography
```

## Using the Recorder
```bash
# symlink the static html+js assets to a public-facing
# subdirectory within your application
ln -s node_modules/choreography public/test
# then browse to the demo recorder
# replace /debug/slides with the actual url of your app you want to test
# note that it must be on the same domain and port for security reasons
google-chrome http://localhost:3000/test/recorder.html#/debug/slides
```

## Using the Integration Tester

Make a view like this (haml example):

```haml
- content_for :head do
  = stylesheet_link_tag "test/suite", :media => 'all'
  = javascript_include_tag "test/suite"

#mocha

= javascript_include_tag "test/specs"
```

The `test/suite` stylesheet just includes the mocha styles (example in scss+sprockets)
```sass
//= require node_modules/choreography/node_modules/mocha/mocha
```

The `test/suite` javascript looks like this (coffee+sprockets):
```coffeescript
#= require node_modules/choreography/node_modules/mocha/mocha
#= require node_modules/choreography/node_modules/chai/chai
#= require node_modules/choreography/node_modules/async2/coffee/async2
#= require node_modules/choreography/vendor/syn
#= require_self

mocha.setup
  ui: 'bdd'
  timeout: 1000*60*5 # 5 min
  globals: [
    'csrf_token'
    'csrf_param'
    'frame'
    'move'
    '__synthTest'
    '__screenCapturePageContext__'
  ]
```

The `test/specs` javascript looks like this (coffee+sprockets):
```coffeescript
#= require node_modules/choreography/coffee/actor
#= require node_modules/choreography/coffee/browser
#= require_tree ./mock/
#= require_tree ./unit/
#= require_tree ./integration/
#= require_self

mocha.run()
```

Where the `./integration/` folder contains a bunch of `*_spec.js` files 
which get aggregated together by those sprockets directives into that 
single `specs.js` file.

Inside each spec is a mocha test which looks like this (in coffee);
```coffeescript
assert = chai.assert
window.frame = undefined

describe 'Slides', ->

  beforeEach (done) ->
    jQuery('iframe[name=iframe-fixtures]').remove()
    jQuery('body').append(jQuery(
      '<iframe name="iframe-fixtures" name="fixtures" style="width:98%;height:50%;position:fixed;left:1%;bottom:0;border:none;border-top:3px double #333"/>')
      .load(->
        window.frame = window.frames['iframe-fixtures']
        done()
      )
      .attr('src', '/debug/slides')
    ).css('padding-bottom', jQuery('iframe[name=iframe-fixtures]').height()+20+'px')

    it 'can complete blue slider sliide', (done) ->
      (new actor)
        .select('#slides', 'modules/01/_11e')
        .read('h2#slide-title', 'Are you listening?')
        .within(20000).drag('div.handle-blue:eq(0)', '724X143')
        .within(10000).drag('div.handle-blue:eq(1)', '731X220')
        .within(10000).drag('div.handle-blue:eq(2)', '616X328')
        .within(20000).click('button.button-green-ok')
        .finally(done)
```

Where `/debug/slides` again is the url you want to test in the iframe.

Of course, that's a lot of setup. Will improve with time.


## Useful documentation

[Syn.js API Reference](http://v3.javascriptmvc.com/docs/api.html#&who=Syn)

Syn is the library that powers the click, drag, keystroke recording and playback.

[Zombie.js Browser API Reference](http://zombie.labnotes.org/API)

Our Browser class sort of resembles the one from zombie.js.


## Credits

* [Syn.js](https://github.com/bitovi/syn) is a dependency provided by [JavascriptMVC](http://javascriptmvc.com). I cannot tell how it is licensed.
