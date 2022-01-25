<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.login.error.verification.problem.title">
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.login.error.verification.problem.title" />
            </h1>
        </header>
        <div>
            <p>
                <spring:message code="public.login.error.verification.expired.code.instruction.1" />
            </p>
            <p>
                <spring:message code="public.login.error.verification.expired.code.instruction.2" />
            </p>
        </div>
        <div>
            <p>
                <c:url value="/login" var="loginUrl">
                    <c:param name="redirect_uri" value="${redirectUri}" />
                    <c:param name="client_id" value="${client_id}" />
                    <c:param name="state" value="${state}" />
                    <c:param name="scope" value="${scope}" />
                    <c:param name="nonce" value="${nonce}" />
                    <c:param name="prompt" value="${prompt}" />
                </c:url>
                <a href="${loginUrl}" class="button">
                    <spring:message code="public.common.button.continue.text" />
                </a>
            </p>
        </div>
    </article>
</t:wrapper>
