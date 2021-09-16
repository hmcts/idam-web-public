<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<t:wrapper titleKey="public.template.footer.support.link.cookies">
    <article class="content__body">
        <a href="javascript:history.go(-1)" class="link-back"><spring:message code="public.cookies.text_0001"/></a>
        <h1 class="heading-xlarge">
            <spring:message code="public.cookies.text_0002"/>
        </h1>
        <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
            <div id="nav-links">

                <ol class="nav-list ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header"
                    role="tablist">
                    <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab"
                        aria-controls="tabs-1" aria-labelledby="ui-id-1" aria-selected="true" aria-expanded="true"><a
                        href="cookies#tabs-1" role="presentation" tabindex="-1" class="ui-tabs-anchor"
                        id="ui-id-1"><spring:message code="public.cookies.text_0003"/></a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab"
                        aria-controls="tabs-5" aria-labelledby="ui-id-2" aria-selected="false" aria-expanded="false"><a
                        href="cookies#tabs-2" role="presentation" tabindex="-1" class="ui-tabs-anchor"
                        id="ui-id-2"><spring:message code="public.cookies.text_0004"/></a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab"
                        aria-controls="tabs-3" aria-labelledby="ui-id-3" aria-selected="false" aria-expanded="false"><a
                        href="cookies#tabs-3" role="presentation" tabindex="-1" class="ui-tabs-anchor"
                        id="ui-id-3"><spring:message code="public.cookies.text_0005"/></a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab"
                        aria-controls="tabs-4" aria-labelledby="ui-id-4" aria-selected="false" aria-expanded="false"><a
                        href="cookies#tabs-4" role="presentation" tabindex="-1" class="ui-tabs-anchor"
                        id="ui-id-4"><spring:message code="public.cookies.text_0006"/></a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab"
                        aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="false" aria-expanded="false"><a
                        href="cookies#tabs-5" role="presentation" tabindex="-1" class="ui-tabs-anchor"
                        id="ui-id-5"><spring:message code="public.cookies.text_0007"/></a></li>
                    <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab"
                        aria-controls="tabs-2" aria-labelledby="ui-id-6" aria-selected="false" aria-expanded="false"><a
                        href="cookies#tabs-6" role="presentation" tabindex="-1" class="ui-tabs-anchor"
                        id="ui-id-6"><spring:message code="public.cookies.text_0008"/></a></li>
                </ol>
                <hr>

                <div id="tabs-1" aria-labelledby="ui-id-1" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false">
                    <!--Cookies Across Services-->
                    <h2 class="heading-large" id="overview"><spring:message code="public.cookies.text_0009"/></h2>

                    <p><spring:message code="public.cookies.text_0010"/></p>
                    <h2><spring:message code="public.cookies.text_0011"/></h2>
                    <ul class="list list-bullet">
                        <li><spring:message code="public.cookies.text_0012"/></li>
                        <li><spring:message code="public.cookies.text_0013"/></li>
                        <li><spring:message code="public.cookies.text_0014"/></li>
                    </ul>
                    <p><spring:message code="public.cookies.text_0015"/> <a target="_blank"
                                                                            href="http://www.aboutcookies.org/"><spring:message
                        code="public.cookies.text_0016"/><span class="visuallyhidden">
                        <spring:message code="public.template.link.opens.in.a.new.tab"/></span></a>
                        <spring:message code="public.cookies.text_0017"/>
                    </p>

                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0018"/></h3>

                    <p><spring:message code="public.cookies.text_0019"/></p>
                    <h2><spring:message code="public.cookies.text_0020"/></h2>
                    <ul class="list list-bullet">
                        <li><spring:message code="public.cookies.text_0021"/></li>
                        <li><spring:message code="public.cookies.text_0022"/></li>
                        <li><spring:message code="public.cookies.text_0023"/></li>
                        <li><spring:message code="public.cookies.text_0024"/></li>
                    </ul>
                    <p><spring:message code="public.cookies.text_0025"/> <a
                        href="https://www.google.com/policies/privacy/partners/"><spring:message
                        code="public.cookies.text_0026"/></a><spring:message code="public.cookies.text_0027"/></p>
                    <p><spring:message code="public.cookies.text_0028"/> <a
                        href="https://tools.google.com/dlpage/gaoptout"><spring:message
                        code="public.cookies.text_0029"/></a> <spring:message code="public.cookies.text_0030"/></p>
                    <p><spring:message code="public.cookies.text_0031"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0032"/></th>
                            <th><spring:message code="public.cookies.text_0033"/></th>
                            <th><spring:message code="public.cookies.text_0034"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0035"/></th>
                            <td><spring:message code="public.cookies.text_0036"/></td>
                            <td><spring:message code="public.cookies.text_0037"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0038"/></th>
                            <td><spring:message code="public.cookies.text_0039"/></td>
                            <td><spring:message code="public.cookies.text_0040"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0041"/></th>
                            <td><spring:message code="public.cookies.text_0042"/></td>
                            <td><spring:message code="public.cookies.text_0043"/></td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0044"/></h3>
                    <p><spring:message code="public.cookies.text_0045"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0046"/></th>
                            <th><spring:message code="public.cookies.text_0047"/></th>
                            <th><spring:message code="public.cookies.text_0048"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0049"/></th>
                            <td><spring:message code="public.cookies.text_0050"/></td>
                            <td><spring:message code="public.cookies.text_0051"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0228"/></th>
                            <td><spring:message code="public.cookies.text_0229"/></td>
                            <td><spring:message code="public.cookies.text_0230"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0231"/></th>
                            <td><spring:message code="public.cookies.text_0232"/></td>
                            <td><spring:message code="public.cookies.text_0233"/></td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0052"/></h3>
                    <p><spring:message code="public.cookies.text_0053"/></p>
                    <ul class="list list-bullet">
                        <li><spring:message code="public.cookies.text_0054"/></li>
                        <li><spring:message code="public.cookies.text_0055"/></li>
                        <li><spring:message code="public.cookies.text_0056"/></li>
                    </ul>

                    <p><spring:message code="public.cookies.text_0057"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0058"/></th>
                            <th><spring:message code="public.cookies.text_0059"/></th>
                            <th><spring:message code="public.cookies.text_0060"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0061"/></th>
                            <td><spring:message code="public.cookies.text_0062"/></td>
                            <td><spring:message code="public.cookies.text_0063"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0064"/></th>
                            <td><spring:message code="public.cookies.text_0065"/></td>
                            <td><spring:message code="public.cookies.text_0066"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0067"/></th>
                            <td><spring:message code="public.cookies.text_0068"/></td>
                            <td><spring:message code="public.cookies.text_0069"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0070"/></th>
                            <td><spring:message code="public.cookies.text_0071"/></td>
                            <td><spring:message code="public.cookies.text_0072"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0073"/></th>
                            <td><spring:message code="public.cookies.text_0074"/></td>
                            <td><spring:message code="public.cookies.text_0075"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0076"/></th>
                            <td><spring:message code="public.cookies.text_0077"/></td>
                            <td><spring:message code="public.cookies.text_0078"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div id="tabs-2" aria-labelledby="ui-id-5" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                    <!--Appeal Benefit-->
                    <h2 class="heading-large"><spring:message code="public.cookies.text_0079"/></h2>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0080"/></h3>
                    <p>
                        <spring:message code="public.cookies.text_0081"/><br>
                        <spring:message code="public.cookies.text_0082"/>
                    </p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0083"/></th>
                            <th><spring:message code="public.cookies.text_0084"/></th>
                            <th><spring:message code="public.cookies.text_0085"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0086"/></th>
                            <td><spring:message code="public.cookies.text_0087"/></td>
                            <td><spring:message code="public.cookies.text_0088"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0089"/></th>
                            <td><spring:message code="public.cookies.text_0090"/></td>
                            <td><spring:message code="public.cookies.text_0091"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0092"/></th>
                            <td><spring:message code="public.cookies.text_0093"/></td>
                            <td><spring:message code="public.cookies.text_0094"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0095"/></th>
                            <td><spring:message code="public.cookies.text_0096"/></td>
                            <td><spring:message code="public.cookies.text_0097"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div id="tabs-3" aria-labelledby="ui-id-3" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <!--Divorce-->
                    <h2 class="heading-large"><spring:message code="public.cookies.text_0098"/></h2>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0099"/></h3>
                    <p>
                        <spring:message code="public.cookies.text_0081"/><br>
                        <spring:message code="public.cookies.text_0082"/>
                    </p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0101"/></th>
                            <th><spring:message code="public.cookies.text_0102"/></th>
                            <th><spring:message code="public.cookies.text_0103"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0104"/></th>
                            <td><spring:message code="public.cookies.text_0105"/></td>
                            <td><spring:message code="public.cookies.text_0106"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0107"/></th>
                            <td><spring:message code="public.cookies.text_0108"/></td>
                            <td><spring:message code="public.cookies.text_0109"/></td>
                        </tr>

                        </tbody>
                    </table>

                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0110"/></h3>
                    <p><spring:message code="public.cookies.text_0111"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0112"/></th>
                            <th><spring:message code="public.cookies.text_0113"/></th>
                            <th><spring:message code="public.cookies.text_0114"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0115"/></th>
                            <td><spring:message code="public.cookies.text_0116"/></td>
                            <td><spring:message code="public.cookies.text_0117"/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0118"/></h3>
                    <p><spring:message code="public.cookies.text_0119"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0120"/></th>
                            <th><spring:message code="public.cookies.text_0121"/></th>
                            <th><spring:message code="public.cookies.text_0122"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0123"/></th>
                            <td><spring:message code="public.cookies.text_0124"/></td>
                            <td><spring:message code="public.cookies.text_0125"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0126"/></th>
                            <td><spring:message code="public.cookies.text_0127"/></td>
                            <td><spring:message code="public.cookies.text_0128"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div id="tabs-4" aria-labelledby="ui-id-4" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <!--Probate-->
                    <h2 class="heading-large"><spring:message code="public.cookies.text_0129"/></h2>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0130"/></h3>
                    <p>
                        <spring:message code="public.cookies.text_0081"/><br>
                        <spring:message code="public.cookies.text_0082"/>
                    </p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0132"/></th>
                            <th><spring:message code="public.cookies.text_0133"/></th>
                            <th><spring:message code="public.cookies.text_0134"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0135"/></th>
                            <td><spring:message code="public.cookies.text_0136"/></td>
                            <td><spring:message code="public.cookies.text_0137"/></td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0138"/></h3>
                    <p><spring:message code="public.cookies.text_0139"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0140"/></th>
                            <th><spring:message code="public.cookies.text_0141"/></th>
                            <th><spring:message code="public.cookies.text_0142"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0143"/></th>
                            <td><spring:message code="public.cookies.text_0144"/></td>
                            <td><spring:message code="public.cookies.text_0145"/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0146"/></h3>
                    <p><spring:message code="public.cookies.text_0147"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0148"/></th>
                            <th><spring:message code="public.cookies.text_0149"/></th>
                            <th><spring:message code="public.cookies.text_0150"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0151"/></th>
                            <td><spring:message code="public.cookies.text_0152"/></td>
                            <td><spring:message code="public.cookies.text_0153"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0154"/></th>
                            <td><spring:message code="public.cookies.text_0155"/></td>
                            <td><spring:message code="public.cookies.text_0156"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0157"/></th>
                            <td><spring:message code="public.cookies.text_0158"/></td>
                            <td><spring:message code="public.cookies.text_0159"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div id="tabs-5" aria-labelledby="ui-id-2" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                    <!-- Money Claims Service -->
                    <h2 class="heading-large"><spring:message code="public.cookies.text_0160"/></h2>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0161"/></h3>
                    <p>
                        <spring:message code="public.cookies.text_0081"/><br>
                        <spring:message code="public.cookies.text_0082"/>
                    </p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0163"/></th>
                            <th><spring:message code="public.cookies.text_0164"/></th>
                            <th><spring:message code="public.cookies.text_0165"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0166"/></th>
                            <td><spring:message code="public.cookies.text_0167"/></td>
                            <td><spring:message code="public.cookies.text_0168"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0169"/></th>
                            <td><spring:message code="public.cookies.text_0170"/></td>
                            <td><spring:message code="public.cookies.text_0171"/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0172"/></h3>
                    <p><spring:message code="public.cookies.text_0173"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0174"/></th>
                            <th><spring:message code="public.cookies.text_0175"/></th>
                            <th><spring:message code="public.cookies.text_0176"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0177"/></th>
                            <td><spring:message code="public.cookies.text_0178"/></td>
                            <td><spring:message code="public.cookies.text_0179"/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0180"/></h3>
                    <p><spring:message code="public.cookies.text_0181"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0182"/></th>
                            <th><spring:message code="public.cookies.text_0183"/></th>
                            <th><spring:message code="public.cookies.text_0184"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0185"/></th>
                            <td><spring:message code="public.cookies.text_0186"/></td>
                            <td><spring:message code="public.cookies.text_0187"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0188"/></th>
                            <td><spring:message code="public.cookies.text_0189"/></td>
                            <td><spring:message code="public.cookies.text_0190"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0191"/></th>
                            <td><spring:message code="public.cookies.text_0192"/></td>
                            <td><spring:message code="public.cookies.text_0193"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div id="tabs-6" aria-labelledby="ui-id-5" role="tabpanel"
                     class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                    <!-- Family Public Law -->
                    <h2 class="heading-large"><spring:message code="public.cookies.text_0194"/></h2>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0195"/></h3>
                    <p>
                        <spring:message code="public.cookies.text_0081"/><br>
                        <spring:message code="public.cookies.text_0082"/>
                    </p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0197"/></th>
                            <th><spring:message code="public.cookies.text_0198"/></th>
                            <th><spring:message code="public.cookies.text_0199"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0200"/></th>
                            <td><spring:message code="public.cookies.text_0201"/></td>
                            <td><spring:message code="public.cookies.text_0202"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0203"/></th>
                            <td><spring:message code="public.cookies.text_0204"/></td>
                            <td><spring:message code="public.cookies.text_0205"/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0206"/></h3>
                    <p><spring:message code="public.cookies.text_0207"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0208"/></th>
                            <th><spring:message code="public.cookies.text_0209"/></th>
                            <th><spring:message code="public.cookies.text_0210"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0211"/></th>
                            <td><spring:message code="public.cookies.text_0212"/></td>
                            <td><spring:message code="public.cookies.text_0213"/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="heading-medium"><spring:message code="public.cookies.text_0214"/></h3>
                    <p><spring:message code="public.cookies.text_0215"/></p>
                    <table>
                        <thead>
                        <tr>
                            <th><spring:message code="public.cookies.text_0216"/></th>
                            <th><spring:message code="public.cookies.text_0217"/></th>
                            <th><spring:message code="public.cookies.text_0218"/></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th><spring:message code="public.cookies.text_0219"/></th>
                            <td><spring:message code="public.cookies.text_0220"/></td>
                            <td><spring:message code="public.cookies.text_0221"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0222"/></th>
                            <td><spring:message code="public.cookies.text_0223"/></td>
                            <td><spring:message code="public.cookies.text_0224"/></td>
                        </tr>
                        <tr>
                            <th><spring:message code="public.cookies.text_0225"/></th>
                            <td><spring:message code="public.cookies.text_0226"/></td>
                            <td><spring:message code="public.cookies.text_0227"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </article>
</t:wrapper>