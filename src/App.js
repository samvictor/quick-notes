import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Amplify, { Analytics, Storage, API, graphqlOperation, Auth} from 'aws-amplify';
import { Authenticator } from "aws-amplify-react";
import styled from "@emotion/styled";

import awsExports from "./aws-exports";
import Screens from "./components/Screens";
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

Amplify.configure(awsExports);

const Title = styled("h1")`
  text-align: center;
  text-transform: uppercase;
  color: #a7d7c5;
  margin-bottom: 8px;
`;

const theme = {
  formContainer: {
    margin: 0,
    padding: "8px 24px 24px"
  },
  formSection: {
    backgroundColor: "#ffffff",
    borderRadius: "4px"
  },
  sectionHeader: {
    color: "#74b49b"
  },
  sectionFooterSecondaryContent: {
    color: "#303952"
  },
  inputLabel: {
    color: "#74b49b"
  },
  input: {
    backgroundColor: "#f4f9f4",
    color: "#74b49b"
  },
  hint: {
    color: "#74b49b"
  },
  button: {
    borderRadius: "3px",
    backgroundColor: "#a7d7c5"
  },
  a: {
    color: "#a7d7c5"
  }
};

function App() {
  const [state, setState] = useState({ isLoggedIn: false, user: null });

  const checkLoggedIn = () => {
    Auth.currentAuthenticatedUser()
      .then(data => {
        const user = { username: data.username, ...data.attributes };
        setState({ isLoggedIn: true, user });
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return state.isLoggedIn ? (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/user/sam">User</Link>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/user/:username">
            <User />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        
        <div>version 0.1</div>
      </div>
    </Router>
  ) : (
    <div>
      <Title>Quick Notes</Title>
      <Authenticator
        onStateChange={authState => {
          if (authState === "signedIn") {
            checkLoggedIn();
          }
        }}
        amplifyConfig={awsExports}
        theme={theme}
      />
    </div>
  );
}

const create_example_post = async () => {
    const post_details = {
      input: {
        title: 'Party tonight!',
        text: 'Amplify CLI rocks!'
      },
    };

    //const newTodo = await API.graphql(graphqlOperation(mutations.createTodo, todoDetails));
    console.log(await API.graphql(graphqlOperation(queries.listNotes, {input: {owner: 'me'}})));
    //alert(JSON.stringify(newTodo));
  };
  
function Home() {
  return (
    <div>
      <h2>Home</h2>
      <div>create post</div>
      <button onClick={create_example_post}>example post</button>
      <div>extisting posts</div>
    </div>
  );
  
}

function User() {
  const {username} = useParams();
  return (
    <div>
      <h2>{username}</h2>
      <div>description</div>
      <div>calendar</div>
      <div>edit calendar</div>
      <div>new post</div>
      <div>posts</div>
    </div>  
  );
}



export default App;
