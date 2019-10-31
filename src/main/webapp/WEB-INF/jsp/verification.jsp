<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<t:wrapper titleKey="public.verification.subheading.verification.required">
    <article class="content__body">
        <h1 class="heading-large"><spring:message code="public.verification.subheading.verification.required"/></h1>
        <div class="form-section">
            <p><spring:message code="public.verification.p"/></p>
            <form:form action="/verification" class="form" modelAttribute="authorizeCommand">
                <form:input id="username" name="username" path="username" type="hidden" value="" />
                <form:input id="response_type" name="response_type" path="response_type" type="hidden" value="" />
                <form:input id="state" name="state" path="state" type="hidden" value="" />
                <form:input id="client_id" name="client_id" path="client_id" type="hidden" value="" />
                <form:input id="redirect_uri" name="redirect_uri" path="redirect_uri" type="hidden" value="" />
                <form:input id="scope" name="scope" path="scope" type="hidden" value="" />
                <form:input id="selfRegistrationEnabled" name="selfRegistrationEnabled" path="selfRegistrationEnabled" type="hidden" value="" />
                <div class="form-group">
                    <label for="code">
                        <span class="form-label">
                            <spring:message code="public.verification.code.label"/>
                        </span>
                    </label>
                    <form:input class="form-control" id="code" name="code" path="code" type="code" value="" autocomplete="off"/>
                </div>
                <input class="button" type="submit" value="<spring:message code="public.verification.form.submit" />">
            </form:form>
        </div>
    </article>
</t:wrapper>
