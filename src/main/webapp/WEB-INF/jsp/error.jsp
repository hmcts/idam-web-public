<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<t:wrapper titleKey="public.error.page.generic.error">
    <article class="content__body">
        <header class="page-header group">
            <h1 id="skiplinktarget" class="heading-large">
                <spring:message code="public.error.page.generic.error" />
            </h1>
        </header>
        <div class="text">
            <p class="lede">
                <spring:message code="public.error.page.generic.sub.error" />
            </p>
        </div>
    </article>
</t:wrapper>