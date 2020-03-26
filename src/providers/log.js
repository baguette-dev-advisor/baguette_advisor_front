export default {
  error: function error(ctx, payload) {
   console.warn(ctx + ': ' + payload + ' ' + JSON.stringify(payload));
  }
};
