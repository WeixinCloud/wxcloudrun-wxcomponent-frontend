import styles from './index.module.less'
import {routes} from "../../components/Console";
import {MessagePlugin, Dialog, Input, Radio, Textarea} from "tdesign-react";
import {useEffect, useState} from "react";
import {get, post} from "../../utils/axios";
import {getComponentInfoUrl, getPreAuthCodeUrl, setComponentInfoUrl} from "../../utils/apis";

const urlTypeList = [{
    label: '去授权页面',
    value: 1
}, {
    label: '直接授权页面',
    value: 2
}]

let componentAppId = ''

export default function AuthPageManage() {

    const [showChangeModal, setShowChangeModal] = useState(false)
    const [nameInput, setNameInput] = useState<string | number>('')
    const [name, setName] = useState<string | number>('')
    const [info, setInfo] = useState<string | number>('')
    const [infoInput, setInfoInput] = useState<string | number>('')

    const [showCreateUrlModal, setShowCreateUrlModal] = useState(false)
    const [chooseUrlType, setChooseUrlType] = useState<string | number | boolean>(urlTypeList[0].value)

    const [copyUrl, setCopyUrl] = useState('')

    useEffect(() => {
        getComponentMessage()
    }, [])

    const copyMessage = (msg: string) => {
        setCopyUrl(msg)
        navigator.clipboard.writeText(msg).then(() => {
            MessagePlugin.success('复制成功', 2000)
        }).catch(() => {
            // 确保视图已经更新了再执行复制操作
            setTimeout(() => {
                const range = document.createRange();
                // @ts-ignore
                range.selectNode(document.getElementById('copyInner'));
                const selection = window.getSelection();
                // @ts-ignore
                if (selection.rangeCount > 0) selection.removeAllRanges();
                // @ts-ignore
                selection.addRange(range);
                document.execCommand('copy') || MessagePlugin.error(`当前浏览器不支持复制该网址，请手动复制弹窗内的网址`, 10000);
            }, 0)
        })
    }

    const jumpAuthorize = () => {
        window.open(`/#${routes.authorize.path}`)
    }

    const getComponentMessage = async () => {
        const resp = await get({
            url: getComponentInfoUrl
        })
        if (resp.code === 0) {
            componentAppId = resp.data.appid
            setInfoInput(resp.data.desc)
            setInfo(resp.data.desc)
            setName(resp.data.name)
            setNameInput(resp.data.name)
        }
    }

    const handleChangeMessage = async () => {
        if (!nameInput || !infoInput) {
            return MessagePlugin.error('有信息未填写', 2000)
        }
        const resp = await post({
            url: setComponentInfoUrl,
            data: {
                name: nameInput,
                desc: infoInput
            }
        })
        if (resp.code === 0) {
            getComponentMessage()
            setShowChangeModal(false)
        }
    }

    const handleCreateUrl = async () => {
        let url = ''
        switch (chooseUrlType) {
            case urlTypeList[0].value: {
                url = `${window.location.origin}/#${routes.authorizeH5.path}`
                break
            }
            case urlTypeList[1].value: {
                const resp = await get({
                    url: getPreAuthCodeUrl
                })
                if (resp.code === 0) {
                    url = `https://open.weixin.qq.com/wxaopen/safe/bindcomponent?component_appid=${componentAppId}&auth_type=3&pre_auth_code=${resp.data.preAuthCode}`
                }
                break
            }
        }
        if (url) {
            copyMessage(url)
        }
    }

    const setShowCreateUrlModalTrue = () => {
        setCopyUrl('')
        setShowCreateUrlModal(true)
    }

    return (
        <div>
            <p className="text">授权页基本信息</p>
            <p className="desc">完善如下信息后可一键构建授权链接，将链接分享给商家后可快速完成授权</p>
            <div className={styles.line} />
            <div className="normal_flex">
                <p style={{width: '100px'}}>企业名称</p>
                <p style={{marginRight: '20px'}} className="desc">{name}</p>
                <a style={{marginRight: '20px'}} className="a" onClick={() => setShowChangeModal(true)}>修改</a>
            </div>
            <div className="normal_flex">
                <p style={{width: '100px'}}>企业介绍</p>
                <p style={{marginRight: '20px'}} className="desc">{info}</p>
            </div>

            <p style={{marginTop: '40px'}} className="text">生成授权页</p>
            <p className="desc">PC版的授权链接用于商家通过扫码的方式完成授权；H5 版的授权链接商家通过微信打开即可完成授权</p>
            <div className={styles.line} />
            <div className="normal_flex">
                <p style={{width: '120px'}}>PC 版授权链接</p>
                <a style={{marginRight: '20px'}} className="a" onClick={jumpAuthorize}>去授权</a>
                <a style={{marginRight: '20px'}} className="a"
                   onClick={() => copyMessage(`${window.location.origin}/#${routes.authorize.path}`)}>复制链接</a>
            </div>
            <div className="normal_flex">
                <p style={{width: '120px'}}>H5 版授权链接</p>
                <a style={{marginRight: '20px'}} className="a" onClick={setShowCreateUrlModalTrue}>生成链接</a>
            </div>

            <Dialog visible={showChangeModal} onClose={() => setShowChangeModal(false)} header="修改授权页基本资料"
                    onConfirm={handleChangeMessage}>
                <p>企业名称</p>
                <Input value={nameInput} onChange={setNameInput} />
                <p>企业介绍</p>
                <Textarea onChange={setInfoInput} />
            </Dialog>

            <Dialog visible={showCreateUrlModal} onClose={() => setShowCreateUrlModal(false)}
                    onConfirm={handleCreateUrl}
                    confirmBtn="生成并复制">
                <div className="normal_flex">
                    <p className="desc" style={{ marginRight: '16px' }}>链接类型</p>
                    <Radio.Group value={chooseUrlType} onChange={setChooseUrlType}>
                        {
                            urlTypeList.map(i => {
                                return (
                                    <Radio value={i.value} key={`urlType${i.value}`}>{i.label}</Radio>
                                )
                            })
                        }
                    </Radio.Group>
                </div>
                {
                    chooseUrlType === urlTypeList[0].value
                        ?
                        <p className="desc" style={{ fontSize: '12px' }}>公众号/小程序管理员在微信访问该链接，需要点击"去授权"方可进入授权页面，该链接无有效期限制</p>
                        :
                        <p className="desc" style={{ fontSize: '12px' }}>公众号/小程序管理员在微信访问该链接后可直接进入授权页面，该链接有效期为30分钟</p>
                }

                {
                    copyUrl &&
                    <>
                        <p style={{ margin: 0 }}>生成的链接为: </p>
                        <p style={{ margin: 0 }} id="copyInner">{copyUrl}</p>
                    </>
                }

            </Dialog>

        </div>
    )
}
