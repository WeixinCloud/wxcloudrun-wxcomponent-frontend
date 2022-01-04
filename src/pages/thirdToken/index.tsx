import {useState} from 'react'
import styles from './index.module.less'
import {Table, Button, MessagePlugin, PopConfirm} from 'tdesign-react';
import {PrimaryTableCol} from "tdesign-react/es/table/type";
import {get} from "../../utils/axios";
import {getCloudBaseTokenUrl, getComponentTokenUrl, getTicketUrl} from "../../utils/apis";
import moment from "moment";
import {routes} from "../../components/Console";

const componentTokenColumn: PrimaryTableCol[] = [{
    align: 'left',
    minWidth: 100,
    className: 'row',
    colKey: 'token',
    title: 'Token',
    render({ row }) {
        console.log(row)
        return (
            <p style={{ maxWidth: '600px', wordWrap: 'break-word' }}>{row.token}</p>
        )
    }
}, {
    align: 'center',
    width: 300,
    minWidth: 100,
    className: 'row',
    colKey: 'expiresTime',
    title: '过期时间',
}, {
    align: 'center',
    width: 100,
    minWidth: 100,
    className: 'row',
    colKey: 'a',
    title: '操作',
    render({ row }) {
        return (
            <a className="a" onClick={() => {
                navigator.clipboard.writeText(row.token)
                MessagePlugin.success('复制成功', 2000)
            }}>复制</a>
        );
    },
}]

const cloudTokenColumn: PrimaryTableCol[] = [{
    align: 'left',
    minWidth: 100,
    width: 400,
    className: 'row',
    colKey: 'token',
    title: 'Token',
    render({ row }) {
        return (
            <p style={{ maxWidth: '800px', wordWrap: 'break-word' }}>{row.token}</p>
        )
    }
}, {
    align: 'center',
    width: 100,
    minWidth: 100,
    className: 'row',
    colKey: 'a',
    title: '操作',
    render({ row }) {
        return (
            <a className="a" onClick={() => {
                navigator.clipboard.writeText(row.token)
                MessagePlugin.success('复制成功', 2000)
            }}>复制</a>
        );
    },
}]

const ticketColumn: PrimaryTableCol[] = [{
    align: 'left',
    minWidth: 100,
    width: 800,
    className: 'row',
    colKey: 'ticket',
    title: 'Ticket',
}, {
    align: 'center',
    width: 100,
    minWidth: 100,
    className: 'row',
    colKey: 'a',
    title: '操作',
    render({ row }) {
        return (
            <a className="a" onClick={() => {
                navigator.clipboard.writeText(row.ticket)
                MessagePlugin.success('复制成功', 2000)
            }}>复制</a>
        );
    },
}]

export default function ThirdToken() {

    const [isTicketLoading, setIsTicketLoading] = useState<boolean>(false)
    const [isComponentTokenLoading, setIsComponentTokenLoading] = useState<boolean>(false)
    const [isCloudBaseTokenLoading, setIsCloudBaseTokenLoading] = useState<boolean>(false)
    const [ticket, setTicket] = useState<{
        ticket: string
    }[]>([])
    const [componentToken, setComponentToken] = useState<{
        token: string
        expiresTime: string
    }[]>([])
    const [cloudBaseToken, setCloudBaseToken] = useState<{
        token: string
    }[]>([])

    const getComponentVerifyTicket = async () => {
        setIsTicketLoading(true)
        const resp = await get({
            url: getTicketUrl
        })
        if (resp.code === 0) {
            setTicket([{
                ticket: resp.data.ticket,
            }])
        }
        setIsTicketLoading(false)
    }

    const getComponentToken = async () => {
        setIsComponentTokenLoading(true)
        const resp = await get({
            url: getComponentTokenUrl
        })
        if (resp.code === 0) {
            setComponentToken([{
                expiresTime: moment().add(7200, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
                token: resp.data.token,
            }])
        }
        setIsComponentTokenLoading(false)
    }

    const getCloudBaseToken = async () => {
        setIsCloudBaseTokenLoading(true)
        const resp = await get({
            url: getCloudBaseTokenUrl
        })
        if (resp.code === 0) {
            setCloudBaseToken([{
                token: resp.data.token,
            }])
        }
        setIsCloudBaseTokenLoading(false)
    }

    return (
        <div className={styles.token}>
            <p className="text">component_verify_ticket 介绍</p>
            <p className="desc">在第三方平台创建审核后，微信服务器会向其"授权事件URL"每隔10分钟以 POST 的请求方式推送 component_verify_ticket。 通过该 ticket
                可生成 component_access_token。更多接受可前往查看<a href="https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/component_verify_ticket.html" target="_blank" className="a">官方文档</a></p>
            <div className={styles.line} />
            <Button style={{ marginTop: '20px' }} onClick={getComponentVerifyTicket}>立即获取</Button>
            <Table
                loading={isTicketLoading}
                data={ticket}
                columns={ticketColumn}
                rowKey="ticket"
                tableLayout="auto"
                verticalAlign="top"
                size="small"// 与pagination对齐
            />

            <p style={{marginTop: '40px'}} className="text">component_access_token 介绍</p>
            <p className="desc">component_access_token 是第三方平台接口的调用凭据。令牌的获取是有限制的，每个令牌的有效期为 2
                小时，请自行做好令牌的管理，在令牌快过期时（比如1小时50分），重新调用接口获取。接口详情可查看<a href="https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/component_access_token.html" target="_blank" className="a">官方文档</a></p>
            <div className={styles.line} />
            <PopConfirm content={'点击确认生成 token 后会导致上一个 token 被刷新而失效，请谨慎操作'} onConfirm={getComponentToken}>
                <Button style={{ marginTop: '20px' }}>立即获取</Button>
            </PopConfirm>
            <Table
                loading={isComponentTokenLoading}
                data={componentToken}
                columns={componentTokenColumn}
                rowKey="componentToken"
                tableLayout="auto"
                verticalAlign="top"
                size="small"// 与pagination对齐
            />

            <p style={{marginTop: '40px'}} className="text">authorizer_access_token 生成</p>
            <p className="desc">authorizer_access_token 是第三方代商家帐号调用接口的调用凭据。令牌的获取是有限制的，每个 token 的有效期为 2 小时，开发者需要缓存
                authorizer_access_token，在 token 快过期时（比如1小时50分），可以使用刷新令牌（authorizer_refresh_token）获取新的token。接口详情可查看<a
                    href="https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/api_authorizer_token.html" target="_blank" className="a">官方文档</a></p>
            <div className={styles.line} />
            <div className="normal_flex">
                <p style={{width: '140px'}}>Token</p>
                <a style={{marginRight: '20px'}} className="a" href={`#${routes.authorizedAccountManage.path}`}>立即前往"授权帐号管理"获取 authorizer_access_token</a>
            </div>

            <p style={{marginTop: '40px'}} className="text">微信令牌介绍</p>
            <p className="desc">微信令牌（cloudbase_access_token）是用于调用微信开放平台接口的凭证。微信后台周期性推送令牌到用户的容器中，用户在指定路径读取令牌后用令牌调用微信开放平台的接口，无需通过
                appId 和 secret 调用相关接口获取 access_token 并维护声明周期。更多接受可前往查看<a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/weixin/token.html" target="_blank" className="a">官方文档</a></p>
            <div className={styles.line} />
            <Button style={{ marginTop: '20px' }} onClick={getCloudBaseToken}>立即获取</Button>
            <Table
                loading={isCloudBaseTokenLoading}
                data={cloudBaseToken}
                columns={cloudTokenColumn}
                rowKey="cloudToken"
                tableLayout="auto"
                verticalAlign="top"
                size="small"// 与pagination对齐
            />

        </div>
    )
}
