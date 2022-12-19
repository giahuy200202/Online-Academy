import express from 'express';
import handlebars from 'express-handlebars';
import mongoSanitize from 'express-mongo-sanitize';
import bodyParser from 'body-parser';
import HomeRoutes from './routes/HomeRoutes.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.engine('.hbs', handlebars.engine({ defaultLayout: 'default', extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', HomeRoutes);

export default app;