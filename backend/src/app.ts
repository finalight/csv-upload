import { join } from 'node:path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import fastify, { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Register the multipart plugin
  await fastify.register(require('@fastify/multipart'))

  await fastify.register(cors, {
    origin: '*'
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
};

function build(opts={}) {
  const fastifyInstance = fastify(opts);
  const buildApp = fastifyInstance.register(app, opts);

  return buildApp
}



export default app;
export { app, options, build }
