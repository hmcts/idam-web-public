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
                   method="post"
                   class="form"
                   action="/authorize"
                   commandName="authorizeCommand"
                   modelAttribute="authorizeCommand"
                   novalidate=""
                   _lpchecked="1">

            <c:url value="/reset/forgotpassword" var="forgotPasswordUrl">
                <c:param name="redirectUri" value="${redirect_uri}" />
                <c:param name="clientId" value="${client_id}" />
                <c:param name="state" value="${state}" />
            </c:url>

            <spring:hasBindErrors name="authorizeCommand">

                <div class="error-summary" role="group"
                     aria-labelledby="validation-error-summary-heading"
                     tabindex="-1">

                    <c:choose>
                        <c:when test="${isAccountLocked}">
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.locked.title" />
                            </h2>
                            <div class="text">
                                <p>
                                    <spring:message  code="public.login.error.locked.instruction"/>
                                    <a href="${forgotPasswordUrl}"><spring:message  code="public.login.error.locked.instruction.reset.password"/></a>
                                    <spring:message  code="public.login.error.locked.instruction.unlock.account"/>
                                </p>
                            </div>
                        </c:when>
                        <c:when test="${isAccountSuspended}">
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.suspended.title" />
                            </h2>
                            <div class="text">
                                <p>
                                    <spring:message code="public.login.error.suspended.instruction" />
                                </p>
                            </div>
                        </c:when>
                        <c:when test="${hasLoginFailed}">
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.failed.title" />
                            </h2>
                        </c:when>
                        <c:otherwise>
                            <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                                <spring:message code="public.login.error.other.title" />
                            </h2>
                            <p><spring:message code="public.common.error.please.fix.following" /></p>
                        </c:otherwise>
                    </c:choose>
                    <ul class="error-summary-list">
                        <c:if test="${isUsernameEmpty}">
                            <li><a href="#username"><form:errors path="username"/></a></li>
                        </c:if>
                        <c:if test="${isPasswordEmpty}">
                            <li><a href="#password"><form:errors path="password"/></a></li>
                        </c:if>
                        <c:if test="${hasLoginFailed}">
                            <li><a href="#username"><spring:message code="public.login.error.failed.username" /></a></li>
                            <li><a href="#password"><spring:message code="public.login.error.failed.password" /></a></li>
                        </c:if>
                    </ul>
                </div>
            </spring:hasBindErrors>

            <h1 class="heading-large"><spring:message code="${selfRegistrationEnabled ? 'public.login.heading' : 'public.login.heading.no.self.register'}" /></h1>
            <c:if test="${selfRegistrationEnabled}">
			<div class="grid-row">
                <div class="column-one-half column--bordered">
			</c:if>
                    <div class="form-section">
                        <h2 class="heading-medium"><spring:message code="public.login.subheading.sign.in"/></h2>
                        <c:set var="usernameError" value="${isUsernameEmpty || hasLoginFailed}" />
                        <div class="form-group ${usernameError? 'form-group-error' : ''}">
                            <label for="username">
                                <span class="form-label">
                                    <spring:message code="public.common.email.address.label" />
                                </span>
                            </label>
                            <c:if test="${isUsernameEmpty}">
                                <span class="error-message">
                                    <spring:message code="public.common.error.enter.username" />
                                </span>
                            </c:if>
                            <form:input class="form-control${selfRegistrationEnabled ? ' form-control-3-4': ''}${usernameError? ' form-control-error' : ''}"
                                        path="username"
                                        type="text"
                                        id="username"
                                        name="username"
                                        value="${username}" autocomplete="off" />
                        </div>

                        <c:set var="passwordError" value="${isPasswordEmpty || hasLoginFailed}" />
                        <div class="form-group ${passwordError? 'form-group-error' : ''}">
                            <label for="password">
                                <span class="form-label">
                                    <spring:message code="public.common.password.label" />
                                </span>
                            </label>
                            <c:if test="${isPasswordEmpty}">
                                <span class="error-message">
                                    <spring:message code="public.common.error.enter.password" />
                                </span>
                            </c:if>
                            <form:input class="form-control${selfRegistrationEnabled ? ' form-control-3-4': ''}${passwordError? ' form-control-error' : ''}" id="password" name="password" path="password" type="password" value="" autocomplete="off"/>
                        </div>

                        <div class="form-group">
                            <a href="${forgotPasswordUrl}">
                                <spring:message code="public.login.forgotten.password" />
                            </a>
                        </div>


                        <input class="button" type="submit" name="save" value="<spring:message code="public.login.form.submit" />">

                        <form:input path="redirect_uri" type="hidden"  id="redirect_uri" name="redirect_uri" />
                        <form:input path="client_id" type="hidden" id="client_id" name="client_id" />
                        <form:input path="state" type="hidden" id="state" name="state"/>
                        <form:input path="response_type" type="hidden" id="response_type" name="response_type"/>
                    </div>
			<c:if test="${selfRegistrationEnabled}">
                </div>
                <div class="column-one-half">
                    <h2 class="heading-medium"><spring:message code="public.login.subheading.create.account"/></h2>
                    <p>
                        <spring:message code="public.login.create.account.body" />
                        <c:url value="/users/selfRegister" var="selfRegisterUrl">
                            <c:param name="redirect_uri" value="${redirect_uri}" />
                            <c:param name="client_id" value="${client_id}" />
                            <c:param name="state" value="${state}" />
                        </c:url>
                        <a href="${selfRegisterUrl}">
                            <spring:message code="public.common.create.account" />
                        </a>
                        <spring:message code="public.login.create.account.body.to.use.service" />
                    </p>
                </div>
            </div>
			</c:if>
        </form:form>
    </article>
</t:wrapper>
