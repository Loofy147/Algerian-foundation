import express from 'express';
import config from './config';
import api from './api';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

app.use(express.json());
app.use('/api', api);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
