import LFSerializer from 'ember-localforage-adapter/serializers/localforage';

export default LFSerializer.extend(
  DS.EmbeddedRecordsMixin, {
    attrs: {
      magnets: { embedded: "always" }
    }
  }
);