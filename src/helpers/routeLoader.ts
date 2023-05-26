import { useEffect, useState } from "react";

import Router from "next/router";

export function useRouteLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      console.log("isLoading", url);
      if (!url.includes("/update/")) {
        setIsLoading(true);
      }
    };
    const handleRouteChangeComplete = () => setIsLoading(false);
    const handleRouteChangeError = () => setIsLoading(false);

    Router.events.on(
      "routeChangeStart",
      handleRouteChangeStart
    );
    Router.events.on(
      "routeChangeComplete",
      handleRouteChangeComplete
    );
    Router.events.on(
      "routeChangeError",
      handleRouteChangeError
    );

    return () => {
      Router.events.off(
        "routeChangeStart",
        handleRouteChangeStart
      );
      Router.events.off(
        "routeChangeComplete",
        handleRouteChangeComplete
      );
      Router.events.off(
        "routeChangeError",
        handleRouteChangeError
      );
    };
  }, []);

  return isLoading;
}
