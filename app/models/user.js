export default DS.Model.extend({
  accessToken: DS.attr('string'),
  expiresAt: DS.attr('string'),
  refreshToken: DS.attr('string')
});