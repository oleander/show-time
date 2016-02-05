export default DS.Model.extend({
  href: DS.attr("string"),
  hash: DS.attr("string"),
  title: DS.attr("string"),
  episode: DS.belongsTo("episode"),
  valid: DS.attr("boolean"),
  seeders: DS.attr("number"),
});