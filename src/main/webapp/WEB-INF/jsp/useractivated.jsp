<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper>
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.user.activated.heading" />
            </h1>
        </header>
        <p class="lede"><spring:message code="public.user.activated.body" /></p>
        <c:if test="${redirectUri != null}">
            <p>
                <a href="${redirectUri}" class="button">
                    <spring:message code="public.common.button.continue.text" />
                </a>
            </p>
        </c:if>
    </article>
</t:wrapper>