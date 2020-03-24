<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ tag description="Language Switcher Tag" pageEncoding="UTF-8" %>

<spring:message code="public.common.language.switch.locale" var="languageSwitchLocale"/>
<script>
    function getOtherLocaleUrl() {
        const url = new URL(location.href);
        const query_string = url.search;
        const search_params = new URLSearchParams(query_string);
        search_params.set('ui_locales', '${languageSwitchLocale}');
        url.search = search_params.toString();
        return url.toString();
    }
</script>
<a href="#" onclick="location.href=getOtherLocaleUrl()" class="language">
    <spring:message code="public.common.language.switch.text"/></a>