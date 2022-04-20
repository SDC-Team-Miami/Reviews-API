import express from 'express';
import morgan from 'morgan';
import sequelize from './db';

const app = express();

app.use(morgan('dev'));


app.get('/reviews', (req: express.Request, res: express.Response) => {
    const getReviews = `SELECT * FROM reviews LIMIT 10 OFFSET 10;`;

    sequelize.query(getReviews)
        .then((result) => {
            res.send(result);
        })
        .catch(err => console.log(err));
})

app.listen(8000, () => {
    console.log('listening on 8000');
})