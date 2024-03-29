<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<c:if test="${redirectUri == null}">
    <c:if test="${param['continue-url'] != null}">
        <c:set var="redirectUri" value="${param['continue-url']}"/>
    </c:if>
    <c:if test="${param['redirect_uri'] != null}">
        <c:set var="redirectUri" value="${param['redirect_uri']}"/>
    </c:if>
</c:if>

<t:wrapper titleKey="public.login.subheading.sign.in">
    <article class="content__body">
        <form:form name="loginForm"
                   class="form"
                   modelAttribute="authorizeCommand"
                   novalidate=""
                   _lpchecked="1">

            <c:url value="/reset/forgotpassword" var="forgotPasswordUrl">
                <c:param name="redirectUri" value="${redirect_uri}"/>
                <c:param name="client_id" value="${client_id}"/>
                <c:param name="state" value="${state}"/>
                <c:param name="nonce" value="${nonce}"/>
                <c:param name="scope" value="${scope}"/>
            </c:url>

            <c:set var="azureLoginUrl">
                <spring:url value="/o/authorize">
                    <spring:param name="redirect_uri" value="${redirect_uri}"/>
                    <spring:param name="client_id" value="${client_id}"/>
                    <spring:param name="state" value="${state}"/>
                    <spring:param name="nonce" value="${nonce}"/>
                    <spring:param name="prompt" value="${prompt}"/>
                    <spring:param name="scope" value="${scope}"/>
                    <spring:param name="response_type" value="code"/>
                    <spring:param name="login_hint" value="ejudiciary-aad"/>
                </spring:url>
            </c:set>

            <c:set var="mojLoginUrl">
                <spring:url value="/o/authorize">
                    <spring:param name="redirect_uri" value="${redirect_uri}"/>
                    <spring:param name="client_id" value="${client_id}"/>
                    <spring:param name="state" value="${state}"/>
                    <spring:param name="nonce" value="${nonce}"/>
                    <spring:param name="prompt" value="${prompt}"/>
                    <spring:param name="scope" value="${scope}"/>
                    <spring:param name="response_type" value="code"/>
                    <spring:param name="login_hint" value="moj"/>
                </spring:url>
            </c:set>

            <spring:hasBindErrors name="authorizeCommand">
                <script>
                    sendEvent('Authorization', 'Error', 'User authorization has failed');
                </script>
                <div class="error-summary" role="alert"
                     aria-labelledby="validation-error-summary-heading"
                     tabindex="-1">

                    <c:choose>
                        <c:when test="${isAccountLocked}">
                            <script>
                                sendEvent('Authorization', 'Error', 'Account is locked');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.locked.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.login.error.locked.instruction" arguments="${forgotPasswordUrl}" htmlEscape="false"/></p>
                        </c:when>
                        <c:when test="${isAccountSuspended}">
                            <script>
                                sendEvent('Authorization', 'Error', 'Account is suspended');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.suspended.title"/>
                            </h2>
                            <div class="text">
                                <p>
                                    <spring:message code="public.login.error.suspended.instruction"/>
                                </p>
                            </div>
                        </c:when>
                        <c:when test="${isAccountSSOAccount}">
                            <script>
                                sendEvent('Authorization', 'Error', 'Account is SSO Linked Account');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.linked.title"/>
                            </h2>
                            <div class="text">
                                <p>
                                    <spring:message code="public.login.error.linked.please"/>
                                    <a href="${azureLoginUrl}">
                                        <spring:message code="public.login.azure.link"/>
                                    </a>
                                </p>
                            </div>
                            <div class="text">
                                <p>
                                    <a href="${pageContext.request.contextPath}/contact-us">
                                        <spring:message code="public.login.error.linked.contact.us" />
                                    </a>
                                    <spring:message code="public.login.error.linked.trouble"/>
                                </p>
                            </div>
                        </c:when>
                        <c:when test="${isAccountRetired}">
                            <script>
                                sendEvent('Authorization', 'Error', 'Account is retired, stale user has been sent reregistration');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.retired.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.login.error.retired.instruction"/></p>
                        </c:when>
                        <c:when test="${hasPolicyCheckFailed}">
                            <script>
                                sendEvent('Authorization', 'Error', 'User policy check has failed');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.policycheck.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.login.error.policycheck.instruction"/></p>
                        </c:when>
                        <c:when test="${hasLoginFailed}">
                            <script>
                                sendEvent('Authorization', 'Error', 'User login has failed');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.failed.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.common.error.please.fix.following"/></p>
                        </c:when>
                        <c:when test="${hasOtpCheckFailed}">
                            <script>
                                sendEvent('Authorization', 'Error', 'User verification code check has failed');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.verificationcheck.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.login.error.verificationcheck.instruction"/></p>
                        </c:when>
                        <c:when test="${missingAuthIdCookie}">
                            <script>
                                sendEvent('Authorization', 'Error', 'User missing AuthId cookie');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.authidcookie.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.login.error.authidcookie.instruction"/></p>
                        </c:when>
                        <c:otherwise>
                            <script>
                                sendEvent('Authorization', 'Error', 'User login has failed');
                            </script>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.common.error.title"/>
                            </h2>
                            <p class="text"><spring:message code="public.common.error.please.fix.following"/></p>
                        </c:otherwise>
                    </c:choose>

                    <c:if test="${isUsernameEmpty}">
                        <script>
                            sendEvent('Authorization', 'Error', 'Username is empty');
                        </script>
                    </c:if>
                    <c:if test="${isPasswordEmpty}">
                        <script>
                            sendEvent('Authorization', 'Error', 'Password is empty');
                        </script>
                    </c:if>

                    <ul class="error-summary-list">
                        <c:forEach var="error" items="${errors.fieldErrors}">
                            <c:if test="${error.code.startsWith('Email')}">
                                <c:set var="isEmailError" value="${error.code.startsWith('Email')}"/>
                            </c:if>
                        </c:forEach>
                        <c:if test="${(isEmailError || isUsernameEmpty)}">
                            <li><a href="#username"><form:errors path="username"/></a></li>
                        </c:if>
                        <c:if test="${isPasswordEmpty}">
                            <li><a href="#password"><form:errors path="password"/></a></li>
                        </c:if>
                        <c:if test="${hasLoginFailed}">
                            <li><a href="#username"><spring:message code="public.login.error.failed.username"/></a></li>
                            <li><a href="#password"><spring:message code="public.login.error.failed.password"/></a></li>
                        </c:if>
                    </ul>
                </div>
            </spring:hasBindErrors>
            <h1 class="heading-large"><spring:message
                code="${selfRegistrationEnabled ? 'public.login.heading' : 'public.login.heading.no.self.register'}"/></h1>
            <c:if test="${selfRegistrationEnabled}">
                <div class="grid-row">
                <div class="column-one-half column--bordered">
            </c:if>
            <div class="form-section">
                <c:if test="${selfRegistrationEnabled}">
                    <h2 class="heading-medium"><spring:message code="public.login.subheading.sign.in"/></h2>
                </c:if>
                <c:set var="usernameError" value="${isUsernameEmpty || hasLoginFailed || isEmailError}"/>
                <div class="form-group ${usernameError? 'form-group-error' : ''}">
                    <label for="username">
                        <span class="form-label">
                            <spring:message code="public.common.email.address.label"/>
                        </span>
                        <c:if test="${isUsernameEmpty}">
                            <span class="error-message">
                                <spring:message code="public.common.error.enter.username"/>
                            </span>
                        </c:if>
                        <c:if test="${isEmailError}">
                            <span class="error-message">
                                <spring:message code="public.common.error.invalid.email"/>
                            </span>
                        </c:if>
                    </label>
                    <form:input
                        class="form-control${selfRegistrationEnabled ? ' form-control-3-4': ''}${usernameError? ' form-control-error' : ''}"
                        path="username"
                        type="text"
                        id="username"
                        name="username"
                        value="${username}" autocomplete="off"/>
                </div>

                <c:set var="passwordError" value="${isPasswordEmpty || hasLoginFailed}"/>
                <div class="form-group ${passwordError? 'form-group-error' : ''}">
                    <label for="password">
                        <span class="form-label">
                            <spring:message code="public.common.password.label"/>
                        </span>
                        <c:if test="${isPasswordEmpty}">
                            <span class="error-message">
                                <spring:message code="public.common.error.enter.password"/>
                            </span>
                        </c:if>
                    </label>
                    <form:input
                        class="form-control${selfRegistrationEnabled ? ' form-control-3-4': ''}${passwordError? ' form-control-error' : ''}"
                        id="password" name="password" path="password" type="password" value="" autocomplete="off"/>
                </div>

                <div class="form-group">
                    <a href="${forgotPasswordUrl}">
                        <spring:message code="public.login.forgotten.password"/>
                    </a>
                </div>

                <div class="login-list">
                    <input class="button" type="submit" name="save" data-prevent-double-click="true"
                           onclick="document.getElementById('username').value = document.getElementById('username').value.trim(); this.disabled = true; document.getElementsByName('loginForm')[0].submit()"
                           value="<spring:message code="public.login.form.submit" />">
                    <form:input path="selfRegistrationEnabled" type="hidden" id="selfRegistrationEnabled"
                                name="selfRegistrationEnabled" value="${selfRegistrationEnabled}"/>

                    <c:if test="${azureLoginEnabled}">
                        <form:input path="azureLoginEnabled" type="hidden" id="azureLoginEnabled"
                                    name="azureLoginEnabled" value="${azureLoginEnabled}"/>
                        <br><br>
                        <a href="${azureLoginUrl}">
                            <spring:message code="public.login.azure.link"/>
                        </a>
                    </c:if>

                    <c:if test="${mojLoginEnabled}">
                        <form:input path="mojLoginEnabled" type="hidden" id="mojLoginEnabled"
                                    name="mojLoginEnabled" value="${mojLoginEnabled}"/>
                        <br>
                        <a href="${mojLoginUrl}">
                            <spring:message code="public.login.moj.link"/>
                        </a>
                    </c:if>

                </div>
            </div>
            <c:if test="${selfRegistrationEnabled}">
                </div>
                <div class="column-one-half">
                    <h2 class="heading-medium"><spring:message code="public.login.subheading.create.account"/></h2>
                    <p>
                        <spring:message code="public.login.create.account.body"/>
                        <c:url value="/users/selfRegister" var="selfRegisterUrl">
                            <c:param name="redirect_uri" value="${redirect_uri}"/>
                            <c:param name="client_id" value="${client_id}"/>
                            <c:param name="state" value="${state}"/>
                            <c:param name="nonce" value="${nonce}"/>
                            <c:param name="scope" value="${scope}"/>
                        </c:url>
                        <a href="${selfRegisterUrl}">
                            <spring:message code="public.common.create.account"/>
                        </a>
                        <spring:message code="public.login.create.account.body.to.use.service"/>
                    </p>
                </div>
                </div>
            </c:if>
        </form:form>
    </article>
</t:wrapper>
