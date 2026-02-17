import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'

export const subscribeToEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'Subscribe to an event',
        tags: ['Subscription'],
        description: 'Subscribe to an event',
        body: z.object({
          name: z.string(),
          email: z.email(),
        }),
        response: {
          201: z.object({
            name: z.string(),
            email: z.email(),
            subscriberId: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {

      const { name, email } = request.body
      const {subscriberId } = await subscribeToEvent({name, email})

      return reply.status(201).send({ name, email, subscriberId })
    },
  )
}
