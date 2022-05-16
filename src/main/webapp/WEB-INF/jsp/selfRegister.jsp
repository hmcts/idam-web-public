<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.self.register.title.text">
    <article class="content__body">
        <form:form name="selfRegisterForm" class="form form-section"
                   method="post" _lpchecked="1"
                   action="/users/selfRegister" modelAttribute="selfRegisterCommand" novalidate="">
            <spring:hasBindErrors name="selfRegisterCommand">
                <div class="error-summary" role="alert"
                     aria-labelledby="validation-error-summary-heading" tabindex="-1">
                    <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                        <spring:message code="public.common.error.title"/>
                    </h2>
                    <p>
                        <spring:message code="public.common.error.please.fix.following"/>
                    </p>
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
                        <c:if test="${not empty errors.getFieldError('email')}">
                            <li>
                                <a href="#${errors.getFieldError('email').field}">
                                    <c:choose>
                                        <c:when test="${empty errors.getFieldError('email').rejectedValue}">
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

            <h1 class="heading-large"><spring:message code="public.self.register.heading.text"/></h1>
            <div class="grid-row">
                <div class="column-one-half column--bordered">
                    <h2 class="heading-medium"><spring:message code="public.self.register.subheading.text"/></h2>
                    <div class="form-section">
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
                                                        sendEvent('Self Register', 'Error', 'First name error code: ${status.errorCode}');
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
                                    autocomplete="given-name"/>
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
                                                        sendEvent('Self Register', 'Error', 'Last name error code: ${status.errorCode}');
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
                                    autocomplete="family-name"/>
                            </div>
                        </spring:bind>
                        <spring:bind path="email">
                            <div class="form-group ${status.error ? 'form-group-error' : ''}">
                                <label for="email">
                                    <span class="form-label-bold"><spring:message code="public.common.email.address.label"/></span>
                                    <c:if test="${status.error && not empty status.value}">
                                        <script>
                                            sendEvent('Self Register', 'Error', 'Invalid email address');
                                        </script>
                                        <span class="error-message"><spring:message code="public.common.error.invalid.email"/></span>
                                    </c:if>
                                    <c:if test="${status.error && empty status.value}">
                                        <script>
                                            sendEvent('Self Register', 'Error', 'Email address is empty');
                                        </script>
                                        <span class="error-message"><spring:message code="public.common.error.empty.email"/></span>
                                    </c:if>
                                </label>
                                <form:input
                                    path="email"
                                    class="form-control form-control-3-4 ${status.error ? 'form-control-error' : ''}"
                                    id="email"
                                    value="${email}"
                                    autocomplete="email"/>
                            </div>
                        </spring:bind>
                        <form:input type="hidden" path="redirectUri" value="${redirectUri}"/>
                        <form:input type="hidden" path="client_id" value="${client_id}"/>
                        <form:input type="hidden" path="state" value="${state}"/>
                        <p class="body-text">
                            <spring:message code="public.register.read.our" />
                            <a href="https://hmcts-access.service.gov.uk/privacy-policy"><spring:message code="public.register.privacy.policy" /></a>
                            <spring:message code="public.register.and" />
                            <a href="https://hmcts-access.service.gov.uk/terms-and-conditions"><spring:message code="public.register.term.conditions" /></a>
                        </p>
                        <input class="button" type="submit" value="<spring:message code="public.self.register.submit.button"/>">
                    </div>
                </div>
                <div class="column-one-half">
                    <h2 class="heading-medium"><spring:message code="public.register.subheading.existing.account"/></h2>
                    <p>
                        <c:url value="/login" var="loginUrl">
                            <c:param name="redirect_uri" value="${redirectUri}" />
                            <c:param name="client_id" value="${client_id}" />
                            <c:param name="state" value="${state}" />
                            <c:param name="nonce" value="${nonce}" />
                            <c:param name="scope" value="${scope}" />
                        </c:url>
                        <a href="${loginUrl}"><spring:message code="public.register.sign.in" /></a>
                    </p>
                </div>
            </div>
        </form:form>
    </article>
</t:wrapper>