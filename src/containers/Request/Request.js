import React, {Component} from 'react';
import {Card, CardBody, Col, Container, Row, CardHeader} from "reactstrap";
import {Button, Select, DatePicker, Transfer, Input, message, Spin, Table, Icon} from "antd";

const {Search} = Input;
import {ApiService} from "../../services/ApiService";
import './request.scss'
import '../Home/Home.scss'
import Cookies from "universal-cookie";
import moment from "moment";

class Request extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            selectedUsers: [],
            selectedApps: [],
            userList: [],
            applicationList: [],
            isModal: false,
            isLoading: false,
            isReview: false,
            isSelf: false,
            userMappings: [],
            groupList: [],
            groupAndAppList: [],
            appList: [],
            selectedItem: [],
            selectedApp: null,
            endDate: '',
            startDate: '',
            requestName: '',
            action: 'Add',
        };
    }

    handleUserChange = selectedUsers => {
        this.setState({selectedUsers});
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                current: 1,
                userMappings: [],
                selectedItem: [],
                selectedUsers: [],
            })
        }
    }

    componentDidMount() {
        this.getAllUsers()
        this.getgroupsWorkflow()
        this.getappsWorkflow()
    }

    getgroupsWorkflow = async () => {
        const {groupAndAppList} = this.state
        this.setState({
            isLoading: true
        });
        const payload = {
            "displayName": "",
        };
        const data = await ApiService.getgroupsWorkflow(payload);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    type: 'Group'
                };
                groupAndAppList.push(obj)
            })
            this.setState({
                groupAndAppList,
                groupList: data,
                isLoading: false
            })
        }
    }

    getappsWorkflow = async () => {
        const {groupAndAppList} = this.state
        this.setState({
            isLoading: true
        });
        const payload = {
            "displayName": "",
        };
        const data = await ApiService.getappsWorkflow(payload);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    type: 'Application'
                };
                groupAndAppList.push(obj)
            })
            this.setState({
                groupAndAppList,
                appList: data,
                isLoading: false
            })
        }
    }

    getAllUsers = async () => {
        const {userList} = this.state
        this.setState({
            isLoading: true
        });
        const payload = {
            "displayName": "",
            'manager': ""
        };
        const data = await ApiService.getUsersWorkflow(payload)
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    key: i
                };
                userList.push(obj)
            })
            this.setState({
                userList,
                isLoading: false
            })
        }
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({
            current,
        });
    }

    previous = () => {
        this.setState({
            current: this.state.current - 1
        });
    }

    isSelf = () => {
        return this.props.location.pathname.includes('request-for-self');
    }

    addToCart = (record) => {
        let {selectedItem} = this.state;
        if (selectedItem.some((x) => x.id === record.id)) {
            selectedItem = selectedItem.filter(x => x.id !== record.id);
        } else {
            selectedItem.push(record);
        }
        this.setState({
            selectedItem
        })
    }

    onReview = () => {
        const {selectedItem, userList, selectedUsers} = this.state;
        let userMappings = [];
        if(this.isSelf()){
            const cookies = new Cookies();
            const loginUser = cookies.get('LOGGEDIN_USERID');
            const obj = {
                displayName: loginUser,
                emails: [
                    {primary: false, secondary: false, value: loginUser, type: "recovery", verified: "false"},
                    {primary: true, secondary: false, value: loginUser, type: "work", verified: "false"}
                    ],
                key: 0,
                name: {familyName: "",
                    formatted: "",
                    givenName: '',},
                userName: loginUser,
                requestList: selectedItem
            };
            userMappings.push(obj);
        } else {
            userList.forEach(user => {
                if (selectedUsers.indexOf(user.key) !== -1) {
                    userMappings.push({
                        ...user,
                        requestList: selectedItem
                    })
                }
            });
        }
        this.setState({
            userMappings,
            current: 3

        })
    }

    filterOption = (inputValue, option) => {
       return  option.displayName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    };


    getFiltered = () => {
        const {groupAndAppList, searchUser, catalogType} = this.state;
        if (!searchUser && !catalogType) {
            return groupAndAppList;
        }
        let filteredData = groupAndAppList || [];
        if (searchUser) {
            filteredData = filteredData.filter(x => {
                return ((x.displayName || '').toLowerCase().includes(searchUser.toLowerCase()));
            });
        }
        if (catalogType) {
            filteredData = filteredData.filter(x => {
                return (x.type.toLowerCase().includes(catalogType.toLowerCase()));
            });
        }
        return filteredData;
    }

    onSubmit = async (step) => {
        let {selectedItem, requestName,  action, selectedUsers, userList, userMappings} = this.state;
        const cookies = new Cookies();
        const requestedBy = cookies.get('LOGGEDIN_USERID');
        const getEmail = (record) => {
            if (Array.isArray(record.emails) && record.emails.length) {
                const primaryEmail = record.emails.find(x => x.primary);
                if (primaryEmail) {
                    return primaryEmail.value;
                } else {
                    return record.emails[0].value;
                }
            }
            return '';
        }
        const userMappingEmail = (record) => {
            if (Array.isArray(record.emails) && record.emails.length) {
                const primaryEmail = record.emails.find(x => x.primary);
                if (primaryEmail) {
                    return primaryEmail.value;
                } else {
                    return record.emails[0].value;
                }
            }
            return '';
        }
        const requestList = [];
        const userMappingsList = [];
        let payload = {
            requestName,
            action,
            startDate: moment().format("MM/DD/YYYY"),
            endDate: moment().add(30 , 'days').format("MM/DD/YYYY"),
            requestedBy,
            requestedByEmail: requestedBy,
            requestList: step === 2 ? requestList : userMappingsList,
        };
        if (step === 2) {
            if (this.isSelf()) {
                userList = [{
                    userName: requestedBy,
                    displayName: requestedBy,
                    key: 0
                }];
                selectedUsers = [0]
            }
            (userList || []).forEach(user => {
                if (selectedUsers.indexOf(user.key) !== -1) {
                    (selectedItem || []).forEach((y) => {
                        let request = {
                            requestedForID: user.userName,
                            requestedFor: user.userName,
                            requestedForDisplayName: user.displayName,
                            requestedForEmail: getEmail(user),
                            approver: "manager",
                            approverEmail: "manager@mail.com",
                            objectType: y.type,
                            objectName: y.displayName
                        };
                        requestList.push({...request})
                    });
                }
            });
        } else {
            (userMappings || []).forEach((x) => {
                (x.requestList || []).forEach((z) => {
                    let request = {
                        requestedForID: x.userName,
                        requestedFor: x.userName,
                        requestedForDisplayName: x.displayName,
                        requestedForEmail: userMappingEmail(x),
                        approver: "manager",
                        approverEmail: "manager@mail.com",
                        objectType: z.type,
                        objectName: z.displayName
                    };
                    userMappingsList.push({...request})
                })
            })
        }


        try {
            await ApiService.submitWorkflow(payload)
            message.success('Requests submitted successfully!');
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 2000);
        } catch (e) {
            return message.error('something is wrong! please try again');
        }

    }

    getColumns = () => {
        return [
            {
                render: (record) => (<span className='cursor-pointer ml-5'><a>{record.type === "Application" ?
                    <img src={require('../../images/application.png')} style={{width: 40}}/> :
                    <img src={require('../../images/group.png')} style={{width: 40}}/>}</a></span>),
                width: 100
            },

            {
                render: (record) => {
                    return <div>
                        <h4>{record.displayName}</h4>
                    </div>

                },
                width: "70%"
            },
            {
                render: (record) => {
                    return <div>
                        <a><img src={require('../../images/info.png')} style={{width: 30}}/></a>
                    </div>

                },
                width: 100
            },
            {
                render: (record) => {
                    return <div>
                        <Button
                            className={this.state.selectedItem.some((x) => x.id === record.id) ? "add-to-cart-select square" : "  square "}
                            size={"small"} color="primary"
                            onClick={() => this.addToCart(record)}><img
                            src={require('../../images/shopping-cart.png')} style={{width: 20}}
                            className="ml-10 mr-20"/>Add To Cart &nbsp;&nbsp;</Button>
                    </div>

                },
                width: "5%"
            },
            {
                render: (record) => {
                    return <div>
                        <a><img src={require('../../images/clock-with-white-face.png')} style={{width: 30}}/></a>
                    </div>

                },
                width: 100,
                alignment: 'center'

            },
        ]
    }

    onDeleteUser = (record) => {
        let {userMappings} = this.state;
        this.setState({
            userMappings: userMappings.filter((x) => x.id !== record.id)
        })
    }

    onDeleteApp = (userId, appId) => {
        let {userMappings} = this.state;
        const user = userMappings.findIndex(x => x.id === userId);
        if (user > -1) {
            userMappings[user].requestList = userMappings[user].requestList.filter(x => x.id !== appId);
        }
        this.setState({
            userMappings
        })
    }

    expandedRowRender = (mainRecord) => {
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span>{record && record.displayName}</span>
                },
                width: "70%",
            },
            {
                title: 'Type',
                render: (record) => {
                    return <span>{record && record.type}</span>
                },
                width: "20%",
            },
            {
                title: "",
                render: (record) => {
                    return <span className='cursor-pointer'
                                 onClick={() => this.onDeleteApp(mainRecord.id, record.id)}><a><img
                        src={require('../../images/delete.png')} style={{width: 18}}/></a></span>
                },
                width: "10%",
            },
        ];
        return (
            <Card className="antd-table-nested">
                <Table
                    columns={columns}
                    size="small"
                    dataSource={(mainRecord && mainRecord.requestList) || []}
                    pagination={{pageSize: 5}}
                />
            </Card>
        );
    };

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onCancel = () => {
        this.setState({
            current: 2,
            userMappings: []
        })
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSelectChange = (value) => {
        this.setState({
            catalogType: value
        })
    }

    onDatePickerChange = (date, dateString, name) => {
        this.setState({
            [name]: date,
        })
    }

    onEdit = () => {
        this.setState({
            current: 1,
        })
    }

    render() {
        const {current, selectedUsers, isLoading, userList, catalogType, selectedItem, userMappings, requestName, searchUser, action} = this.state;
        const getEmail = (record) => {
            if (Array.isArray(record.emails) && record.emails.length) {
                const primaryEmail = record.emails.find(x => x.primary);
                if (primaryEmail) {
                    return primaryEmail.value;
                } else {
                    return record.emails[0].value;
                }
            }
            return '';
        }
        const users = []
        userList.forEach(user => {
            if (selectedUsers.indexOf(user.key) !== -1) {
                users.push({
                    ...user,
                })

            }
        })
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span>Name: <b>{record && record.displayName}</b><br/> UserName: <b>{record && record.userName}</b></span>
                },
                width: "70%",

            },
            {
                render: (record) => {
                    return (
                        <span>Email: <b>{getEmail(record)}</b></span>);
                },
                width: "20%",

            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                render: (record) => {
                    return <span className='cursor-pointer' onClick={() => this.onDeleteUser(record)}><a><img
                        src={require('../../images/delete.png')} style={{width: 18}}/></a></span>
                },
                width: "10%",

            },

        ];
        return (
            <Container className="dashboard request">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='custom-card-header'>
                                <Row className="main-div">
                                    <Col md={10} sm={12} xs={12}>
                                        <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5"><a><img
                                                src={require("../../images/request.png")}
                                                style={{width: 40}}/></a></span>
                                            <h4 className="mt-10">{!this.isSelf() ? "Request For Others" : "Request For Self"}</h4>
                                        </Col>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    isLoading ?
                                        <Spin className='custom-loading mt-50'/> :
                                        <>
                                           {((current === 1 &&  this.isSelf()) || (current === 1 &&  !this.isSelf()) ) &&
                                           <Row className="mt-10">
                                                <Col md="6" sm="12">
                                                    <Row className="align-items-center">
                                                        <Col md="6" sm="12">
                                                            <div className="d-flex align-items-center">
                                                                <span className="mr-11"><b>Request Name</b></span>
                                                                <Input onChange={this.onChange} style={{width: 270}} value={requestName} name="requestName"/>
                                                            </div>
                                                        </Col>
                                                        <Col md="6" sm="12">
                                                            <div className="d-flex align-items-center">
                                                                <span className="mr-10"><b>Action</b></span>
                                                                <Select style={{width: "100%"}} value={action} size="small">
                                                                    <option value={'add'}>Add</option>
                                                                </Select>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                           }
                                            <Row>
                                                <Col md="6" sm="12">
                                                    {
                                                        current === 1 && !this.isSelf() ?
                                                            <>
                                                                <Transfer className="mt-20"
                                                                          dataSource={userList || []}
                                                                          showSearch
                                                                          filterOption={this.filterOption}
                                                                          listStyle={{
                                                                              width: 300,
                                                                              height: 300,
                                                                          }}
                                                                          operations={['Select', 'Unselect']}
                                                                          targetKeys={selectedUsers}
                                                                          onChange={this.handleUserChange}
                                                                          render={(item) => `${item.displayName}`}
                                                                />
                                                            </> : null
                                                    }
                                                </Col>
                                            </Row>
                                            {
                                                (current === 2 || current === 1 && this.isSelf()) &&
                                                <Row>
                                                    <Col md="12" sm="12">
                                                        {
                                                            !this.isSelf() &&
                                                            <>
                                                                <Row className="align-items-center">
                                                                    <Col md={12} sm={12} xs={12}>
                                                                        <div className='user-header'
                                                                             style={{height: 35, paddingTop: 2}}>
                                                                            {
                                                                                (users || []).slice(0, 3).map((x, i) => {
                                                                                    return <span
                                                                                        className="mt-10 ml-10 fs-18">{x.displayName}</span>
                                                                                })

                                                                            }
                                                                            <span
                                                                                className="mt-20 ml-10 fs-18 ">&nbsp;{users.length > 3 ? `+${users.length - 3} more` : null}</span>
                                                                            <Button
                                                                                className=" add-to-cart edit square mt-5 pull-right mr-10"
                                                                                size={"small"}
                                                                                color="primary"
                                                                                onClick={this.onEdit}>Edit</Button>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                                <hr/>
                                                            </>
                                                        }
                                                        <Row className="mt-10">
                                                            <Col md={3} sm={12} xs={12}>
                                                                <Search
                                                                    placeholder="Search Catalog" value={searchUser}
                                                                    name="searchUser" onChange={this.onChange}
                                                                />
                                                            </Col>
                                                            <Col md={3} sm={12} xs={12}>
                                                                <Select
                                                                    style={{width: "100%"}}
                                                                    placeholder="Select Catalog Type"
                                                                    value={catalogType}
                                                                    name="catalogType"
                                                                    size="small"
                                                                    onChange={this.onSelectChange}

                                                                >
                                                                    <option value=''>All
                                                                    </option>
                                                                    <option value='Group'>Group
                                                                    </option>
                                                                    <option value='Application'>Application
                                                                    </option>
                                                                </Select>
                                                            </Col>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <div className='text-right'>
                                                                    <Button className="square ml-10"
                                                                            size={"large"}
                                                                            color="primary"
                                                                            onClick={() => this.onSubmit(2)}
                                                                            disabled={!selectedItem.length}><span><img
                                                                        src={require('../../images/enter-arrow.png')}
                                                                        style={{width: 20}}
                                                                        className="ml-10 mr-10"/></span>Submit</Button>

                                                                    <Button className="square ml-10"
                                                                            size={"large"}
                                                                            color="primary"
                                                                            key={'btn'}
                                                                            onClick={this.onReview}
                                                                            disabled={!selectedItem.length}><a><img
                                                                        src={require('../../images/shopping-cart.png')}
                                                                        style={{width: 20}}
                                                                        className="ml-10 mr-10"/></a>Review
                                                                       {selectedItem.length ? <span className="btn-round-label">{selectedItem.length}</span> : null}</Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Table dataSource={this.getFiltered()} className="mt-20 main-table" size="small"
                                                               columns={this.getColumns()} showHeader={false}/>
                                                    </Col>
                                                </Row>

                                            }
                                            {
                                                current === 3 &&
                                                <Row>
                                                    <Col md={12} sm={12} xs={12}>
                                                        <div className='text-right'>
                                                            <Button className="square ml-10"
                                                                    size={"large"}
                                                                    color="primary" onClick={() => this.onSubmit(3)}
                                                                    disabled={!userMappings.length}><span><img
                                                                src={require('../../images/enter-arrow.png')}
                                                                style={{width: 20}}
                                                                className="ml-10 mr-10"/></span>Submit</Button>
                                                            <Button className="square ml-10"
                                                                    size={"large"}
                                                                    color="primary"
                                                                    onClick={this.onCancel}><a><img
                                                                src={require('../../images/multiply.png')}
                                                                style={{width: 20}} className="ml-10 mr-10"/></a>Cancel</Button>
                                                        </div>
                                                    </Col>
                                                    <Col md={12} sm={12} xs={12} className="mt-10">
                                                        <div className="inner-profile-right">
                                                            <Table
                                                                columns={columns}
                                                                size="medium"
                                                                className={`user-profile-data no-padding-table`}
                                                                expandedRowRender={this.expandedRowRender}
                                                                expandIcon={this.customExpandIcon}
                                                                dataSource={userMappings}
                                                                showHeader={false}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            }
                                        </>
                                }
                                <div className="mt-20">
                                    {current === 1 &&
                                    <Button
                                        disabled={!selectedUsers.length}
                                        className="float-right" type="primary" onClick={this.next}>
                                        Next
                                    </Button>
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default Request


