<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.error.page.not.found.heading">
    <article class="content__body">
        <header class="page-header group">
            <h1 class="heading-large">
                <spring:message code="public.error.page.not.found.heading" />
            </h1>
        </header>
        <div class="article-container">
            <article role="article" class="group">
                <p class="lede">
                    <spring:message code="public.error.page.not.found.description.one" />
                </p>
                <p class="lede">
                    <spring:message code="public.error.page.not.found.description.two" />
                </p>
                <p class="lede">
                    <spring:message code="public.error.page.not.found.description.three" />  <a href="${pageContext.request.contextPath}/contact-us"><spring:message code="public.template.footer.support.link.contact.us" />.
                </p>
            </article>
        </div>
    </article>
</t:wrapper>