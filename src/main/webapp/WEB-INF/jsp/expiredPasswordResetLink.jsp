<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.user.activation.expired.title">
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.user.link.expired.heading"/>
            </h1>
        </header>
        <p class="lede">
            <spring:message code="public.user.password.reset.expired.text"/>
        </p>
        <p>
            <spring:message code="public.user.password.reset.expired.link.text.start"/>
            <c:choose>
                <c:when test="${empty forgotPasswordLink}">
                    <spring:message code="public.user.password.reset.expired.link.label"/>
                </c:when>
                <c:otherwise>
                    <a href="${forgotPasswordLink}"><spring:message code="public.user.password.reset.expired.link.label"/> </a>
                </c:otherwise>
            </c:choose>
            <spring:message code="public.user.password.reset.expired.link.text.end"/>
        </p>
    </article>
    <script>
        sendEvent('Expired Token', 'Expired', 'Password Reset token has expired');
    </script>
</t:wrapper>