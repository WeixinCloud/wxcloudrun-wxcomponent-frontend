import styles from './index.module.less'
import {Button} from 'tdesign-react'
import {useEffect, useState} from "react";
import {get} from "../../utils/axios";
import {getComponentInfoUrl, getPreAuthCodeUrl} from "../../utils/apis";

export default function AuthPage() {

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
            window.location.href = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${componentAppId}&pre_auth_code=${resp.data.preAuthCode}&auth_type=3`
        }
    }

    return (
        <div className={styles.auth}>
            <div className={styles.auth_modal}>
                <p style={{ margin: 0 }}>{name}</p>
                <p className="desc" style={{ marginBottom: '40px' }}>{info}</p>
                <div className="normal_flex" style={{ justifyContent: 'space-between' }}>
                    <div className={styles.auth_modal_box}>
                        <p className={styles.auth_modal_box_title}>已有小程序或公众号</p>
                        <p className={styles.auth_modal_box_desc}>使用管理员扫码授权已有小程序或者公众号</p>
                        <Button style={{ width: '250px' }} onClick={jumpAuthPage}>前往授权</Button>
                    </div>
                    <div className={styles.auth_modal_box}>
                        <p className={styles.auth_modal_box_title}>还没小程序或公众号</p>
                        <p className={styles.auth_modal_box_desc}>请前往微信公众号平台完成帐号注册后再进行授权</p>
                        <Button style={{ width: '250px' }} onClick={() => window.location.href = 'https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index'}>前往注册</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
