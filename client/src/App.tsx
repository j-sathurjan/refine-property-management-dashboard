import React from 'react';
import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";
import{
  AccountCircleOutlined,
  ChatBubbleOutlined,
  Dashboard,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,

}from "@mui/icons-material"

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";

import { 
  Login,
  Home,
  Agents,
  MyProfile,
  PropertyDetails,
  AllProperties,
  CreateProperty,
  AgentProfile,
  EditProperty,
 } from "./pages";
import { parseJwt } from "./utils/parse-jwt";
import allProperties from "./pages/all-properties";


const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      //save user to MongoDB
      if(profileObj){
        const response = await fetch('http://localhost:8080/api/v1/users',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            name:profileObj.name,
            email:profileObj.email,
            avatar:profileObj.picture,
          })
        })

        const data = await response.json();
        if(response.status===200){
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            })
          );
        }else{
          return Promise.reject();
        }
        
      }

      if (profileObj) {
        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("http://localhost:8080/api/v1")}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                DashboardPage={Home}
                resources={[
                  {
                    name: "properties",
                    icon: <VillaOutlined/>,
                    list: AllProperties,
                    show: PropertyDetails,
                    create: CreateProperty,
                    edit: EditProperty,
                  },
                  {
                    name: "agents",
                    list: Agents,
                    show: AgentProfile,
                    meta: {
                      canDelete: true,
                      icon: <PeopleAltOutlined/>
                    },
                  },
                  {
                    name: "review",
                    icon: <StarOutlineRounded/>,
                    list: "/review",
                    create: "/review/create",
                    edit: "/review/edit/:id",
                    show: "/review/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "message",
                    icon: <ChatBubbleOutlined/>,
                    list: "/message",
                    create: "/message/create",
                    edit: "/message/edit/:id",
                    show: "/message/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "my-profile",
                    icon: <AccountCircleOutlined/>,
                    options:{label:'My Profile'},
                    list: MyProfile,
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "omd6FW-6QGob3-GoEYco",
                }}
                
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2 Header={Header}>
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource='home'/>}
                    />
                    <Route path="">
                      <Route index element={<Home/>} />
                    </Route>
                    <Route path="/properties">
                      <Route index element={<AllProperties />} />
                      <Route path="create" element={<CreateProperty />} />
                      <Route path="edit/:id" element={<EditProperty />} />
                      <Route path="show/:id" element={<PropertyDetails />} />
                    </Route>
                    <Route path="/agents">
                      <Route index element={<Agents/>} />
                      <Route path="show/:id" element={<AgentProfile />} />
                    </Route>
                    <Route path="/review">
                      <Route index element={<Home/>} />
                      <Route path="show/:id" element={<AgentProfile />} />
                    </Route>
                    <Route path="/message">
                      <Route index element={<Home/>} />
                      <Route path="show/:id" element={<AgentProfile />} />
                    </Route>
                    <Route path="/my-profile">
                      <Route index element={<MyProfile/>} />
                      <Route path="show/:id" element={<AgentProfile />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
