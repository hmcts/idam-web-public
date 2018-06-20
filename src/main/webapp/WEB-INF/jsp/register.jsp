<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.register.title">
    <article class="content__body">
        <c:set var="redirectUri" value="${empty param['redirectUri'] ? param['redirect_uri'] : param['redirectUri']}" />
        <c:set var="clientId" value="${empty param['clientId'] ? param['client_id'] : param['clientId']}" />
        <c:set var="hasError" value="${error != null}" />
        <c:if test="${hasError}">
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
                      novalidate=""
                      method="post"
                      _lpchecked="1"
                      action="/uplift">

                    <h2 class="heading-medium"><spring:message code="public.login.subheading.sign.in"/></h2>
                    <div class="form-group ${hasError? 'form-group-error': ''}">
                        <label for="username">
                            <span class="form-label-bold"><spring:message code="public.common.email.address.label" /></span>
                            <c:if test="${hasError}">
                                <span class="error-message"><spring:message code="public.common.error.enter.username" /></span>
                            </c:if>
                        </label>
                        <input class="form-control form-control-3-4 ${hasError? 'form-control-error': ''}" type="email" id="username" name="username" value="" autocomplete="off">
                    </div>

                    <div class="form-group ${hasError? 'form-group-error': ''}">
                        <label for="password">
                            <span class="form-label-bold"><spring:message code="public.common.password.label" /></span>
                            <c:if test="${hasError}">
                                <span class="error-message"><spring:message code="public.common.error.enter.password" /></span>
                            </c:if>
                        </label>
                        <input class="form-control form-control-3-4 ${hasError? 'form-control-error': ''}" id="password" name="password" type="password" autocomplete="off">
                    </div>

                    <div class="form-group">
                        <a href="/reset/forgotpassword?redirectUri=${param['redirect_uri']}&clientId=${param['client_id']}&state=${param['state']}">
                            <spring:message code="public.login.forgotten.password" />
                        </a>
                    </div>

                    <spring:message code="public.login.form.submit" var="signInCta" />
                    <input class="button" type="submit" value="${signInCta}">
                    <input type="hidden" id="jwt" name="jwt" value="${param['jwt']}"/>
                    <input type="hidden" id="redirectUri" name="redirectUri" value="${redirectUri}"/>
                    <input type="hidden" id="clientId" name="clientId" value="${clientId}"/>
                    <input type="hidden" id="state" name="state" value="${param['state']}"/>
                </form:form>
            </div>
            <div class="column-one-half">
                <h2 class="heading-medium"><spring:message code="public.login.subheading.create.account"/></h2>
                <p>
                    <spring:message code="public.login.create.account.body"
                                    arguments="/login/uplift?state=${param['state']}&redirect_uri=${param['redirect_uri']}&client_id=${param['client_id']}&jwt=${param['jwt']}" />
                </p>
            </div>
        </div>
    </article>
</t:wrapper>