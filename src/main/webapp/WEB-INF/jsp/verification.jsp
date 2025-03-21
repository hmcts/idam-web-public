<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.verification.subheading.verification.required">
    <article class="content__body">
        <form:form name="verificationForm"
                   class="form"
                   modelAttribute="authorizeCommand"
                   novalidate=""
                   _lpchecked="1">

            <spring:hasBindErrors name="authorizeCommand">
                <c:set var="hasBindError" value="true" />
                <script>
                    sendEvent('Authorization', 'Error', 'User one time password authorization has failed');
                </script>
                <div class="error-summary" role="alert"
                     aria-labelledby="validation-error-summary-heading"
                     tabindex="-1">

                    <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                          <c:choose>
                                <c:when test="${hasOtpSessionExpired}">
                                    <spring:message code="public.login.error.verification.expired.title"/>
                                </c:when>
                                <c:otherwise>
                                    <spring:message code="public.login.error.verification.problem.title"/>
                                </c:otherwise>
                          </c:choose>
                    </h2>
                    <c:choose>
                        <c:when test="${isCodeEmpty}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password is empty');
                            </script>
                            <ul class="error-summary-list">
                                <li><a href="#code"><spring:message code="public.login.error.verification.code.incorrect.instruction"/></a></li>
                            </ul>
                        </c:when>
                        <c:when test="${isCodePatternInvalid}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password has invalid pattern');
                            </script>
                            <ul class="error-summary-list">
                                <li><a href="#code"><spring:message code="public.login.error.verification.code.incorrect.instruction"/></a></li>
                            </ul>
                        </c:when>
                        <c:when test="${isCodeLengthInvalid}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password has invalid length');
                            </script>
                            <ul class="error-summary-list">
                                <li><a href="#code"><spring:message code="public.login.error.verification.code.incorrect.instruction"/></a></li>
                            </ul>
                        </c:when>
                        <c:when test="${hasOtpSessionExpired}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password has expired');
                            </script>
                            <c:url value="/login" var="loginUrl">
                                <c:param name="redirect_uri" value="${redirect_uri}"/>
                                <c:param name="client_id" value="${client_id}"/>
                                <c:param name="state" value="${state}"/>
                                <c:param name="nonce" value="${nonce}"/>
                                <c:param name="prompt" value="${prompt}"/>
                                <c:param name="scope" value="${scope}"/>
                                <c:param name="response_type" value="${response_type}"/>
                            </c:url>
                            <div class="text">
                                <p>
                                    <spring:message
                                        code="public.login.error.verification.field.code.expired"
                                        arguments="${loginUrl}"
                                        htmlEscape="false"/>
                                </p>
                            </div>
                        </c:when>
                        <c:otherwise>
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password is incorrect');
                            </script>
                            <ul class="error-summary-list">
                                <li><a href="#code"><spring:message code="public.login.error.verification.code.incorrect.instruction"/></a></li>
                            </ul>
                        </c:otherwise>
                    </c:choose>
                </div>
            </spring:hasBindErrors>

            <h1 class="heading-large"><spring:message code="public.verification.subheading.verification.required"/></h1>
            <div class="form-section">
                <div class="column-two-thirds" style="padding: 0;">
                    <p><spring:message code="public.verification.p"/></p>
                    <p><spring:message htmlEscape="false" code="public.verification.check.inbox.instruction"/></p>
                    <div class="form-group ${hasBindError? 'form-group-error' : ''}">
                        <label for="code">
                            <span class="form-label">
                                <spring:message code="public.verification.code.label"/>
                            </span>
                        </label>
                        <c:if test="${hasBindError}">
                            <span class="error-message">
                                <c:choose>
                                    <c:when test="${hasOtpSessionExpired}">
                                        <c:url value="/login" var="loginUrl">
                                            <c:param name="redirect_uri" value="${redirect_uri}"/>
                                            <c:param name="client_id" value="${client_id}"/>
                                            <c:param name="state" value="${state}"/>
                                            <c:param name="nonce" value="${nonce}"/>
                                            <c:param name="prompt" value="${prompt}"/>
                                            <c:param name="scope" value="${scope}"/>
                                            <c:param name="response_type" value="${response_type}"/>
                                        </c:url>
                                        <spring:message code="public.login.error.verification.field.code.expired" htmlEscape="false" arguments="${loginUrl}"/>
                                    </c:when>
                                    <c:otherwise>
                                        <spring:message code="public.login.error.verification.field.code.incorrect"/>
                                    </c:otherwise>
                                </c:choose>
                            </span>
                        </c:if>
                        <form:input
                            class="form-control${hasBindError? ' form-control-error' : ''}"
                            id="code" name="code" path="code" type="text" style="width:120px" value="" autocomplete="off"/>
                    </div>
                    <input class="button" type="submit" data-prevent-double-click="true"
                        onclick="this.disabled = true; document.getElementsByName('verificationForm')[0].submit()"
                        value="<spring:message code="public.verification.form.submit" />">
                </div>
            </div>
        </form:form>
    </article>
</t:wrapper>
