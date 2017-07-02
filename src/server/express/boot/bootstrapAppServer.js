import path from 'path';
import express from 'express';
import expressHttpProxy from 'express-http-proxy';
import fallback from 'express-history-api-fallback';
import favicon from 'serve-favicon';
import serverConfig from '../../shared/config/serverConfig';

export default async function bootstrapAppServer() {
  const { appPort, graphQLPort } = serverConfig;
  const app = express();
  const rootDir = path.join(__dirname, '..', '..', '..', '..');
  const distDir = path.join(rootDir, 'dist');
  const publicDir = path.join(rootDir, 'public');

  app.use(favicon(path.join(publicDir, 'favicon.ico')));
  app.use('/graphql', expressHttpProxy(`http://localhost:${graphQLPort}`));
  app.use(express.static(distDir));
  app.use(fallback('index.html', { root: distDir }));
  app.listen(appPort, () => {
    console.log(`App is now running on http://localhost:${appPort}`);
  });
}
