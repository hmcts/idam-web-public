<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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
                        <spring:message
                            code="public.common.user.created.re.enter.details"
                            arguments="/login/uplift?state=${state}&redirect_uri=${redirectUri}&client_id=${clientId}&jwt=${jwt}"
                        />
                    </c:when>
                    <c:otherwise>
                        <spring:message
                            code="public.common.user.created.re.enter.details"
                            arguments="/users/selfRegister?redirect_uri=${redirectUri}&client_id=${clientId}"
                        />
                    </c:otherwise>
                </c:choose>
            </p>
        </div>
    </article>
</t:wrapper>
