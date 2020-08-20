<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ tag description="Base URL tag" pageEncoding="UTF-8" %>
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).getBaseUrl(pageContext.request)" var="baseUrl"/>
<base href="${baseUrl}">