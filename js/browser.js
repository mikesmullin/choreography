var browser;

window.browser = browser = {
  find: function(e) {
    return frame.jQuery(e);
  },
  exists: function(e) {
    assert["true"]((e = browser.find(e)).length > 0);
    return e;
  },
  text: function(e) {
    return this.find(e).text();
  },
  select: function(select, value) {
    return this.find(select).val(browser.find(select).find("option[value='" + value + "'], option:contains('" + value + "')").first().val()).change();
  }
};
