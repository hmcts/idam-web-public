<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.privacy.policy">
    <article class="content__body">
        <a href="javascript:history.go(-1)" class="link-back"><spring:message code="public.common.link.back" /></a>
        <h1 class="heading-xlarge">
            <spring:message code="public.privacy.title" />
        </h1>
        <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
            <div id="nav-links">

                <ol class="nav-list ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-1" aria-labelledby="ui-id-1" aria-selected="false" aria-expanded="false"><a href="#tabs-1" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-1">Overview</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-4" aria-labelledby="ui-id-2" aria-selected="false" aria-expanded="false"><a href="#tabs-4" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-2">Appeal a benefit decision service</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-3" aria-labelledby="ui-id-3" aria-selected="false" aria-expanded="false"><a href="#tabs-3" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-3">Apply for divorce service</a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-5" aria-labelledby="ui-id-4" aria-selected="false" aria-expanded="false"><a href="#tabs-5" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-4">Apply for probate service</a></li>
                    <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="true" aria-expanded="true"><a href="#tabs-2" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-5">Money claims service</a></li>
                    <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="true" aria-expanded="true"><a href="#tabs-6" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-6">Family public law service</a></li>
                </ol>
                <hr>

                <div id="tabs-1" aria-labelledby="ui-id-1" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">

                    <h2 class="heading-large" id="overview">Overview</h2>
                    <p>This privacy policy explains why we collect your personal data, what we do with it, and your rights. More information about using this service is in the <a href="/terms-and-conditions">terms and conditions</a>.</p>

                    <h2 class="heading-medium">Who manages this service</h2>
                    <p>This service is managed by Her Majesty’s Courts and Tribunals Service (HMCTS) and we’re responsible for protecting the personal data you provide.</p>
                    <p>HMCTS is an executive agency of the Ministry of Justice (MoJ). The MoJ is the data controller and their <a href="https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter">personal information charter</a> explains more about how they process personal data.</p>
                    <p>When you use this service we (HMCTS) will ask you to provide some personal data.</p>

                    <h2 class="heading-medium">Why we collect your personal data</h2>
                    <p>We collect your personal data to:</p>
                    <ul class="list list-bullet">
                        <li>process your claim or application</li>
                        <li>meet legal requirements</li>
                        <li>make improvements to this service</li>
                    </ul>
                    <p>Our staff use your personal data to process your claim or application. They work in the UK and your data is stored in the UK.</p>
                    <h2 class="heading-medium">Types of personal data we collect</h2>
                    <p>The personal data we collect includes:</p>
                    <ul class="list list-bullet">
                        <li>your name, address and contact details</li>
                        <li>your email and password (if you create an account)</li>
                        <li>other personal information you provide in your claim or application</li>
                    </ul>

                    <p>Some services collect more personal data. Find out more about the <a href="#otherservices">personal data that is collected by the service you are using</a> . </p>

                    <h2 class="heading-medium">Using your data</h2>
                    <p>As part of your claim you’ll be asked to use your email address to set up an account. You will be able to use this email and password to sign into other HMCTS services.</p>
                    <p>We may ask for your permission to use your email address to send you emails using GOV.UK Notify. This system processes emails only within the European Economic Area until the point where emails are handed over to the email provider you use.</p>
                    <p>We <a href="/cookies">use cookies</a> to collect data that tells us about how you’re using this service, including:</p>
                    <ul class="list list-bullet">
                        <li>if you open an email from us or click on a link in an email</li>
                        <li>your computer, phone or tablet’s IP address </li>
                        <li>the region or town where you are using your computer, phone or tablet</li>
                        <li>the web browser you use</li>
                    </ul>

                    <h2 class="heading-medium">Storing your data</h2>

                    <p>When you make your claim or application we store the data you have provided. The amount of time that your data is kept for depends on the service that you are using.</p>
                    <p>Find out more about how long your personal data is stored by the service you are using. </p>

                    <p>Some services collect more personal data. Find out more about the <a href="#otherservices">personal data that is collected by the service you are using</a> . </p>


                    <h2 class="heading-medium">Sharing your data</h2>

                    <p>While processing your claim or application, another government department, agency or organisation might be involved and we may share your data with them.</p>

                    <p>If you contact us and ask for help with the service you are using, your personal data may be shared with the Good Things Foundation. This is a company who we have partnered with to offer face to face support.</p>

                    <p>In some circumstances we may share your data for example, to prevent or detect crime, or to produce anonymised statistics.</p>

                    <p>We use Google Analytics to collect data about how a website is used. This anonymous data is shared with Google. Find out about this in our <a href="/terms-and-conditions">terms and conditions</a>.</p>

                    <h2 class="heading-medium">Storing and sharing your data internationally</h2>

                    <p>Sometimes we need to send your personal information outside of the UK. When we do this we comply with data protection law.</p>

                    <h2 class="heading-medium">Your rights</h2>
                    <p>You can ask:</p>
                    <ul class="list list-bullet">
                        <li>to see the personal data that we hold on you</li>
                        <li>to have the personal data corrected</li>
                        <li>to have the personal data removed or deleted (this will depend on the circumstances, for example if you decide not to continue your claim or application)</li>
                        <li>that access to the personal data is restricted (for example, you can ask to have your data stored for longer and not automatically deleted)</li>
                    </ul>
                    <p>If you want to see the personal data that we hold on you, you can: </p>
                    <ul class="list list-bullet">
                        <li>complete a form to <a href="https://www.gov.uk/government/publications/request-your-personal-data-from-moj">make a subject access request</a> . Your request goes to the MoJ as data controller.</li>
                        <li>write to us: Disclosure Team, Post point 10.38, 102 Petty France, London, SW1H 9AJ</li>
                    </ul>

                    <h2 class="heading-medium">You can ask for more information about:</h2>

                    <ul class="list list-bullet">
                        <li>agreements we have on sharing information with other organisations</li>
                        <li>when we are allowed to pass on personal information without telling you</li>
                        <li>our instructions to staff on how to collect, use or delete your personal information</li>
                        <li>how we check that the information we hold is accurate and up-to-date</li>
                    </ul>

                    <h2 class="heading-medium">You can contact the MoJ data protection officer, by:</h2>
                    <ul class="list list-bullet">
                        <li>writing to us: Post point 10.38, 102 Petty France, London, SW1H 9AJ</li>
                        <li>emailing: <a href="mailto:data.compliance@justice.gov.uk">data.compliance@justice.gov.uk</a></li>
                    </ul>

                    <h2 class="heading-medium">How to complain</h2>
                    <p>See our <a href="https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure">complaints procedure</a>. if you want to complain about how we've handled your personal data.</p>

                    <p>Write to: Post point 10.38, 102 Petty France, London, SW1H 9AJ</p>
                    <p>Email: <a href="mailto:data.compliance@justice.gov.uk">data.compliance@justice.gov.uk</a></p>

                    <p>You can also complain to the <a href="https://ico.org.uk/global/contact-us">Information Commissioner’s Office</a> if you’re not satisfied with our response or believe we are not processing your personal data lawfully.</p>

                    <h2 id="otherservices" class="heading-medium">The service you are using</h2>
                    <p>The types of personal data collected, how long it is stored for, and who it is shared with depends on the service you are using. Find out more by following the links below:</p>
                    <ul>
                        <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-4">Using the appeal a benefit decision service</a>  </li>

                        <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-3">Using the apply for a divorce service</a> </li>

                        <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-5">Using the apply for probate service</a> </li>

                        <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-2">Using the money claims service</a> </li>
                    </ul>
                </div>

                <div id="tabs-3" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <h2 class="heading-large" id="divorce">Using the apply for a divorce service</h2>
                    <h2 class="heading-medium">The personal data we need</h2>
                    <p>When you use the apply for divorce service we need the following personal data:</p>
                    <ul class="list list-bullet">
                        <li>your current name</li>
                        <li>your name on the marriage certificate</li>
                        <li>a copy of your marriage certificate</li>
                        <li>date of your marriage</li>
                        <li>country in which you got married</li>
                        <li>information about where you have lived</li>
                        <li>your habitual residence (whether your life is mainly based in England or Wales)</li>
                        <li>your domicile (usually the place in which you were born, regard as your permanent home and to which you have the closest ties)</li>
                        <li>your email or mobile phone number</li>
                        <li>your address</li>
                        <li>reasons for your divorce</li>
                        <li>to know if you have been involved in other court cases</li>
                        <li>your husband or wife’s current name</li>
                        <li>their name on the marriage certificate</li>
                        <li>the name and address of the person who committed adultery with your husband or wife (this is optional and only asked if adultery is your reason for divorce)</li>
                        <li>your solicitors name and address (if you have one)</li>
                    </ul>

                    <h2 class="heading-medium">Receiving notifications</h2>
                    <p>You need to sign up to receive notifications to use the apply for divorce service. This is a legal requirement so that the divorce application can proceed.</p>


                    <h2 class="heading-medium">Storing your data</h2>
                    <p>When you use this service you’ll be asked to use your email address to set up an account. You will be able to use this email and password to sign into other HMCTS services.</p>

                    <p>While you are filling out or responding to a divorce application we will hold your data for up to 6 months. If you don’t complete the application during this time you’ll have to start again.</p>

                    <p>When a divorce is finalised the case is stored for 18 years. After this time, some data (from the decree nisi and the decree absolute) is deleted. </p>

                    <p>The remainder of the case information is stored for an additional 82 years. After a total of 100 years this data will be deleted.</p>

                    <h2 class="heading-medium">Sharing your data</h2>
                    <p>While processing your claim or application, another government department, agency or organisation might be involved and we may share your data with them.</p>

                    <p>Any data you provide which needs to be printed will be shared with Xerox (UK) Ltd. For example, the divorce application will be printed so that it can be sent to the respondent by post.</p>

                    <p>Any data which is posted in to support a divorce application will be shared with Exela Technologies Limited. For example, a posted marriage certificate will be received by Exela and sent to the court as a scanned image.</p>

                    <p>If you contact us and ask for help with the service you're using, your personal data may be shared with the Good Things Foundation. This is a company who we have partnered with to offer face to face support.</p>

                    <p>In some circumstances we may share your data for example, to prevent or detect crime, or to produce anonymised statistics.</p>
                </div>
                <div id="tabs-2" aria-labelledby="ui-id-5" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" style="display: block;" aria-hidden="false">
                    <h2 class="heading-large">Using the money claims service</h2>
                    <h2 class="heading-medium">The personal data we need</h2>

                    <p>If you are using the money claims service we will ask you for:</p>
                    <ul class="list list-bullet">
                        <li>your name</li>
                        <li>your business or organisation if you are acting on their behalf</li>
                        <li>your date of birth</li>
                        <li>your email or mobile phone number</li>
                        <li>your address</li>
                        <li>the name of the person, business or organisation you are claiming against</li>
                        <li>their email address</li>
                        <li>their address</li>
                        <li>the reasons you are making the claim</li>
                        <li>the timeline of events leading to the dispute</li>
                        <li>a list of any evidence you have to support your claim</li>
                    </ul>
                    <p>If you are responding to a money claim we ask you to check the personal information about you that was provided by the claimant which includes your name, your address and contact details.</p>
                    <p>We may ask you to provide:</p>
                    <ul class="list list-bullet">
                        <li>your date of birth</li>
                        <li>your business or organisation if you are acting on their behalf</li>
                        <li>your response to the claim made against you</li>
                        <li>the timeline of events leading to the dispute</li>
                        <li>a list of any evidence you have to support your claim</li>
                    </ul>

                    <h2 class="heading-medium">Storing your data</h2>
                    <p>When you use this service you’ll be asked to use your email address to set up an account. You can use this email and password to sign into other HMCTS services.</p>

                    <h2 class="heading-small">Before you submit your information</h2>
                    <p>The information you enter in the money claims service is saved until you decide to submit it. This allows you to save what you are doing and continue later. Saved information that you do not submit will be deleted after 90 days.</p>

                    <h2 class="heading-small">After you submit your information</h2>

                    <p>The information you submit for a money claim will be deleted 2 years after the court makes a decision on the outcome of your claim (this is called a judgment).</p>

                    <p>If the court doesn’t make a decision about your claim (for example, you settle the claim out of court and a judgment is no longer required) then the information you provide will be deleted 3 years after the last update made to the claim.</p>


                    <h2 class="heading-medium">Sharing your data</h2>
                    <p>The information you submit will be shared with everyone who is named on the claim. This excludes any payment details that you use to pay court fees.</p>

                    <p>If a judgment is made on a case some information is shared with Registry Trust Limited who provide financial information about court judgments to banks and credit agencies.</p>
                </div>

                <div id="tabs-4" aria-labelledby="ui-id-2" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <h2 class="heading-large" id="probate">Using the appeal a benefit decision service</h2>
                    <h2 class="heading-medium">The personal data we need</h2>
                    <p>When you use the appeal a benefit decision service we ask for:</p>
                    <ul class="list list-bullet">
                        <li>your name</li>
                        <li>your date of birth</li>
                        <li>your email or mobile phone number</li>
                        <li>your National Insurance Number</li>
                        <li>information from the Mandatory Reconsideration Notice</li>
                        <li>information on any support you need for a hearing, if you attend one</li>
                        <li>information on your availability for a hearing, if you attend one</li>
                    </ul>
                    <p>If you have a representative, we will ask for:</p>
                    <ul class="list list-bullet">
                        <li>their name</li>
                        <li>their contact details</li>
                    </ul>
                    <p>If you are appointee, you will need to provide information about the person who you are appealing on behalf of, including:</p>
                    <ul class="list list-bullet">
                        <li>their name</li>
                        <li>their National Insurance number</li>
                    </ul>

                    <h2 class="heading-medium">Receiving notifications</h2>
                    <p>As part of your appeal we’ll ask if you want to receive text message and email notifications to keep you updated with your appeal.</p>

                    <p>You can cancel text messages by following the steps mentioned in the text message, and you can cancel emails by following the steps mentioned in the emails.</p>

                    <p>If you have asked for your named representative to receive updates on your appeal, then we will share your data with them. If you want your representative to stop receiving notifications then you need to <a href="/contact-us">Contact us.</a></p>

                    <h2 class="heading-medium">Storing and sharing your data</h2>

                    <p>Your data will be shared with the government department that made the decision you are appealing against. For example, the Department for Work and Pensions or HM Revenue and Customs. This is so that department can respond to your appeal.</p>

                    <p>After you complete your application it will be stored for 2 years. It will be deleted after that.</p>
                </div>

                <div id="tabs-5" aria-labelledby="ui-id-4" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">

                    <h2 class="heading-large">Using the apply for probate service</h2>
                    <h2 class="heading-medium">The personal data we need</h2>

                    <p>When you use the apply for probate service we ask for:</p>
                    <ul class="list list-bullet">
                        <li>your name, any other names you are known as </li>
                        <li>your email or mobile phone number</li>
                        <li>your address</li>
                        <li>the names of any executors of the will</li>
                        <li>contact details for all of the executors who are applying for probate</li>
                    </ul>

                    <h2 class="heading-medium">Storing your data</h2>

                    <p>When you use this service you’ll be asked to use your email address to set up an account. You can use this email and password to sign into other HMCTS services.</p>

                    <h2 class="heading-medium">Before you submit your information</h2>

                    <p>Information you enter in the apply for probate service is saved until you decide to submit it. This allows you to save what you are doing and continue later. Saved information that you do not submit will be deleted after 90 days.</p>

                    <h2 class="heading-medium">After you submit your information</h2>

                    <p>Grants of probate are stored as public records. However, your email address and telephone number won’t be publicly available.</p>
                </div>
                <div id="tabs-6" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <h2 class="heading-large">Using the family public law service</h2>
                    <h2 class="heading-medium">What is the personal data that we collect</h2>
                    <p>When you use the Family Public Law service, we collect the following personal data:</p>
                    <ul class="list list-bullet">
                        <li>the applicant's name, address, job role and contact details</li>
                        <li>the Local Authority solicitor's name, address and contact details</li>
                        <li>the social worker's name, address and contact details</li>
                        <li>name, date of birth, gender, and address of children in the case</li>
                        <li>name, date of birth, gender, address and contact details of respondents in the case</li>
                        <li>name, address and contact details of other parties in the case, for example witnesses</li>
                        <li>details of any disability or litigation capacity (ability to understand proceedings) of any child, respondent or other party in the case</li>
                        <li>details of other court cases respondents or children in the case have been involved in</li>
                        <li>evidence supporting the case</li>
                    </ul>
                    <p>We also collect</p>
                    <ul class="list list-bullet">
                        <li>information that tells us if you open an email from us, or click on a link in an email</li>
                        <li>information about how you use this service, like your IP address and the web browser you use. We do this by <a href="/cookies">using cookies</a></li>
                    </ul>
                    <h2 class="heading-medium">What we do with your data</h2>
                    <p>We collect personal data to:</p>
                    <ul class="list list-bullet">
                        <li>process the application</li>
                        <li>meet legal requirements</li>
                        <li>make improvements to this service</li>
                    </ul>
                    <p>Personal data is processed by our staff in the UK and the data is stored in the UK.</p>
                    <p>Data relating to a case is stored until the youngest child reaches 18 years old, unless the case results in adoption where the data is stored for 100 years.</p>
                    <p>We use GOV.UK Notify to send emails. These are processed within the EEA until the point where emails are handed over to your email provider.</p>
                    <h2 class="heading-medium">Your rights</h2>
                    <p>You can ask:</p>
                    <ul class="list list-bullet">
                        <li>to see the personal data that we hold on you</li>
                        <li>to have the personal data corrected</li>
                        <li>to have the personal data removed or deleted (this will depend on the circumstances, for example if you decide not to continue your claim or application)</li>
                        <li>that access to the personal data is restricted (for example, you can ask to have your data stored for longer and not automatically deleted)</li>
                    </ul>
                    <p>Email <a href="mailto:data.access@justice.gov.uk">data.access@justice.gov.uk</a> if you want to see any of this information.</p>
                    <h2 class="heading-medium">Sharing your data</h2>
                    <p>We allow Google to use or share our website analytics data, find out about this in our <a href="/terms-and-conditions">terms and conditions</a>.	</p>
                    <h2 class="heading-medium">Receiving notifications</h2>
                    <p>As part of your application we will send you notifications to let you know how your application is proceeding.</p>
                    <p>Email <a href="mailto:dcd-familypubliclawservicedesk@hmcts.net">dcd-familypubliclawservicedesk@hmcts.net</a> if you want to cancel email updates.</p>
                    <h2 class="heading-medium">How to complain</h2>
                    <p>If you want to complain about how we have handled your personal data, email <a href="mailto:data.compliance@justice.gov.uk">data.compliance@justice.gov.uk</a>.</p>
                    <p>You can complain to the <a href="https://ico.org.uk/global/contact-us">Information Commissioner’s Office</a> if you are unsatisfied with our response or believe we are not legally processing your personal data.</p>
                </div>
            </div>
        </div>
        <style>
            .ui-state-active a {
                text-decoration: none;
                color: #0b0c0c;
                cursor: default;
            }
        </style>
    </article>
</t:wrapper>