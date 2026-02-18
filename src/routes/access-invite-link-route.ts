import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/access-invite-link'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Acces inite link and redirects user',
        tags: ['referals'],
        description: 'Subscribe to an event',
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.any(),
        },
      },
    },

    async (request, reply) => {

      const { subscriberId } = request.params
      await accessInviteLink({ subscriberId })

      const url = new URL(env.WEB_URL)
      url.searchParams.set("referrer", subscriberId)

      return reply.redirect(url.toString(), 302)
      // 302 redirect code temporario

    },
  )
}