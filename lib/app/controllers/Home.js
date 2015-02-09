module.exports = function *() {

  yield this.render("index", {
    title: "Test Page",
    name: "World"
  });
};