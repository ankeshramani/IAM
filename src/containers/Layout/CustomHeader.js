import React, { Component } from 'react';
import TopbarProfile from './topbar/TopbarProfile';
import './Header.scss';

class CustomHeader extends Component{
    render() {
        let title = this.props.title;
        return(
           <div className="d-flex header-custom">
               <div className="logo w-20-p text-center fs-30"><a className="topbar__logo" href="/iga/LDAPDEMO1"></a></div>
               <div className="custom-title">
                   {
                       title
                   }
                 <div className="pull-right pr-30">
                   <TopbarProfile />
                 </div>
               </div>

           </div>
        )
    }
}

export default CustomHeader
