<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.common.user.created.title.text">
    <article class="content__body">
        <div class="text">
            <h1 class="heading-large">
                <spring:message code="public.common.user.created.heading.text"/>
            </h1>
            <p>
                <spring:message
                    code="public.common.user.created.sent.confirmation.email"
                    arguments="${email}"
                />
                <spring:message code="public.common.user.created.follow.instruction"/>
            </p>
            <h2 class="heading-medium">
                <spring:message code="public.common.user.created.mail.not.arrived"/>
            </h2>
            <p>
                <spring:message code="public.common.user.created.few.minutes"/>
            </p>
            <p>
                <c:choose>
                    <c:when test="${not empty param['jwt']}">
                        <spring:message  code="public.common.user.created.re.enter.details"/>
                        <a href="/login/uplift?state=${fn:escapeXml(state)}&redirect_uri=${fn:escapeXml(redirectUri)}&client_id=${fn:escapeXml(clientId)}&jwt=${fn:escapeXml(jwt)}"><spring:message  code="public.common.user.created.re.enter.details.enter.details.again"/></a>
                    </c:when>
                    <c:otherwise>
                        <spring:message code="public.common.user.created.re.enter.details"/>
                        <a href="/users/selfRegister?redirect_uri=${fn:escapeXml(redirectUri)}&client_id=${fn:escapeXml(clientId)}"><spring:message  code="public.common.user.created.re.enter.details.enter.details.again"/></a>
                    </c:otherwise>
                </c:choose>
            </p>
        </div>
    </article>
</t:wrapper>
