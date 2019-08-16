<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.cookies">
    <article class="content__body">
        <a href="javascript:history.go(-1)" class="link-back">Back</a>
        <h1 class="heading-xlarge">
            Cookies
        </h1>
        <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
            <div id="nav-links">



                <ol class="nav-list ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                    <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-1" aria-labelledby="ui-id-1" aria-selected="true" aria-expanded="true"><a href="#tabs-1" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-1">Overview</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-5" aria-labelledby="ui-id-2" aria-selected="false" aria-expanded="false"><a href="#tabs-5" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-2">Appeal a benefit decision service</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-3" aria-labelledby="ui-id-3" aria-selected="false" aria-expanded="false"><a href="#tabs-3" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-3">Apply for divorce service</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-4" aria-labelledby="ui-id-4" aria-selected="false" aria-expanded="false"><a href="#tabs-4" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-4">Apply for probate service</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="false" aria-expanded="false"><a href="#tabs-2" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-5">Money claims service</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-6" aria-selected="false" aria-expanded="false"><a href="#tabs-6" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-6">Family public law service</a></li>
                </ol>
                <hr>



                <div id="tabs-1" aria-labelledby="ui-id-1" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false">

                    <h2 class="heading-large" id="overview">Overview</h2>

                    <p>A cookie is a small piece of data that’s stored on your computer, tablet, or phone when you visit a website. Most websites need cookies to work properly.</p>
                    <h2>How cookies are used in this service:</h2>
                    <ul class="list list-bullet">
                        <li>measure how you use the service so it can be improved</li>
                        <li>remember the notifications you’ve seen so that you’re not shown them again</li>
                        <li>temporarily store the answers you give</li>
                    </ul>
                    <p>Find out more about <a target="_blank" href="http://www.aboutcookies.org/">how to manage cookies</a>.</p>


                </div>


                <div id="tabs-2" aria-labelledby="ui-id-5" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                    <h2 class="heading-large">Cookies in the money claims service</h2>
                    <h3 class="heading-medium">Cookies used to measure website usage</h3>
                    <p>We use Google Analytics software to collect information about how you use this service. We do this to help make sure the service is meeting the needs of its users and to help us make improvements, for example improving site search.</p>
                    <p>Google Analytics stores information about:</p>
                    <ul class="list list-bullet">
                        <li>the pages you visit</li>
                        <li>how long you spend on each page</li>
                        <li>how you got to the service</li>
                        <li>what you click on while you’re visiting the service</li>
                    </ul>
                    <p>We allow Google to use or share our analytics data. You can find out more about how Google use this information in their <a href="https://www.google.com/policies/privacy/partners/">Privacy Policy</a>.</p>
                    <p>You can <a href="https://tools.google.com/dlpage/gaoptout">opt out of Google Analytics</a> if you do not want Google to have access to your information</p>
                    <p>Google Analytics sets the following cookies:</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>_ga</th>
                            <td>This helps us count how many people visit the service by tracking if you’ve visited before</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <th>_gat</th>
                            <td>Manages the rate at which page view requests are made</td>
                            <td>10 minutes</td>
                        </tr>
                        <tr>
                            <th>_gid</th>
                            <td>Identifies you to the service</td>
                            <td>24 hours</td>
                        </tr>
                        </tbody>
                    </table>
                    <p>We allow Google to use or share this data. Find out more about how they use this information in the <a href="https://www.google.com/policies/privacy/partners/">Google privacy policy</a></p>
                    <h3 class="heading-medium">Cookies used to turn our introductory message off</h3>
                    <p>You may see a welcome message when you first visit the service. We’ll store a cookie so that your computer knows not to show this message again.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>seen_cookie_message</th>
                            <td>Saves a message to let us know that you’ve seen our cookie message</td>
                            <td>1 month</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to store the answers you’ve given during your visit (known as a ‘session’)</h3>
                    <p>Session cookies are stored on your computer as you travel through a website, and let the website know what you’ve seen and done so far. These are temporary cookies and are automatically deleted a short while after you leave the website.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>session_ID</th>
                            <td>Keeps track of your answers</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>eligibility-check</th>
                            <td>Stores answers to eligibility questions</td>
                            <td>Ten minutes</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to identify you when you come back to the service</h3>
                    <p>We use authentication cookies to identify you when you return to the service.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>lang</th>
                            <td>Identifies your prefered language</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to make the service more secure</h3>
                    <p>We set cookies which prevent attackers from modifying the contents of the other cookies we set. This makes the service more secure and protects your personal information.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>state</th>
                            <td>Identifies you to the service and secures your authentication</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <td>ARRAfinnity</td>
                            <td>
                                Protects your session from tampering
                            </td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>_csrf</th>
                            <td>Helps protect against forgery</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div id="tabs-3" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <!--divorce-->

                    <h2 class="heading-large">Cookies in the apply for a divorce service</h2>
                    <h3 class="heading-medium">Cookies used to measure website usage</h3>
                    <p>We use Google Analytics software to collect information about how you use this service. We do this to help make sure the service is meeting the needs of its users and to help us make improvements, for example improving site search.</p>
                    <p>Google Analytics stores information about:</p>
                    <ul class="list list-bullet">
                        <li>the pages you visit</li>
                        <li>how long you spend on each page</li>
                        <li>how you got to the service</li>
                        <li>what you click on while you’re visiting the service</li>
                    </ul>
                    <p>We allow Google to use or share our analytics data. You can find out more about how Google use this information in their <a href="https://www.google.com/policies/privacy/partners/">Privacy Policy</a>.</p>
                    <p>You can <a href="https://tools.google.com/dlpage/gaoptout">opt out of Google Analytics</a> if you do not want Google to have access to your information</p>
                    <p>Google Analytics sets the following cookies:</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>_ga</th>
                            <td>This helps us count how many people visit the service by tracking if you’ve visited before</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <th>_gat</th>
                            <td>Manages the rate at which page view requests are made</td>
                            <td>10 minutes</td>
                        </tr>
                        <tr>
                            <th>_gid</th>
                            <td>Identifies you to the service</td>
                            <td>24 hours</td>
                        </tr>
                        </tbody>
                    </table>
                    <p>We allow Google to use or share this data. Find out more about how they use this information in the <a href="https://www.google.com/policies/privacy/partners/">Google privacy policy</a></p>
                    <h3 class="heading-medium">Cookies used to turn our introductory message off</h3>
                    <p>You may see a welcome message when you first visit the service. We’ll store a cookie so that your computer knows not to show this message again.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>seen_cookie_message</th>
                            <td>Saves a message to let us know that you’ve seen our cookie message</td>
                            <td>1 month</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to store the answers you’ve given during your visit (known as a ‘session’)</h3>
                    <p>Session cookies are stored on your computer as you travel through a website, and let the website know what you’ve seen and done so far. These are temporary cookies and are automatically deleted a short while after you leave the website.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>connect.sid</th>
                            <td>Carries details of your current session</td>
                            <td>When you close your browser</td>
                        </tr>

                        <tr>
                            <th>session_ID</th>
                            <td>Keeps track of your answers</td>
                            <td>When you close your browser</td>
                        </tr>

                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to identify you when you come back to the service</h3>
                    <p>We use authentication cookies to identify you when you return to the service.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>__auth-token</th>
                            <td>Identifies you to the service</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to make the service more secure</h3>
                    <p>We set cookies which prevent attackers from modifying the contents of the other cookies we set. This makes the service more secure and protects your personal information.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>TSxxxxxxxx</th>
                            <td>Protects your session from tampering</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>__state</th>
                            <td>Identifies you to the service and secures your authentication</td>
                            <td>When you close your browser</td>
                        </tr>

                        </tbody>
                    </table>
                </div>
                <div id="tabs-4" aria-labelledby="ui-id-4" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <!--probate-->
                    <h2 class="heading-large">Cookies in the apply for probate service</h2>
                    <h3 class="heading-medium">Cookies used to measure website usage</h3>
                    <p>We use Google Analytics software to collect information about how you use this service. We do this to help make sure the service is meeting the needs of its users and to help us make improvements, for example improving site search.</p>
                    <p>Google Analytics stores information about:</p>
                    <ul class="list list-bullet">
                        <li>the pages you visit</li>
                        <li>how long you spend on each page</li>
                        <li>how you got to the service</li>
                        <li>what you click on while you’re visiting the service</li>
                    </ul>
                    <p>We allow Google to use or share our analytics data. You can find out more about how Google use this information in their <a href="https://www.google.com/policies/privacy/partners/">Privacy Policy</a>.</p>
                    <p>You can <a href="https://tools.google.com/dlpage/gaoptout">opt out of Google Analytics</a> if you do not want Google to have access to your information</p>
                    <p>Google Analytics sets the following cookies:</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>_ga</th>
                            <td>This helps us count how many people visit the service by tracking if you’ve visited before</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <th>_gat</th>
                            <td>Manages the rate at which page view requests are made</td>
                            <td>10 minutes</td>
                        </tr>

                        </tbody>
                    </table>

                    <h3 class="heading-medium">Cookies used to turn our introductory message off</h3>
                    <p>You may see a welcome message when you first visit the service. We’ll store a cookie so that your computer knows not to show this message again.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>seen_cookie_message</th>
                            <td>Saves a message to let us know that you’ve seen our cookie message</td>
                            <td>1 month</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to store the answers you’ve given during your visit (known as a ‘session’)</h3>
                    <p>Session cookies are stored on your computer as you travel through a website, and let the website know what you’ve seen and done so far. These are temporary cookies and are automatically deleted a short while after you leave the website.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>connect.sid</th>
                            <td>Carries details of your current session</td>
                            <td>When you close your browser</td>
                        </tr>



                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to identify you when you come back to the service</h3>
                    <p>We use authentication cookies to identify you when you return to the service.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>__auth-token</th>
                            <td>Identifies you to the service</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to make the service more secure</h3>
                    <p>We set cookies which prevent attackers from modifying the contents of the other cookies we set. This makes the service more secure and protects your personal information.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>TS01842b02</th>
                            <td>Protects your session from tampering</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>__state</th>
                            <td>Identifies you to the service and secures your authentication</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>_csrf</th>
                            <td>Helps protect against forgery</td>
                            <td>When you close your browser</td>
                        </tr>


                        </tbody>
                    </table>

                </div>
                <div id="tabs-5" aria-labelledby="ui-id-2" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <!--Social Security and Child Support Tribunal-->
                    <h2 class="heading-large">Cookies in the appeal a benefit decision service</h2>
                    <h3 class="heading-medium">Cookies used to measure website usage</h3>
                    <p>We use Google Analytics software to collect information about how you use this service. We do this to help make sure the service is meeting the needs of its users and to help us make improvements, for example improving site search.</p>
                    <p>Google Analytics stores information about:</p>
                    <ul class="list list-bullet">
                        <li>the pages you visit</li>
                        <li>how long you spend on each page</li>
                        <li>how you got to the service</li>
                        <li>what you click on while you’re visiting the service</li>
                    </ul>
                    <p>We allow Google to use or share our analytics data. You can find out more about how Google use this information in their <a href="https://www.google.com/policies/privacy/partners/">Privacy Policy</a>.</p>
                    <p>You can <a href="https://tools.google.com/dlpage/gaoptout">opt out of Google Analytics</a> if you do not want Google to have access to your information</p>
                    <p>Google Analytics sets the following cookies:</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>_ga</th>
                            <td>This helps us count how many people visit the service by tracking if you’ve visited before</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <th>_gat</th>
                            <td>Manages the rate at which page view requests are made</td>
                            <td>10 minutes</td>
                        </tr>

                        </tbody>
                    </table>

                    <h3 class="heading-medium">Cookies used to turn our introductory message off</h3>
                    <p>You may see a welcome message when you first visit the service. We’ll store a cookie so that your computer knows not to show this message again.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>seen_cookie_message</th>
                            <td>Saves a message to let us know that you’ve seen our cookie message</td>
                            <td>1 month</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to store the answers you’ve given during your visit (known as a ‘session’)</h3>
                    <p>Session cookies are stored on your computer as you travel through a website, and let the website know what you’ve seen and done so far. These are temporary cookies and are automatically deleted a short while after you leave the website.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>session</th>
                            <td>Keeps track of your answers</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>tya-surname-appeal-validated</th>
                            <td>Validates your surname so you can access the Track your appeal service</td>
                            <td>30 mins</td>
                        </tr>
                        <tr>
                            <th>tya-surname-appeal-validated.sig</th>
                            <td>Used to detect tampering the next time a cookie is received</td>
                            <td>30 mins</td>
                        </tr>
                        <tr>
                            <th>ARRAffinity</th>
                            <td>To know which internal IP a request should be routed to</td>
                            <td>When you close your browser</td>
                        </tr>



                        </tbody>
                    </table>

                </div>
                <div id="tabs-6" aria-labelledby="ui-id-5" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                    <h2 class="heading-large">Cookies in the family public law service</h2>
                    <h3 class="heading-medium">Cookies used to measure website usage</h3>
                    <p>We use Google Analytics software to collect information about how you use this service. We do this to help make sure the service is meeting the needs of its users and to help us make improvements, for example improving site search.</p>
                    <p>Google Analytics stores information about:</p>
                    <ul class="list list-bullet">
                        <li>the pages you visit</li>
                        <li>how long you spend on each page</li>
                        <li>how you got to the service</li>
                        <li>what you click on while you’re visiting the service</li>
                    </ul>
                    <p>We allow Google to use or share our analytics data. You can find out more about how Google use this information in their <a href="https://www.google.com/policies/privacy/partners/">Privacy Policy</a>.</p>
                    <p>You can <a href="https://tools.google.com/dlpage/gaoptout">opt out of Google Analytics</a> if you do not want Google to have access to your information</p>
                    <p>Google Analytics sets the following cookies:</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>_ga</th>
                            <td>This helps us count how many people visit the service by tracking if you’ve visited before</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <th>_gat</th>
                            <td>Manages the rate at which page view requests are made</td>
                            <td>10 minutes</td>
                        </tr>
                        <tr>
                            <th>_gid</th>
                            <td>Identifies you to the service</td>
                            <td>24 hours</td>
                        </tr>
                        </tbody>
                    </table>
                    <p>We allow Google to use or share this data. Find out more about how they use this information in the <a href="https://www.google.com/policies/privacy/partners/">Google privacy policy</a></p>
                    <h3 class="heading-medium">Cookies used to turn our introductory message off</h3>
                    <p>You may see a welcome message when you first visit the service. We’ll store a cookie so that your computer knows not to show this message again.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>seen_cookie_message</th>
                            <td>Saves a message to let us know that you’ve seen our cookie message</td>
                            <td>1 month</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to store the answers you’ve given during your visit (known as a ‘session’)</h3>
                    <p>Session cookies are stored on your computer as you travel through a website, and let the website know what you’ve seen and done so far. These are temporary cookies and are automatically deleted a short while after you leave the website.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>connect.sid</th>
                            <td>Carries details of your current session</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>sessionKey</th>
                            <td>Protects your session using encryption</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>session_ID</th>
                            <td>Keeps track of your answers</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to identify you when you come back to the service</h3>
                    <p>We use authentication cookies to identify you when you return to the service.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>__auth-token</th>
                            <td>Identifies you to the service</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>lang</th>
                            <td>Used in the Money claims service to identify your prefered language</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium">Cookies used to make the service more secure</h3>
                    <p>We set cookies which prevent attackers from modifying the contents of the other cookies we set. This makes the service more secure and protects your personal information.</p>
                    <table>
                        <thead>
                        <tr>
                            <th>Cookie name</th>
                            <th>What this cookie is for</th>
                            <th>Expires after</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>TSxxxxxxxx</th>
                            <td>Protects your session from tampering</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>__state</th>
                            <td>Identifies you to the service and secures your authentication</td>
                            <td>When you close your browser</td>
                        </tr>
                        <tr>
                            <th>X_CMC</th>
                            <td>Helps us keep track of your session</td>
                            <td>When you close your browser</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </article>
</t:wrapper>