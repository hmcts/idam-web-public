<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ tag description="Language Switcher Tag" pageEncoding="UTF-8" %>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getOtherLocaleUrl()" var="languageSwitchUrl"/>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getCurrentLocale()" var="currentLocale"/>
<c:if test="${currentLocale == 'en'}">
    <a lang='cy' href="${languageSwitchUrl}" class="language"><spring:message code="public.common.language.switch.text"/></a>
</c:if>
<c:if test="${currentLocale == 'cy'}">
    <a lang='en' href="${languageSwitchUrl}" class="language"><spring:message code="public.common.language.switch.text"/></a>
</c:if>