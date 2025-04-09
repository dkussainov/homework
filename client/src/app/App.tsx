import { ApolloProvider } from "./providers/ApolloProvider";
import UsersPage from "../pages/users/UsersPage";

const App = () => {
  return (
    <ApolloProvider>
      <UsersPage />
    </ApolloProvider>
  );
};

export default App;
