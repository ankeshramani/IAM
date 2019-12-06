import React, {Component} from 'react';
import {Button, Checkbox, Dropdown, Icon, Input, Menu, Progress, Select, Spin, Table, Tabs, Tooltip} from "antd";
import {Card, CardBody, Col, Container, Row} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import './ApplicationsAndEntitilements.scss'

const {TabPane} = Tabs;
const {Search} = Input;
const {Option} = Select;

class ApplicationAndEntitlements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expendedRows: []
        };
    }
    onExpandedRowsChange = (data) => {
        this.setState({
            expendedRows: data
        })
    }
    tab = (mainRecord) => {
        const {isLoadingUser, selectedEnt, selectedApp, entCheckBoxChange, showDrawer, undoDecisionEnt, onUpdateEntStatus, onToggleComment, getFilterEntData, checkBoxChange, showInfoDrawer, undoDecisionApp,
            onUpdateAppStatus, CustomExpandIcon, getFilterData} = this.props;
        const expandedRowRender = (mainRecord) => {
            const columns = [
                {
                    title: '',
                    width: "5%",
                    render: (record) => {
                        let entItems = [];
                        const entList = selectedEnt.find(x => x.appId === mainRecord.appId);
                        if (entList) {
                            entItems = entList.entIds || [];
                        }
                        return (
                            <div>
                                <Checkbox className={'custom-check-box'} checked={entItems.includes(record.entId)} onChange={(e) => entCheckBoxChange(record.entId, mainRecord.appId, e)}/>
                            </div>
                        )
                    }
                },

                {
                    title: 'Entitlement Name',
                    width: "25%",
                    render: (record) => {
                        return <span>{record.entitlementInfo && record.entitlementInfo.entitlementName}</span>
                    }
                },
                {
                    title: 'Description',
                    width: "30%",
                    render: (record) => {
                        return <span>{record.entitlementInfo && record.entitlementInfo.entitlementDescription}</span>
                    }
                },
                {
                    title: 'Type',
                    width: "10%",
                    render: (record) => {
                        return <span>{record.entitlementInfo && record.entitlementInfo.entitlementType}</span>
                    }
                },
                {
                    width: "5%",
                    title: (record) => {
                        return <div><span className="mr-5"><img src={require('../../images/mind-icon.png')} /></span>
                        </div>
                    },
                    render: (record) => {
                        return (
                            <div>
                                <img src={require('../../images/thumbs-up.png')} className="size-img" />
                                {/*{
                                    record.isApprove ?
                                        <Popover content={content} title="Title">
                                            <span><i className="fa fa-thumbs-up fs-19 color-green mr-10 cursor-pointer" aria-hidden="true"/></span>
                                        </Popover>
                                        :
                                        <Popover content={content} title="Title">
                                            <span><i className="fa fa-thumbs-down fs-19 color-red mr-10 cursor-pointer" aria-hidden="true"/></span>
                                        </Popover>
                                }*/}
                            </div>
                        );
                    }
                },
                {
                    title: 'Decision',
                    width: "17%",
                    render: (record) => {
                        const menu = (
                            <Menu>
                                <Menu.Item><span
                                    className="text-primary ml-5 cursor-pointer">Certify Conditionally</span></Menu.Item>
                                <Menu.Item><span
                                    className="text-primary ml-5 cursor-pointer"
                                    onClick={() => undoDecisionEnt(record.entId, mainRecord.appId)}>Undo decision</span></Menu.Item>
                                {/*<Menu.Item><span
                       className="text-primary ml-5 cursor-pointer">Mark for Review</span></Menu.Item>*/}
                            </Menu>
                        );
                        return (
                            <div>
                                <span
                                    className={`mr-10 row-action-btn ${record.action === 'certified' ? 'text-success' : 'text-initial'}`}
                                    onClick={() => onUpdateEntStatus(record.entId, record.action === 'certified' ? 'required' : 'certified', mainRecord.appId)}>
                                     {record.action === 'certified' ? 'Approved' : 'Approve'}
                                </span>
                                <span
                                    className={`mr-10 row-action-btn-a ${record.action === 'rejected' ? 'text-success' : 'text-initial'}`}
                                    onClick={() => onUpdateEntStatus(record.entId, record.action === 'rejected' ? 'required' : 'rejected', mainRecord.appId)}>
                                      {record.action === 'rejected' ? 'Revoked' : 'Revoke'}
                                </span>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Icon type="unordered-list" className='text-primary'/>
                                </Dropdown>
                            </div>
                        )
                    }
                },
                {
                    title: (<div><img src={require('../../images/comment.png')} /></div>),
                    width: "5%",
                    render: (record) => {
                        return <span className='cursor-pointer' onClick={() => onToggleComment(mainRecord.appId, record && record.entId, record.newComment)}><a><img src={require('../../images/edit.png')} className="size-img" /></a></span>
                    }
                },
            ];
            return (
                <Card className="antd-table-nested">
                    <Table
                        columns={columns}
                        size="small"
                        dataSource={getFilterEntData((mainRecord && mainRecord.entityEntitlements) || [])}
                        pagination={{pageSize: 5}}
                    />
                </Card>
            );
        };
        const columns = [
            {
                title: '',
                width: 10,
                render: (record) => {
                    return (
                        <div>
                            <Checkbox checked={selectedApp.includes(record.appId)} className={'custom-check-box'}
                                      onChange={() => checkBoxChange(record.appId)}/>
                        </div>
                    )
                }
            },
            {
                title: 'Application',
                width: "25%",
                render: (record) => {
                    return <span><span
                        className='application'>Application:</span> <b>{record && record.applicationInfo && record.applicationInfo.applicationName}</b>
                        <Icon type="info-circle" theme="twoTone"
                              onClick={() => showInfoDrawer(record, 'app')}/></span>
                }
            },
            {
                title: 'Account',
                width: "25%",
                render: (record) => {
                  return (<span><span className='application'>Account:</span> <b>{record && record.accountId}</b> <Icon
                    type="info-circle" theme="twoTone" onClick={() => showInfoDrawer(record)}/></span>);
                }
            },
            {
            title: 'Last Login',
            width: "25%",
            render: (record) => {
              return (<span><span className='application'>Last Login:</span> <b>{record && record.applicationInfo && record.applicationInfo.lastLogin }</b></span>);
            }
            },
            {
                title: 'Decision',
                width: '150px',
                render: (record) => {
                    const menu = (
                        <Menu>
                            <Menu.Item><span
                                className="text-primary ml-5 cursor-pointer">Certify Conditionally</span></Menu.Item>
                            <Menu.Item><span
                                className="text-primary ml-5 cursor-pointer"
                                onClick={() => undoDecisionApp(record.appId)}>Undo decision</span></Menu.Item>
                            {/*<Menu.Item><span
                       className="text-primary ml-5 cursor-pointer">Mark for Review</span></Menu.Item>*/}
                        </Menu>
                    );
                    return (
                        <div className="no-wrap">
                           <span
                               className={`mr-10 cursor-pointer row-action-btn ${record && record.action === 'certified' ? 'text-success' : 'text-initial'}`}
                               onClick={() => onUpdateAppStatus(record.appId, 'certified')}>{record.action === 'certified' ? 'Approved' : 'Approve'}</span>
                            <span
                                className={`mr-10 cursor-pointer row-action-btn-a ${record && record.action === 'rejected' ? 'text-success' : 'text-initial'}`}
                                onClick={() => onUpdateAppStatus(record.appId, 'rejected')}>{record.action === 'rejected' ? 'Revoked' : 'Revoke'}</span>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon type="unordered-list" className='text-primary'/>
                            </Dropdown>
                        </div>
                    )
                }
            },
            /* {
                 title: 'High Risk Entitlements',
                 width: "10%",
                 render: (record) => (
                     <span>{record && record.itemRisk}</span>)
             },*/
            /*{
                title: 'Porgress',
                width: "25%",
                render: (record) => {
                    const totalCertified = ((record.totalCertifiedEntitlements) || 0) * 100 ;
                    const percentage = record.totalEntitlements > 0 ? totalCertified /record.totalEntitlements : 0;
                    return <Progress percent={parseInt(percentage)}/>
                }
            },*/

            /*{
                title: 'Comments',
                width:'10%',
                render: (record) => {
                    return <div className="cursor-pointer text-primary"><span
                        onClick={this.showModal}>{record && record.oldComments}</span>
                    </div>
                },
            },*/
        ];
        return (
            <div className='border-1 mt-20' style={{flex: 1}}>
                {isLoadingUser ?
                    <Spin className='mt-50 custom-loading'/> :
                    <Row>
                        {/*<Col md="2" sm="12" className='pr-0'>
                            <div className="inner-profile">
                                <Row className='align-items-center'>
                                    <Col md="12" sm="12" className="right">
                                        <Row><Col md="4"><b>User ID:</b> </Col><Col md="8">{mainRecord.userInfo.UserName}</Col></Row>
                                        <div className="text-center">
                                            <div className="initialName"
                                                 style={{background: mainRecord.color || 'red'}}>{(mainRecord.userInfo.FirstName || 'A').substr(0, 1)}{(mainRecord.userInfo.LastName || 'B').substr(0, 1)}</div>
                                            <div
                                                className="UName">{mainRecord.userInfo.FirstName} {mainRecord.userInfo.LastName}</div>
                                            <div className="UDesignation">{mainRecord.userInfo.Title}</div>
                                            <div className="UDesignation mb-10">{mainRecord.userInfo.Email}</div>
                                            <div className="box-part-a">
                                                <div><span>Manager: </span><b>{mainRecord.userInfo.Manager}</b></div>
                                                <div><span>Department: </span><b>{mainRecord.userInfo.Department}</b>
                                                </div>
                                            </div>
                                            <div className="box-part-a">
                                                <div><span>Roles: </span><b>{mainRecord.noOfRoles}</b></div>
                                                <div><span>Applications: </span><b>{mainRecord.noOfApplications}</b>
                                                </div>
                                                <div><span>Entitlements: </span><b>{mainRecord.numOfEntitlements}</b>
                                                </div>
                                            </div>
                                            <div className="box-part-b text-center">
                                                <Progress type="circle" width={50} percent={parseInt(percentage)}/>
                                            </div>

                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>*/}
                        <Col md="12" sm="12" className='pl-15'>
                            <div className="inner-profile-right">
                                <Table
                                    columns={columns}
                                    size="medium"
                                    className={`user-profile-data no-padding-table`}
                                    expandedRowRender={expandedRowRender}
                                    expandIcon={CustomExpandIcon}
                                    dataSource={getFilterData()}
                                    onExpandedRowsChange={this.onExpandedRowsChange}
                                    showHeader={false}
                                    onRow={
                                        (record, index) => {
                                            if (!((record.entityEntitlements || []).length)) {
                                                return { className: 'no-ent-data'};
                                            }
                                            return {
                                                className: this.state.expendedRows.includes(index) ? 'expanded-tr' : ''
                                            };
                                        }
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        );
    }

    render() {
        const { members, activeKey, onSelectAll, selectedApp, selectedCertification,  confirmApproveSelected,
             confirmRevokeSelected, onChange,selectedEnt, changedCount, submitData} = this.props;
        return (
            <div className="custom-content">
                <Card className="mt-10">
                    <CardHeader className="pl-20">
                        <Row className="top-filter">
                            <Col md={12} sm={12} xs={12}>
                                {/*<Search
                                      size="large"
                                      placeholder="Search Name"
                                      style={{ width: 220, marginRight: 130 }}
                                      value={searchUser}
                                      onChange={onChangeSearchUser}
                                  />*/}
                                <Button className="square" size={"large"} color="primary">
                                    <Checkbox
                                        onChange={onSelectAll} className="custom-check-box   "
                                        checked={!!(selectedApp && selectedApp.length && selectedEnt && selectedEnt.length || selectedCertification && selectedCertification.length === members && members.length)}
                                    > Select All</Checkbox></Button>
                                <Button className="square ml-10" size={"large"} color="primary"
                                        onClick={confirmApproveSelected}><Icon type="check"/>Approve</Button>
                                <Button className="square ml-10" size={"large"} color="primary"
                                        onClick={confirmRevokeSelected}><Icon type="minus-circle"/>Revoke</Button>
                                {/*<Button className="square ml-10" size={"large"} color="primary"><Icon*/}
                                    {/*type="right-circle"/>Reassign</Button>*/}

                                <Select placeholder='Show New Access' defaultValue="" size="large"
                                        className='border-0 ml-10 float-right ' style={{width: 220}}>
                                    <Option value="">Show New Access</Option>
                                    <Option value="1">Show All Access</Option>
                                </Select>
                                <Select placeholder='Filter' className='border-0 ml-10 float-right' size="large"
                                        onChange={(value) => onChange({
                                            target: {
                                                name: 'filter',
                                                value
                                            }
                                        })} style={{width: 220}}>
                                    <Option value="">All</Option>
                                    <Option value="certified">Approved</Option>
                                    <Option value="rejected">Revoked</Option>
                                    <Option value="required">Undecided</Option>
                                </Select>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="pt-0">
                        <Row>
                            {
                                members.map(item => {
                                    if (item.userInfo.UserName === activeKey) {
                                        return this.tab(item)
                                    }
                                    return null;
                                })
                            }


                        </Row>
                          <div className="sticky-btn cstm-btn">
                              <Button
                                  className="icon square float-right mb-0"
                                  size={"large"} color="primary"
                                  disabled={changedCount  === 0}
                                  onClick={submitData}>
                                  Save & Review Later ({changedCount && changedCount})
                              </Button>
                          </div>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ApplicationAndEntitlements
