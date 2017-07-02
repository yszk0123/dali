import path from 'path';
import express from 'express';
import expressHttpProxy from 'express-http-proxy';
import favicon from 'serve-favicon';
import serverConfig from '../../shared/config/serverConfig';

export default async function bootstrapAppServer() {
  const { appPort, graphQLPort } = serverConfig;
  const app = express();

  app.use(
    favicon(
      path.join(__dirname, '..', '..', '..', '..', 'public', 'favicon.ico'),
    ),
  );
  app.use('/graphql', expressHttpProxy(`http://localhost:${graphQLPort}`));
  app.use(express.static(path.join(__dirname, '..', '..', '..', '..', 'dist')));
  app.listen(appPort, () => {
    console.log(`App is now running on http://localhost:${appPort}`);
  });
}
