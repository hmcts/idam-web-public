<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.forgot.password.title.text">
    <article class="content__body">
        <form:form name="loginForm"
              class="form form-section"
              novalidate=""
              method="post"
              _lpchecked="1"
              action="doForgotPassword"
              modelAttribute="forgotPasswordCommand">

            <spring:hasBindErrors name="forgotPasswordCommand">
                <script>
                    sendEvent('Forgot Password', 'Error', 'Forgot password error occurred');
                </script>
                <div class="error-summary" role="alert" aria-labelledby="validation-error-summary-heading"
                     tabindex="-1">
                    <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                        <spring:message code="public.common.error.title" text="default"/>
                    </h2>
                    <p>
                        <spring:message code="public.common.error.please.fix.following" text="default"/>
                    </p>
                    <ul class="error-summary-list">
                        <c:forEach var="error" items="${errors.fieldErrors}">
                            <c:set var="isEmailError" value="${error.field == 'email'}"/>
                            <c:set var="isEmptyValue" value="${empty error.rejectedValue}"/>
                            <c:set var="isEmptyError" value="${error.code.startsWith('NotEmpty')}"/>
                            <c:if test="${(isEmailError && isEmptyError && isEmptyValue) || (!isEmptyValue) || (!isEmailError)}">
                                <li>
                                    <a href="#${error.field}"><spring:message message="${error}" /></a>
                                </li>
                            </c:if>
                        </c:forEach>
                    </ul>
                </div>
            </spring:hasBindErrors>

            <h1 class="heading-large"><spring:message code="public.forgot.password.heading.text" text="default"/></h1>
            <p class="body-text"><spring:message code="public.forgot.password.subheading.text" text="default"/></p>

            <spring:bind path="email">
                <div class="form-group ${status.error ? 'form-group-error' : ''}">
                    <label for="email">
                        <span class="form-label-bold">
                            <spring:message code="public.common.email.address.label" text="default"/>
                        </span>
                        <c:if test="${status.error}">
                            <span class="error-message">
                                <c:if test="${empty status.value}">
                                    <script>
                                        sendEvent('Forgot Password', 'Error', 'Empty email');
                                    </script>
                                    <spring:message code="public.common.error.enter.username" />
                                </c:if>
                                <c:if test="${not empty status.value}">
                                    <script>
                                        sendEvent('Forgot Password', 'Error', 'Invalid email');
                                    </script>
                                    <spring:message code="public.common.error.enter.valid.email" />
                                </c:if>
                            </span>
                        </c:if>
                    </label>
                    <form:input path="email"
                                class="form-control ${status.error ? 'form-control-error' : ''}"
                                type="email"
                                id="email"
                                value=""
                                autocomplete="off" />
                </div>
            </spring:bind>


            <input class="button" type="submit" value="<spring:message code="public.common.button.submit.text"/>">
            <form:input path="redirectUri" type="hidden" id="redirectUri" />
            <form:input path="client_id" type="hidden" id="client_id" />
            <form:input path="state" type="hidden" id="state" />
            <form:input path="scope" type="hidden" id="scope" />
        </form:form>
    </article>
</t:wrapper>