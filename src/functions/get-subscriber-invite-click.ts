import { redis } from "../redis/client";

interface GetSubscriberInviteLinkParams {
    subscriberId: string;
}

export async function getSubscriberInviteClick({subscriberId }: GetSubscriberInviteLinkParams)  {

    const count = await redis.hget("referral:access-count", subscriberId)

    return {
        subscriberId,
        count: count ? parseInt(count) : 0
    }
}