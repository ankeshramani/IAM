import React, { PureComponent } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import TopbarMenuLink from './TopbarMenuLink';
import Cookies from "universal-cookie";


const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

class TopbarProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      clientId: props.match.params.clientId
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  onLogout = () => {
    const cookies = new Cookies();
    cookies.remove('JWT_ACCESSTOKEN',  { path: '/' });
    cookies.remove('REGISTERED_APPNAME', { path: '/' });
    cookies.remove('LOGGEDIN_USERID', { path: '/' });
    window.location.replace(`/iga/logout`);
  }

  getUserName = () => {
    const cookies = new Cookies();
    let userName = cookies.get('LOGGEDIN_USERID') || '';
    if (userName.length > 20) {
      userName = userName.substr(0, 20) + '..'
    }
    return userName;
  }

  render() {
    const { collapse, clientId } = this.state;

    return (
      <div className="topbar__profile">
        <button type="button" className="topbar__avatar" onClick={this.toggle}>
          <img className="topbar__avatar-img" src={Ava} alt="avatar" />
          <p className="topbar__avatar-name"><b>{this.getUserName()}</b></p>
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button type="button" className="topbar__back" onClick={this.toggle} />}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            <span onClick={this.onLogout}>
              <a className="topbar__link"><span className="topbar__link-icon lnr lnr-exit"></span><p
                className="topbar__link-title">Log Out</p></a>
            </span>
            <TopbarMenuLink title="Admin" icon="user" path={`/${clientId}/admin/connector/direct`}/>
            <TopbarMenuLink title="Certification" icon="user" path={`/${clientId}/certification`} />
            <TopbarMenuLink title="Requests" icon="user" path={`/${clientId}/requests`} />
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: (state && state.auth && state.auth.info) || {},
});

export default connect(mapStateToProps, null) (withRouter(TopbarProfile));
