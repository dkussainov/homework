import { ApolloProvider } from "./providers/ApolloProvider";
import UsersPage from "../pages/users/UsersPage";
import "@ant-design/v5-patch-for-react-19";

const App = () => {
  return (
    <ApolloProvider>
      <UsersPage />
    </ApolloProvider>
  );
};

export default App;
