<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ tag description="Simple Wrapper Tag" pageEncoding="UTF-8" %>
<%@attribute name="titleKey" required="true"%>
<!--[if lt IE 9]><html class="lte-ie8" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title><spring:message code="${titleKey}"/> <spring:message code="public.common.title"/></title>

    <link href="/assets/stylesheets/application.css" media="all" rel="stylesheet"/>
    <!--[if gt IE 8]><!-->
    <link href="/assets/stylesheets/govuk-template.css" media="screen" rel="stylesheet"/><!--<![endif]-->
    <!--[if IE 6]>
    <link href="/assets/stylesheets/govuk-template-ie6.css" media="screen" rel="stylesheet"/><![endif]-->
    <!--[if IE 7]>
    <link href="/assets/stylesheets/govuk-template-ie7.css" media="screen" rel="stylesheet"/><![endif]-->
    <!--[if IE 8]>
    <link href="/assets/stylesheets/govuk-template-ie8.css" media="screen" rel="stylesheet"/><![endif]-->
    <link href="/assets/stylesheets/govuk-template-print.css" media="print" rel="stylesheet"/>

    <!--[if IE 8]>
    <link href="/assets/stylesheets/fonts-ie8.css" media="all" rel="stylesheet"/><![endif]-->
    <!--[if gte IE 9]><!-->
    <link href="/assets/stylesheets/fonts.css" media="all" rel="stylesheet"/><!--<![endif]-->
    <!--[if lt IE 9]>
    <script src="/assets/javascripts/ie.js"></script><![endif]-->

    <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon"/>

    <link rel="mask-icon" href="/assets/images/gov.uk_logotype_crown.svg" color="#0b0c0c">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">

    <meta name="theme-color" content="#0b0c0c"/>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:image" content="/assets/images/opengraph-image.png">

    <script
      src="https://code.jquery.com/jquery-3.3.1.min.js"
      integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
      crossorigin="anonymous"></script>
</head>
<body>
<script>document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>

<div id="skiplink-container">
    <div>
        <a href="#content" class="skiplink"><spring:message code="public.template.skip.to.main.content" /></a>
    </div>
</div>

<header role="banner" id="global-header" class=" with-proposition ">
    <div id="global-cookie-message">
        <p>
            <spring:message
                htmlEscape="false"
                code="public.template.cookie.message"
                arguments="https://www.gov.uk/help/cookies"
            />
        </p>

    </div>
    <div class="header-wrapper">
        <div class="header-global">
            <div class="header-logo">
                <a href="https://www.gov.uk/" title="Go to the GOV.UK homepage" id="logo" class="content">
                    <img src="/assets/images/gov.uk_logotype_crown_invert_trans.png" width="36" height="32" alt="">
                    GOV.UK
                </a>
            </div>
        </div>
        <sec:authorize access="isAuthenticated()">
            <div class="header-proposition">
                <div class="content">
                    <nav id="proposition-menu" class="header__menu" role="navigation">
                        <span class="header__menu__proposition-name">
                            <spring:message code="public.template.header.link.your.account" />
                        </span>
                        <ul id="proposition-links" class="header__menu__proposition-links">
                            <li>
                                <a href="/logout">
                                    <spring:message code="public.template.header.link.sign.out" />
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </sec:authorize>
    </div>
</header>

<div id="global-header-bar"></div>

<main id="content" role="main">
    <div class="centered-content">
        <div class="phase-banner-beta">
            <p>
                <strong class="phase-tag"><spring:message code="public.template.header.phase.tag" /></strong>
                <span>
                    <spring:message
                        htmlEscape="false"
                        code="public.template.header.phase.description"
                        arguments="http://www.smartsurvey.co.uk/s/58DYD/"
                    />
                </span>
            </p>
        </div>
    </div>

    <jsp:doBody/>

    <details role="group" class="divider">
        <summary class="font-xsmall" role="button" aria-controls="details-content-0" aria-expanded="false">
            <span class="summary"><spring:message code="public.template.feedback.summary" /></span>
        </summary>
        <div class="panel panel-border-narrow" id="details-content-0" aria-hidden="true">
            <p class="text bold-small"><spring:message code="public.template.feedback.heading" /></p>
            <p class="text">
                <a aria-label="<spring:message code="public.template.feedback.link.label" />"
                   href="http://www.smartsurvey.co.uk/s/2T7C6/" target="_blank">
                    <spring:message code="public.template.feedback.link.text" />
                </a>
            </p>
            <p class="text">
                <spring:message code="public.template.feedback.link.label" />
            </p>
        </div>
    </details>
</main>

<footer class="group js-footer" id="footer" role="contentinfo">
    <div class="footer-wrapper">
        <div class="footer-meta">
            <div class="footer-meta-inner">
                <h2 class="visuallyhidden"><spring:message code="public.template.footer.support.links" /></h2>
                <c:set var="footerUrl" value="https://hmcts-access.service.gov.uk" />
                <ul>
                    <li><a href="${pageContext.request.contextPath}/cookies"><spring:message code="public.template.footer.support.link.cookies" /></a></li>
                    <li><a href="${pageContext.request.contextPath}/privacy-policy"><spring:message code="public.template.footer.support.link.privacy.policy" /></a></li>
                    <li><a href="${pageContext.request.contextPath}/terms-and-conditions"><spring:message code="public.template.footer.support.link.terms.and.conditions" /></a></li>
                    <li><a href="${pageContext.request.contextPath}/contact-us"><spring:message code="public.template.footer.support.link.contact.us" /></a></li>
                </ul>

                <div class="open-government-licence">
                    <p class="logo">
                        <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">
                            <spring:message code="public.template.licence.ogl" />
                        </a>
                    </p>

                    <p>
                        <spring:message
                            htmlEscape="false"
                            code="public.template.licence.description"
                            arguments="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                        />
                    </p>

                </div>
            </div>

            <div class="copyright">
                <a href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/">
                    <spring:message code="public.template.copyright" htmlEscape="false" />
                </a>
            </div>
        </div>
    </div>
</footer>

<div id="global-app-error" class="app-error hidden"></div>
<script src="/assets/javascripts/details.polyfill.js"></script>
<script src="/assets/javascripts/govuk-template.js"></script>


<script>if (typeof window.GOVUK === 'undefined') document.body.className = document.body.className.replace('js-enabled', '');</script>
</body>
</html>