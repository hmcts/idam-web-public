<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.login.subheading.sign.in">
    <article class="content__body">
        <c:set var="hasError" value="${error != null}" />
        <c:if test="${hasError}">
            <script>
                sendEvent('Uplift', 'Error', 'Login error occurred');
            </script>
            <div class="error-summary" role="group" aria-labelledby="validation-error-summary-heading" tabindex="-1">
                <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                        ${errorTitle}
                </h2>
                <p>${errorMessage}</p>
                <ul class="error-summary-list">
                    <li><a href="#username"><spring:message code="public.login.error.failed.username" /></a></li>
                    <li><a href="#password"><spring:message code="public.login.error.failed.password" /></a></li>
                </ul>
            </div>
        </c:if>
        <h1 class="heading-large"><spring:message code="public.login.heading" /></h1>
        <div class="grid-row">
            <div class="column-one-half column--bordered">
                <form:form name="upliftUser"
                      class="form form-section"
                      method="post"
                      novalidate=""
                      _lpchecked="1">

                    <h2 class="heading-medium"><spring:message code="public.login.subheading.sign.in"/></h2>
                    <div class="form-group ${hasError? 'form-group-error': ''}">
                        <label for="username">
                            <span class="form-label-bold"><spring:message code="public.common.email.address.label" /></span>
                            <c:if test="${hasError}">
                                <script>
                                    sendEvent('Uplift', 'Error', 'Email address error occurred');
                                </script>
                                <span class="error-message"><spring:message code="public.common.error.enter.username" /></span>
                            </c:if>
                        </label>
                        <input class="form-control form-control-3-4 ${hasError? 'form-control-error': ''}" type="email" id="username" name="username" value="" autocomplete="off">
                    </div>

                    <div class="form-group ${hasError? 'form-group-error': ''}">
                        <label for="password">
                            <span class="form-label-bold"><spring:message code="public.common.password.label" /></span>
                            <c:if test="${hasError}">
                                <script>
                                    sendEvent('Uplift', 'Error', 'Password error occurred');
                                </script>
                                <span class="error-message"><spring:message code="public.common.error.enter.password" /></span>
                            </c:if>
                        </label>
                        <input class="form-control form-control-3-4 ${hasError? 'form-control-error': ''}" id="password" name="password" type="password" autocomplete="off">
                    </div>

                    <div class="form-group">
                        <c:url value="/reset/forgotpassword" var="forgotPasswordUrl">
                            <c:param name="redirectUri" value="${param['redirect_uri']}" />
                            <c:param name="clientId" value="${param['client_id']}" />
                            <c:param name="state" value="${param['state']}" />
                            <c:param name="scope" value="${param['scope']}" />
                        </c:url>
                        <a href="${forgotPasswordUrl}">
                            <spring:message code="public.login.forgotten.password" />
                        </a>
                    </div>


                    <input class="button" type="submit" value="<spring:message code="public.login.form.submit"/>">
                </form:form>
            </div>
            <div class="column-one-half">
                <h2 class="heading-medium"><spring:message code="public.login.subheading.create.account"/></h2>
                <p>
                    <spring:message code="public.login.create.account.body" />
                    <c:url value="/login/uplift" var="loginUpliftUrl">
                        <c:param name="redirect_uri" value="${param['redirect_uri']}" />
                        <c:param name="client_id" value="${param['client_id']}" />
                        <c:param name="state" value="${param['state']}" />
                        <c:param name="scope" value="${param['scope']}" />
                        <c:param name="jwt" value="${param['jwt']}" />
                    </c:url>
                    <a href="${loginUpliftUrl}">
                        <spring:message code="public.common.create.account" />
                    </a>
                    <spring:message code="public.login.create.account.body.to.use.service" />
                </p>
            </div>
        </div>
    </article>
</t:wrapper>