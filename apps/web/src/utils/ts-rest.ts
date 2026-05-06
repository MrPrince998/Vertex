import { QueryClient } from "@tanstack/react-query";
import { initClient, tsRestFetchApi } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@Vextro/api/index";
import { env } from "@Vextro/env/web";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
    },
  },
});

const clientArgs = {
  baseUrl: `${env.NEXT_PUBLIC_SERVER_URL}/rest`,
  baseHeaders: {},
  api: tsRestFetchApi,
};

const client = initClient(contract, clientArgs);

export const tsr = initTsrReactQuery(contract, clientArgs);
