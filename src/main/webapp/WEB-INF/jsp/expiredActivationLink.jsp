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
            <spring:message code="public.user.activation.expired.text.p1.1"/>
            <c:choose>
                <c:when test="${empty redirect_uri}">
                    <spring:message code="public.user.activation.expired.text.p1.2"/>.
                </c:when>
                <c:otherwise>
                    <a href="${fn:escapeXml(redirect_uri)}"><spring:message code="public.user.activation.expired.text.p1.2" text=""/>.</a>
                </c:otherwise>
            </c:choose>
        </p>
        <p class="lede">
            <spring:message code="public.user.activation.expired.text.p2"/>
        </p>
    </article>
    <script>
        sendEvent('Expired Token', 'Expired', 'User activation token has expired');
    </script>
</t:wrapper>