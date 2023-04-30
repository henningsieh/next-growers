import "~/styles/globals.css";

import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* // FUTURE BANNERS GO HERE!! */}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
