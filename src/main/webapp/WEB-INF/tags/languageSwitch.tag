<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ tag description="Language Switcher Tag" pageEncoding="UTF-8" %>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getLocalisedText('public.common.language.switch.text', 'en')" var="englishText"/>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getLocalisedText('public.common.language.switch.text', 'cy')" var="welshText"/>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getCurrentLocale()" var="currentLocale"/>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getOtherLocaleUrl()" var="languageSwitchUrl"/>
<ul class="translation-nav__list">
    <li class="translation-nav__list-item">
        <c:if test="${currentLocale == 'en'}">
            <a lang="en" href="${languageSwitchUrl}" class="language">${englishText}</a>
        </c:if>
        <c:if test="${currentLocale == 'cy'}">
            <span lang="en">${englishText}</span>
        </c:if>
    </li>
    <li class="translation-nav__list-item">
        <c:if test="${currentLocale == 'cy'}">
            <a lang="cy" href="${languageSwitchUrl}" class="language">${welshText}</a>
        </c:if>
        <c:if test="${currentLocale == 'en'}">
            <span lang="cy">${welshText}</span>
        </c:if>
    </li>
</ul>