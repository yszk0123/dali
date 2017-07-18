import path from 'path';
import express from 'express';
import expressHttpProxy from 'express-http-proxy';
import fallback from 'express-history-api-fallback';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import serverConfig from '../../shared/config/serverConfig';

export default async function bootstrapAppServer() {
  const { appPort, graphQLPort } = serverConfig;
  const app = express();
  const rootDir = path.join(__dirname, '..', '..', '..', '..');
  const publicDir = path.join(rootDir, 'dist', 'public');

  app.use(morgan('combined'));
  app.use(favicon(path.join(publicDir, 'favicon.ico')));
  app.use('/graphql', expressHttpProxy(`http://localhost:${graphQLPort}`));
  app.use(express.static(publicDir));
  app.use(fallback('index.html', { root: publicDir }));
  app.listen(appPort, () => {
    console.log(`App is now running on http://localhost:${appPort}`);
  });
}
