<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper>
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.error.page.not.found.heading" />
            </h1>
        </header>
        <div class="article-container">
            <article role="article" class="group">
                <p class="lede">
                    <spring:message code="public.error.page.not.found.description" />
                </p>
            </article>
        </div>
    </article>
</t:wrapper>