<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ tag description="Simple Wrapper Tag" pageEncoding="UTF-8" %>
<%@attribute name="titleKey" required="true"%>
<!--[if lt IE 9]><html class="lte-ie8" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
<spring:eval expression="T(uk.gov.hmcts.reform.idam.web.helper.JSPHelper).isGTMEnabled()" var="gtmFlag"/>

<head>

    <!-- Disable Search Engine Crawlers -->
    <meta name="robots" content="noindex">

    <script>
        function sendEvent(eventCategory, eventAction, eventLabel) {
            // disabled with ga
            //ga('send', 'event', eventCategory, eventAction, eventLabel);
        }
    </script>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
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

    <!--[if !IE 8]><!-->
    <link rel="stylesheet" href="/assets/stylesheets/govuk-frontend-3.12.0.min.css">
    <!--<![endif]-->
    <!--[if IE 8]>
    <link rel="stylesheet" href="/assets/stylesheets/govuk-frontend-ie8-3.12.0.min.css">
    <![endif]-->

    <!--[if IE 8]>
    <link href="/assets/stylesheets/fonts-ie8.css" media="all" rel="stylesheet"/><![endif]-->
    <!--[if gte IE 9]><!-->
    <link href="/assets/stylesheets/fonts.css" media="all" rel="stylesheet"/><!--<![endif]-->
    <!--[if lt IE 9]>
    <script src="/assets/javascripts/ie.js"></script><![endif]-->

    <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon"/>

    <link rel="mask-icon" href="/assets/images/gov.uk_logotype_crown.svg" color="#0b0c0c">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/assets/images/govuk-apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">

    <meta name="theme-color" content="#0b0c0c"/>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:image" content="/assets/images/opengraph-image.png">

    <script src="/assets/javascripts/jquery-3.5.1.min.js"></script>

    <c:if test="${gtmFlag}">
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-54HWQKQ');</script>
        <!-- End Google Tag Manager -->
    </c:if>
</head>
<body>
<c:if test="${gtmFlag}">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src=https://www.googletagmanager.com/ns.html?id=GTM-54HWQKQ
                      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
</c:if>
<script>
    document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
    $(document).ready(function () {
        $('body').find(':input.form-control-error:first').focus();
    });
</script>
<script src="/assets/javascripts/govuk-frontend-3.12.0.min.js"></script>
<script>
    window.GOVUKFrontend.initAll()
</script>

<div class="govuk-visually-hidden govuk-cookie-banner govuk-!-display-none " data-nosnippet role="region"
     aria-label="<spring:message code="public.cookie.banner.text_0005"/>" id="reject-all-cookies-success">
    <div class="govuk-cookie-banner__message govuk-width-container">
        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
                <div class="govuk-cookie-banner__content govuk-p-size-override">
                    <p class="govuk-body govuk-p-size-override"><spring:message code="public.cookie.banner.rejected.text_0001"/></p>
                    <p class="govuk-body govuk-p-size-override"><spring:message code="public.cookie.banner.rejected.text_0002"/> <a href="${pageContext.request.contextPath}/cookie-preferences"><spring:message code="public.cookie.banner.rejected.text_0003"/></a>
                        <spring:message code="public.cookie.banner.rejected.text_0004"/>
                    </p>
                    <button type="button" name="hide-rejected" class="govuk-button govuk-p-size-override" data-module="govuk-button" id="cookie-reject-all-success-banner-hide">
                        <spring:message code="public.cookie.banner.rejected.text_0005"/>  <span class="govuk-visually-hidden"><spring:message code="public.cookie.banner.rejected.text_0006"/> </span><spring:message code="public.cookie.banner.rejected.text_0007"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="govuk-visually-hidden govuk-cookie-banner govuk-!-display-none " data-nosnippet role="region"
     aria-label="<spring:message code="public.cookie.banner.text_0004"/>" id="accept-all-cookies-success">
    <div class="govuk-cookie-banner__message govuk-width-container">
        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
                <div class="govuk-cookie-banner__content govuk-p-size-override">
                    <p class="govuk-body govuk-p-size-override"><spring:message code="public.cookie.banner.accepted.text_0001"/></p>
                    <p class="govuk-body govuk-p-size-override"><spring:message code="public.cookie.banner.accepted.text_0002"/> <a href="${pageContext.request.contextPath}/cookie-preferences"><spring:message code="public.cookie.banner.accepted.text_0003"/></a>
                        <spring:message code="public.cookie.banner.accepted.text_0004"/>
                    </p>
                    <button type="button" name="hide-accepted" class="govuk-button govuk-p-size-override" data-module="govuk-button" id="cookie-accept-all-success-banner-hide">
                        <spring:message code="public.cookie.banner.accepted.text_0005"/> <span class="govuk-visually-hidden"><spring:message code="public.cookie.banner.accepted.text_0006"/> </span><spring:message code="public.cookie.banner.accepted.text_0007"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="cm_cookie_notification" class="govuk-visually-hidden govuk-!-display-none ">
    <div class="govuk-cookie-banner " data-nosnippet role="region" aria-label="<spring:message code="public.cookie.banner.text_0001"/>">
        <div class="govuk-cookie-banner__message govuk-width-container">
            <div class="govuk-grid-row">
                <div class="govuk-grid-column-two-thirds">
                    <h2 class="govuk-cookie-banner__heading govuk-heading-m govuk-h-size-override"><spring:message code="public.cookie.banner.text_0001"/></h2>
                    <div class="govuk-cookie-banner__content govuk-p-size-override">
                        <p><spring:message code="public.cookie.banner.text_0002"/></p>
                        <p><spring:message code="public.cookie.banner.text_0003"/></p>
                    </div>
                </div>
            </div>
            <div class="govuk-button-group govuk-p-size-override">
                <button value="accept" type="button" name="cookies" class="govuk-button govuk-p-size-override" data-module="govuk-button" id="cookie-accept-submit">
                    <spring:message code="public.cookie.banner.text_0004"/>
                </button>
                <button value="reject" type="button" name="cookies" class="govuk-button govuk-p-size-override" data-module="govuk-button" id="cookie-reject-submit">
                    <spring:message code="public.cookie.banner.text_0005"/>
                </button>
                <a class="govuk-link govuk-p-size-override" href="${pageContext.request.contextPath}/cookie-preferences"><spring:message code="public.cookie.banner.text_0006"/></a>
            </div>
        </div>
    </div>
</div>

<div id="skiplink-container">
    <div>
        <a href="#skiplinktarget" class="skiplink"><spring:message code="public.template.skip.to.main.content" /></a>
    </div>
</div>

<header role="banner" id="global-header" class=" with-proposition ">

    <script src="/assets/javascripts/cookie-manager.js"></script>

    <script src="/assets/javascripts/skiplink-target.js"></script>

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
        <div class="govuk-phase-banner">
            <p class="govuk-phase-banner__content govuk-p-size-override">
                <strong class="govuk-tag govuk-phase-banner__content__tag govuk-p-size-override">
                    <spring:message code="public.template.header.phase.tag"/>
                </strong>
                <span class="govuk-phase-banner__text">
                    <c:set var="smartSurveyParam">
                        ${pageContext.request.scheme}://${pageContext.request.serverName}${requestScope['javax.servlet.forward.request_uri']}${empty param.client_id ? '' : '?client_id='}${param.client_id}
                    </c:set>
                    <c:set var="smartSurveyUrl">
                        <spring:url value="https://www.smartsurvey.co.uk/s/IDAMSurvey/">
                            <spring:param name="pageurl" value="${smartSurveyParam}"/>
                        </spring:url>
                    </c:set>
                    <spring:message
                        htmlEscape="false"
                        code="public.template.header.phase.description"
                        arguments="${smartSurveyUrl}"
                    />
                    <t:languageSwitch/>
                </span>
            </p>
        </div>
    </div>

    <jsp:doBody/>
</main>

<footer class="group js-footer" id="footer" role="contentinfo">
    <div class="footer-wrapper">
        <div class="footer-meta">
            <div class="footer-meta-inner">
                <h2 class="visuallyhidden"><spring:message code="public.template.footer.support.links" /></h2>
                <c:set var="footerUrl" value="https://hmcts-access.service.gov.uk" />
                <ul>
                    <li><a href="${pageContext.request.contextPath}/cookies"><spring:message code="public.template.footer.support.link.cookies" /></a></li>
                    <li><a href="${pageContext.request.contextPath}/cookie-preferences"><spring:message code="public.template.footer.support.link.cookie.preferences" /></a></li>
                    <li><a href="${pageContext.request.contextPath}/accessibility-statement"><spring:message code="public.template.footer.support.link.accessibility.statement" /></a></li>
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