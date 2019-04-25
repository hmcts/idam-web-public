<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper titleKey="public.login.subheading.sign.in">
    <c:redirect url="/login">
        <c:forEach var="requestParam" items="${param}">
            <c:param name="${requestParam.key}" value="${requestParam.value}" />
        </c:forEach>
    </c:redirect>
</t:wrapper>