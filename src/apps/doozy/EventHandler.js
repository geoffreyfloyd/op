var Rx = require('rx-lite');

module.exports = {
   create: function create () {
      function subject (value) {
            subject.onNext(value);
      }

      /* eslint-disable guard-for-in */
      for (var key in Rx.Subject.prototype) {
            subject[key] = Rx.Subject.prototype[key];
      }
      /* eslint-enable guard-for-in */

      Rx.Subject.call(subject);

      return subject;
   }
};
