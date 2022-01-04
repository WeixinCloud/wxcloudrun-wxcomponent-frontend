import styles from './index.module.less'
import {Button} from 'tdesign-react'
import {useEffect, useState} from "react";
import {get} from "../../utils/axios";
import {getComponentInfoUrl, getPreAuthCodeUrl} from "../../utils/apis";

export default function AuthPageH5() {

    const [name, setName] = useState<string | number>('')
    const [info, setInfo] = useState<string | number>('')
    const [componentAppId, setComponentAppId] = useState('')

    useEffect(() => {
        getComponentMessage()
    }, [])

    const getComponentMessage = async () => {
        const resp = await get({
            url: getComponentInfoUrl,
            notNeedCheckLogin: true
        })
        if (resp.code === 0) {
            setComponentAppId(resp.data.appid)
            setInfo(resp.data.desc)
            setName(resp.data.name)
        }
    }

    const jumpAuthPage = async () => {
        const resp = await get({
            url: getPreAuthCodeUrl,
            notNeedCheckLogin: true
        })
        if (resp.code === 0) {
            window.location.href = `https://open.weixin.qq.com/wxaopen/safe/bindcomponent?component_appid=${componentAppId}&pre_auth_code=${resp.data.preAuthCode}&auth_type=3`
        }
    }

    return (
        <div className={styles.auth}>
            <p>{name}</p>
            <p className="desc">第三方平台 AppId: {componentAppId}</p>
            <div className={styles.line} />
            <p>{info}</p>
            <div style={{ textAlign: 'center' }}>
                <Button style={{ marginTop: '50px' }} onClick={jumpAuthPage}>去授权</Button>
            </div>
        </div>
    )
}
