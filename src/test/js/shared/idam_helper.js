let Helper = codecept_helper;
var TestData = require('../config/test_data');
const fetch = require('node-fetch');

let agentToUse;
if (process.env.PROXY_SERVER) {
  console.log('using proxy agent: ' + process.env.PROXY_SERVER);
  const HttpsProxyAgent = require('https-proxy-agent');
  agentToUse = new HttpsProxyAgent(process.env.PROXY_SERVER);
} else {
  console.log('using real agent');
//  const Https = require('https');
//  agentToUse = new Https.Agent({
//    rejectUnauthorized: false
//  });
}
const agent = agentToUse;

const NotifyClient = require('notifications-node-client').NotifyClient;
var notifyClient = new NotifyClient(TestData.NOTIFY_API_KEY);

class IdamHelper extends Helper {

    async createServiceData(serviceName){
        let token = await this.getAuthToken();
        this.createService(serviceName, '', token);
    }

    deleteService(service) {
        return fetch(`${TestData.IDAM_API}/testing-support/services/${service}`, {
            agent: agent,
            method: 'DELETE'
        });
    }

    deleteRole(role) {
        return fetch(`${TestData.IDAM_API}/testing-support/roles/${role}`, {
            agent: agent,
            method: 'DELETE'
        });
    }

    createService(serviceName, roleId, token) {
      let data;

      if(roleId === '') {
        data = {
          label: serviceName,
          description: serviceName,
          oauth2ClientId: serviceName,
          oauth2ClientSecret: 'autotestingservice',
          oauth2RedirectUris: ['https://idam.testservice.gov.uk'],
          onboardingEndpoint: '/autotest',
          onboardingRoles: ['auto-private-beta_role'],
          activationRedirectUrl: "https://idam.testservice.gov.uk",
          selfRegistrationAllowed: true
        };
      }else{
        data = {
          label: serviceName,
          description: serviceName,
          oauth2ClientId: serviceName,
          oauth2ClientSecret: 'autotestingservice',
          oauth2RedirectUris: ['https://idam.testservice.gov.uk'],
          onboardingEndpoint: '/autotest',
          onboardingRoles: ['auto-private-beta_role'],
          allowedRoles: [roleId, 'auto-admin_role'],
          activationRedirectUrl: "https://idam.testservice.gov.uk",
          selfRegistrationAllowed: true
        };
      }
      return fetch(`${TestData.IDAM_API}/services`, {
        agent: agent,
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + token },
      }).then(res => res.json())
        .then((json) => {
          return json;
        })
        .catch(err => err);
    }

    createServiceWithRoles(serviceName, serviceRoles, betaRole, token) {
        const data = {
            label: serviceName,
            description: serviceName,
            oauth2ClientId: serviceName,
            oauth2ClientSecret: 'autotestingservice',
            oauth2RedirectUris: ['https://idam.testservice.gov.uk'],
            onboardingEndpoint: '/autotest',
            onboardingRoles: [betaRole],
            allowedRoles: serviceRoles,
            activationRedirectUrl: "https://idam.testservice.gov.uk",
            selfRegistrationAllowed: true
        };
        return fetch(`${TestData.IDAM_API}/services`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + token },
        }).then(res => res.json())
      .then((json) => {
          return json;
      })
      .catch(err => err);
  }

    getAuthToken() {
        return fetch(`${TestData.IDAM_API}/loginUser?username=${TestData.SMOKE_TEST_USER_USERNAME}&password=${TestData.SMOKE_TEST_USER_PASSWORD}`, {
            agent: agent,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(
        function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
               console.log('Admin auth token failed first attempt with response ' + response.status + ' from ' + TestData.IDAM_API + ' user: ' + TestData.SMOKE_TEST_USER_USERNAME + ' password ' + TestData.SMOKE_TEST_USER_PASSWORD);

               // retry!
               return fetch(`${TestData.IDAM_API}/loginUser?username=${TestData.SMOKE_TEST_USER_USERNAME}&password=${TestData.SMOKE_TEST_USER_PASSWORD}`, {
                   agent: agent,
                   method: 'POST',
                   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
               }).then(
                   function(response) {
                       if (response.status === 200) {
                           return response.json();
                       } else {
                           console.log('Admin auth token failed second attempt with response ' + response.status + ' from ' + TestData.IDAM_API + ' user: ' + TestData.SMOKE_TEST_USER_USERNAME + ' password ' + TestData.SMOKE_TEST_USER_PASSWORD);
                       }
                   }
              );
            }
        }
        ).then(
            function(json) {
                console.log('Admin auth token received');
                return json.api_auth_token;
            });
    }

    deleteUser(email) {
        return fetch(`${TestData.IDAM_API}/testing-support/accounts/${email}`, {
        agent: agent,
        method: 'DELETE' })
        .catch(err => err);
    }

   createRole(roleName, roleDescription, assignableRoles, api_auth_token) {

    const data = {
        assignableRoles: [assignableRoles],
        conflictingRoles: [],
        description: roleDescription,
        name: roleName,
        id: roleName,
    };

    return fetch(`${TestData.IDAM_API}/roles`, {
      agent: agent,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + api_auth_token },
    })
      .then(res => res.json())
  .then((json) => {
    return json;
  })
  .catch(err => err);
  }

    generateRandomText(){
        return Math.random().toString(36).substr(2, 5);
    }

    createUser(email, forename, role, serviceRole) {
      console.log('Creating user with email: ', email);
      const data = {
        email: email,
        forename: forename,
        password: 'Passw0rdIDAM',
        roles : [{code : role}, {code : serviceRole}],
        surname: 'User',
        userGroup:{ code : 'xxx_private_beta'},
      };
      return fetch(`${TestData.IDAM_API}/testing-support/accounts`, {
        agent: agent,
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json())
        .then((json) => {
          return json;
        })
        .catch(err => err);
    }

    createUserWithRoles(email, forename, userRoles) {
      var codeUserRoles = [];
      for (var i=0;i<userRoles.length;i++) {
        codeUserRoles.push({'code': userRoles[i]});
      }
      const data = {
        email: email,
        forename: forename,
        password: 'Passw0rdIDAM',
        roles : codeUserRoles,
        surname: 'User',
        userGroup:{ code : 'xxx_private_beta'}
      };
      return fetch(`${TestData.IDAM_API}/testing-support/accounts`, {
        agent: agent,
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json())
        .then((json) => {
          return json;
        })
        .catch(err => err);
    }

   verifyEmailSent(email) {
     notifyClient
       .getNotifications("email", "sending")
       .then(response => {
         console.log("Searching " + response.body.notifications.length + " emails(s)");
         var result = response.body.notifications.find(obj => {
           if (obj.email_address === email) {
             return obj.email_address === email
           } else {
             //console.log("ignoring unmatched email address " + obj.email_address);
           }
         })
       })
       .catch(err => {
         console.log(err)
         let browser = this.helpers['Puppeteer'].browser;
         browser.close();
       });
   }

  extractUrl(email) {
     return (notifyClient
         .getNotifications("email", "sending")
         .then(response => {
             console.log("Searching " + response.body.notifications.length + " emails(s)");
             var result = response.body.notifications.find(obj => {
                 if (obj.email_address === email) {
                     return obj.email_address === email
                 } else {
                     console.log("Ignoring unmatched email address");
                 }
             });
             return result;
         })
       .then(emailResponse => {
           var regex = "(https.+)"
           var url = emailResponse.body.match(regex);
           return url[0];
        })
     )
     .catch(err => {
          console.log(err)
          let browser = this.helpers['Puppeteer'].browser;
          browser.close();
     });
  }
}

module.exports = IdamHelper;