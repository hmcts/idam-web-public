<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.cookies">
    <article class="content__body">
        <a href="javascript:history.go(-1)" class="link-back"><spring:message code="public.cookie.preferences.text_0000"/></a>

        <div class="govuk-visually-hidden" id="cookie-preference-success">
            <div class="gem-c-success-alert govuk-notification-banner govuk-notification-banner--success" role="alert" tabindex="-1" aria-labelledby="govuk-notification-banner-title-64523f81" data-module="initial-focus">
                <div class="govuk-notification-banner__content">
                    <h3 class="govuk-notification-banner__heading govuk-h-size-override"><spring:message code="public.cookie.preferences.saved.text_0001"/></h3>
                    <p class="govuk-body govuk-p-size-override"><spring:message code="public.cookie.preferences.saved.text_0002"/></p>
                </div>
            </div>
        </div>

        <h1 class="heading-xlarge">
            <spring:message code="public.cookie.preferences.text_0001"/>
        </h1>
        <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
            <div id="nav-links">

                <p><spring:message code="public.cookie.preferences.text_0002"/></p>

                <hr>

                <div id="tabs-1" aria-labelledby="ui-id-1" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false">
                    <h2 class="heading-large" id="overview"><spring:message code="public.cookie.preferences.text_0003"/></h2>

                    <h2><spring:message code="public.cookie.preferences.text_0004"/></h2>
                    <ul class="list list-bullet">
                        <li><spring:message code="public.cookie.preferences.text_0005"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0006"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0007"/></li>
                    </ul>
                    <p><spring:message code="public.cookie.preferences.text_0008"/> <a target="_blank"
                                                                            href="http://www.aboutcookies.org/">
                        <spring:message code="public.cookie.preferences.text_0009"/><span class="visuallyhidden">
                        <spring:message code="public.template.link.opens.in.a.new.tab"/></span></a>
                        <spring:message code="public.cookie.preferences.text_0010"/></p>

                    <h3 class="heading-medium"><spring:message code="public.cookie.preferences.text_0011"/></h3>

                    <p><spring:message code="public.cookie.preferences.text_0012"/></p>
                    <h2><spring:message code="public.cookie.preferences.text_0013"/></h2>
                    <ul class="list list-bullet">
                        <li><spring:message code="public.cookie.preferences.text_0014"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0015"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0016"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0017"/></li>
                    </ul>
                    <p><spring:message code="public.cookie.preferences.text_0018"/> <a
                        href="https://www.google.com/policies/privacy/partners/"><spring:message
                        code="public.cookie.preferences.text_0019"/></a><spring:message code="public.cookie.preferences.text_0020"/></p>
                    <p><spring:message code="public.cookie.preferences.text_0021"/> <a
                        href="https://tools.google.com/dlpage/gaoptout"><spring:message
                        code="public.cookie.preferences.text_0022"/></a> <spring:message code="public.cookie.preferences.text_0023"/></p>
                    <p><spring:message code="public.cookie.preferences.text_0024"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0025"/></th>
                            <th><spring:message code="public.cookie.preferences.text_0026"/></th>
                            <th><spring:message code="public.cookie.preferences.text_0027"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0028"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0029"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0030"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0031"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0032"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0033"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0034"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0035"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0036"/></td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 class="heading-medium"><spring:message code="public.cookie.preferences.text_0037"/></h3>
                    <div class="govuk-radios govuk-radios--inline u-margin-top-30">
                        <div class="govuk-radios">
                            <div class="multiple-choice">
                                <input type="radio" name="analytics" id="radio-analytics-on" value="true">
                                <label for="radio-analytics-on"><spring:message code="public.cookie.preferences.text_0038"/></label>
                            </div>
                            <div class="multiple-choice">
                                <input type="radio" name="analytics" id="radio-analytics-off" value="false">
                                <label for="radio-analytics-off"><spring:message code="public.cookie.preferences.text_0039"/></label>
                            </div>
                        </div>
                    </div>

                    <h3 class="heading-medium"><spring:message code="public.cookie.preferences.text_0040"/></h3>
                    <p><spring:message code="public.cookie.preferences.text_0041"/></p>
                    <ul class="list list-bullet">
                        <li><spring:message code="public.cookie.preferences.text_0042"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0043"/></li>
                        <li><spring:message code="public.cookie.preferences.text_0044"/></li>
                    </ul>

                    <p><spring:message code="public.cookie.preferences.text_0045"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0046"/></th>
                            <th><spring:message code="public.cookie.preferences.text_0047"/></th>
                            <th><spring:message code="public.cookie.preferences.text_0048"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0049"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0050"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0051"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0052"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0053"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0054"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0055"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0056"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0057"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0058"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0059"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0060"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0061"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0062"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0063"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookie.preferences.text_0064"/></th>
                            <td><spring:message code="public.cookie.preferences.text_0065"/></td>
                            <td><spring:message code="public.cookie.preferences.text_0066"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="heading-medium"><spring:message code="public.cookie.preferences.text_0067"/></h3>
                <div class="govuk-radios govuk-radios--inline u-margin-top-30">
                    <div class="multiple-choice">
                        <input type="radio" name="apm" id="radio-apm-on" value="true">
                        <label for="radio-apm-on"><spring:message code="public.cookie.preferences.text_0068"/></label>
                    </div>
                    <div class="multiple-choice">
                        <input type="radio" name="apm" id="radio-apm-off" value="false">
                        <label for="radio-apm-off"><spring:message code="public.cookie.preferences.text_0069"/></label>
                    </div>
                </div>

                <h3 class="heading-medium"><spring:message code="public.cookie.preferences.text_0070"/></h3>

                <p><spring:message code="public.cookie.preferences.text_0071"/></p>
                <table>
                    <thead>
                    <tr>
                        <th><spring:message code="public.cookie.preferences.text_0072"/></th>
                        <th><spring:message code="public.cookie.preferences.text_0073"/></th>
                        <th><spring:message code="public.cookie.preferences.text_0074"/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th><spring:message code="public.cookie.preferences.text_0075"/></th>
                        <td><spring:message code="public.cookie.preferences.text_0076"/></td>
                        <td><spring:message code="public.cookie.preferences.text_0077"/></td>
                    </tr>
                    <tr>
                        <th><spring:message code="public.cookie.preferences.text_0078"/></th>
                        <td><spring:message code="public.cookie.preferences.text_0079"/></td>
                        <td><spring:message code="public.cookie.preferences.text_0080"/></td>
                    </tr>
                    <tr>
                        <th><spring:message code="public.cookie.preferences.text_0081"/></th>
                        <td><spring:message code="public.cookie.preferences.text_0082"/></td>
                        <td><spring:message code="public.cookie.preferences.text_0083"/></td>
                    </tr>
                    <tr>
                        <th><spring:message code="public.cookie.preferences.text_0084"/></th>
                        <td><spring:message code="public.cookie.preferences.text_0085"/></td>
                        <td><spring:message code="public.cookie.preferences.text_0086"/></td>
                    </tr>
                    <tr>
                        <th><spring:message code="public.cookie.preferences.text_0087"/></th>
                        <td><spring:message code="public.cookie.preferences.text_0088"/></td>
                        <td><spring:message code="public.cookie.preferences.text_0089"/></td>
                    </tr>
                    </tbody>
                </table>

                <p></p>
                <p><a href="${pageContext.request.contextPath}/cookies" target="_blank"><spring:message
                    code="public.cookie.preferences.text_0090"/></a>
                    <spring:message code="public.cookie.preferences.text_0091"/></p>

                <p id="save-cookie-preferences" class=""><a class="button" href="cookie-preferences#">
                    <spring:message code="public.cookie.preferences.text_0092"/></a></p>

                <script src="/assets/javascripts/cookie-manager.js"></script>
            </div>
        </div>
    </article>
</t:wrapper>