import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col, Button} from "reactstrap";
import {Radio, Input, Upload, Icon, Checkbox, Select, Table} from 'antd';

const {Option} = Select;

class ApplicationManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNewApplication: false,
            isMapping: false,
        };

    }
    onEdit = () => {
        this.props.history.push('/admin/application/edit')
    }

    onUpload = () =>{
        this.props.history.push('/admin/application/upload')
    }

    getColumns = () => {
        return [
            {
                title: 'Application Name',
                dataIndex: 'ApplicationName'
            },
            {
                title: 'Description',
                dataIndex: 'Description',
            },
            {
                title: 'Last Uploaded',
                dataIndex: 'LastUploaded',
            },
            {
                title: 'Uploaded By',
                dataIndex: 'UploadedBy',
            },
            {
                title: 'Action',
                render: () => {
                    return <div>
                        <span className="mr-5" onClick={this.onEdit}><Icon type="edit" className="fs-16"/></span>
                        <span onClick={this.onUpload}><Icon type="file-add" className="fs-16"/></span>
                    </div>
                }
            },

        ];
    }

    onClick = () => {
        this.props.history.push('/admin/application/new')
    }

    render() {
        const {isMapping} = this.state;
        const applicationData = [
            {
                ApplicationName: 'ApplicationName',
                Description: 'Description',
                LastUploaded: 'LastUploaded',
                UploadedBy: 'UploadedBy',
            },
            {
                ApplicationName: 'ApplicationName',
                Description: 'Description',
                LastUploaded: 'LastUploaded',
                UploadedBy: 'UploadedBy',
            },
            {
                ApplicationName: 'ApplicationName',
                Description: 'Description',
                LastUploaded: 'LastUploaded',
                UploadedBy: 'UploadedBy',
            },
        ]
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={12} sm={12} xs={12}>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Button className="icon square float-right" size={"sm"} color="primary"
                                                onClick={this.onClick}><p>Add New Application</p></Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Table className="mr-10"
                                               columns={this.getColumns()}
                                               size="small"
                                               dataSource={applicationData}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </Container>
        )
    }
}

export default ApplicationManage