<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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
            <c:if test="${not empty redirectUri}">
                <p>
                    <spring:message
                        code="public.forgot.password.success.unconnected.account"
                        arguments="/users/selfRegister?redirect_uri=${redirectUri}&client_id=${clientId}&state=${state}"
                    />
                </p>
            </c:if>
            <h2 class="heading-medium">
                <spring:message code="public.common.user.created.mail.not.arrived"/>
            </h2>
            <p>
                <spring:message code="public.common.user.created.few.minutes"/>
            </p>
        </div>
    </article>
</t:wrapper>