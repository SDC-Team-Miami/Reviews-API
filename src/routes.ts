import { Router, Request, Response } from "express";

const router = Router();
// routes
router.get("/reviews", (req: Request, res: Response) => {
  res.status(200);
});

router.get("/reviews/meta", (req: Request, res: Response) => {
  res.status(200);
});

router.post("/reviews/", (req: Request, res: Response) => {
  res.status(201);
});
router.put("/reviews/:reviewId/helpful", (req: Request, res: Response) => {
  res.status(204);
});
router.put("/reviews/:reviewId/report", (req: Request, res: Response) => {
  res.status(204);
});

export default router;
