var Store = function() {
   this.updates = { value: null };
   this.subscribers = [];
};

Store.prototype = {
   subscribe: function(callback) {
      if (this.subscribers.length === 0 && this.onFirstIn !== undefined) {
         this.onFirstIn();
      }
      this.subscribers.push(callback);
   },
   unsubscribe: function(callback) {
      for (var i = 0; i < this.subscribers.length; i++) {
         if (callback === this.subscribers[i]) {
            this.subscribers.splice(i, 1);
         }
      }
      // if our callback is
      if (Rx && Rx.Observer && callback instanceof Rx.Observer) {
         callback.dispose();
      }
      if (this.subscribers.length === 0 && this.onLastOut !== undefined) {
         this.onLastOut();
      }
   },
   notify: function() {
      for (var i = 0; i < this.subscribers.length; i++) {
         this.subscribers[i](this.updates.value);
      }
   }
};

export default {
   Store: Store
};
