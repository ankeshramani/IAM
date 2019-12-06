import axios from "axios";
import Cookies from "universal-cookie";
import { body } from "./campaignUserBody";
const apiEndPoint = 'http://cloud.kapstonellc.com:8084';
const oktaEndPoint = 'http://cloud.kapstonellc.com:8085';
const apiServiceEndPoint = 'https://preview.kapstonellc.com';
const axiosInstance = axios.create({
  baseURL: '',
});
const cookies = new Cookies();

const getTenantId = () =>{
  return cookies.get('REGISTERED_APPNAME')
}

const getUserName = () => {
 return  cookies.get('LOGGEDIN_USERID');
}

export class ApiService {

  static async getData(url, headers, cancelToken, data) {
    const config = {
      headers: {
        ...(headers || {}),
        'Content-Type': 'application/json'
      },
    };
    if (data) {
      config.data = data;
    }
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    const response = await axiosInstance.get(url, config).catch((err) => {
      data = {error: 'something went wrong'};
    });
    return data || response.data;
  }

  static async postMethod(url, data, headers, cancelToken) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    let resData = '';
    const response = await axiosInstance.post(url, data, config).catch(thrown => {
      if (thrown.toString() === 'Cancel') {
        resData = 'cancel';
      } else {
        resData = {error: 'something went wrong'};;
      }
    });
    return resData || response.data;
  }

  static async patchMethod(url, data, headers, cancelToken) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    let resData = '';
    const response = await axiosInstance.patch(url, data, config).catch(thrown => {
      if (thrown.toString() === 'Cancel') {
        resData = 'cancel';
      } else {
        resData = {error: 'something went wrong'};;
      }
    });
    return resData || response.data;
  }

  static async putMethod(url, data, headers) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    let resData = '';
    const response = await axiosInstance.put(url, data, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  static async deleteMethod(url, data, headers) {
    const config = {
      headers: {
        ...(headers || {})
      },
      data
    };
    let resData = '';
    const response = await axiosInstance.delete(url, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async getReviewAndApproveData(requestId, orgId, startDate, endDate) {
      return await ApiService.getData(`${apiEndPoint}/userDetailsbyParameters?requestId=${requestId}&orgId=${orgId}&startDate=${startDate || ''}&endDate=${endDate || ''}`);
  }

  async getAllUsers() {
      return await ApiService.getData(`${oktaEndPoint}/OKTAAppServices/OKTA/getAllUsers`);
  }

  async getAllApplications() {
      return await ApiService.getData(`${oktaEndPoint}/OKTAAppServices/OKTA/getAllApplications`);
  }

  async getCampaigns() {
      return await ApiService.getData(`${apiServiceEndPoint}/campaign/${getTenantId()}/getCampaigns`);
  }

  async getDirectSources() {
      return await ApiService.getData(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/getIdentityConfig`);
  }
  async getCertifications() {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertifications/${getUserName()}`);
  }

  async getRequests(assignee) {
    return await ApiService.getData(`${apiServiceEndPoint}/workflow/tasks?assignee=${assignee}`);
  }

  async getCertificateUsers(certificationId) {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertificateUsers/${certificationId}`);
  }

  async getUserDetails(userName, campaignID) {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getUserDetails/${userName}/${campaignID}`);
  }

  async getSMTP() {
      return await ApiService.getData(`${apiServiceEndPoint}/notification/jersey/email/getsmtp/${getTenantId()}`);
  }

  async getAllTemplates() {
      return await ApiService.getData(`${apiServiceEndPoint}/notification/jersey/email/getalltemplates/${getTenantId()}`);
  }

  static async putReviewAndApproveData(data) {
      return await ApiService.postMethod(`${apiEndPoint}/createMultipleUserDetails`, data);
  }

  static async createCampaign(data) {
      return await ApiService.postMethod(`${apiServiceEndPoint}/campaign/${getTenantId()}/createCampaign`, data);
  }

  static async submitRequestAction(data) {
    const config = {
    };
    return await axiosInstance.post(`${apiServiceEndPoint}/workflow/review`, data, config)
  }

  static async createCampaignUsers(campaignid) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/campaign/${getTenantId()}/getUsers/${campaignid}`, body);
  }

  static async createEmailStoreSMTP(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/notification/jersey/email/storesmtp/${getTenantId()}`, payload);
  }

  static async createEmailStoreTemplate(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/notification/jersey/email/storetemplate/${getTenantId()}`, payload);
  }

  static async certificationAction(data) {
    return await ApiService.patchMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/action`, data);
  }

  static async registration (tenantId, applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${tenantId}/loginconfig/${applicationType}`, data);
  }

  static async bulkAction(data) {
    return await ApiService.patchMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/bulkAction`, data);
  }

  static async getConfigForClient(data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/RequestJWTToken/jersey/TokenProvider/applicationType`, data);
  }

  static async localLogin(data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/RequestJWTToken/jersey/TokenProvider/requestToken`, data);
  }

  static async verifyToken(data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/RequestJWTToken/jersey/TokenProvider/verifyToken`, data);
  }

  static async directAuthcontroller(applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/identityconfig/${applicationType}`, data);
  }

  static async updateDirectAuthcontroller(applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/updateIdentityconfig/${applicationType}`, data);
  }

  static async uploadcsvAuthcontroller(applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/uploadcsv/${applicationType}`, data);
  }

  static async uploadXLSAuthcontroller(certificationId,  campaignId, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/submitOfflineCertification/${getUserName()}/${campaignId}/${certificationId}`, data);
  }


  async generateTenantID() {
    return await ApiService.getData(`${apiServiceEndPoint}/authcontroller/NEW/generateTenantID`);
  }

  static async LoadCSVScheduler() {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/start?jobName=${getTenantId()}_FLATFILE_TrustedRecon`);
  }

  static async LoadEnrichmentScheduler() {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/start?jobName=${getTenantId()}_ENRICHMENT_TrustedRecon`);
  }

  static async LoadDirectScheduler(jobName) {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/start?jobName=${jobName}_TrustedRecon`);
  }

  static async GetAllIdentityUsers(type) {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/getAllUser`);
  }

  static async GetScheduledJobs() {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/jobs`);
  }

  static async getUsersWorkflow(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/workflow/getusers`, payload);
  }
  static async getgroupsWorkflow(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/workflow/getgroups`, payload);
  }

  static async getappsWorkflow(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/workflow/getapps`, payload);
  }

  static async getOfflineCertificationDetails(certificationId) {
    return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getOfflineCertificationDetails/${certificationId}`);
  }

  static async submitWorkflow(data, headers) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    const response = await axiosInstance.post(`${apiServiceEndPoint}/workflow/submit`, data, config)
    return response;
  }









}
