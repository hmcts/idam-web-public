<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.error.page.generic.error">
    <article class="content__body">
        <header class="page-header group">
            <h1 id="skiplinktarget" class="heading-large">
                <spring:message code="${errorMsg}" text=""/>
            </h1>
        </header>
        <div class="text">
            <p class="lede">
                <c:choose>
                    <c:when test="${errorSubMsg != null}">
                        <spring:message code="${errorSubMsg}" text=""/>
                    </c:when>
                </c:choose>
            </p>
        </div>
    </article>
    <script>
        sendEvent('Generic Error', 'Error', 'Generic error page loaded');
    </script>
</t:wrapper>