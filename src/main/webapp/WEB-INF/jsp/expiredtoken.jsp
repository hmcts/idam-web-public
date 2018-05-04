<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper>
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.user.activation.expired.title" text="default"/>
            </h1>
        </header>
        <p class="lede">
            <spring:message code="public.user.activation.expired.text" text="default"/>
        </p>
        <c:if test="${redirect_uri != null}">
            <p><a href="${redirect_uri}"><spring:message code="public.user.activation.expired.link.click.here" text=""/></a> <spring:message code="public.user.activation.expired.link.sing.into" text=""/></p>
        </c:if>
    </article>
</t:wrapper>