// import styles from './index.module.less'
import {Table, Input, PopConfirm, Dialog, MessagePlugin, Button} from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react'
import {useEffect, useState} from "react";
import {get, post} from "../../utils/axios";
import {getAuthAccessTokenUrl, getAuthorizedAccountUrl, syncAccountUrl} from "../../utils/apis";
import {PrimaryTableCol} from "tdesign-react/es/table/type";
import moment from "moment";

const officialAccountAuthType: Record<string, string> = {
    "-1": "未认证",
    "0": "微信认证",
    "1": "新浪微博认证",
    "2": "腾讯微博认证",
    "3": "已资质认证通过但还未通过名称认证",
    "4": "已资质认证通过、还未通过名称认证，但通过了新浪微博认证",
    "5": "已资质认证通过、还未通过名称认证，但通过了腾讯微博认证"
}

const miniProgramAuthType: Record<string, string> = {
    "-1": "未认证",
    "0": "微信认证",
}

const tokenColumn: PrimaryTableCol[] = [
    {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'token',
        title: 'Token',
    },
    {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'index',
        title: '操作',
        render({ row }) {
            return (
                <a className="a" onClick={() => {
                    navigator.clipboard.writeText(row.token)
                    MessagePlugin.success('复制成功', 2000)
                }}>复制</a>
            );
        },
    },
]

export default function AuthorizedAccount() {

    const accountColumn: PrimaryTableCol[] = [
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            colKey: 'appid',
            title: 'AppID',
        },
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            colKey: 'userName',
            title: '原始ID',
        },
        {
            align: 'center',
            width: 120,
            minWidth: 120,
            colKey: 'nickName',
            title: '名称',
        },
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            colKey: 'appType',
            title: '帐号类型',
            cell: ({ row }) => {
                return row.appType === 0 ? '小程序' : '公众号'
            }
        },
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            colKey: 'authTime',
            title: '授权时间',
            render: ({ row }) => moment(row.authTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            colKey: 'principalName',
            title: '主体信息',
        },
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            className: 'row',
            colKey: 'index',
            title: '认证类型',
            cell: ({ row }) => {
                return row.appType === 0 ? miniProgramAuthType[String(row.verifyInfo)] : officialAccountAuthType[String(row.verifyInfo)]
            }
        },
        // {
        //     align: 'center',
        //     width: 100,
        //     minWidth: 100,
        //     className: 'row',
        //     colKey: 'refreshToken',
        //     title: 'refresh_token',
        // },
        {
            align: 'center',
            width: 100,
            minWidth: 100,
            className: 'row',
            colKey: 'funcInfo',
            title: '授权权限集ID',
        },
        {
            align: 'center',
            fixed: 'right',
            width: 210,
            minWidth: 210,
            className: 'row',
            colKey: 'index',
            title: '操作',
            render({ row }) {
                return (
                    <div style={{ width: '210px' }}>
                        <PopConfirm content="点击确定生成 token 后会导致上一个 token 被刷新而失效，请谨慎操作">
                            <a className="a" onClick={() => createToken(row.appid)} style={{ margin: '0 10px' }}>生成token</a>
                        </PopConfirm>
                        <a onClick={() => {
                            navigator.clipboard.writeText(row.refreshToken)
                            MessagePlugin.success('复制成功', 2000)
                        }} className="a">复制refresh_token</a>
                    </div>
                );
            },
        },
    ]

    const pageSize = 15

    const [accountList, setAccountList] = useState([])
    const [accountTotal, setAccountTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [appIdInput, setAppIdInput] = useState<string | number>('')
    const [visibleTokenModal, setVisibleTokenModal] = useState(false)
    const [tokenData, setTokenData] = useState([{
        token: ''
    }])

    useEffect(() => {
        getAccountList()
    }, [currentPage])

    const createToken = async (appid: string) => {
        const resp = await get({
            url: `${getAuthAccessTokenUrl}?appid=${appid}`
        })
        if (resp.code === 0) {
            setTokenData([{
                token: resp.data.token
            }])
            setVisibleTokenModal(true)
        }
    }

    const getAccountList = async () => {
        const resp = await get({
            url: `${getAuthorizedAccountUrl}?offset=${(currentPage - 1) * pageSize}&limit=${pageSize}&appid=${appIdInput}`,
        })
        if (resp.code === 0) {
            setAccountList(resp.data.records)
            setAccountTotal(resp.data.total)
        }
    }

    const handleSyncAccount = async () => {
        const resp = await post({
            url: syncAccountUrl
        })
        if (resp.code === 0) {
            await MessagePlugin.success('同步成功', 2000)
            await getAccountList()
        }
    }

    return (
        <div>
            <div className="normal_flex" style={{ marginBottom: '16px'}}>
                <Button onClick={handleSyncAccount} style={{ marginRight: '16px' }}>同步授权帐号</Button>
                <p>授权帐号指的是授权给该第三方平台帐号的公众号或者小程序，可手动刷新以获取当前已授权帐号。若授权帐号数较多，更新需要一定时间，请耐心等待。</p>
            </div>
            <Input value={appIdInput} onChange={setAppIdInput} style={{ width: '400px', marginBottom: '10px' }} placeholder="请输入 AppID，不支持模糊搜索" clearable suffixIcon={<a className="a" onClick={getAccountList}><SearchIcon /></a>} />
            <Table
                data={accountList}
                columns={accountColumn}
                rowKey="index"
                tableLayout="auto"
                verticalAlign="top"
                size="small"
                hover
                // 与pagination对齐
                pagination={{
                    pageSize,
                    total: accountTotal,
                    current: currentPage,
                    showJumper: true,
                    pageSizeOptions: [15],
                    onCurrentChange: setCurrentPage,
                }}
            />
            <Dialog header="AuthorizerAccessToken" visible={visibleTokenModal} onClose={() => setVisibleTokenModal(false)}>
                <Table
                    data={tokenData}
                    columns={tokenColumn}
                    rowKey="index"
                    tableLayout="auto"
                    verticalAlign="top"
                    size="small"
                />
            </Dialog>
        </div>
    )
}
