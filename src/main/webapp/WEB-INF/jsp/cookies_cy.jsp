<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<article class="content__body">
    <a href="javascript:history.go(-1)" class="link-back">Yn ôl</a>
    <h1 class="heading-xlarge">
        Cwcis
    </h1>
    <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
        <div id="nav-links">



            <ol class="nav-list ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-1" aria-labelledby="ui-id-1" aria-selected="true" aria-expanded="true"><a href="#tabs-1" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-1">Trosolwg</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-5" aria-labelledby="ui-id-2" aria-selected="false" aria-expanded="false"><a href="#tabs-5" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-2">Gwasanaeth apelio yn erbyn penderfyniad ynghylch budd-daliadau</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-3" aria-labelledby="ui-id-3" aria-selected="false" aria-expanded="false"><a href="#tabs-3" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-3">Gwasanaeth gwneud cais am ysgariad</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-4" aria-labelledby="ui-id-4" aria-selected="false" aria-expanded="false"><a href="#tabs-4" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-4">Gwasanaeth gwneud cais am brofiant</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="false" aria-expanded="false"><a href="#tabs-2" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-5">Gwasanaeth Hawlio Arian</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-6" aria-selected="false" aria-expanded="false"><a href="#tabs-6" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-6">Gwasanaeth cyfraith gyhoeddus - Teulu</a></li>
            </ol>
            <hr>



            <div id="tabs-1" aria-labelledby="ui-id-1" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false">

                <h2 class="heading-large" id="overview">Trosolwg</h2>

                <p>Darn bach o ddata sy'n cael ei storio ar eich cyfrifiadur, eich tabled neu eich ffôn symudol pan fyddwch yn ymweld â gwefan yw cwci. Mae angen cwcis ar y rhan fwyaf o wefannau i weithio'n iawn.</p>
                <h2>Sut ydym yn defnyddio cwcis yn y gwasanaeth hwn:</h2>
                <ul class="list list-bullet">
                    <li>mesur sut ydych yn defnyddio’r gwasanaeth fel y gallwn ei wella</li>
                    <li>cofio'r hysbysiadau rydych wedi'u gweld fel na fyddwch yn eu gweld eto</li>
                    <li>storio’r atebion a roddwch dros dro</li>
                </ul>
                <p>Darganfod mwy am <a target="_blank" href="http://www.aboutcookies.org/">sut i reoli cwcis</a>.</p>


            </div>


            <div id="tabs-2" aria-labelledby="ui-id-5" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                <h2 class="heading-large">Cwcis yn y gwasanaeth hawlio arian</h2>
                <h3 class="heading-medium">Cwcis a ddefnyddir i fesur faint o bobl sy’n defnyddio ein gwefan</h3>
                <p>Rydym yn defnyddio meddalwedd Google Analytics i gasglu gwybodaeth am sut rydych yn defnyddio'r gwasanaeth hwn. Rydym yn gwneud hyn i helpu i sicrhau bod y gwasanaeth yn diwallu anghenion defnyddwyr ac i'n helpu i wneud gwelliannau, er enghraifft gwella’r cyfleuster chwilio.</p>
                <p>Mae Google Analytics yn storio gwybodaeth am:</p>
                <ul class="list list-bullet">
                    <li>y tudalennau yr ydych yn ymweld â hwy</li>
                    <li>faint o amser y byddwch yn ei dreulio ar bob tudalen</li>
                    <li>sut y daethoch o hyd i’r gwasanaeth</li>
                    <li>yr hyn rydych chi'n clicio arno wrth ddefnyddio'r gwasanaeth</li>
                </ul>
                <p>Rydym yn caniatáu i Google ddefnyddio neu rannu ein data dadansoddi. Gallwch ddarganfod mwy am sut mae Google yn defnyddio’r wybodaeth hon yn eu <a href="https://www.google.com/policies/privacy/partners/">Polisi Preifatrwydd</a>.</p>
                <p>Gallwch <a href="https://tools.google.com/dlpage/gaoptout">optio allan o Google Analytics</a> os nad ydych eisiau i Google gael mynediad at eich gwybodaeth</p>
                <p>Mae Google Analytics yn gosod y cwcis canlynol:</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>_ga</th>
                        <td>Mae hyn yn ein helpu i gyfrif faint o bobl sy'n ymweld â'r tudalennau drwy olrhain os ydych wedi ymweld o'r blaen</td>
                        <td>2 flynedd</td>
                    </tr>
                    <tr>
                        <th>_gat</th>
                        <td>Rheoli faint o bobl sy’n ymweld â’r dudalen</td>
                        <td>10 munud</td>
                    </tr>
                    <tr>
                        <th>_gid</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi</td>
                        <td>24 awr</td>
                    </tr>
                    </tbody>
                </table>
                <p>Rydym yn caniatáu i Google ddefnyddio neu rannu’r data hwn. Gallwch ddarganfod mwy am sut maent yn defnyddio’r wybodaeth hon ym <a href="https://www.google.com/policies/privacy/partners/">Mholisi preifatrwydd Google</a></p>
                <h3 class="heading-medium">Cwcis a ddefnyddir i droi ein neges gyflwyno i ffwrdd</h3>
                <p>Efallai y byddwch yn gweld neges groeso pan fyddwch yn ymweld â'r gwasanaeth am y tro cyntaf. Byddwn yn storio cwci ar eich cyfrifiadur fel ei fod yn gwybod i beidio â'i dangos eto.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>seen_cookie_message</th>
                        <td>Arbed neges i roi gwybod inni eich bod wedi gweld ein neges ynglŷn â chwcis</td>
                        <td>1 mis</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i storio’r atebion a roesoch yn ystod eich ymweliad (gelwir hyn yn ‘sesiwn’)</h3>
                <p>Caiff cwcis sesiwn eu storio ar eich cyfrifiadur wrth ichi fynd drwy wefan, ac maent yn gadael i'r wefan wybod beth rydych wedi'i weld a'i wneud hyd yn hyn. Cwcis dros dro yw'r rhain ac fe'u dilëir yn awtomatig ychydig ar ôl ichi adael y wefan.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>session_ID</th>
                        <td>Cadw cofnod o’ch atebion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>eligibility-check</th>
                        <td>Storio eich atebion i’r cwestiynau cymhwystra</td>
                        <td>10 munud</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i’ch hadnabod pan fyddwch yn dod nôl i'r gwasanaeth</h3>
                <p>Rydym yn defnyddio cwcis dilysu i’ch adnabod pan fyddwch yn dod nôl i'r gwasanaeth.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>lang</th>
                        <td>Nodi eich dewis iaith</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i wneud y gwasanaeth yn fwy diogel</h3>
                <p>Rydym yn gosod cwcis er mwyn rhwystro hacwyr rhag addasu cynnwys y cwcis eraill a osodon ni. Mae hyn yn gwneud y gwasanaeth yn fwy diogel ac yn diogelu eich gwybodaeth bersonol.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>state</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi a diogelu eich manylion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <td>ARRAfinnity</td>
                        <td>
                            Amddiffyn eich sesiwn rhag i rywun ymyrryd ag o
                        </td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>_csrf</th>
                        <td>Helpu i amddiffyn rhag ffugio</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div id="tabs-3" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                <!--divorce-->

                <h2 class="heading-large">Cwics yn y gwasanaeth gwneud cais am ysgariad</h2>
                <h3 class="heading-medium">Cwcis a ddefnyddir i fesur faint o bobl sy’n defnyddio ein gwefan</h3>
                <p>Rydym yn defnyddio meddalwedd Google Analytics i gasglu gwybodaeth am sut rydych yn defnyddio'r gwasanaeth hwn. Rydym yn gwneud hyn i helpu i sicrhau bod y gwasanaeth yn diwallu anghenion defnyddwyr ac i'n helpu i wneud gwelliannau, er enghraifft gwella’r cyfleuster chwilio.</p>
                <p>Mae Google Analytics yn storio gwybodaeth am:</p>
                <ul class="list list-bullet">
                    <li>y tudalennau yr ydych yn ymweld â hwy</li>
                    <li>faint o amser y byddwch yn ei dreulio ar bob tudalen</li>
                    <li>sut y daethoch o hyd i’r gwasanaeth</li>
                    <li>yr hyn rydych chi'n clicio arno wrth ddefnyddio'r gwasanaeth</li>
                </ul>
                <p>Rydym yn caniatáu i Google ddefnyddio neu rannu ein data dadansoddi. Gallwch ddarganfod mwy am sut mae Google yn defnyddio’r wybodaeth hon yn eu <a href="https://www.google.com/policies/privacy/partners/">Polisi Preifatrwydd</a>.</p>
                <p>Gallwch <a href="https://tools.google.com/dlpage/gaoptout">optio allan o Google Analytics</a> os nad ydych eisiau i Google gael mynediad at eich gwybodaeth</p>
                <p>Mae Google Analytics yn gosod y cwcis canlynol:</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>_ga</th>
                        <td>Mae hyn yn ein helpu i gyfrif faint o bobl sy'n ymweld â'r tudalennau drwy olrhain os ydych wedi ymweld o'r blaen</td>
                        <td>2 flynedd</td>
                    </tr>
                    <tr>
                        <th>_gat</th>
                        <td>Rheoli faint o bobl sy’n ymweld â’r dudalen</td>
                        <td>10 munud</td>
                    </tr>
                    <tr>
                        <th>_gid</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi</td>
                        <td>24 awr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i droi ein neges gyflwyno i ffwrdd</h3>
                <p>Efallai y byddwch yn gweld neges groeso pan fyddwch yn ymweld â'r gwasanaeth am y tro cyntaf. Byddwn yn storio cwci ar eich cyfrifiadur fel ei fod yn gwybod i beidio â'i dangos eto.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>seen_cookie_message</th>
                        <td>Arbed neges i roi gwybod inni eich bod wedi gweld ein neges ynglŷn â chwcis</td>
                        <td>1 mis</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i storio’r atebion a roesoch yn ystod eich ymweliad (gelwir hyn yn ‘sesiwn’)</h3>
                <p>Caiff cwcis sesiwn eu storio ar eich cyfrifiadur wrth ichi fynd drwy wefan, ac maent yn gadael i'r wefan wybod beth rydych wedi'i weld a'i wneud hyd yn hyn. Cwcis dros dro yw'r rhain ac fe'u dilëir yn awtomatig ychydig ar ôl ichi adael y wefan.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>connect.sid</th>
                        <td>Gwybodaeth am eich sesiwn gyfredol</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>

                    <tr>
                        <th>session_ID</th>
                        <td>Cadw cofnod o’ch atebion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>

                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i’ch hadnabod pan fyddwch yn dod nôl i'r gwasanaeth</h3>
                <p>Rydym yn defnyddio cwcis dilysu i’ch adnabod pan fyddwch yn dod nôl i'r gwasanaeth.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>__auth-token</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i wneud y gwasanaeth yn fwy diogel</h3>
                <p>Rydym yn gosod cwcis er mwyn rhwystro hacwyr rhag addasu cynnwys y cwcis eraill a osodon ni. Mae hyn yn gwneud y gwasanaeth yn fwy diogel ac yn diogelu eich gwybodaeth bersonol.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>TSxxxxxxxx</th>
                        <td>Amddiffyn eich sesiwn rhag i rywun ymyrryd ag o</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>__state</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi a diogelu eich manylion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>

                    </tbody>
                </table>
            </div>
            <div id="tabs-4" aria-labelledby="ui-id-4" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                <!--probate-->
                <h2 class="heading-large">Cwcis yn y gwasanaeth gwneud cais am brofiant</h2>
                <h3 class="heading-medium">Cwcis a ddefnyddir i fesur faint o bobl sy’n defnyddio ein gwefan</h3>
                <p>Rydym yn defnyddio meddalwedd Google Analytics i gasglu gwybodaeth am sut rydych yn defnyddio'r gwasanaeth hwn. Rydym yn gwneud hyn i helpu i sicrhau bod y gwasanaeth yn diwallu anghenion defnyddwyr ac i'n helpu i wneud gwelliannau, er enghraifft gwella’r cyfleuster chwilio.</p>
                <p>Mae Google Analytics yn storio gwybodaeth am:</p>
                <ul class="list list-bullet">
                    <li>y tudalennau yr ydych yn ymweld â hwy</li>
                    <li>faint o amser y byddwch yn ei dreulio ar bob tudalen</li>
                    <li>sut y daethoch o hyd i’r gwasanaeth</li>
                    <li>yr hyn rydych chi'n clicio arno wrth ddefnyddio'r gwasanaeth</li>
                </ul>
                <p>Rydym yn caniatáu i Google ddefnyddio neu rannu ein data dadansoddi. Gallwch ddarganfod mwy am sut mae Google yn defnyddio’r wybodaeth hon yn eu <a href="https://www.google.com/policies/privacy/partners/">Polisi Preifatrwydd</a>.</p>
                <p>Gallwch <a href="https://tools.google.com/dlpage/gaoptout">optio allan o Google Analytics</a> os nad ydych eisiau i Google gael mynediad at eich gwybodaeth</p>
                <p>Mae Google Analytics yn gosod y cwcis canlynol:</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>_ga</th>
                        <td>Mae hyn yn ein helpu i gyfrif faint o bobl sy'n ymweld â'r tudalennau drwy olrhain os ydych wedi ymweld o'r blaen</td>
                        <td>2 flynedd</td>
                    </tr>
                    <tr>
                        <th>_gat</th>
                        <td>Rheoli faint o bobl sy’n ymweld â’r dudalen</td>
                        <td>10 munud</td>
                    </tr>

                    </tbody>
                </table>

                <h3 class="heading-medium">Cwcis a ddefnyddir i droi ein neges gyflwyno i ffwrdd</h3>
                <p>Efallai y byddwch yn gweld neges groeso pan fyddwch yn ymweld â'r gwasanaeth am y tro cyntaf. Byddwn yn storio cwci ar eich cyfrifiadur fel ei fod yn gwybod i beidio â'i dangos eto.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>seen_cookie_message</th>
                        <td>Arbed neges i roi gwybod inni eich bod wedi gweld ein neges ynglŷn â chwcis</td>
                        <td>1 mis</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i storio’r atebion a roesoch yn ystod eich ymweliad (gelwir hyn yn ‘sesiwn’)</h3>
                <p>Caiff cwcis sesiwn eu storio ar eich cyfrifiadur wrth ichi fynd drwy wefan, ac maent yn gadael i'r wefan wybod beth rydych wedi'i weld a'i wneud hyd yn hyn. Cwcis dros dro yw'r rhain ac fe'u dilëir yn awtomatig ychydig ar ôl ichi adael y wefan.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>connect.sid</th>
                        <td>Gwybodaeth am eich sesiwn gyfredol</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>



                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i’ch hadnabod pan fyddwch yn dod nôl i'r gwasanaeth</h3>
                <p>Rydym yn defnyddio cwcis dilysu i’ch adnabod pan fyddwch yn dod nôl i'r gwasanaeth.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>__auth-token</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i wneud y gwasanaeth yn fwy diogel</h3>
                <p>Rydym yn gosod cwcis er mwyn rhwystro hacwyr rhag addasu cynnwys y cwcis eraill a osodon ni. Mae hyn yn gwneud y gwasanaeth yn fwy diogel ac yn diogelu eich gwybodaeth bersonol.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>TS01842b02</th>
                        <td>Amddiffyn eich sesiwn rhag i rywun ymyrryd ag o</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>__state</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi a diogelu eich manylion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>_csrf</th>
                        <td>Helpu i amddiffyn rhag ffugio</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>


                    </tbody>
                </table>

            </div>
            <div id="tabs-5" aria-labelledby="ui-id-2" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                <!--Social Security and Child Support Tribunal-->
                <h2 class="heading-large">Cwcis yn y gwasanaeth apelio yn erbyn penderfyniad ynghylch budd-daliadau</h2>
                <h3 class="heading-medium">Cwcis a ddefnyddir i fesur faint o bobl sy’n defnyddio ein gwefan</h3>
                <p>Rydym yn defnyddio meddalwedd Google Analytics i gasglu gwybodaeth am sut rydych yn defnyddio'r gwasanaeth hwn. Rydym yn gwneud hyn i helpu i sicrhau bod y gwasanaeth yn diwallu anghenion defnyddwyr ac i'n helpu i wneud gwelliannau, er enghraifft gwella’r cyfleuster chwilio.</p>
                <p>Mae Google Analytics yn storio gwybodaeth am:</p>
                <ul class="list list-bullet">
                    <li>y tudalennau yr ydych yn ymweld â hwy</li>
                    <li>faint o amser y byddwch yn ei dreulio ar bob tudalen</li>
                    <li>sut y daethoch o hyd i’r gwasanaeth</li>
                    <li>yr hyn rydych chi'n clicio arno wrth ddefnyddio'r gwasanaeth</li>
                </ul>
                <p>Rydym yn caniatáu i Google ddefnyddio neu rannu ein data dadansoddi. Gallwch ddarganfod mwy am sut mae Google yn defnyddio’r wybodaeth hon yn eu <a href="https://www.google.com/policies/privacy/partners/">Polisi Preifatrwydd</a>.</p>
                <p>Gallwch <a href="https://tools.google.com/dlpage/gaoptout">optio allan o Google Analytics</a> os nad ydych eisiau i Google gael mynediad at eich gwybodaeth</p>
                <p>Mae Google Analytics yn gosod y cwcis canlynol:</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>_ga</th>
                        <td>Mae hyn yn ein helpu i gyfrif faint o bobl sy'n ymweld â'r tudalennau drwy olrhain os ydych wedi ymweld o'r blaen</td>
                        <td>2 flynedd</td>
                    </tr>
                    <tr>
                        <th>_gat</th>
                        <td>Rheoli faint o bobl sy’n ymweld â’r dudalen</td>
                        <td>10 munud</td>
                    </tr>

                    </tbody>
                </table>

                <h3 class="heading-medium">Cwcis a ddefnyddir i droi ein neges gyflwyno i ffwrdd</h3>
                <p>Efallai y byddwch yn gweld neges groeso pan fyddwch yn ymweld â'r gwasanaeth am y tro cyntaf. Byddwn yn storio cwci ar eich cyfrifiadur fel ei fod yn gwybod i beidio â'i dangos eto.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>seen_cookie_message</th>
                        <td>Arbed neges i roi gwybod inni eich bod wedi gweld ein neges ynglŷn â chwcis</td>
                        <td>1 mis</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i storio’r atebion a roesoch yn ystod eich ymweliad (gelwir hyn yn ‘sesiwn’)</h3>
                <p>Caiff cwcis sesiwn eu storio ar eich cyfrifiadur wrth ichi fynd drwy wefan, ac maent yn gadael i'r wefan wybod beth rydych wedi'i weld a'i wneud hyd yn hyn. Cwcis dros dro yw'r rhain ac fe'u dilëir yn awtomatig ychydig ar ôl ichi adael y wefan.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>session</th>
                        <td>Cadw cofnod o’ch atebion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>tya-surname-appeal-validated</th>
                        <td>Cadarnhau eich cyfenw fel y gallwch ddefnyddio’r gwasanaeth Olrhain eich apêl</td>
                        <td>30 munud</td>
                    </tr>
                    <tr>
                        <th>tya-surname-appeal-validated.sig</th>
                        <td>Defnyddir hwn i ddatgelu unrhyw ymyrraeth y tro nesaf y derbynnir cwci</td>
                        <td>30 munud</td>
                    </tr>
                    <tr>
                        <th>ARRAffinity</th>
                        <td>Gwybod i ba IP y dylid cyfeirio cais</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>



                    </tbody>
                </table>

            </div>
            <div id="tabs-6" aria-labelledby="ui-id-5" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                <h2 class="heading-large">Cwcis yn y gwasanaeth cyfraith gyhoeddus - teulu</h2>
                <h3 class="heading-medium">Cwcis a ddefnyddir i fesur faint o bobl sy’n defnyddio ein gwefan</h3>
                <p>Rydym yn defnyddio meddalwedd Google Analytics i gasglu gwybodaeth am sut rydych yn defnyddio'r gwasanaeth hwn. Rydym yn gwneud hyn i helpu i sicrhau bod y gwasanaeth yn diwallu anghenion defnyddwyr ac i'n helpu i wneud gwelliannau, er enghraifft gwella’r cyfleuster chwilio.</p>
                <p>Mae Google Analytics yn storio gwybodaeth am:</p>
                <ul class="list list-bullet">
                    <li>y tudalennau yr ydych yn ymweld â hwy</li>
                    <li>faint o amser y byddwch yn ei dreulio ar bob tudalen</li>
                    <li>sut y daethoch o hyd i’r gwasanaeth</li>
                    <li>yr hyn rydych chi'n clicio arno wrth ddefnyddio'r gwasanaeth</li>
                </ul>
                <p>Rydym yn caniatáu i Google ddefnyddio neu rannu ein data dadansoddi. Gallwch ddarganfod mwy am sut mae Google yn defnyddio’r wybodaeth hon yn eu <a href="https://www.google.com/policies/privacy/partners/">Polisi Preifatrwydd</a>.</p>
                <p>Gallwch <a href="https://tools.google.com/dlpage/gaoptout">optio allan o Google Analytics</a> os nad ydych eisiau i Google gael mynediad at eich gwybodaeth</p>
                <p>Mae Google Analytics yn gosod y cwcis canlynol:</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>_ga</th>
                        <td>Mae hyn yn ein helpu i gyfrif faint o bobl sy'n ymweld â'r tudalennau drwy olrhain os ydych wedi ymweld o'r blaen</td>
                        <td>2 flynedd</td>
                    </tr>
                    <tr>
                        <th>_gat</th>
                        <td>Rheoli faint o bobl sy’n ymweld â’r dudalen</td>
                        <td>10 munud</td>
                    </tr>
                    <tr>
                        <th>_gid</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi</td>
                        <td>24 awr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i droi ein neges gyflwyno i ffwrdd</h3>
                <p>Efallai y byddwch yn gweld neges groeso pan fyddwch yn ymweld â'r gwasanaeth am y tro cyntaf. Byddwn yn storio cwci ar eich cyfrifiadur fel ei fod yn gwybod i beidio â'i dangos eto.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>seen_cookie_message</th>
                        <td>Arbed neges i roi gwybod inni eich bod wedi gweld ein neges ynglŷn â chwcis</td>
                        <td>1 mis</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i storio’r atebion a roesoch yn ystod eich ymweliad (gelwir hyn yn ‘sesiwn’)</h3>
                <p>Caiff cwcis sesiwn eu storio ar eich cyfrifiadur wrth ichi fynd drwy wefan, ac maent yn gadael i'r wefan wybod beth rydych wedi'i weld a'i wneud hyd yn hyn. Cwcis dros dro yw'r rhain ac fe'u dilëir yn awtomatig ychydig ar ôl ichi adael y wefan.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>connect.sid</th>
                        <td>Gwybodaeth am eich sesiwn gyfredol</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>sessionKey</th>
                        <td>Defnyddio encryptio i amddiffyn eich sesiwn</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i’ch hadnabod pan fyddwch yn dod nôl i'r gwasanaeth</h3>
                <p>Rydym yn defnyddio cwcis dilysu i’ch adnabod pan fyddwch yn dod nôl i'r gwasanaeth.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>__auth-token</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="heading-medium">Cwcis a ddefnyddir i wneud y gwasanaeth yn fwy diogel</h3>
                <p>Rydym yn gosod cwcis er mwyn rhwystro hacwyr rhag addasu cynnwys y cwcis eraill a osodon ni. Mae hyn yn gwneud y gwasanaeth yn fwy diogel ac yn diogelu eich gwybodaeth bersonol.</p>
                <table>
                    <thead>
                    <tr>
                        <th>Enw’r cwci</th>
                        <th>Pwrpas y cwci</th>
                        <th>Darfod ymhen</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>TSxxxxxxxx</th>
                        <td>Amddiffyn eich sesiwn rhag i rywun ymyrryd ag o</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>__state</th>
                        <td>Gadael i'r gwasanaeth wybod pwy ydych chi a diogelu eich manylion</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    <tr>
                        <th>X_CMC</th>
                        <td>Helpu ni i gadw golwg ar eich sesiwn</td>
                        <td>Pan fyddwch chi’n cau’ch porwr</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</article>