<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.terms.and.conditions">
    <c:choose>
        <c:when test="${pageContext.response.locale == 'cy'}">
            <jsp:include page="tandc_cy.jsp"/>
        </c:when>

        <c:otherwise>
            <jsp:include page="tandc_en.jsp"/>
        </c:otherwise>
    </c:choose>
</t:wrapper>