import React, {useEffect, useMemo, useState} from 'react'
import styles from './index.module.less'
import Menu from '../Menu'
import {Outlet, useNavigate, useLocation, Link} from "react-router-dom";
import * as Icon from 'tdesign-icons-react'
import {Dropdown, Dialog} from 'tdesign-react';
import {checkLogin, initNav, logout} from "../../utils/login";

export const routes = {
    thirdToken: {
        label: '第三方 Token',
        path: '/token'
    },
    thirdMessage: {
        label: '第三方消息查看',
        path: '/message'
    },
    authorizedAccountManage: {
        label: '授权帐号管理',
        path: '/authorizedAccount'
    },
    authPageManage: {
        label: '授权页管理',
        path: '/authPageManage'
    },
    passwordManage: {
        label: 'Secret与密码管理',
        path: '/passwordManage'
    },
    systemVersion: {
        label: '系统版本',
        path: '/systemVersion'
    },
    login: {
        label: '登录',
        path: '/login'
    },
    authorize: {
        label: '授权页',
        path: '/authorize'
    },
    authorizeH5: {
        label: '授权页H5',
        path: '/authorizeH5'
    }
}

type IMenuItem = {
    label: string
    path: string
}[]

const menuList: {
    label: string
    icon: JSX.Element
    path?: string
    item?: IMenuItem
}[] = [{
    label: '开发管理',
    icon: <Icon.HomeIcon />,
    item: [routes.thirdToken, routes.thirdMessage]
}, {
    ...routes.authorizedAccountManage,
    icon: <Icon.UsergroupAddIcon />,
}, {
    label: '系统管理',
    icon: <Icon.SettingIcon />,
    item: [routes.authPageManage, routes.passwordManage]
}, {
    ...routes.systemVersion,
    icon: <Icon.InfoCircleIcon />,
}]

const options = [
    {
        content: '微信开放平台',
        value: 'https://open.weixin.qq.com/',
    },
    {
        content: '微信第三方平台',
        value: 'https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/Third_party_platform_appid.html',
    },
];

const noticeOptions = [
    {
        content: '查看通知',
    },
];

export default function Console() {

    const [showNotice, setShowNotice] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [username] = useState(localStorage.getItem('username') || '')

    useEffect(() => {
        initNav(navigate)
        if (checkLogin()) {
            if (location.pathname === '/' || location.pathname === routes.login.path) {
                navigate('/token')
            }
        }
    }, [])

    const headerLabel = useMemo(() => {
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].item) {
                for (let j = 0; j < (menuList[i].item || []).length; j++) {
                    if (menuList[i].item?.[j].path === location.pathname) {
                        return menuList[i].item?.[j].label
                    }
                }
            }
            if (menuList[i].path === location.pathname) {
                return menuList[i].label
            }
        }
        return ''
    }, [location.pathname])

    return (
        <div className={styles.console}>
            <div style={{width: '232px'}} />
            <span className={styles.console_menu}>
                <Menu menuList={menuList} />
            </span>
            <div className={styles.detail}>
                <div className={styles.detail_header}>
                    <p className={styles.detail_header_title}>{headerLabel}</p>
                    <div className={styles.detail_header_notice}>
                        <Dropdown maxColumnWidth={200} options={noticeOptions}
                                  onClick={() => setShowNotice(true)}>
                            <div className={styles.detail_header_notice_item}>
                                <Icon.NotificationIcon />
                                <p>通知</p>
                                <Icon.ChevronDownIcon />
                            </div>
                        </Dropdown>
                        <div className={styles.detail_header_notice_line} />
                        <Dropdown maxColumnWidth={200} options={options}
                                  onClick={(data) => window.open(data.value as string)}>
                            <div className={styles.detail_header_notice_item}>
                                <p>快捷链接</p>
                                <Icon.ChevronDownIcon />
                            </div>
                        </Dropdown>
                        <div className={styles.detail_header_notice_line} />
                        <p style={{ marginLeft: '15px' }}>{username}</p>
                        <p onClick={logout} style={{ margin: '0 15px', cursor: 'pointer' }}>退出</p>
                    </div>
                </div>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
            <Dialog header="通知中心" visible={showNotice} onConfirm={() => setShowNotice(false)}
                    onClose={() => setShowNotice(false)}>
                <p>管理工具最新版本为V 1.0.0，详情可前往<Link to={routes.systemVersion.path}>系统版本</Link>查看 2021-12-31</p>
            </Dialog>
        </div>
    )
}
