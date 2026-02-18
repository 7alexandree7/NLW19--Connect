import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getSubscriberInviteClick } from '../functions/get-subscriber-invite-click'
import { z } from 'zod'


export const getSubscriberInviteClicksRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/subscribers/:subscriberId/ranking/clicks',
    {
      schema: {
        summary: 'Get subscriber invite link',
        tags: ['referral'],
        params: z.object({
            subscriberId: z.string(),
        }),
        response: {
            200: z.object({
                subscriberId: z.string(),
                count: z.number(),
            }),
          },
        },
      },

    async (request) => {

        const { subscriberId } = request.params

        return await getSubscriberInviteClick({ subscriberId})
    },
  )
}
