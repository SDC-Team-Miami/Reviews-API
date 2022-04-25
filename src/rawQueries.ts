export const getReviewQuery = (productId: string): string =>
  `SELECT row_to_json(t)FROM(SELECT id AS review_id,rating,summary,recommend,response,body,datetime AS date,reviewer_name,helpfulness,(SELECT json_agg(t)FROM(SELECT id,url FROM photo WHERE photo.review_id=review.id)t)AS photos FROM review WHERE product_id=${productId})t;`;
