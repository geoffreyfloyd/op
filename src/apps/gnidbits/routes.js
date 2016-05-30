
import Comic from './ui/comic';
import strips from './ui/comic/strips';

export const ComicRoute = {
   path: '/feeds/:id',
   action: async (state) => {
      state.context.onSetTitle(state.params.id);
      var content = strips[state.params.id];
      var props = {};
      if (!content) {
         props.index = strips;
      }
      else {
         props.content = content;
      }
      return <Comic {...props} />;
   }
};

export const ComicsRoute = {
   path: '/feeds',
   action: async (state) => {
      state.context.onSetTitle('Feeds');
      return <Comic index={strips} />;
   }
};
