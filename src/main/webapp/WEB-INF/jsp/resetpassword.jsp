<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.reset.password.title.text">
    <article class="content__body">
        <c:set var="hasError" value="${error != null}" />
        <form:form name="resetpassword" class="form form-section" novalidate="" method="post" _lpchecked="1"
                 action="/doResetPassword">
            <c:if test="${hasError}">
                <script>
                    sendEvent('Reset Password', 'Error', 'Reset password error occurred');
                </script>
                <div class="error-summary" role="group" aria-labelledby="validation-error-summary-heading" tabindex="-1">
                    <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                        <spring:message code="public.common.error.password.heading" text=""/>
                    </h2>
                    <ul class="error-summary-list">
                        <li><a href="#password1"><spring:message code="${errorMessage}" text=""/></a></li>
                    </ul>
                </div>
            </c:if>

            <h1 class="heading-large"><spring:message code="public.reset.password.heading.text" text="default"/></h1>
            <p><spring:message code="public.reset.password.new.password.rule.instruction" /></p>
            <ul class="list list-bullet">
                <li><spring:message code="public.reset.password.new.password.rule.characters" /></li>
                <li><spring:message code="public.reset.password.new.password.rule.capital.letter" /></li>
                <li><spring:message code="public.reset.password.new.password.rule.number" /></li>
                <li><spring:message code="public.reset.password.new.password.rule.no.name" /></li>
            </ul>

            <c:set var="hasPassword1Error" value="${not empty errorLabelOne}" />
            <div class="form-group ${hasPassword1Error ? "form-group-error" : ""}">
                <label for="password1">
                    <span class="form-label-bold">
                        <spring:message code="public.reset.password.enter.new.password" text=""/>
                    </span>
                    <c:if test="${hasPassword1Error}">
                        <span class="error-message"><spring:message code="${errorLabelOne}" text=""/></span>
                    </c:if>
                </label>
                <input class="form-control ${hasPassword1Error ? "form-control-error" : ""}" type="password" id="password1" name="password1" value="${fn:escapeXml(password1)}" autocomplete="off">
            </div>

            <c:set var="hasPassword2Error" value="${not empty errorLabelTwo}" />
            <div class="form-group ${hasPassword2Error ? "error" : ""}">
                <label for="password2">
                    <span class="form-label-bold">
                        <spring:message code="public.reset.password.repeat.new.password" text="default"/>
                    </span>
                    <c:if test="${hasPassword2Error}">
                        <span class="error-message"><spring:message code="${errorLabelTwo}" text=""/></span>
                    </c:if>
                </label>
                <input class="form-control ${hasPassword2Error ? "form-control-error" : ""}" type="password" id="password2" name="password2" value="${fn:escapeXml(password2)}" autocomplete="off">
            </div>


            <input class="button" type="submit" value="<spring:message code="public.reset.password.form.submit"/>">
            <input type="hidden" id="token" name="token" value="${fn:escapeXml(param.token)}"/>
            <input type="hidden" id="code" name="code" value="${fn:escapeXml(param.code)}"/>
        </form:form>
    </article>
</t:wrapper>