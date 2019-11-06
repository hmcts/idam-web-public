<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.verification.subheading.verification.required">
    <article class="content__body">
        <form:form action="/verification" class="form" modelAttribute="authorizeCommand">

            <form:input id="username" name="username" path="username" type="hidden" value="" />
            <form:input id="response_type" name="response_type" path="response_type" type="hidden" value="" />
            <form:input id="state" name="state" path="state" type="hidden" value="" />
            <form:input id="client_id" name="client_id" path="client_id" type="hidden" value="" />
            <form:input id="redirect_uri" name="redirect_uri" path="redirect_uri" type="hidden" value="" />
            <form:input id="scope" name="scope" path="scope" type="hidden" value="" />
            <form:input id="selfRegistrationEnabled" name="selfRegistrationEnabled" path="selfRegistrationEnabled" type="hidden" value="" />

            <spring:hasBindErrors name="authorizeCommand">
                <c:set var="hasBindError" value="true" />
                <script>
                    sendEvent('Authorization', 'Error', 'User one time password authorization has failed');
                </script>
                <div class="error-summary" role="group"
                     aria-labelledby="validation-error-summary-heading"
                     tabindex="-1">

                    <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                        <c:choose>
                            <c:when test="${hasOtpCheckFailed}">
                                <spring:message code="public.login.error.verification.failed.title"/>
                            </c:when>
                            <c:otherwise>
                                <spring:message code="public.login.error.other.title"/>
                            </c:otherwise>
                        </c:choose>
                    </h2>
                    <p><spring:message code="public.common.error.please.fix.following"/></p>
                    <ul class="error-summary-list">
                        <c:choose>
                            <c:when test="${isCodeEmpty}">
                                <script>
                                    sendEvent('Authorization', 'Error', 'One time password is empty');
                                </script>
                                <li><a href="#code"><spring:message code="public.login.error.verification.field.code.empty"/></a></li>
                            </c:when>
                            <c:when test="${isCodePatternInvalid}">
                                <script>
                                    sendEvent('Authorization', 'Error', 'One time password has invalid pattern');
                                </script>
                                <li><a href="#code"><spring:message code="public.login.error.verification.field.code.pattern"/></a></li>
                            </c:when>
                            <c:when test="${isCodeLengthInvalid}">
                                <script>
                                    sendEvent('Authorization', 'Error', 'One time password has invalid length');
                                </script>
                                <li><a href="#code"><spring:message code="public.login.error.verification.field.code.length"/></a></li>
                            </c:when>
                            <c:when test="${hasOtpSessionExpired}">
                                <script>
                                    sendEvent('Authorization', 'Error', 'One time password has expired');
                                </script>
                                <li><a href="#code"><spring:message code="public.login.error.verification.field.code.expired"/></a></li>
                            </c:when>
                            <c:otherwise>
                                <script>
                                    sendEvent('Authorization', 'Error', 'One time password is incorrect');
                                </script>
                                <li><a href="#code"><spring:message code="public.login.error.verification.field.code.failed"/></a></li>
                            </c:otherwise>
                        </c:choose>
                    </ul>
                </div>
            </spring:hasBindErrors>

            <h1 class="heading-large"><spring:message code="public.verification.subheading.verification.required"/></h1>
            <div class="form-section">
                <p><spring:message code="public.verification.p"/></p>
                <div class="form-group ${hasBindError? 'form-group-error' : ''}">
                    <label for="code">
                        <span class="form-label">
                            <spring:message code="public.verification.code.label"/>
                        </span>
                    </label>
                    <c:if test="${hasBindError}">
                        <span class="error-message">
                            <c:choose>
                                <c:when test="${isCodeEmpty}">
                                    <spring:message code="public.login.error.verification.field.code.empty"/>
                                </c:when>
                                <c:when test="${isCodePatternInvalid}">
                                    <spring:message code="public.login.error.verification.field.code.pattern"/>
                                </c:when>
                                <c:when test="${isCodeLengthInvalid}">
                                    <spring:message code="public.login.error.verification.field.code.length"/>
                                </c:when>
                                <c:when test="${hasOtpSessionExpired}">
                                    <spring:message code="public.login.error.verification.field.code.expired"/>
                                </c:when>
                                <c:otherwise>
                                    <spring:message code="public.login.error.verification.field.code.failed"/>
                                </c:otherwise>
                            </c:choose>
                        </span>
                    </c:if>
                    <form:input
                        class="form-control${hasBindError? ' form-control-error' : ''}"
                        id="code" name="code" path="code" type="code" value="" autocomplete="off"/>
                </div>
                <input class="button" type="submit" value="<spring:message code="public.verification.form.submit" />">
            </div>
        </form:form>
    </article>
</t:wrapper>
