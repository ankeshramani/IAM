import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
const HomePage = React.lazy(() => import('../Home/index'));
const Certification = React.lazy(() => import('../Certification/index'));
const ApplicationManage = React.lazy(() => import('../FileBoarding/ApplicationManage'));
const NewApplication = React.lazy(() => import('../FileBoarding/NewApplication'));
const UserManage = React.lazy(() => import('../FileBoarding/UserManage'));
const NewUser = React.lazy(() => import('../FileBoarding/NewUser'));
const AppOwner = React.lazy(() => import('../CreateCamping/AppOwner'));
const UserManager = React.lazy(() => import('../CreateCamping/UserManager'));
const UserManager2 = React.lazy(() => import('../CreateCamping/UserManager2'));
const AddAccess = React.lazy(() => import('../DelegatedAdmin/AddAccess'));
const ReviewAndApprove = React.lazy(() => import('../AppOwner/ReviewAndApprove'));
const Administration = React.lazy(() => import('../Notification/Administration'));
const EmailTemplates = React.lazy(() => import('../Notification/EmailTemplates'));
const Reporting= React.lazy(() => import('../Reporting/Reporting'));
const Direct= React.lazy(() => import('../Connector/Direct'));
const FileUpload= React.lazy(() => import('../Connector/FileUpload'));
const CreateUser= React.lazy(() => import('../User/CreateUser'));
const Jobs= React.lazy(() => import('../ScheduledJobs'));
const Users= React.lazy(() => import('../User/Users'));
const Request= React.lazy(() => import('../Request/Request'));
const ReviewRequest= React.lazy(() => import('../ReviewRequest'));

const loading = () => <div className="load">
  <div className="load__icon-wrap text-center ">
    <svg className="load__icon">
      <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
    </svg>
  </div>
</div>

const Pages = () => (
  <Suspense fallback={loading()}>
    <Switch>
      <Route path="/" component={HomePage} />
    </Switch>
  </Suspense>
);

const wrappedRoutes = () => (
  <div>
    <div className="container__wrap sidebar-hidden pt-0 public-area">
      <Suspense fallback={loading()}>
        <Switch>
          <Route path="/:clientId/certification/:id" component={HomePage} />
          <Route path="/:clientId/requests" component={ReviewRequest} />
          <Route path="/:clientId/" component={Certification} />
        </Switch>
      </Suspense>
    </div>
  </div>
);

const wrappedRoutesAdmin = () => (
  <div>
    <Layout isSideBar={true} />
    <div className="container__wrap admin-part">
      <Suspense fallback={loading()}>
        <Switch>
          <Route  path="/:clientId/admin/application-manage" component={ApplicationManage} />
          <Route  path="/:clientId/admin/user-manage" component={UserManage} />
          <Route  path="/:clientId/admin/application/new" component={NewApplication} />
          <Route  path="/:clientId/admin/application/edit" component={NewApplication} />
          <Route  path="/:clientId/admin/application/upload" component={NewApplication} />
          <Route  path="/:clientId/admin/user/new" component={NewUser} />
          <Route  path="/:clientId/admin/user/edit" component={NewUser} />
          <Route  path="/:clientId/admin/user/upload" component={NewUser} />
          <Route  exact path="/:clientId/admin/app-owner" component={AppOwner} />
          <Route  path="/:clientId/admin/manage-campaign" component={UserManager} />
          <Route  path="/:clientId/admin/user-manager2" component={UserManager2} />
          <Route  path="/:clientId/admin/delegated-admin/add-access" component={AddAccess} />
          <Route  path="/:clientId/admin/app-owner/review-and-approve" component={ReviewAndApprove} />
          <Route  path="/:clientId/admin/notification/administration" component={Administration} />
          <Route  path="/:clientId/admin/notification/email-templates" component={EmailTemplates} />
          <Route  path="/:clientId/admin/reporting" component={Reporting} />
          <Route  path="/:clientId/admin/connector/direct" component={Direct}/>
          <Route  path="/:clientId/admin/connector/file-upload" component={FileUpload}/>
          <Route  path="/:clientId/admin/user/create-user" component={CreateUser}/>
          <Route  path="/:clientId/admin/users" component={Users}/>
          <Route  path="/:clientId/admin/scheduled-jobs" component={Jobs}/>
          <Route  path="/:clientId/admin/request/request-for-others" component={Request}/>
          <Route  path="/:clientId/admin/request/request-for-self" component={Request}/>
        </Switch>
      </Suspense>
    </div>
  </div>
);

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, userinfo: null };
  }

  async componentDidMount() {
    window.onLogOut = () => {
    }
  }

  render() {
    return (
      <div>
           <Switch>
             <Route path="/:clientId/admin" component={wrappedRoutesAdmin}/>
             <Route path="/:clientId" component={wrappedRoutes}/>
           </Switch>
       </div>
    );
  }
}

export default MainContainer;
