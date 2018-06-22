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
                <spring:message code="public.user.activation.expired.heading" text="default"/>
            </h1>
        </header>
        <p class="lede">
            <spring:message code="public.user.activation.expired.text" text="default"/>
        </p>
        <c:if test="${redirect_uri != null}">
            <p><a href="${fn:escapeXml(redirect_uri)}"><spring:message code="public.user.activation.expired.link.click.here" text=""/></a> <spring:message code="public.user.activation.expired.link.sing.into" text=""/></p>
        </c:if>
    </article>
</t:wrapper>