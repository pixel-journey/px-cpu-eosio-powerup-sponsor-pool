import { Session } from "@wharfkit/session";

const CONTRACT = "replaceaccount";

export async function claimCpu(session: Session) {
  return session.transact({
    actions: [
      {
        account: CONTRACT,
        name: "claimcpu",
        authorization: [session.permissionLevel],
        data: { user: session.actor },
      },
    ],
  });
}
