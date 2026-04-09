import { Router, type NextFunction, type Request, type Response } from 'express';

const homeRouter = Router();

homeRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/home', { title: 'Members Only', user: req.user, path: '/' });
});

export default homeRouter;
