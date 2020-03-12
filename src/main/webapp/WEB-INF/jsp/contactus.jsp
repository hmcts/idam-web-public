<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.contact.us">
    <article class="content__body">
        <a href="javascript:history.back()" class="link-back"><spring:message code="public.common.link.back" /></a>
        <h1 class="heading-large">
            <spring:message code="public.contact.title" />
        </h1>

        <h2 class="heading-medium"><spring:message code="public.contact.divorce.section.title" /></h2>
        <ul class="list">
            <li><spring:message code="public.contact.divorce.line-1" /></li>
            <li><spring:message code="public.contact.divorce.line-2" /></li>
            <li><spring:message code="public.contact.divorce.line-3" /></li>
            <li><spring:message code="public.contact.divorce.line-4" /></li>
            <li> <a href="https://www.gov.uk/call-charges"><spring:message code="public.contact.call.charges" /></a> </li>
        </ul>

        <h2 class="heading-medium"><spring:message code="public.contact.family-public-law.section.title" /></h2>
        <ul class="list">
            <li><spring:message code="public.contact.family-public-law.line-1" /></li>
        </ul>

        <h2 class="heading-medium"><spring:message code="public.contact.money-claims.section.title" /></h2>
        <ul class="list">
            <li><spring:message code="public.contact.money-claims.line-1" /></li>
            <li><spring:message code="public.contact.money-claims.line-2" /></li>
            <li><spring:message code="public.contact.money-claims.line-3" /></li>
            <li> <a href="https://www.gov.uk/call-charges"><spring:message code="public.contact.call.charges" /></a> </li>
        </ul>

        <h2 class="heading-medium"><spring:message code="public.contact.probate.section.title" /></h2>
        <ul class="list">
            <li><spring:message code="public.contact.probate.line-1" /></li>
            <li><spring:message code="public.contact.probate.line-2" /></li>
            <li><spring:message code="public.contact.probate.line-3" /></li>
            <li> <a href="https://www.gov.uk/call-charges"><spring:message code="public.contact.call.charges" /></a> </li>
        </ul>

        <h2 class="heading-medium"><spring:message code="public.contact.appeal.england-wales.section.title" /></h2>
        <ul class="list">
            <li><spring:message code="public.contact.appeal.england-wales.line-1" /></li>
            <li><spring:message code="public.contact.appeal.england-wales.line-2" /></li>
            <li><spring:message code="public.contact.appeal.england-wales.line-3" /></li>
            <li><spring:message code="public.contact.appeal.england-wales.line-4" /></li>
            <li> <a href="https://www.gov.uk/call-charges"><spring:message code="public.contact.call.charges" /></a> </li>
        </ul>

        <h2 class="heading-medium"><spring:message code="public.contact.appeal.scotland.section.title" /></h2>
        <ul class="list">
            <li><spring:message code="public.contact.appeal.scotland.line-1" /></li>
            <li><spring:message code="public.contact.appeal.scotland.line-2" /></li>
            <li><spring:message code="public.contact.appeal.scotland.line-3" /></li>
            <li><spring:message code="public.contact.appeal.scotland.line-4" /></li>
            <li> <a href="https://www.gov.uk/call-charges"><spring:message code="public.contact.call.charges" /></a> </li>
        </ul>
    </article>
</t:wrapper>