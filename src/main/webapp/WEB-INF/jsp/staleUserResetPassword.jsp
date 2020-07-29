<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.reset.password.stale.users.title.text">
    <article class="content__body">
        <div class="error-summary" aria-labelledby="validation-error-summary-heading" tabindex="-1">
             <h2 class="heading-medium error-summary-heading" id="validation-error-summary-heading">
                <spring:message code="public.reset.password.stale.users.warning.header" />
             </h2>
             <p>
                 <spring:message code="public.reset.password.stale.users.warning.fix" />
             </p>
             <ul class="error-summary-list">
                <li><a href="#password"><spring:message code="public.reset.password.stale.users.warning.reset"/></a></li>
             </ul>
        </div>
        <div class="text">
            <header class="page-header group">
                <h1 class="heading-large">
                    <spring:message code="public.forgot.password.success.heading" />
                </h1>
            </header>
            <p class="lede">
                <spring:message code="public.forgot.password.success.valid.address" />
            </p>
            <c:choose>
                <c:when test="${not empty redirectUri && selfRegistrationEnabled}">
                    <p>
                        <spring:message code="public.forgot.password.success.unconnected.account"/>
                        <c:url value="/users/selfRegister" var="selfRegisterUrl">
                            <c:param name="redirect_uri" value="${redirectUri}" />
                            <c:param name="client_id" value="${clientId}" />
                            <c:param name="state" value="${state}" />
                            <c:param name="scope" value="${scope}" />
                        </c:url>
                        <a href="${selfRegisterUrl}"><spring:message code="public.common.create.account"/></a>
                    </p>
                </c:when>
                <c:otherwise>
                    <spring:message code="public.forgot.password.success.unconnected.account.contact"/>
                    <a href="https://hmcts-access.service.gov.uk/contact-us"><spring:message code="public.forgot.password.success.unconnected.account.contact.us.text"/></a>
                    <spring:message code="public.forgot.password.success.unconnected.account.contact.end"/>
                </c:otherwise>
            </c:choose>

            <h2 class="heading-medium">
                <spring:message code="public.common.user.created.mail.not.arrived"/>
            </h2>
            <p>
                <spring:message code="public.common.user.created.few.minutes"/>
            </p>
            <p>
                <spring:message code="public.reset.password.stale.users.email.notarrived"/><a href="/reset/forgotpassword"> <spring:message code="public.reset.password.stale.users.email.tryagain.hyperlink"/></a><spring:message code="public.reset.password.stale.users.email.tryagain.end"/>
            </p>
        </div>
    </article>
</t:wrapper>