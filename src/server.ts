import express from 'express';
import morgan from 'morgan';
import sequelize from './db';
import 'dotenv/config'

const app = express();

const getTables = "SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';"

app.use(morgan('dev'));
app.get('/', (req: express.Request, res: express.Response) => {
    sequelize.query(getTables)
        .then((result) => {
            res.send(result);
        })
        .catch(err => console.log(err));
})

app.listen(8000, () => {
    console.log('listening on 8000');
})