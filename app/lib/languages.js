export default {
  keys: function(){
    var keys = [];
    for(var language in this.content) {
      keys.push(language);
    }

    return keys;
  },
  values: function(){
    var values = [];
    for(var language in this.content) {
      values.push(this.content[language]);
    }

    return values;
  },
  content: {
    "English": "eng",
    "Swedish": "swe",
    "None": null
  }
};