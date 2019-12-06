import React, {Component} from 'react';
import { Row, Col} from "reactstrap";
import {Input, Select, Icon, Checkbox,} from 'antd'
const {TextArea} = Input;
const {Option} = Select;

class FirstStep extends Component {
    render() {
        const {certOwner, certificationName, isUserManager, certificationDescription, toggleUserSearchModal, onChange, onCheckBoxCheck} = this.props;
        return (
            <Row className="align-items-center step-row">
                <Col md={3} sm={12} xs={12}><b>Campaign Type</b></Col>
                <Col md={9} sm={12} xs={12}>
                    <Select disabled={true} value={1} style={{width: "100%"}}>
                        <Option value={1}>User Manager</Option>
                    </Select>
                </Col>
                <Col md={3} sm={12} xs={12}><b>Certification Name</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10"><Input name="certificationName" value={certificationName} onChange={onChange}/></Col>
                <Col md={3} sm={12} xs={12}><b>Description</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10"><TextArea name="certificationDescription" value={certificationDescription} onChange={onChange}/></Col>
                <Col md={3} sm={12} xs={12}><b>Owner</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Input value={certOwner} disabled={true} onChange={onChange} name="certOwner"  addonAfter={<Icon type="search" onClick={toggleUserSearchModal}/>}/>
                </Col>
                <Col md={3} sm={12} xs={12}><b>Certifier</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Checkbox name='isUserManager' checked={isUserManager} disabled={true} onChange={onCheckBoxCheck}>Is User Manager</Checkbox>
                </Col>
            </Row>
        )
    }
}

export default FirstStep
