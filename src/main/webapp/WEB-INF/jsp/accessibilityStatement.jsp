<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.accessibility.statement">
    <article class="content__body">
        <a href="javascript:history.go(-1)" class="link-back"><spring:message code="public.accessibility.statement.text_0000" /></a>

        <h1 class="heading-large"><spring:message code="public.accessibility.statement.text_0001" /></h1>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0002" /></p>
        <p><spring:message code="public.accessibility.statement.text_0003" /></p>
        <ul class="list list-bullet">
            <li><spring:message code="public.accessibility.statement.text_0004"/></li>
            <li><spring:message code="public.accessibility.statement.text_0005"/></li>
            <li><spring:message code="public.accessibility.statement.text_0006"/></li>
            <li><spring:message code="public.accessibility.statement.text_0007"/></li>
            <li><spring:message code="public.accessibility.statement.text_0008"/></li>
        </ul>
        <p><spring:message code="public.accessibility.statement.text_0009" /></p>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0010" /></p>

        <h2 class="heading-medium"><spring:message code="public.accessibility.statement.text_0011" /></h2>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0012" /></p>
        <p><spring:message code="public.accessibility.statement.text_0013" /></p>

        <h2 class="heading-medium"><spring:message code="public.accessibility.statement.text_0014" /></h2>
        <p><spring:message code="public.accessibility.statement.text_0015" /></p>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_adoption_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_adoption_email"/>'><spring:message code="public.accessibility.statement.text_adoption_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_adoption_phone"/>'><spring:message code="public.accessibility.statement.text_adoption_phone" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_ccmcc_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_ccmcc_email"/>'><spring:message code="public.accessibility.statement.text_ccmcc_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_ccmcc_phone"/>'><spring:message code="public.accessibility.statement.text_ccmcc_phone" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_div_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_div_email"/>'><spring:message code="public.accessibility.statement.text_div_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_div_phone"/>'><spring:message code="public.accessibility.statement.text_div_phone" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_div_hours"/>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_fpl_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_fpl_email"/>'><spring:message code="public.accessibility.statement.text_fpl_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_fpl_phone"/>'><spring:message code="public.accessibility.statement.text_fpl_phone" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_fprl_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_fprl_phone"/>'><spring:message code="public.accessibility.statement.text_fprl_phone" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_fr_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_fr_email"/>'><spring:message code="public.accessibility.statement.text_fr_email" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_ftt_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_ftt_email"/>'><spring:message code="public.accessibility.statement.text_ftt_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_ftt_phone"/>'><spring:message code="public.accessibility.statement.text_ftt_phone" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_ftt_hours"/>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_iac_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_iac_email"/>'><spring:message code="public.accessibility.statement.text_iac_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_iac_phone"/>'><spring:message code="public.accessibility.statement.text_iac_phone" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_ocmc_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_ocmc_email"/>'><spring:message code="public.accessibility.statement.text_ocmc_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_ocmc_phone"/>'><spring:message code="public.accessibility.statement.text_ocmc_phone" /></a>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_probate_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_probate_email"/>'><spring:message code="public.accessibility.statement.text_probate_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_probate_phone"/>'><spring:message code="public.accessibility.statement.text_probate_phone" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_probate_hours"/>
            </li>
        </ul>

        <h3 class="heading-small"><spring:message code="public.accessibility.statement.text_sscs_title" /></h3>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0016"/>
                <a href='mailto: <spring:message code="public.accessibility.statement.text_sscs_email"/>'><spring:message code="public.accessibility.statement.text_sscs_email" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0017"/>
                <a href='tel: <spring:message code="public.accessibility.statement.text_sscs_phone"/>'><spring:message code="public.accessibility.statement.text_sscs_phone" /></a>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_sscs_hours"/>
            </li>
        </ul>

        <p><spring:message code="public.accessibility.statement.text_0018" /></p>

        <h2 class="heading-medium"><spring:message code="public.accessibility.statement.text_0019" /></h2>
        <p><spring:message code="public.accessibility.statement.text_0020" /></p>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0021" /></p>

        <h2 class="heading-large"><spring:message code="public.accessibility.statement.text_0022" /></h2>
        <p><spring:message code="public.accessibility.statement.text_0023" /></p>
        <p><spring:message code="public.accessibility.statement.text_0024" /></p>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0025" /></p>

        <h2 class="heading-large"><spring:message code="public.accessibility.statement.text_0026" /></h2>
        <p><spring:message code="public.accessibility.statement.text_0027" /></p>
        <h2 class="heading-medium"><spring:message code="public.accessibility.statement.text_0028" /></h2>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0029" /></p>

        <h2 class="heading-large"><spring:message code="public.accessibility.statement.text_0030" /></h2>
        <p><spring:message code="public.accessibility.statement.text_0031" /></p>
        <p><spring:message code="public.accessibility.statement.text_0032" /></p>
        <p><spring:message code="public.accessibility.statement.text_0033" /></p>
        <p><spring:message code="public.accessibility.statement.text_0034" /></p>
        <p><spring:message code="public.accessibility.statement.text_0035" /></p>
        <p><spring:message code="public.accessibility.statement.text_0036" /></p>

        <h2 class="heading-large"><spring:message code="public.accessibility.statement.text_0037" /></h2>
        <p><spring:message code="public.accessibility.statement.text_0038" /></p>
        <p><spring:message htmlEscape="false" code="public.accessibility.statement.text_0039" /></p>
        <p><spring:message code="public.accessibility.statement.text_0040" /></p>
        <ul class="list list-bullet">
            <li>
                <spring:message code="public.accessibility.statement.text_0041"/>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0042"/>
            </li>
            <li>
                <spring:message code="public.accessibility.statement.text_0043"/>
            </li>
        </ul>
    </article>
</t:wrapper>