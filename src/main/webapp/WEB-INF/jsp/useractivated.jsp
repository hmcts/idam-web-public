<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.user.activated.heading">
    <article class="content__body">
        <header class="page-header group">
            <h1 id="skiplinktarget" class="heading-large">
                <spring:message code="public.user.activated.heading" />
            </h1>
        </header>
        <p class="lede"><spring:message code="public.user.activated.body" /></p>
        <c:choose>
            <c:when test="${redirectUri != null}">
                <p>
                    <a href="${fn:escapeXml(redirectUri)}" class="button">
                        <spring:message code="public.common.button.continue.text" />
                    </a>
                </p>
            </c:when>
            <c:otherwise>
                <p>
                    <a href="https://www.gov.uk/" class="button">
                        <spring:message code="public.common.button.continue.text" />
                    </a>
                </p>
            </c:otherwise>
        </c:choose>
    </article>
    <script>
        sendEvent('User Activation', 'Success',  'User has been activated');
    </script>
</t:wrapper>