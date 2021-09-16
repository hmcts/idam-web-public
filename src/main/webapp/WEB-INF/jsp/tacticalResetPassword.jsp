<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.tactical.reset.password.title">
    <article class="content__body">
        <h1 id="skiplinktarget" class="heading-large"><spring:message code="public.tactical.reset.password.heading" /></h1>

        <spring:message code="public.tactical.reset.password.text" htmlEscape="false"/>

    </article>
</t:wrapper>