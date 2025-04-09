import { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloClientProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
  );
};
