import React from 'react'
import ReactDOM from 'react-dom'
import Login from './pages/login'
import {HashRouter, Routes, Route} from "react-router-dom";
import Console, { routes } from "./components/Console";
import './main.less'
import 'tdesign-react/es/style/index.css'; // 少量公共样式
import ThirdToken from "./pages/thirdToken";
import ThirdMessage from "./pages/thirdMessage";
import AuthorizedAccount from "./pages/authorizedAccount";
import SystemVersion from "./pages/systemVersion";
import PasswordManage from "./pages/passwordManage";
import AuthPageManage from "./pages/authPageManage";
import AuthPage from "./pages/authPage";
import AuthPageH5 from "./pages/authPageH5";

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path={routes.login.path} element={<Login />} />
                <Route path={routes.authorize.path} element={<AuthPage />} />
                <Route path={routes.authorizeH5.path} element={<AuthPageH5 />} />
                <Route path={"/"} element={<Console />}>
                    <Route path={routes.thirdToken.path} element={<ThirdToken />} />
                    <Route path={routes.thirdMessage.path} element={<ThirdMessage />} />
                    <Route path={routes.authorizedAccountManage.path} element={<AuthorizedAccount />} />
                    <Route path={routes.systemVersion.path} element={<SystemVersion />} />
                    <Route path={routes.passwordManage.path} element={<PasswordManage />} />
                    <Route path={routes.authPageManage.path} element={<AuthPageManage />} />
                </Route>
            </Routes>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
