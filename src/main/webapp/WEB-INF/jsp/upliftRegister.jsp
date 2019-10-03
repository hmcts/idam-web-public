<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.uplift.user.title">
    <article class="content__body">
        <c:set var="hasError" value="${error != null}" />

        <spring:hasBindErrors name="registerUserCommand">
            <div class="error-summary" role="group" aria-labelledby="validation-error-summary-heading" tabindex="-1">
                <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                    ${errorTitle}
                </h2>
                <p>${errorMessage}</p>
                <ul class="error-summary-list">
                    <c:if test="${not empty errors.getFieldError('firstName')}">
                        <li>
                            <a href="#${errors.getFieldError('firstName').field}">
                                <c:choose>
                                    <c:when test="${empty errors.getFieldError('firstName').rejectedValue}">
                                        <spring:message code="public.common.error.empty.first.name" />
                                    </c:when>
                                    <c:otherwise>
                                        <spring:message code="public.common.error.invalid.first.name"/>
                                    </c:otherwise>
                                </c:choose>
                            </a>
                        </li>
                    </c:if>
                    <c:if test="${not empty errors.getFieldError('lastName')}">
                        <li>
                            <a href="#${errors.getFieldError('lastName').field}">
                                <c:choose>
                                    <c:when test="${empty errors.getFieldError('lastName').rejectedValue}">
                                        <spring:message code="public.common.error.empty.last.name" />
                                    </c:when>
                                    <c:otherwise>
                                        <spring:message code="public.common.error.invalid.last.name"/>
                                    </c:otherwise>
                                </c:choose>
                            </a>
                        </li>
                    </c:if>
                    <c:if test="${not empty errors.getFieldError('username')}">
                        <li>
                            <a href="#${errors.getFieldError('username').field}">
                                <c:choose>
                                    <c:when test="${empty errors.getFieldError('username').rejectedValue}">
                                        <spring:message code="public.common.error.enter.username" />
                                    </c:when>
                                    <c:otherwise>
                                        <spring:message code="public.common.error.invalid.username"/>
                                    </c:otherwise>
                                </c:choose>
                            </a>
                        </li>
                    </c:if>
                </ul>
            </div>
        </spring:hasBindErrors>

        <h1 class="heading-large"><spring:message code="public.uplift.user.heading" /></h1>

        <div class="grid-row">
            <div class="column-one-half column--bordered">
                <form:form name="registerForm"
                    modelAttribute="registerUserCommand"
                    class="form form-section"
                    novalidate="true"
                    _lpchecked="1">

                    <h2 class="heading-medium"><spring:message code="public.uplift.user.body" /></h2>

                    <spring:bind path="firstName">
                        <div class="form-group ${status.error ? 'form-group-error' : ''}">
                            <label for="firstName">
                                <span class="form-label-bold"><spring:message code="public.self.register.first.name.label"/></span>
                                <c:if test="${status.error}">
                                        <span class="error-message">
                                            <ul>
                                                <c:forEach var="error" items="${status.errorCodes}">
                                                    <li><spring:message code="${error}${'.selfRegisterCommand.firstName'}"></spring:message></li>
                                                    <script>
                                                        sendEvent('Uplift Registration', 'Error', 'First name error code: ${status.errorCode}');
                                                    </script>
                                                </c:forEach>
                                            </ul>
                                        </span>
                                </c:if>
                            </label>
                            <form:input
                                path="firstName"
                                class="form-control form-control-3-4 ${status.error ? 'form-control-error' : ''}"
                                id="firstName"
                                value="${firstName}"
                                autocomplete="off"/>
                        </div>
                    </spring:bind>

                    <spring:bind path="lastName">
                        <div class="form-group ${status.error ? 'form-group-error' : ''}">
                            <label for="lastName">
                                <span class="form-label-bold"><spring:message code="public.self.register.last.name.label"/></span>
                                <c:if test="${status.error}">
                                        <span class="error-message">
                                            <ul>
                                                <c:forEach var="error" items="${status.errorCodes}">
                                                    <li><spring:message code="${error}${'.selfRegisterCommand.lastName'}"></spring:message></li>
                                                    <script>
                                                        sendEvent('Uplift Registration', 'Error', 'Last name error code: ${status.errorCode}');
                                                    </script>
                                                </c:forEach>
                                            </ul>
                                        </span>
                                </c:if>
                            </label>
                            <form:input
                                path="lastName"
                                class="form-control form-control-3-4 ${status.error ? 'form-control-error' : ''}"
                                id="lastName"
                                value="${lastName}"
                                autocomplete="off"/>
                        </div>
                    </spring:bind>

                    <spring:bind path="username">
                        <div class="form-group ${status.error ? 'form-group-error' : ''}">
                            <label for="username">
                                <span class="form-label-bold"><spring:message code="public.common.email.address.label"/></span>
                                <c:if test="${status.error && not empty status.value}">
                                    <script>
                                        sendEvent('Uplift Registration', 'Error', 'Invalid email address');
                                    </script>
                                    <span class="error-message"><spring:message code="public.common.error.invalid.email"/></span>
                                </c:if>
                                <c:if test="${status.error && empty status.value}">
                                    <script>
                                        sendEvent('Uplift Registration', 'Error', 'Email address is empty');
                                    </script>
                                    <span class="error-message"><spring:message code="public.common.error.empty.email"/></span>
                                </c:if>
                            </label>
                            <form:input
                                path="username"
                                class="form-control form-control-3-4 ${status.error ? 'form-control-error' : ''}"
                                id="username"
                                value="${username}"
                                autocomplete="off"/>
                        </div>
                    </spring:bind>

                    <p class="body-text">
                        <spring:message code="public.register.read.our" />
                        <a href="https://hmcts-access.service.gov.uk/privacy-policy" target="_blank"><spring:message code="public.register.privacy.policy" /></a>
                        <spring:message code="public.register.and" />
                        <a href="https://hmcts-access.service.gov.uk/terms-and-conditions" target="_blank"><spring:message code="public.register.term.conditions" /></a>
                    </p>

                    <input class="button" type="submit" value="<spring:message code="public.uplift.user.submit.button" />">
                </form:form>
            </div>
            <div class="column-one-half">
                <h2 class="heading-medium"><spring:message code="public.register.subheading.existing.account"/></h2>
                <p>
                    <c:url value="/register" var="registerUrl">
                        <c:param name="redirect_uri" value="${param['redirect_uri']}" />
                        <c:param name="client_id" value="${param['client_id']}" />
                        <c:param name="state" value="${param['state']}" />
                        <c:param name="scope" value="${param['scope']}" />
                        <c:param name="jwt" value="${param['jwt']}" />
                    </c:url>
                    <a href="${registerUrl}" id="reg-sign-in-url"><spring:message code="public.register.sign.in" /></a>
                </p>
            </div>
        </div>
    </article>
</t:wrapper>