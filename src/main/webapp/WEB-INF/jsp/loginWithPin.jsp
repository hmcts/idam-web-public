<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.login.subheading.sign.in">
    <article class="content__body">
        <c:set var="hasError" value="${error != null}" />
        <c:if test="${hasError}">
            <div class="error-summary" role="group" aria-labelledby="validation-error-summary-heading" tabindex="-1">
                <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                    <spring:message code="${errorTitle}" />
                </h2>
                <c:if test="${invalidPin}">
                  <p><spring:message code="public.login.with.pin.valid.security.code.description" arguments="https://hmcts-access.service.gov.uk/contact-us"/></p>
                </c:if>
                <ul class="error-summary-list">
                    <li><a href="#pin"><spring:message code="${errorMessage}" /></a></li>
                </ul>
            </div>
        </c:if>
        <h1 class="heading-large">
            <spring:message code="public.login.with.pin.heading" />
        </h1>
        <p class="body-text text-secondary">
            <spring:message code="public.login.with.pin.body" />
        </p>
        <form name="f" action="/loginWithPin" method="post" class="form form-section">
            <div class="form-group ${hasError ? "form-group-error" : ""}">
                <label for="pin">
                    <span class="form-label-bold">
                        <spring:message code="public.login.with.pin.form.security.code.label" />
                    </span>
                    <c:if test="${hasError}">
                        <span class="error-message">
                            <spring:message code="public.login.with.pin.form.security.code.error" />
                        </span>
                    </c:if>
                </label>
                <input class="form-control ${hasError ? "form-control-error" : ""}" type="text" id="pin" name="pin" value="" autocomplete="off">
            </div>

            <spring:message code="public.login.with.pin.form.cta" var="formCta" />
            <input class="button" type="submit" value="${formCta}">

            <input type="hidden" id="redirectUri" name="redirect_uri" value="${param['redirect_uri']}"/>
            <input type="hidden" id="clientId" name="client_id" value="${param['client_id']}"/>
            <input type="hidden" id="state" name="state" value="${param['state']}"/>
        </form>
    </article>
</t:wrapper>