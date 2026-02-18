import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getSubscriberInviteLink } from '../functions/get-subscriber-invite-link'
import { z } from 'zod'


export const getSubscriberInviteLinkRoute: FastifyPluginAsyncZod = async app => {
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

        return await getSubscriberInviteLink({ subscriberId})
    },
  )
}
