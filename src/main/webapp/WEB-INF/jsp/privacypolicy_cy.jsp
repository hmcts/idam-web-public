<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<article class="content__body">
    <a href="javascript:history.go(-1)" class="link-back">Yn ôl</a>
    <h1 class="heading-xlarge">
        Polisi Preifatrwydd
    </h1>
    <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
        <div id="nav-links">

            <ol class="nav-list ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-1" aria-labelledby="ui-id-1" aria-selected="false" aria-expanded="false"><a href="#tabs-1" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-1">Trosolwg</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-4" aria-labelledby="ui-id-2" aria-selected="false" aria-expanded="false"><a href="#tabs-4" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-2">Gwasanaeth apelio yn erbyn penderfyniad ynghylch budd-daliadau</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-3" aria-labelledby="ui-id-3" aria-selected="false" aria-expanded="false"><a href="#tabs-3" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-3">Gwasanaeth gwneud cais am ysgariad</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-5" aria-labelledby="ui-id-4" aria-selected="false" aria-expanded="false"><a href="#tabs-5" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-4">Gwasanaeth gwneud cais am brofiant</a></li>
                <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="true" aria-expanded="true"><a href="#tabs-2" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-5">Gwasanaeth Hawlio Arian</a></li>
                <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="tabs-2" aria-labelledby="ui-id-5" aria-selected="true" aria-expanded="true"><a href="#tabs-6" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-6">Gwasanaeth cyfraith gyhoeddus - Teulu</a></li>
            </ol>
            <hr>

            <div id="tabs-1" aria-labelledby="ui-id-1" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">

                <h2 class="heading-large" id="overview">Trosolwg</h2>
                <p>Mae’r polisi preifatrwydd hwn yn egluro pam rydym yn casglu eich data personol, beth rydym yn ei wneud ag ef, a’ch hawliau chi. Ceir rhagor o wybodaeth am ddefnyddio’r gwasanaeth hwn yn y <a href="/terms-and-conditions">telerau ac amodau</a>.</p>

                <h2 class="heading-medium">Pwy sy’n rheoli'r gwasanaeth hwn</h2>
                <p>Rheolir y gwasanaeth hwn gan Wasanaeth Llysoedd a Thribiwnlysoedd ei Mawrhydi (HMCTS) ac rydym yn gyfrifol am ddiogelu'r data personol y byddwch yn ei ddarparu.</p>
                <p>Mae GLlTEM yn un o asiantaethau gweithredol y Yr ydym ni yninyddiaeth Gyfiawnder (MoJ). MoJ yw’r rheolydd data ac mae ei <a href="https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter.cy">siarter gwybodaeth bersonol</a> yn egluro mwy am sut maent yn prosesu data personol.</p>
                <p>Pan fyddwch chi'n defnyddio'r gwasanaeth hwn byddwn ni (GLlTEM) yn gofyn i chi ddarparu rhywfaint o ddata personol.</p>

                <h2 class="heading-medium">Pam rydym ni’n casglu eich data personol</h2>
                <p>Rydym ni’n casglu eich data personol i:</p>
                <ul class="list list-bullet">
                    <li>brosesu eich hawliad neu’ch cais</li>
                    <li>bodloni gofynion cyfreithiol</li>
                    <li>gwella’r gwasanaeth hwn</li>
                </ul>
                <p>Mae ein staff yn defnyddio eich data personol i brosesu eich hawliad neu'ch cais. Maent yn gweithio yn y DU ac mae eich data yn cael ei storio yn y DU.</p>
                <h2 class="heading-medium">Mathau o ddata personol rydym yn eu casglu</h2>
                <p>Mae’r data personol rydym ni yn ei gasglu yn cynnwys:</p>
                <ul class="list list-bullet">
                    <li>eich enw, cyfeiriad a manylion cyswllt</li>
                    <li>eich e-bost a’ch cyfrinair (os byddwch yn creu cyfrif)</li>
                    <li>gwybodaeth bersonol arall rydych yn ei darparu yn eich hawliad neu gais</li>
                </ul>

                <p>Mae rhai gwasanaethau yn casglu mwy o ddata personol. Darganfyddwch fwy am y <a href="#otherservices">data personol sy'n cael ei gasglu gan y gwasanaeth rydych yn ei ddefnyddio</a> . </p>

                <h2 class="heading-medium">Defnyddio eich data</h2>
                <p>Fel rhan o'ch hawliad fe ofynnir ichi ddefnyddio’ch cyfeiriad e-bost i greu cyfrif. Byddwch yn gallu defnyddio’r cyfeiriad e-bost a’r cyfrinair hwn i fewngofnodi i wasanaethau eraill GLlTEM.</p>
                <p>Efallai y byddwn yn gofyn am eich caniatâd i ddefnyddio eich cyfeiriad e-bost i anfon negeseuon e-bost atoch trwy’r system GOV.UK Notify. Mae’r system yn prosesu negeseuon e-bost o fewn Ardal Economaidd Ewrop yn unig hyd nes y pwynt lle mae’r negeseuon e-bost yn cael eu trosglwyddo i’r darparwr e-bost rydych chi’n ei ddefnyddio.</p>
                <p>Yr ydym ni yn <a href="/cookies">defnyddio cwcis</a> i gasglu data am sut rydych yn defnyddio'r gwasanaeth hwn, gan gynnwys:</p>
                <ul class="list list-bullet">
                    <li>os byddwch yn agor neges e-bost gennym neu’n clicio ar ddolen mewn e-bost</li>
                    <li>cyfeiriad IP eich cyfrifiadur, eich ffôn neu'ch llechen </li>
                    <li>yr ardal neu’r dref lle rydych yn defnyddio’ch cyfrifiadur, ffôn neu dabled</li>
                    <li>y porwr gwe rydych yn ei ddefnyddio</li>
                </ul>

                <h2 class="heading-medium">Storio eich data</h2>

                <p>Pan fyddwch yn gwneud hawliad neu gais, rydym yn storio'r data a ddarparwyd gennych. Mae faint o amser y cedwir eich data ar ei gyfer yn dibynnu ar y gwasanaeth yr ydych yn ei ddefnyddio.</p>
                <p>Dysgwch fwy am ba mor hir mae eich data personol yn cael ei storio gan y gwasanaeth rydych yn ei ddefnyddio. </p>

                <p>Mae rhai gwasanaethau yn casglu mwy o ddata personol. Darganfyddwch fwy am y <a href="#otherservices">data personol sy'n cael ei gasglu gan y gwasanaeth rydych yn ei ddefnyddio</a> . </p>


                <h2 class="heading-medium">Rhannu eich data</h2>

                <p>Pan fydd eich hawliad neu’ch cais yn cael ei brosesu, mae’n bosib y byddwn angen cysylltu ag adran, asiantaeth neu sefydliad arall yn y llywodraeth ac efallai y byddwn yn rhannu eich data gyda nhw.</p>

                <p>Os byddwch yn cysylltu â ni ac yn gofyn am help gyda'r gwasanaeth rydych yn ei ddefnyddio, efallai y byddwn yn rhannu eich data personol gyda’r Good Things Foundation. Rydym yn gweithio mewn partneriaeth â'r cwmni hwn i gynnig cefnogaeth wyneb yn wyneb.</p>

                <p>Mewn rhai amgylchiadau efallai y byddwn yn rhannu eich data, er enghraifft er mwyn atal neu ganfod trosedd, neu i gynhyrchu ystadegau cyffredinol am unigolion sy’n defnyddio'r gwasanaeth.</p>

                <p>Rydym yn defnyddio Google Analytics i gasglu data am sut y defnyddir gwefan. Mae'r data cyffredinol hwn yn cael ei rannu â Google. Mae rhagor o wybodaeth am hyn yn ein <a href="/terms-and-conditions">telerau ac amodau</a>.</p>

                <h2 class="heading-medium">Storio a rhannu eich data’n rhyngwladol</h2>

                <p>Yr ydym ni ynithiau efallai y bydd angen inni anfon eich gwybodaeth bersonol tu allan i'r DU. Pan fyddwn yn gwneud hyn, byddwn yn cydymffurfio â chyfraith diogelu data.</p>

                <h2 class="heading-medium">Eich hawliau</h2>
                <p>Gallwch ofyn:</p>
                <ul class="list list-bullet">
                    <li>i gael gweld y data personol rydym yn ei gadw amdanoch</li>
                    <li>i'r data personol gael ei gywiro</li>
                    <li>i'r data personol gael ei symud neu ei ddileu (bydd hyn yn ddibynnol ar yr amgylchiadau, er enghraifft os ydych chi’n penderfynu peidio â pharhau gyda’ch hawliad neu’ch cais)</li>
                    <li>i gyfyngu ar y mynediad at y data personol (er enghraifft, gallwch ofyn i'ch data gael ei storio am gyfnod hirach a pheidio â chael ei ddileu'n awtomatig)</li>
                </ul>
                <p>Os ydych eisiau gweld y data personol rydym yn ei gadw amdanoch, gallwch: </p>
                <ul class="list list-bullet">
                    <li>lenwi ffurflen i <a href="https://www.gov.uk/government/publications/request-your-personal-data-from-moj.cy">wneud cais am fynediad at wybodaeth</a> . Bydd y cais hwn yn mynd i’r rheolydd data, sef MoJ.</li>
                    <li>ysgrifennu atom yn: Disclosure Team, Post point 10.38, 102 Petty France, Llundain, SW1H 9AJ</li>
                </ul>

                <h2 class="heading-medium">Gallwch ofyn i gael mwy o wybodaeth am:</h2>

                <ul class="list list-bullet">
                    <li>gytundebau sydd gennym ar rannu gwybodaeth gyda sefydliadau eraill</li>
                    <li>pryd caniateir inni drosglwyddo gwybodaeth bersonol amdanoch heb roi gwybod ichi</li>
                    <li>ein cyfarwyddiadau i staff ynghylch sut i gasglu, defnyddio neu ddileu eich gwybodaeth bersonol</li>
                    <li>sut rydym yn sicrhau bod yr wybodaeth sydd gennym yn gywir ac yn gyfredol</li>
                </ul>

                <h2 class="heading-medium">Gallwch gysylltu â swyddog diogelu data MoJ drwy:</h2>
                <ul class="list list-bullet">
                    <li>ysgrifennu atom yn: Post point 10.38, 102 Petty France, Llundain SW1H 9AJ</li>
                    <li>anfon neges e-bost i: <a href="mailto:data.compliance@justice.gov.uk">data.compliance@justice.gov.uk</a></li>
                </ul>

                <h2 class="heading-medium">Sut i wneud cwyn</h2>
                <p>Gweler ein <a href="https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure.cy">trefn gwyno</a>. os ydych eisiau cwyno am sut rydym wedi trin eich data personol.</p>

                <p>Ysgrifennwch i: Post point 10.38, 102 Petty France, Llundain SW1H 9AJ</p>
                <p>Anfonwch e-bost i:: <a href="mailto:data.compliance@justice.gov.uk">data.compliance@justice.gov.uk</a></p>

                <p>Gallwch hefyd gyflwyno cwyn i <a href="https://ico.org.uk/global/contact-us">Swyddfa’r Comisiynydd Gwybodaeth</a> os ydych yn anfodlon â’n hymateb neu'n credu nad ydym yn prosesu eich data personol yn gyfreithlon.</p>

                <h2 id="otherservices" class="heading-medium">Y gwasanaeth yr ydych yn ei ddefnyddio</h2>
                <p>Mae'r mathau o ddata personol a gesglir, faint o amser y caiff ei storio, a phwy sy'n cael ei rannu yn dibynnu ar y gwasanaeth rydych yn ei ddefnyddio. I gael rhagor o wybodaeth, dilynwch y dolenni isod:</p>
                <ul>
                    <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-4">Defnyddio’r gwasanaeth apelio yn erbyn penderfyniad ynghylch budd-daliadau</a>  </li>

                    <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-3">Defnyddio’r gwasanaeth gwneud cais am ysgariad</a> </li>

                    <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-5">Defnyddio’r gwasanaeth gwneud cais am brofiant</a> </li>

                    <li><a onclick="window.location.reload().scrollTop(0);" href="#tabs-2">Defnyddio’r gwasanaeth hawlio arian</a> </li>
                </ul>
            </div>

            <div id="tabs-3" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                <h2 class="heading-large" id="divorce">Defnyddio’r gwasanaeth gwneud cais am ysgariad</h2>
                <h2 class="heading-medium">Y data personol sydd ei angen arnom</h2>
                <p>Pan fyddwch yn defnyddio'r gwasanaeth gwneud cais am ysgariad, mae angen y data personol canlynol arnom:</p>
                <ul class="list list-bullet">
                    <li>eich enw cyfredol</li>
                    <li>eich enw ar y dystysgrif briodas</li>
                    <li>copi o’ch tystysgrif briodas</li>
                    <li>dyddiad eich priodas</li>
                    <li>y wlad y gwnaethoch briodi ynddi</li>
                    <li>gwybodaeth am lle’r ydych wedi byw</li>
                    <li>eich preswylfa arferol (os ydych yn treulio’r rhan fwyaf o’ch amser yng Nghymru neu Loegr)</li>
                    <li>eich domisil (fel arfer, yw’r lle y cawsoch eich geni, y lle yr ydych yn meddwl amdano fel eich cartref parhaol a’r lle mae eich teulu a’ch ffrindiau agosaf yn byw)</li>
                    <li>eich cyfeiriad e-bost neu rif ffôn symudol</li>
                    <li>eich cyfeiriad</li>
                    <li>y rhesymau pam eich bod wedi ysgaru</li>
                    <li>i wybod os ydych wedi bod ynghlwm ag achosion llys eraill</li>
                    <li>enw cyfredol eich gŵr neu’ch gwraig</li>
                    <li>ei (h)enw ar y dystysgrif briodas</li>
                    <li>enw a chyfeiriad yr unigolyn y bu iddo/iddi odinebu â’ch gŵr neu’ch gwraig (dewisol, ac ni ofynnir hyn dim ond pan ddywedir mai godineb yw’r rheswm dros ysgaru)</li>
                    <li>enw a chyfeiriad eich cyfreithiwr (os oes gennych un)</li>
                </ul>

                <h2 class="heading-medium">Hysbysiadau</h2>
                <p>Mae angen ichi gofrestru i gael hysbysiadau i ddefnyddio’r gwasanaeth ysgaru. Mae hwn yn ofyniad cyfreithiol er mwyn i’r cais am ysgariad fynd yn ei flaen.</p>


                <h2 class="heading-medium">Storio eich data</h2>
                <p>Pan fyddwch yn defnyddio'r gwasanaeth hwn fe ofynnir ichi ddefnyddio’ch cyfeiriad e-bost i greu cyfrif. Byddwch yn gallu defnyddio’r cyfeiriad e-bost a’r cyfrinair hwn i fewngofnodi i wasanaethau eraill GLlTEM.</p>

                <p>Tra byddwch yn llenwi cais am ysgariad neu’n ymateb i gais, byddwn yn cadw eich data am hyd at 6 mis. Os na fyddwch yn cwblhau’r cais yn ystod yr amser hwn, bydd rhaid ichi ddechrau eto.</p>

                <p>Pan gwblheir ysgariad cedwir manylion yr achos am 18 mlynedd. Ar ôl y cyfnod hwnnw, dilëir peth data (o’r dyfarniad nisi a’r dyfarniad absoliwt). </p>

                <p>Cedwir gweddill gwybodaeth yr achos am 82 blynedd arall. Ar ôl cyfanswm o 100 mlynedd dilëir y data hwn.</p>

                <h2 class="heading-medium">Rhannu eich data</h2>
                <p>Pan fydd eich hawliad neu’ch cais yn cael ei brosesu, mae’n bosib y byddwn angen cysylltu ag adran, asiantaeth neu sefydliad arall yn y llywodraeth ac efallai y byddwn yn rhannu eich data gyda nhw.</p>

                <p>Bydd unrhyw ddata a ddarperir gennych sydd angen ei argraffu yn cael ei rannu gyda Xerox (UK) Ltd. Er enghraifft, bydd y cais am ysgariad yn cael ei argraffu fel y gellir ei anfon at yr Atebydd drwy’r post.</p>

                <p>Bydd unrhyw ddata sy'n cael ei bostio i gefnogi cais am ysgariad yn cael ei rannu gydag Exela Technologies Limited. Er enghraifft, caiff tystysgrif priodas sydd wedi'i phostio ei derbyn gan Exela a'i hanfon i'r llys fel llun wedi'i sganio.</p>

                <p>Os byddwch yn cysylltu â ni ac yn gofyn am help gyda'r gwasanaeth rydych yn ei ddefnyddio, efallai y byddwn yn rhannu eich data personol gyda’r Good Things Foundation. Rydym yn gweithio mewn partneriaeth â'r cwmni hwn i gynnig cefnogaeth wyneb yn wyneb.</p>

                <p>Mewn rhai amgylchiadau efallai y byddwn yn rhannu eich data, er enghraifft er mwyn atal neu ganfod trosedd, neu i gynhyrchu ystadegau cyffredinol am unigolion sy’n defnyddio'r gwasanaeth.</p>
            </div>
            <div id="tabs-2" aria-labelledby="ui-id-5" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" style="display: block;" aria-hidden="false">
                <h2 class="heading-large">Defnyddio’r gwasanaeth hawlio arian</h2>
                <h2 class="heading-medium">Y data personol sydd ei angen arnom</h2>

                <p>Os ydych yn defnyddio’r gwasanaeth hawlio arian byddwn yn gofyn ichi am:</p>
                <ul class="list list-bullet">
                    <li>eich enw</li>
                    <li>eich busnes neu’ch sefydliad os ydych yn gweithredu ar eu rhan</li>
                    <li>eich dyddiad geni</li>
                    <li>eich cyfeiriad e-bost neu rif ffôn symudol</li>
                    <li>eich cyfeiriad</li>
                    <li>enw’r unigolyn, y busnes neu’r sefydliad yr ydych yn cyflwyno hawliad yn ei erbyn</li>
                    <li>cyfeiriad e-bost yr unigolyn, y busnes neu’r sefydliad</li>
                    <li>cyfeiriad yr unigolyn, y busnes neu’r sefydliad</li>
                    <li>y rhesymau yr ydych yn gwneud yr hawliad</li>
                    <li>yr amserlen o ddigwyddiadau sy'n arwain at yr anghydfod</li>
                    <li>rhestr o unrhyw dystiolaeth sydd gennych i gefnogi'ch cais</li>
                </ul>
                <p>Os ydych yn ymateb i hawliad am arian, gwiriwch eich gwybodaeth bersonol a ddarparwyd gan yr hawlydd, yn cynnwys eich enw, eich cyfeiriad a'ch manylion cyswllt.</p>
                <p>Efallai y byddwn yn gofyn ichi ddarparu:</p>
                <ul class="list list-bullet">
                    <li>eich dyddiad geni</li>
                    <li>eich busnes neu’ch sefydliad os ydych yn gweithredu ar eu rhan</li>
                    <li>eich ymateb i’r hawliad a wnaed yn eich erbyn</li>
                    <li>yr amserlen o ddigwyddiadau sy'n arwain at yr anghydfod</li>
                    <li>rhestr o unrhyw dystiolaeth sydd gennych i gefnogi'ch cais</li>
                </ul>

                <h2 class="heading-medium">Storio eich data</h2>
                <p>Pan fyddwch yn defnyddio'r gwasanaeth hwn fe ofynnir ichi ddefnyddio’ch cyfeiriad e-bost i greu cyfrif. Gallwch ddefnyddio’r cyfeiriad e-bost hwn a chyfrinair i fewngofnodi i wasanaethau eraill GLlTEM.</p>

                <h2 class="heading-small">Cyn ichi gyflwyno eich gwybodaeth</h2>
                <p>Caiff yr wybodaeth rydych yn ei rhoi yn y gwasanaeth hawlio arian ei chadw hyd nes y byddwch yn penderfynu cyflwyno’ch cais. Bydd hyn yn eich galluogi i arbed beth ydych yn ei wneud a pharhau â'ch cais yn hwyrach ymlaen. Bydd gwybodaeth sydd wedi cael ei storio nad ydych yn ei chyflwyno yn cael ei dileu ar ôl 90 diwrnod.</p>

                <h2 class="heading-small">Ar ôl ichi gyflwyno eich cais</h2>

                <p>Bydd yr wybodaeth rydych yn ei chyflwyno ar gyfer hawlio arian yn cael ei dileu 2 flynedd ar ôl i'r llys wneud penderfyniad ar ganlyniad eich hawliad (gelwir hyn yn ddyfarniad).</p>

                <p>Os nad yw'r llys yn gwneud penderfyniad am eich hawliad (er enghraifft, eich bod yn setlo'r hawliad y tu allan i'r llys ac nad oes angen dyfarniad bellach) yna caiff yr wybodaeth a gyflwynir gennych ei dileu 3 blynedd ar ôl y diweddariad diwethaf a wnaed i'r hawliad.</p>


                <h2 class="heading-medium">Rhannu eich data</h2>
                <p>Bydd yr wybodaeth y byddwch yn ei chyflwyno yn cael ei rhannu â phawb sydd wedi'u henwi ar y cais. Mae hyn yn eithrio unrhyw fanylion talu rydych yn eu defnyddio i dalu ffioedd llys.</p>

                <p>Os gwneir dyfarniad mewn achos, rhennir rhywfaint o wybodaeth â Registry Trust Limited sy'n darparu gwybodaeth ariannol am ddyfarniadau llys i fanciau ac asiantaethau credyd.</p>
            </div>

            <div id="tabs-4" aria-labelledby="ui-id-2" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                <h2 class="heading-large" id="probate">Defnyddio’r gwasanaeth apelio yn erbyn penderfyniad ynghylch budd-daliadau</h2>
                <h2 class="heading-medium">Y data personol sydd ei angen arnom</h2>
                <p>Pan fyddwch yn defnyddio’r gwasanaeth apelio yn erbyn penderfyniad ynghylch budd-daliadau, byddwn yn gofyn am:</p>
                <ul class="list list-bullet">
                    <li>eich enw</li>
                    <li>eich dyddiad geni</li>
                    <li>eich cyfeiriad e-bost neu rif ffôn symudol</li>
                    <li>eich Rhif Yswiriant Gwladol</li>
                    <li>gwybodaeth o’r Hysbysiad Gorfodi i Ailystyried</li>
                    <li>gwybodaeth am unrhyw gymorth sydd ei angen arnoch ar gyfer y gwrandawiad, os byddwch yn mynychu un</li>
                    <li>gwybodaeth ynglŷn â phryd yr ydych ar gael ar gyfer gwrandawiad, os ydych yn mynychu un</li>
                </ul>
                <p>Os oes gennych gynrychiolydd, byddwn yn gofyn am:</p>
                <ul class="list list-bullet">
                    <li>Ei enw</li>
                    <li>ei fanylion cyswllt</li>
                </ul>
                <p>Os ydych chi’n benodai, bydd angen ichi ddarparu gwybodaeth am yr unigolyn rydych yn apelio ar ei ran, gan gynnwys:</p>
                <ul class="list list-bullet">
                    <li>Ei enw</li>
                    <li>ei rif Yswiriant Gwladol</li>
                </ul>

                <h2 class="heading-medium">Hysbysiadau</h2>
                <p>Fel rhan o'ch apêl byddwn yn gofyn a ydych eisiau inni anfon negeseuon testun a hysbysiadau e-bost atoch i roi'r wybodaeth ddiweddaraf i chi am eich apêl.</p>

                <p>Gallwch ganslo negeseuon testun trwy ddilyn y camau a grybwyllir yn y neges destun, a gallwch ganslo negeseuon e-bost trwy ddilyn y camau a grybwyllir yn y negeseuon e-bost.</p>

                <p>Os ydych wedi gofyn i'ch cynrychiolydd enwebedig dderbyn diweddariadau ar eich apêl, yna byddwn yn rhannu eich data gyda nhw. Os ydych am i'ch cynrychiolydd roi'r gorau i dderbyn hysbysiadau yna mae angen i chi <a href="/contact-us">Gysylltu â ni.</a></p>

                <h2 class="heading-medium">Storio a rhannu eich data</h2>

                <p>Bydd eich data yn cael ei rannu gydag adran o'r llywodraeth a wnaeth y penderfyniad rydych chi’n apelio yn ei erbyn. Er enghraifft, Yr Adran Waith a Phensiynau neu Gyllid a Thollau Ei Mawrhydi Mae hyn fel bod yr adran yn gallu ymateb i’ch apêl.</p>

                <p>Ar ôl ichi orffen llenwi eich cais, bydd yn cael ei storio am 2 flynedd. Bydd yn cael ei ddileu ar ôl hynny.</p>
            </div>

            <div id="tabs-5" aria-labelledby="ui-id-4" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">

                <h2 class="heading-large">Defnyddio’r gwasanaeth gwneud cais am brofiant</h2>
                <h2 class="heading-medium">Y data personol sydd ei angen arnom</h2>

                <p>Pan fyddwch yn defnyddio’r gwasanaeth gwneud cais am brofiant, byddwn yn gofyn am:</p>
                <ul class="list list-bullet">
                    <li>eich enw, ac unrhyw enwau eraill yr ydych yn cael eich adnabod wrthynt </li>
                    <li>eich cyfeiriad e-bost neu rif ffôn symudol</li>
                    <li>eich cyfeiriad</li>
                    <li>enwau unrhyw ysgutorion yn yr ewyllys</li>
                    <li>manylion cyswllt yr holl ysgutorion sy’n gwneud cais am brofiant</li>
                </ul>

                <h2 class="heading-medium">Storio eich data</h2>

                <p>Pan fyddwch yn defnyddio'r gwasanaeth hwn fe ofynnir ichi ddefnyddio’ch cyfeiriad e-bost i greu cyfrif. Gallwch ddefnyddio’r cyfeiriad e-bost hwn a chyfrinair i fewngofnodi i wasanaethau eraill GLlTEM.</p>

                <h2 class="heading-medium">Cyn ichi gyflwyno eich gwybodaeth</h2>

                <p>Caiff yr wybodaeth rydych yn ei rhoi yn eich cais am brofiant ei storio hyd nes y byddwch yn penderfynu cyflwyno’ch cais. Bydd hyn yn eich galluogi i arbed beth ydych yn ei wneud a pharhau â'ch cais yn hwyrach ymlaen. Bydd gwybodaeth sydd wedi cael ei storio nad ydych yn ei chyflwyno yn cael ei dileu ar ôl 90 diwrnod.</p>

                <h2 class="heading-medium">Ar ôl ichi gyflwyno eich cais</h2>

                <p>Mae grantiau profiant yn cael eu storio fel cofnod cyhoeddus. Fodd bynnag, ni fydd eich cyfeiriad e-bost a'ch rhif ffôn ar gael i'r cyhoedd.</p>
            </div>
            <div id="tabs-6" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true">
                <h2 class="heading-large">Defnyddio’r gwasanaeth cyfraith gyhoeddus - teulu</h2>
                <h2 class="heading-medium">Beth yw'r data personol a gasglwn</h2>
                <p>Pan fyddwch yn defnyddio'r gwasanaeth cyfraith gyhoeddus - teulu, byddwn yn casglu'r data personol canlynol:</p>
                <ul class="list list-bullet">
                    <li>enw, cyfeiriad, swydd a manylion cyswllt y ceisydd</li>
                    <li>enw, cyfeiriad a manylion cyswllt cyfreithiwr yr Awdurdod Lleol</li>
                    <li>enw, cyfeiriad a manylion cyswllt y gweithiwr cymdeithasol</li>
                    <li>enw, dyddiad geni, rhyw, a chyfeiriad y plant sydd ynghlwm â’r achos</li>
                    <li>enw, dyddiad geni, rhyw, cyfeiriad a manylion cyswllt yr atebwyr sydd ynghlwm â’r achos</li>
                    <li>enw, cyfeiriad a manylion cyswllt y partïon eraill sydd ynghlwm â’r achos, er enghraifft tystion</li>
                    <li>manylion unrhyw anabledd neu allu ymgyfreitha (gallu i ddeall achosion) unrhyw blentyn, atebydd neu barti arall yn yr achos</li>
                    <li>manylion achosion llys eraill y bu a wnelo’r atebwyr neu’r plant â hwy</li>
                    <li>tystiolaeth yn cefnogi’r achos</li>
                </ul>
                <p>Rydym hefyd yn casglu</p>
                <ul class="list list-bullet">
                    <li>gwybodaeth sy’n dweud wrthym os byddwch yn agor neges e-bost gennym neu’n clicio ar ddolen mewn e-bost</li>
                    <li>gwybodaeth am sut rydych chi'n defnyddio'r gwasanaeth hwn, fel eich cyfeiriad IP a'r porwr gwe rydych chi'n ei ddefnyddio. Rydym yn gwneud hyn drwy <a href="/cookies">ddefnyddio cwcis</a></li>
                </ul>
                <h2 class="heading-medium">Beth rydym yn ei wneud gyda’ch data</h2>
                <p>Rydym ni’n casglu data personol er mwyn:</p>
                <ul class="list list-bullet">
                    <li>prosesu’r cais</li>
                    <li>bodloni gofynion cyfreithiol</li>
                    <li>gwella’r gwasanaeth hwn</li>
                </ul>
                <p>Caiff data personol ei brosesu gan ein staff yn y DU a chaiff y data ei storio yn y DU.</p>
                <p>Caiff data sy'n ymwneud ag achos ei storio nes bod y plentyn ieuengaf yn cyrraedd 18 oed, oni bai bod yr achos yn arwain at fabwysiadu lle bydd y data'n cael ei storio am 100 mlynedd.</p>
                <p>Rydym yn defnyddio GOV.UK Notify i anfon negeseuon e-bost. Prosesir y rhain o fewn yr EEA tan y pwynt lle mae negeseuon e-bost yn cael eu trosglwyddo i'ch darparwr e-bost.</p>
                <h2 class="heading-medium">Eich hawliau</h2>
                <p>Gallwch ofyn:</p>
                <ul class="list list-bullet">
                    <li>i gael gweld y data personol rydym yn ei gadw amdanoch</li>
                    <li>i'r data personol gael ei gywiro</li>
                    <li>i'r data personol gael ei symud neu ei ddileu (bydd hyn yn ddibynnol ar yr amgylchiadau, er enghraifft os ydych chi’n penderfynu peidio â pharhau gyda’ch hawliad neu’ch cais)</li>
                    <li>i gyfyngu ar y mynediad at y data personol (er enghraifft, gallwch ofyn i'ch data gael ei storio am gyfnod hirach a pheidio â chael ei ddileu'n awtomatig)</li>
                </ul>
                <p>Anfonwch e-bost i: <a href="mailto:data.access@justice.gov.uk">data.access@justice.gov.uk</a> os ydych eisiau gweld yr wybodaeth hon.</p>
                <h2 class="heading-medium">Rhannu eich data</h2>
                <p>Rydym yn rhoi caniatâd i Google ddefnyddio neu rannu data dadansoddi ein gwefan, gweler ein telerau ac amodau am ragor o wybodaeth <a href="/terms-and-conditions">telerau ac amodau</a>.	</p>
                <h2 class="heading-medium">Hysbysiadau</h2>
                <p>Fel rhan o'ch cais, byddwn yn anfon hysbysiadau atoch i roi gwybod ichi sut mae'ch cais yn datblygu.</p>
                <p>Anfonwch e-bost i: <a href="mailto:dcd-familypubliclawservicedesk@hmcts.net">dcd-familypubliclawservicedesk@hmcts.net</a> os oes arnoch eisiau stopio cael hysbysiadau e-bost.</p>
                <h2 class="heading-medium">Sut i wneud cwyn</h2>
                <p>Os ydych eisiau cwyno am y ffordd rydym ni wedi trin eich data personol, anfonwch e-bost i <a href="mailto:data.compliance@justice.gov.uk">data.compliance@justice.gov.uk</a>.</p>
                <p>Gallwch hefyd gyflwyno cwyn i <a href="https://ico.org.uk/global/contact-us">Swyddfa’r Comisiynydd Gwybodaeth</a> os ydych yn anfodlon â’n hymateb neu'n credu nad ydym yn prosesu eich data personol yn gyfreithlon.</p>
            </div>
        </div>
    </div>
    <style>
        .ui-state-active a {
            text-decoration: none;
            color: #0b0c0c;
            cursor: default;
        }
    </style>
</article>