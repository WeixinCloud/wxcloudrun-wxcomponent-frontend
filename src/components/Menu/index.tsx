import {useEffect, useState} from 'react'
// import styles from './index.module.less'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'tdesign-react/'
const {SubMenu, MenuItem} = Menu;

interface IProps {
    menuList: {
        label?: string | JSX.Element
        icon: JSX.Element
        path?: string
        item?: {
            label: string | JSX.Element
            path: string
        }[]
    }[]
}

export default function MyMenu(props: IProps) {

    const [activePath, setActivePath] = useState<string | number>('')
    const [expandsMenu, setExpandsMenu] = useState<Array<string | number>>([])
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setActivePath(location.pathname)
    }, [location.pathname])

    const changePath = (path: string | number) => {
        setActivePath(path)
        navigate(path as string)
    }

    const {menuList} = props

    return (
        <Menu
            theme="dark"
            value={activePath}
            expandMutex={false}
            expanded={expandsMenu}
            onExpand={(values) => setExpandsMenu(values)}
            onChange={changePath}
            style={{height: '100%'}}
            logo={<h3 style={{margin: '0 auto', color: 'white'}}>第三方平台管理工具</h3>}
        >
            {
                (menuList || []).map((i, index) => {
                    if (i.item) {
                        return (
                            <SubMenu key={`menu_father_${index}`} value={`menu_father_${index}`} title={i.label} icon={i.icon}>
                                {
                                    (i.item || []).map(item => {
                                        return (
                                            <MenuItem key={`menu_item_${item.path}`} value={item.path}>
                                                {item.label}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </SubMenu>
                        )
                    } else {
                        return (
                            <MenuItem value={i.path} key={`menu_${i.path}`} icon={i.icon}>
                                {i.label}
                            </MenuItem>
                        )
                    }
                })
            }
        </Menu>
    )
}
