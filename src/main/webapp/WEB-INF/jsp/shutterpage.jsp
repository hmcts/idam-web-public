<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.shutter.page.title">
    <article class="content__body">
        <header class="page-header group">
            <div>
                <h1 class="heading-large">
                    <spring:message code="public.shutter.page.body.header.main.text" />
                </h1>
            </div>
        </header>
        <div class="article-container">
            <article role="article" class="group">
                <div class="inner">
                    <p><spring:message code="public.shutter.page.body.para.cant.start.application.for.service" /></p>
                    <p><spring:message code="public.shutter.page.body.para.try.again.later" /></p>

                    <h2 class="heading-medium"><spring:message code="public.shutter.page.body.header.sub.started.application.for.service" /> </h2>
                    <p><spring:message code="public.shutter.page.body.para.information.saved" /></p>
                    <p><spring:message code="public.shutter.page.body.para.able.to.signin.complete.application" htmlEscape="false"/> </p>

                    <h2 class="heading-medium"><spring:message code="public.shutter.page.body.header.sub.contact.us" /></h2>
                    <p><spring:message code="public.shutter.page.body.para.need.help" /> </p>
                    <p><a href = "mailto: OnlineApplications@justice.gov.uk" target="_blank">
                        <spring:message code="public.shutter.page.body.para.mail.to" />
                    </a></p>

                </div>
            </article>
        </div>
    </article>
</t:wrapper>