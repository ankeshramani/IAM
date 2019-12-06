import React, {Component} from 'react';
import moment from 'moment';
import {Card, CardBody, Container, Row, Col, CardHeader,} from "reactstrap";
import {Select, Icon, Table, Checkbox, Steps, Button, InputNumber, message, Spin} from 'antd';
import UserSearchModal from './UserSearchModal';
const {Option} = Select;
const {Step} = Steps;
import './AppOwner.scss';
import {ApiService} from "../../services/ApiService";
import Cookies from "universal-cookie";
import FirstStep from "./Step/FirstStep";
import SecondStep from "./Step/SecondStep";
import ThirdStep from "./Step/ThirdStep";
import FourthStep from "./Step/FourthStep";

const statusType = {
  SIGN_OFF: 'SIGNEDOFF',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
}

const getStatusName = (status) => {
  if (status === statusType.ACTIVE || status === 'INPROGRESS') {
    return 'In-Progress';
  } else if (status === statusType.COMPLETED){
    return 'Completed'
  } else if (status === statusType.SIGN_OFF){
    return 'Signed-Off'
  }
  return status;
}

class UserManager extends Component {
  _apiService = new ApiService()
    constructor(props) {
    super(props);
    this.state = {
      clientId: props.match.params.clientId,
      current: 0,
      reminderFrequencyOption: ['Every', 'BeforeDueDate'],
      includedAppsOptions: ['Active Directory', 'Peoplesoft', 'LDAP'],
      reminderFrequencies: [{frequency: '', days: ''}],
      SendReminderEmail: false,
      IncludedApps: '',
      includedAppsData: [],
      certOwners: ['user 1', 'user 2', 'user 3', 'user 4'],
      isUserSearchModal: false,
      departmentList: ['Sales', 'IAM', 'Admin', 'HR', 'Accounts'],
      rolesList: ['Developer', 'Consultant', 'Sr. Consultant', 'HR Admin', 'HR', 'Account', 'Manager', 'Clerk', 'Sales VP', 'Sales executive'],
      selectedDepartmentList: [],
      selectedRoleList: [],
      isUserManager: true,
      frequency: '',
      campaignDuration: 30,
      undecidedAccess: '',
      certificationDescription: '',
      certificationName: '',
      certificationFrequency: '',
      certificationStartDate: '',
      certificationNumberFrequency: '',
      isObjective: true,
      isEdit: false,
      isLoading: false,
      isCreateCampaign: false,
      isAddCampaign: false,
      campaignList: [],
      selectedRecord: {},
      campaignId:'',
      selectedUserCriteriaOption: 'all'
    };
  }

  componentDidMount() {
      this.getCampaigns()
  }

  getCampaigns = async () =>{
    this.setState({
      isLoading: true
    });
    const data = await this._apiService.getCampaigns()
    if(!data || data.error){
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      this.setState({
        campaignList: data,
        isLoading: false
      })
    }
  }

  next() {
    const current = this.state.current + 1;
    this.setState({current});
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({current});
  }

  selectChange = (e) => {
    const {reminderFrequencies} = this.state;
    let {reminderFrequencyOption} = this.state;
    reminderFrequencies[e.target.index][e.target.name] = e.target.value;
    this.setState({
      reminderFrequencies,
      reminderFrequencyOption
    });
  }

  onAddFrequency = e => {
    let reminderFrequencies = this.state.reminderFrequencies.concat([{frequency: '', days: ''}])
    this.setState({
      reminderFrequencies
    })
  }

  onDeleteFrequency = (index) => {
    const {reminderFrequencies} = this.state;
    this.setState({
      reminderFrequencies: reminderFrequencies.filter((x, i) => i !== index)
    })
  }

  onCheckBoxCheck = (e) => {
    const newState = {};
    const {name, checked} = e.target;
    if (name === 'certificationForOneTime' && checked) {
      newState.frequency = '';
    }
    if (name === 'certificationToRunNow' && checked) {
      newState.startDate = null;
    }
    this.setState({
      [e.target.name]: e.target.checked,
      ...newState
    })
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onDatePickerChange = (date, dateString, name) => {
    this.setState({
      [name]: date,
    })
  }

  addIncludedApps = () => {
    const {selectedApp, includedAppsData} = this.state;
    if (selectedApp) {
      const data = {AppName: selectedApp, Entitlement: '', Objective: '', IsAppOwner: false, certifier: ''};
      includedAppsData.push(data)
    }
    this.setState({
      includedAppsData,
      selectedApp: ''
    });
  }

  removeIncludedApps = (index) => {
    const {includedAppsData} = this.state;
    this.setState({
      includedAppsData: includedAppsData.filter((x, i) => i !== index)
    });
  }

  addDepartment = () => {
    const {selectedDepartment, selectedDepartmentList} = this.state;
    if (selectedDepartment) {
      selectedDepartmentList.push({Name: selectedDepartment});
    }
    this.setState({
      selectedDepartmentList,
      selectedDepartment: ''
    });
  }

  addRole = () => {
    const {selectedRole, selectedRoleList} = this.state;
    if (selectedRole) {
      selectedRoleList.push({Name: selectedRole});
    }
    this.setState({
      selectedRoleList,
      selectedRole: ''
    });
  }

  removeDepartment = (index) => {
    const {selectedDepartmentList} = this.state;
    this.setState({
      selectedDepartmentList: selectedDepartmentList.filter((x, i) => i !== index)
    })
  }

  removeRole = (index) => {
    const {selectedRoleList} = this.state;
    this.setState({
      selectedRoleList: selectedRoleList.filter((x, i) => i !== index)
    })
  }

  onChangeEntitlement = (e, index) => {
      const {includedAppsData} = this.state;
    if(e.target.name === 'Entitlement' && e.target.value !== 'Objective'){
      includedAppsData[index].Objective = '';
    }
      includedAppsData[index][e.target.name] = e.target.value;
      this.setState({
        includedAppsData
      });
  }

  onCertOwnerSelect = (data) => {
    this.setState({
      certOwner: `${data.firstName} ${data.lastName} (${data.userID})`,
      certOwnerUserName: data.userID,
      isUserSearchModal: false,
    });
  }

  toggleUserSearchModal = () => {
    this.setState({
      isUserSearchModal: !this.state.isUserSearchModal
    });
  }

  userSearchModal = () => {
    const {isUserSearchModal} = this.state;
    return (
      <UserSearchModal visible={isUserSearchModal} onHide={this.toggleUserSearchModal}
                       onSelect={this.onCertOwnerSelect}/>
    )
  }

  onCreateCampaign = async () => {
    this.setState({
      isCreateCampaign: true
    });
    const {certificationName, certificationDescription, certOwner, certificationFrequency,
      campaignDuration, certificationForOneTime, certificationToRunNow,includedAppsData, selectedDepartmentList,
      selectedUserCriteria, selectedRoleList, certOwnerUserName, certificationNumberFrequency, isEdit, campaignId, campaignList, certificationStatus } = this.state;
    const certificationDays = `${certificationNumberFrequency}${certificationFrequency}`
    const scopeCriteria = [];
    const selectionCriteria = [];
    let scopeCriteriaObj = {};
    let selectionCriteriaObj = {};
    let certificationStartDate = this.state.certificationStartDate ? moment(this.state.certificationStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    (includedAppsData || []).forEach((x)=>{
      scopeCriteriaObj = {
        name: 'Application',
        value: x.AppName
      };
      scopeCriteria.push(scopeCriteriaObj);
    });

    if(selectedUserCriteria === 'department'){
      (selectedDepartmentList || []).forEach((x)=>{
        selectionCriteriaObj = {
          name: 'Department',
          value: x.Name
        };
        selectionCriteria.push(selectionCriteriaObj);
      });
    } else {
      (selectedRoleList || []).forEach((x)=>{
        selectionCriteriaObj = {
          name: 'Role',
          value: x.Name
        };
        selectionCriteria.push(selectionCriteriaObj);
      });
    }
    const certificationExpiration = moment(certificationStartDate).add(Number(campaignDuration || '0') , 'days').format("YYYY-MM-DD");
    const payload = {
      certificationType: "UserCertification",
      certificationName,
      certificationDescription,
      certificateRequester: certOwnerUserName,
      certificationFrequency: certificationDays,
      certificationExpiration,
      certificationForOneTime: certificationForOneTime ? 'yes' : 'no',
      certificationStartDate: certificationStartDate,
      certificationToRunNow: certificationToRunNow ? 'yes' : 'no',
      criteria: {
        selectionCriteria,
        scopeCriteria
      }
    };
    if(isEdit){
      const findIndex = (campaignList || []).findIndex((x) => x.campaignId === campaignId);
      const newPayload = {
        certificationType: "UserCertification",
        certificationName,
        certificationDescription,
        certificateRequester: certOwner,
        certificationFrequency: certificationDays,
        certificationExpiration,
        certificationStatus,
        certificationForOneTime: certificationForOneTime ? 'yes' : 'no',
        certificationStartDate: certificationStartDate,
        certificationToRunNow: certificationToRunNow ? 'yes' : 'no',
      };
      if(findIndex > -1){
        campaignList[findIndex].certificationInfo = newPayload;
        this.setState({
          campaignList,
          isEdit: false,
          isCreateCampaign: false,
          current: 0,
        })
      }
    }else {
      const data = await ApiService.createCampaign(payload)
      if(!data || data.error) {
        this.setState({
          isCreateCampaign: false,
        });
        return message.error('something is wrong! please try again');
      }else {
        // if (data && data.campaignId) {
        //   await ApiService.createCampaignUsers(data && data.campaignId)
        // }
        this.getCampaigns()
        this.setState({
          isAddCampaign: false,
          isCreateCampaign: false,
        });
        return message.success('Campaign created successfully!');
      }
    }
  }

  onEdit = (selectedRecord,campaignId, isEdit) => {
    let intNumber = parseInt(selectedRecord.certificationFrequency);
    let days = '';
     if(!isNaN(intNumber)){
       days = selectedRecord.certificationFrequency.replace(String(intNumber), "");
       days = days ? days.trim() : '';
     } else {
       intNumber = '';
     }
    this.setState({
      certificationType: selectedRecord.certificationType,
      certificationName: selectedRecord.certificationName,
      certificationDescription: selectedRecord.certificationDescription,
      certOwner: selectedRecord.certificateRequester,
      certificationNumberFrequency: intNumber,
      certificationFrequency: days,
      certificationStatus: selectedRecord.certificationStatus,
      certificationStartDate: selectedRecord.certificationStartDate && selectedRecord.certificationStartDate.trim() ? moment(selectedRecord.certificationStartDate) : '',
      certificationToRunNow: selectedRecord.certificationToRunNow === 'yes',
      certificationForOneTime: selectedRecord.certificationForOneTime === 'yes',
      isEdit,
      campaignId,
      current: 3,
    })
  }

  onCancel = () => {
    this.setState({
      selectedRecord: {},
      isEdit: false,
      current: 0,
      isAddCampaign: false,
      certificationType:'',
      certificationName: '',
      certificationDescription: '',
      certOwner: '',
      certificationNumberFrequency: '',
      certificationFrequency: '',
      certificationStatus: '',
      certificationStartDate:  '',
      certificationToRunNow: false,
      certificationForOneTime: false,
    })
  }

  getColumns = () => {
    return [
      {
        title: 'Name',
        render: (record) => (<span>{record.certificationInfo.certificationName}</span>)
      },
      {
        title: 'Type',
        render: (record) => (<span>{record.certificationType}</span>)
      },
      {
        title: 'Description',
        render: (record) => (<span>{record.certificationInfo.certificationDescription}</span>)
      },
      {
        title: 'Owner',
        render: (record) => (<span>{record.certificationInfo.certificateRequester}</span>)
      },
      {
        title: 'Last Run',
        dataIndex: 'status',
      },
      {
        title: 'Status',
        render: (record) => (<span>{getStatusName(record.certificationInfo.certificationStatus)}</span>)
      },
      {
        title: '',
        render: (record) => {
          return <div>
            <span className='cursor-pointer' onClick={()=> this.onEdit(record.certificationInfo, record.campaignId, true)}><a><img src={require('../../images/edit.png')} style={{width: 18}} /></a></span>
              <span className='cursor-pointer ml-5'><a><img src={require('../../images/run.png')} style={{width: 19}} /></a></span>
          </div>
        }
      },
    ];
  }

  getUserName = () => {
    const cookies = new Cookies();
    let userName = cookies.get('LOGGEDIN_USERID') || '';
    if (userName.length > 20) {
      userName = userName.substr(0, 20) + '..'
    }
    return userName;
  }

  onAddCampaign = (isAddCampaign) => {
    this.setState({
      isAddCampaign,
      undecidedAccess: 'Maintain access to undecided items',
      SendWelcomeEmailToReviewers: true,
      certOwner: this.getUserName()

    });
  }


  render() {
    const {current, campaignList, isEdit, isLoading, isAddCampaign, selectedRecord, certOwner, certificationName, isUserManager, certificationDescription,
      certificationForOneTime, certificationToRunNow, certificationFrequency, certificationStartDate, campaignDuration, undecidedAccess, certificationNumberFrequency,
      selectedApp, includedAppsOptions, includedAppsData, selectedUserCriteria, selectedRole, selectedRoleList, selectedUserCriteriaOption, departmentList,
      rolesList, selectedDepartment, selectedDepartmentList,reminderFrequencies, SendReminderEmailReviewers, reminderFrequencyOption, SendWelcomeEmailToReviewers, isCreateCampaign
    } = this.state;
    const firstStep = (
        <FirstStep selectedRecord={selectedRecord}
                   toggleUserSearchModal={this.toggleUserSearchModal}
                   onCheckBoxCheck={this.onCheckBoxCheck}
                   onChange={this.onChange}
                   certOwner={certOwner}
                   certificationName={certificationName}
                   isUserManager={isUserManager}
                   certificationDescription={certificationDescription}
        />
    );
    const secondStep = (
        <SecondStep
            certificationNumberFrequency={certificationNumberFrequency}
            certificationForOneTime={certificationForOneTime}
            certificationToRunNow={certificationToRunNow}
            certificationFrequency={certificationFrequency}
            certificationStartDate={certificationStartDate}
            campaignDuration={campaignDuration}
            undecidedAccess={undecidedAccess}
            onChange={this.onChange}
            onCheckBoxCheck={this.onCheckBoxCheck}
            onDatePickerChange={this.onDatePickerChange}
        />
    );
    const thirdStep = (
        <ThirdStep
            selectedApp={selectedApp}
            includedAppsOptions={includedAppsOptions}
            includedAppsData={includedAppsData}
            selectedUserCriteria={selectedUserCriteria}
            selectedRole={selectedRole}
            selectedRoleList={selectedRoleList}
            selectedUserCriteriaOption={selectedUserCriteriaOption}
            departmentList={departmentList}
            rolesList={rolesList}
            selectedDepartment={selectedDepartment}
            selectedDepartmentList={selectedDepartmentList}
            onChangeEntitlement={this.onChangeEntitlement}
            removeIncludedApps={this.removeIncludedApps}
            removeDepartment={this.removeDepartment}
            removeRole={this.removeRole}
            addIncludedApps={this.addIncludedApps}
            onChange={this.onChange}
            addDepartment={this.addDepartment}
            addRole={this.addRole}
        />
    );
    const fourthStep = (
        <FourthStep
            reminderFrequencies={reminderFrequencies}
            SendReminderEmailReviewers={SendReminderEmailReviewers}
            reminderFrequencyOption={reminderFrequencyOption}
            SendWelcomeEmailToReviewers={SendWelcomeEmailToReviewers}
            onCheckBoxCheck={this.onCheckBoxCheck}
            selectChange={this.selectChange}
            onDeleteFrequency={this.onDeleteFrequency}
            onAddFrequency={this.onAddFrequency}
        />
    );

    return (
      <Container className="dashboard">
        {this.userSearchModal()}
        <Row>
          <Col>
            <Card>
              <CardHeader className='custom-card-header'>
                <Row className="main-div">
                  <Col md={10} sm={12} xs={12}>
                    <Col md={6} sm={12} xs={12} className="d-flex">
                      <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/campaign.png")} style={{width: 40}}/></a></span>
                      <h4 className="mt-10">Campaign Management</h4>
                    </Col>
                  </Col>
                  <Col md={2} sm={12} xs={12} className="text-right">
                    {(!isEdit && !isAddCampaign) && <Button type="primary" className="square" size="small" onClick={() => this.onAddCampaign(true)}><a><img src={require("../../images/plus-symbol.png")} style={{width: 18}}/></a>&nbsp;Create Campaign</Button>}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {
                  isLoading ? <Spin className='custom-loading mt-50'/> :
                      <>
                        {
                          (!isEdit && !isAddCampaign) ?
                              <Row>
                                <Col md={12} sm={12} xs={12} className='mt-10'>
                                  <Table columns={this.getColumns()} size='small' dataSource={campaignList}/>
                                </Col>
                              </Row> :
                              <>
                                <Row>
                                  <Col md="3" sm="12">
                                    <span className="fs-18 text-primary cursor-pointer" onClick={this.onCancel}><Icon type="arrow-left"/></span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="3" sm="12" className="mt-10">
                                    <Steps direction="vertical" size="small" current={current}>
                                      <Step title="Basic Definition"/>
                                      <Step title="Campaign Schedule"/>
                                      <Step title="Campaign Scope"/>
                                      <Step title="Campaign Notification"/>
                                    </Steps>
                                  </Col>
                                  <Col md="9" sm="12">
                                    {current === 0 && firstStep}
                                    {current === 1 && <>{firstStep}{secondStep}</>}
                                    {current === 2 && <>{firstStep}{secondStep}{thirdStep}</>}
                                    {current === 3 && <>{firstStep}{secondStep}{thirdStep}{fourthStep}</>}
                                  </Col>
                                </Row>
                                <div className="mt-20">
                                  {current >= -1 && current < 3 &&
                                  <Button className="float-right" type="primary" onClick={() => this.next()}>
                                    Next
                                  </Button>
                                  }
                                  {
                                    current === 3 &&
                                    <>
                                      <Button type="primary float-right" className="mr-5" onClick={this.onCreateCampaign}>{isCreateCampaign ? <Spin/> : 'Save'}</Button>
                                    </>
                                  }
                                </div>
                              </>
                        }
                      </>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UserManager
