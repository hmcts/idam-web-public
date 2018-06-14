<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper>
    Remote address: <c:out value="${remoteAddress}" /><br/>
    X-forwarded-for: <c:out value="${xForwardedFor}" /><br/>
    X-forwarded-proto: <c:out value="${xForwardedProto}" /><br/>
</t:wrapper>