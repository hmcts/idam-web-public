<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<t:wrapper titleKey="public.error.page.enter.email.heading">
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.error.page.enter.email.heading" />
            </h1>
        </header>
        <div class="article-container">
            <article role="article" class="group">
                <p class="lede">
                    <spring:message htmlEscape="false" code="public.error.page.enter.email.description" />
                </p>
                <ul class="list list-bullet">
                    <li>
                        <spring:message code="public.error.page.enter.email.list.one" />
                    </li>
                    <li>
                        <spring:message code="public.error.page.enter.email.list.two" />
                    </li>
                    <li>
                        <spring:message code="public.error.page.enter.email.list.three" text="" />
                    </li>
                </ul>
            </article>
        </div>
    </article>
</t:wrapper>
