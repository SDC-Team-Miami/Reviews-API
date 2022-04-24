exports.randomReviewId = (requestParams, context, ee, next) => {
  context.vars.reviewId = Math.floor(Math.random() * 5774971);
  return next();
};
exports.randomProductId = (requestParams, context, ee, next) => {
  context.vars.productId = Math.floor(Math.random() * 1000011);
  return next();
};
