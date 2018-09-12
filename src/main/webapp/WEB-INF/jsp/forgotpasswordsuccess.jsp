<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.forgot.password.success.title">
    <article class="content__body">
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
        </div>
    </article>
</t:wrapper>