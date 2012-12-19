window.browser = browser =
  find: (e) ->
    frame.jQuery(e)
  exists: (e) ->
    assert.true (e = browser.find(e)).length > 0
    e
  text: (e) ->
    @find(e).text()
  select: (select, value) ->
    @find(select).val(browser.find(select).find("option[value='#{value}'], option:contains('#{value}')").first().val()).change()
