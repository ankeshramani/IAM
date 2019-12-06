import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";

import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            clientId: props.match.params.clientId
        };
    }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
      const {clientId} = this.state;
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          {/*<SidebarCategory title="File OnBoarding" icon="diamond">
          <SidebarCategory title="Application">
            <SidebarLink title="Manage" route="/admin/application-manage" onClick={this.hideSidebar} />
          </SidebarCategory>
            <SidebarCategory title="User">
              <SidebarLink title="Manage" route="/admin/user-manage" onClick={this.hideSidebar} />
            </SidebarCategory>
          </SidebarCategory>*/}
            {/*<SidebarLink title="File OnBoarding" icon="diamond" route="/admin/application-manage" onClick={this.hideSidebar} />*/}
            <SidebarCategory title="Data Import" icon="diamond">
                <SidebarLink title="Direct" route={`/${clientId}/admin/connector/direct`} onClick={this.hideSidebar} />
                <SidebarLink title="File Upload" route={`/${clientId}/admin/connector/file-upload`} onClick={this.hideSidebar} />
            </SidebarCategory>
         {/* <SidebarCategory title="Create Campaign" icon="diamond">
              <SidebarLink title="App Owner" route="/admin/app-owner" onClick={this.hideSidebar} />
              <SidebarLink title="User Manager" route="/admin/user-manager" onClick={this.hideSidebar} />
          </SidebarCategory>*/}
            <SidebarLink title="Manage Campaign" icon="diamond" route={`/${clientId}/admin/manage-campaign`} onClick={this.hideSidebar}/>
          <SidebarCategory title="Delegated Admin" icon="diamond">
              <SidebarLink title="Add Access" route={`/${clientId}/admin/delegated-admin/add-access`} onClick={this.hideSidebar} />
              <SidebarLink title="User Profile Mgmt" route={`/${clientId}/admin/user-manager`} onClick={this.hideSidebar} />
              <SidebarLink title="Check Status" route={`/${clientId}/admin/user-manager`} onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="App Owner" icon="diamond">
              <SidebarLink title="Review and Approve" route={`/${clientId}/admin/app-owner/review-and-approve`} onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="Notification" icon="diamond">
              <SidebarLink title="Administration" route={`/${clientId}/admin/notification/administration`} onClick={this.hideSidebar} />
              <SidebarLink title="Email Templates" route={`/${clientId}/admin/notification/email-templates`} onClick={this.hideSidebar} />
          </SidebarCategory>
              <SidebarLink title="Users" icon="diamond" route={`/${clientId}/admin/users`} onClick={this.hideSidebar} />
            <SidebarLink title="Reporting" icon="diamond" route={`/${clientId}/admin/reporting`} onClick={this.hideSidebar} />
           <SidebarLink title="Scheduled Jobs" icon="diamond" route={`/${clientId}/admin/scheduled-jobs`} onClick={this.hideSidebar} />
           {/* <SidebarCategory title="Reporting" icon="diamond">
              <SidebarLink title="Reporting" route="/admin/reporting" onClick={this.hideSidebar} />
          </SidebarCategory>*/}
            <SidebarCategory title="Request" icon="diamond">
                <SidebarLink title="Request For Others" route={`/${clientId}/admin/request/request-for-others`} onClick={this.hideSidebar} />
                <SidebarLink title="Request For Self" route={`/${clientId}/admin/request/request-for-self`} onClick={this.hideSidebar} />
            </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default withRouter(SidebarContent);
