export const getReviewQuery = (productId: string): string =>
  `SELECT id AS review_id,rating,summary,recommend,response,body,date,reviewer_name,helpfulness,json_object_agg('photos',ARRAY(SELECT json_build_object('id',photo.id,'url',photo.url)FROM photo WHERE review.id=photo.review_id GROUP BY photo.id,photo.url))FROM review WHERE product_id=${productId} AND reported=FALSE GROUP BY id;`;
