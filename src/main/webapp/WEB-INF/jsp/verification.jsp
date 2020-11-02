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
                <div class="error-summary" role="group"
                     aria-labelledby="validation-error-summary-heading"
                     tabindex="-1">

                    <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                          <spring:message code="public.login.error.verification.problem.title"/>
                    </h2>
                    <c:choose>
                        <c:when test="${isCodeEmpty}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password is empty');
                            </script>
                            <p><spring:message code="public.login.error.verification.code.incorrect.instruction"/></p>
                        </c:when>
                        <c:when test="${isCodePatternInvalid}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password has invalid pattern');
                            </script>
                            <p><spring:message code="public.login.error.verification.code.incorrect.instruction"/></p>
                        </c:when>
                        <c:when test="${isCodeLengthInvalid}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password has invalid length');
                            </script>
                            <p><spring:message code="public.login.error.verification.code.incorrect.instruction"/></p>
                        </c:when>
                        <c:when test="${hasOtpSessionExpired}">
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password has expired');
                            </script>
                            <p><spring:message code="public.login.error.verification.expired.instruction.1"/></p>
                            <p><spring:message code="public.login.error.verification.expired.instruction.2"/></p>
                        </c:when>
                        <c:otherwise>
                            <script>
                                sendEvent('Authorization', 'Error', 'One time password is incorrect');
                            </script>
                            <p><spring:message code="public.login.error.verification.code.incorrect.instruction"/></p>
                        </c:otherwise>
                    </c:choose>
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
                        id="code" name="code" path="code" type="code" value="" autocomplete="off"/>
                </div>
                <input class="button" type="submit" value="<spring:message code="public.verification.form.submit" />">
            </div>
        </form:form>
    </article>
</t:wrapper>
