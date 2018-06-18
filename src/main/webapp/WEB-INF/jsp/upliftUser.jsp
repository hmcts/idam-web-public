<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>

<t:wrapper titleKey="public.uplift.user.title">
    <article class="content__body">
        <c:set var="redirectUri" value="${empty param['redirectUri'] ? param['redirect_uri'] : param['redirectUri']}" />
        <c:set var="clientId" value="${empty param['clientId'] ? param['client_id'] : param['clientId']}" />
        <c:set var="hasError" value="${error != null}" />
        <c:set var="isFirstNameEmpty" value="${param['firstName'] == ''}" />
        <c:set var="isLastNameEmpty" value="${param['lastName'] == ''}" />
        <c:set var="isUsernameEmpty" value="${param['username'] == ''}" />

        <spring:hasBindErrors name="registerUserCommand">
            <div class="error-summary" role="group" aria-labelledby="validation-error-summary-heading" tabindex="-1">
                <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                    ${errorTitle}
                </h2>
                <p>${errorMessage}</p>
                <ul class="error-summary-list">
                    <c:forEach var="error" items="${errors.fieldErrors}">
                        <li>
                            <a href="#${error.field}">
                                <c:if test="${error.field != 'username' or (error.field == 'username' && !isUsernameEmpty)}">
                                    <spring:message message="${error}" />
                                </c:if>
                                <c:if test="${error.field == 'username' && isUsernameEmpty}">
                                    <spring:message code="public.common.error.enter.username" />
                                </c:if>
                            </a>
                        </li>
                    </c:forEach>
                </ul>
            </div>
        </spring:hasBindErrors>

        <h1 class="heading-large"><spring:message code="public.uplift.user.heading" /></h1>

        <div class="grid-row">
            <div class="column-one-half column--bordered">
                <form:form name="registerForm"
                    commandName="registerUserCommand"
                    class="form form-section"
                    novalidate="true"
                    method="post"
                    _lpchecked="1"
                    action="/registerUser">

                    <h2 class="heading-medium"><spring:message code="public.uplift.user.body" /></h2>

                    <div class="form-group ${isFirstNameEmpty? 'form-group-error' : ''}">
                        <label for="firstName">
                            <span class="form-label-bold"><spring:message code="public.uplift.user.first.name.label" /></span>
                            <c:if test="${isFirstNameEmpty}">
                                <span class="error-message"><spring:message code="public.common.error.empty.first.name" /></span>
                            </c:if>
                        </label>
                        <input class="form-control form-control-3-4 ${isFirstNameEmpty? 'form-control-error' : ''}" type="text" id="firstName" name="firstName" value="${param['firstName']}" autocomplete="off">
                    </div>

                    <div class="form-group ${isLastNameEmpty? 'form-group-error' : ''}">
                        <label for="lastName">
                            <span class="form-label-bold"><spring:message code="public.uplift.user.last.name.label" /></span>
                            <c:if test="${isLastNameEmpty}">
                                <span class="error-message"><spring:message code="public.common.error.empty.last.name" /></span>
                            </c:if>
                        </label>
                        <input class="form-control form-control-3-4 ${isLastNameEmpty? 'form-control-error' : ''}" type="text" id="lastName" name="lastName" value="${param['lastName']}" autocomplete="off">
                    </div>

                    <spring:bind path="username">
                        <div class="form-group ${status.error? 'form-group-error' : ''}">

                            <label for="username">
                                <span class="form-label-bold"><spring:message code="public.uplift.user.email.address.label" /></span>
                                <c:if test="${isUsernameEmpty}">
                                    <span class="error-message"><spring:message code="public.common.error.empty.email" /></span>
                                </c:if>
                                <c:if test="${!isUsernameEmpty && status.error}">
                                    <span class="error-message"><spring:message code="public.common.error.invalid.email" /></span>
                                </c:if>
                            </label>
                            <input class="form-control form-control-3-4 ${status.error? 'form-control-error' : ''}" type="email" id="username" name="username" value="${param['username']}" autocomplete="off">
                        </div>
                    </spring:bind>

                    <p class="body-text">
                        <c:set var="finePrintUrl" value="https://hmcts-access.service.gov.uk" />
                        <spring:message code="public.register.fine.print"
                                        arguments="${finePrintUrl}/privacy-policy,${finePrintUrl}/terms-and-conditions" />
                    </p>

                    <spring:message code="public.uplift.user.submit.button" var="formCta" />
                    <input class="button" type="submit" value="${formCta}">

                    <input type="hidden" id="jwt" name="jwt" value="${param['jwt']}"/>
                    <input type="hidden" id="redirectUri" name="redirectUri" value="${redirectUri}"/>
                    <input type="hidden" id="clientId" name="clientId" value="${clientId}"/>
                    <input type="hidden" id="state" name="state" value="${param['state']}"/>
                </form:form>
            </div>
            <div class="column-one-half">
                <h2 class="heading-medium"><spring:message code="public.register.subheading.existing.account"/></h2>
                <p>
                    <a href="/register?state=${param['state']}&redirect_uri=${param['redirect_uri']}&client_id=${param['client_id']}&jwt=${param['jwt']}">
                        <spring:message code="public.register.sign.in" />
                    </a>
                </p>
            </div>
        </div>
    </article>
</t:wrapper>