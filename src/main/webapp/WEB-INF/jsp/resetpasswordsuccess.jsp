<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.reset.password.success.title.text">
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.reset.password.success.heading.text"/>
            </h1>
        </header>
        <p class="lede"><spring:message code="public.reset.password.success.subheading.text"/></p>
        <c:if test="${redirectUri != null}">
            <p>
                <a class="button" href="${fn:escapeXml(redirectUri)}" id="continue-button">
                    <spring:message code="public.reset.password.success.button.continue.text"/>
                </a>
            </p>
        </c:if>
    </article>
    <script>
        ga('send', 'event', 'Reset password success', 'The reset password email entry was successful');
    </script>
</t:wrapper>
