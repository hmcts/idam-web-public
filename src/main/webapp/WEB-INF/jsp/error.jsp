<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.error.page.generic.error">
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.error.page.generic.error" text=""/>
            </h1>
        </header>
        <div class="text">
            <p class="lede">
                <spring:message code="public.error.page.generic.sub.error" text=""/>
            </p>
        </div>
    </article>
    <script>
        sendEvent('Generic Error', 'Error', 'Generic error page loaded');
    </script>
</t:wrapper>