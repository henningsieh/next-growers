import { Container, Space, Text, Title } from "@mantine/core";

import Link from "next/link";

function Privacy() {
  return (
    <Container size="md" pt="xl">
      <Title order={1}>Datenschutzerklärung</Title>

      <Space h="xl" />
      <Title order={2}>1. Datenschutz auf einen Blick</Title>

      <Space h="xl" />
      <Title order={3}>Allgemeine Hinweise</Title>
      <Text>
        Die folgenden Hinweise geben einen einfachen Überblick darüber,
        was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
        Website besuchen. Personenbezogene Daten sind alle Daten, mit
        denen Sie persönlich identifiziert werden können. Ausführliche
        Informationen zum Thema Datenschutz entnehmen Sie unserer unter
        diesem Text aufgeführten Datenschutzerklärung.
      </Text>

      <Space h="xl" />
      <Title order={3}>Datenerfassung auf dieser Website</Title>
      <Title order={4}>
        Wer ist verantwortlich für die Datenerfassung auf dieser
        Website?
      </Title>
      <Text>
        Die Datenverarbeitung auf dieser Website erfolgt durch den
        Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
        „Hinweis zur Verantwortlichen Stelle“ in dieser
        Datenschutzerklärung entnehmen.
      </Text>

      <Space h="xl" />
      <Title order={4}>Wie erfassen wir Ihre Daten?</Title>
      <Text>
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
        mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie
        in ein Kontaktformular eingeben.
      </Text>
      <Text>
        Andere Daten werden automatisch oder nach Ihrer Einwilligung
        beim Besuch der Website durch unsere IT-Systeme erfasst. Das
        sind vor allem technische Daten (z. B. Internetbrowser,
        Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung
        dieser Daten erfolgt automatisch, sobald Sie diese Website
        betreten.
      </Text>

      <Space h="xl" />
      <Title order={4}>Wofür nutzen wir Ihre Daten?</Title>
      <Text>
        Ein Teil der Daten wird erhoben, um eine fehlerfreie
        Bereitstellung der Website zu gewährleisten. Andere Daten können
        zur Analyse Ihres Nutzerverhaltens verwendet werden.
      </Text>

      <Space h="xl" />
      <Title order={4}>
        Welche Rechte haben Sie bezüglich Ihrer Daten?
      </Title>
      <Text>
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über
        Herkunft, Empfänger und Zweck Ihrer gespeicherten
        personenbezogenen Daten zu erhalten. Sie haben außerdem ein
        Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
        Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
        können Sie diese Einwilligung jederzeit für die Zukunft
        widerrufen. Außerdem haben Sie das Recht, unter bestimmten
        Umständen die Einschränkung der Verarbeitung Ihrer
        personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen
        ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
      </Text>
      <Text>
        Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie
        sich jederzeit an uns wenden.
      </Text>

      <Space h="xl" />
      <Title order={3}>
        Analyse-Tools und Tools von Drittanbietern
      </Title>
      <Text>
        Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch
        ausgewertet werden. Das geschieht vor allem mit sogenannten
        Analyseprogrammen.
      </Text>
      <Text>
        Detaillierte Informationen zu diesen Analyseprogrammen finden
        Sie in der folgenden Datenschutzerklärung.
      </Text>

      <Space h="xl" />
      <Title order={2}>2. Hosting</Title>
      <Text>
        Wir hosten die Inhalte unserer Website bei folgenden Anbietern:
      </Text>
      {/* 
      <Space h="xl" />
      <Title order={3}>Hetzner</Title>
      <Text>
        Anbieter ist die Hetzner Online GmbH, Industriestr. 25, 91710
        Gunzenhausen (nachfolgend Hetzner).
      </Text>
      <Text>
        Details entnehmen Sie der Datenschutzerklärung von Hetzner:{" "}
        <a
          href="https://www.hetzner.com/de/rechtliches/datenschutz"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.hetzner.com/de/rechtliches/datenschutz
        </a>
        .
      </Text>
      <Text>
        Die Verwendung von Hetzner erfolgt auf Grundlage von Art. 6 Abs.
        1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer
        möglichst zuverlässigen Darstellung unserer Website. Sofern eine
        entsprechende Einwilligung abgefragt wurde, erfolgt die
        Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit.
        a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die
        Speicherung von Cookies oder den Zugriff auf Informationen im
        Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des
        TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
      </Text> */}

      <Space h="xl" />
      <Title order={3}>Externes Hosting</Title>
      <Text>
        Diese Website wird extern gehostet. Die personenbezogenen Daten,
        die auf dieser Website erfasst werden, werden auf den Servern
        des Hosters / der Hoster gespeichert. Hierbei kann es sich v. a.
        um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
        Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige
        Daten, die über eine Website generiert werden, handeln.
      </Text>
      <Text>
        Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung
        gegenüber unseren potenziellen und bestehenden Kunden (Art. 6
        Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen
        und effizienten Bereitstellung unseres Online-Angebots durch
        einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
        Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt
        die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1
        lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die
        Speicherung von Cookies oder den Zugriff auf Informationen im
        Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des
        TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
      </Text>
      <Text>
        Unser(e) Hoster wird bzw. werden Ihre Daten nur insoweit
        verarbeiten, wie dies zur Erfüllung seiner Leistungspflichten
        erforderlich ist und unsere Weisungen in Bezug auf diese Daten
        befolgen.
      </Text>

      <Space h="xl" />
      <Title order={3}>Wir setzen folgende(n) Hoster ein:</Title>
      <Text>
        Vercel Inc.
        <br />
        440 N Barranca Avenue #4133
        <br />
        Covina, CA 91723
        <br />
        United States
      </Text>
      <Space h="xl" />
      <Text>
        Cloudinary
        <br />
        3400 Central Expressway, Suite 110
        <br />
        Santa Clara, CA 95051
        <br />
        United States
      </Text>
      <Space h="xl" />
      <Text>
        Hetzner Online GmbH
        <br />
        Industriestr. 25
        <br />
        91710 Gunzenhausen
        <br />
        Deutschland
      </Text>

      <Space h="xl" />
      <Title order={2}>
        3. Allgemeine Hinweise und Pflichtinformationen
      </Title>

      <Space h="xl" />
      <Title order={3}>Datenschutz</Title>
      <Text>
        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
        Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
        vertraulich und entsprechend den gesetzlichen
        Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </Text>
      <Text>
        Wenn Sie diese Website benutzen, werden verschiedene
        personenbezogene Daten erhoben. Personenbezogene Daten sind
        Daten, mit denen Sie persönlich identifiziert werden können. Die
        vorliegende Datenschutzerklärung erläutert, welche Daten wir
        erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu
        welchem Zweck das geschieht.
      </Text>
      <Text>
        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.
        B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen
        kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch
        Dritte ist nicht möglich.
      </Text>

      <Space h="xl" />
      <Title order={3}>Hinweis zur verantwortlichen Stelle</Title>
      <Text>
        Die verantwortliche Stelle für die Datenverarbeitung auf dieser
        Website ist:
      </Text>
      <Space h="md" />
      <Text>
        {"Benjamin Klein - "}
        <Link target="_blank" href={"https://webkult.de/"}>
          webkult.de
        </Link>
        <br />
        Kleine Dorfstraße 5
        <br />
        38312 Börßum
      </Text>
      <Text>
        {/* Telefon: +4961814985597
        <br /> */}
        E-Mail: privacy@growagram.com
      </Text>
      <Space h="md" />
      <Text>
        Verantwortliche Stelle ist die natürliche oder juristische
        Person, die allein oder gemeinsam mit anderen über die Zwecke
        und Mittel der Verarbeitung von personenbezogenen Daten (z. B.
        Namen, E-Mail-Adressen o. Ä.) entscheidet.
      </Text>

      <Space h="xl" />
      <Title order={3}>Speicherdauer</Title>
      <Text>
        Soweit innerhalb dieser Datenschutzerklärung keine speziellere
        Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
        Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
        Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine
        Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
        gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe
        für die Speicherung Ihrer personenbezogenen Daten haben (z. B.
        steuer- oder handelsrechtliche Aufbewahrungsfristen); im
        letztgenannten Fall erfolgt die Löschung nach Fortfall dieser
        Gründe.
      </Text>

      <Space h="xl" />
      <Title order={3}>
        Allgemeine Hinweise zu den Rechtsgrundlagen der
        Datenverarbeitung auf dieser Website
      </Title>
      <Text>
        Sofern Sie in die Datenverarbeitung eingewilligt haben,
        verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von
        Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO,
        sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO
        verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung
        in die Übertragung personenbezogener Daten in Drittstaaten
        erfolgt die Datenverarbeitung zudem auf Grundlage von Art. 49
        Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies
        oder in den Zugriff auf Informationen in Ihr Endgerät (z. B. via
        Device-Fingerprinting) eingewilligt haben, erfolgt die
        Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1
        TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre
        Daten zur Vertragserfüllung oder zur Durchführung
        vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre
        Daten auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren
        verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer
        rechtlichen Verpflichtung erforderlich sind auf Grundlage von
        Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner
        auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1
        lit. f DSGVO erfolgen. Über die jeweils im Einzelfall
        einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen
        dieser Datenschutzerklärung informiert.
      </Text>

      <Space h="xl" />
      <Title order={3}>
        Hinweis zur Datenweitergabe in datenschutzrechtlich nicht
        sichere Drittstaaten sowie die Weitergabe an US-Unternehmen, die
        nicht DPF-zertifiziert sind
      </Title>
      <Text>
        Wir verwenden unter anderem Tools von Unternehmen mit Sitz in
        datenschutzrechtlich nicht sicheren Drittstaaten sowie US-Tools,
        deren Anbieter nicht nach dem EU-US-Data Privacy Framework (DPF)
        zertifiziert sind. Wenn diese Tools aktiv sind, können Ihre
        personenbezogene Daten in diese Staaten übertragen und dort
        verarbeitet werden. Wir weisen darauf hin, dass in
        datenschutzrechtlich unsicheren Drittstaaten kein mit der EU
        vergleichbares Datenschutzniveau garantiert werden kann.
      </Text>
      <Text>
        Wir weisen darauf hin, dass die USA als sicherer Drittstaat
        grundsätzlich ein mit der EU vergleichbares Datenschutzniveau
        aufweisen. Eine Datenübertragung in die USA ist danach zulässig,
        wenn der Empfänger eine Zertifizierung unter dem &quot;EU-US
        Data Privacy Framework&quot; (DPF) besitzt oder über geeignete
        zusätzliche Garantien verfügt. Informationen zu Übermittlungen
        an Drittstaaten einschließlich der Datenempfänger finden Sie in
        dieser Datenschutzerklärung.
      </Text>

      <Space h="xl" />
      <Title order={3}>Empfänger von personenbezogenen Daten</Title>
      <Text>
        Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit
        verschiedenen externen Stellen zusammen. Dabei ist teilweise
        auch eine Übermittlung von personenbezogenen Daten an diese
        externen Stellen erforderlich. Wir geben personenbezogene Daten
        nur dann an externe Stellen weiter, wenn dies im Rahmen einer
        Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu
        verpflichtet sind (z. B. Weitergabe von Daten an
        Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6
        Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine
        sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim
        Einsatz von Auftragsverarbeitern geben wir personenbezogene
        Daten unserer Kunden nur auf Grundlage eines gültigen Vertrags
        über Auftragsverarbeitung weiter. Im Falle einer gemeinsamen
        Verarbeitung wird ein Vertrag über gemeinsame Verarbeitung
        geschlossen.
      </Text>

      <Space h="xl" />
      <Title order={3}>
        Widerruf Ihrer Einwilligung zur Datenverarbeitung
      </Title>
      <Text>
        Viele Datenverarbeitungsvorgänge sind nur mit Ihrer
        ausdrücklichen Einwilligung möglich. Sie können eine bereits
        erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit
        der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
        Widerruf unberührt.
      </Text>

      <Space h="xl" />
      <Title order={3}>
        Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen
        sowie gegen Direktwerbung (Art. 21 DSGVO)
      </Title>
      <Text>
        WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT.
        E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS
        GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN
        DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH
        EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN
        GESTÜTZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN
        EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER
        DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR
        IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN,
        ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE
        VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND
        FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER
        GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN
        (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
      </Text>
      <Text>
        WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM
        DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT
        WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER
        PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG
        EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT
        SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE
        WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND
        NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH
        NACH ART. 21 ABS. 2 DSGVO).
      </Text>

      <Space h="xl" />
      <Title order={3}>
        Beschwerderecht bei der zuständigen Aufsichtsbehörde
      </Title>
      <Text>
        Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein
        Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem
        Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres
        Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das
        Beschwerderecht besteht unbeschadet anderweitiger
        verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
      </Text>

      <Space h="xl" />
      <Title order={3}>Recht auf Datenübertragbarkeit</Title>
      <Text>
        Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
        Einwilligung oder in Erfüllung eines Vertrags automatisiert
        verarbeiten, an sich oder an einen Dritten in einem gängigen,
        maschinenlesbaren Format auszuhändigen zu lassen. Sofern Sie die
        direkte Übertragung der Daten an einen anderen Verantwortlichen
        verlangen, erfolgt dies nur, soweit es technisch machbar ist.
      </Text>

      <Space h="xl" />
      <Title order={3}>Auskunft, Berichtigung und Löschung</Title>
      <Text>
        Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
        jederzeit das Recht auf unentgeltliche Auskunft über Ihre
        gespeicherten personenbezogenen Daten, deren Herkunft und
        Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht
        auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu
        weiteren Fragen zum Thema personenbezogene Daten können Sie sich
        jederzeit an uns wenden.
      </Text>

      <Space h="xl" />
      <Title order={3}>Recht auf Einschränkung der Verarbeitung</Title>
      <Text>
        Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer
        personenbezogenen Daten zu verlangen. Hierzu können Sie sich
        jederzeit an uns wenden. Das Recht auf Einschränkung der
        Verarbeitung besteht in folgenden Fällen:
      </Text>
      <ul>
        <li>
          Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten
          personenbezogenen Daten bestreiten, benötigen wir in der Regel
          Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben
          Sie das Recht, die Einschränkung der Verarbeitung Ihrer
          personenbezogenen Daten zu verlangen.
        </li>
        <li>
          Wenn die Verarbeitung Ihrer personenbezogenen Daten
          unrechtmäßig geschah/geschieht, können Sie statt der Löschung
          die Einschränkung der Datenverarbeitung verlangen.
        </li>
        <li>
          Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen,
          Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung
          von Rechtsansprüchen benötigen, haben Sie das Recht, statt der
          Löschung die Einschränkung der Verarbeitung Ihrer
          personenbezogenen Daten zu verlangen.
        </li>
        <li>
          Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt
          haben, muss eine Abwägung zwischen Ihren und unseren
          Interessen vorgenommen werden. Solange noch nicht feststeht,
          wessen Interessen überwiegen, haben Sie das Recht, die
          Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
          zu verlangen.
        </li>
      </ul>
      <Text>
        Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten
        eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung
        abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung,
        Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz
        der Rechte einer anderen natürlichen oder juristischen Person
        oder aus Gründen eines wichtigen öffentlichen Interesses der
        Europäischen Union oder eines Mitgliedstaats verarbeitet werden.
      </Text>

      <Space h="xl" />
      <Title order={3}>SSL- bzw. TLS-Verschlüsselung</Title>
      <Text>
        Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
        Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen
        oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine
        SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
        erkennen Sie daran, dass die Adresszeile des Browsers von
        &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem
        Schloss-Symbol in Ihrer Browserzeile.
      </Text>
      <Text>
        Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die
        Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen
        werden.
      </Text>

      <Space h="xl" />
      <Title order={3}>Widerspruch gegen Werbe-E-Mails</Title>
      <Text>
        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
        Kontaktdaten zur Übersendung von nicht ausdrücklich
        angeforderter Werbung und Informationsmaterialien wird hiermit
        widersprochen. Die Betreiber der Seiten behalten sich
        ausdrücklich rechtliche Schritte im Falle der unverlangten
        Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
      </Text>

      <Space h="xl" />
      <Title order={2}>4. Datenerfassung auf dieser Website</Title>

      <Space h="xl" />
      <Title order={3}>Cookies</Title>
      <Text>
        Unsere Internetseiten verwenden so genannte „Cookies“. Cookies
        sind kleine Datenpakete und richten auf Ihrem Endgerät keinen
        Schaden an. Sie werden entweder vorübergehend für die Dauer
        einer Sitzung (Session-Cookies) oder dauerhaft (permanente
        Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden
        nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies
        bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst
        löschen oder eine automatische Löschung durch Ihren Webbrowser
        erfolgt.
      </Text>
      <Text>
        Cookies können von uns (First-Party-Cookies) oder von
        Drittunternehmen stammen (sog. Third-Party-Cookies).
        Third-Party-Cookies ermöglichen die Einbindung bestimmter
        Dienstleistungen von Drittunternehmen innerhalb von Webseiten
        (z. B. Cookies zur Abwicklung von Zahlungsdienstleistungen).
      </Text>
      <Text>
        Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind
        technisch notwendig, da bestimmte Webseitenfunktionen ohne diese
        nicht funktionieren würden (z. B. die Warenkorbfunktion oder die
        Anzeige von Videos). Andere Cookies können zur Auswertung des
        Nutzerverhaltens oder zu Werbezwecken verwendet werden.
      </Text>
      <Text>
        Cookies, die zur Durchführung des elektronischen
        Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen
        erwünschter Funktionen (z. B. für die Warenkorbfunktion) oder
        zur Optimierung der Website (z. B. Cookies zur Messung des
        Webpublikums) erforderlich sind (notwendige Cookies), werden auf
        Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern
        keine andere Rechtsgrundlage angegeben wird. Der
        Websitebetreiber hat ein berechtigtes Interesse an der
        Speicherung von notwendigen Cookies zur technisch fehlerfreien
        und optimierten Bereitstellung seiner Dienste. Sofern eine
        Einwilligung zur Speicherung von Cookies und vergleichbaren
        Wiedererkennungstechnologien abgefragt wurde, erfolgt die
        Verarbeitung ausschließlich auf Grundlage dieser Einwilligung
        (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG); die
        Einwilligung ist jederzeit widerrufbar.
      </Text>
      <Text>
        Sie können Ihren Browser so einstellen, dass Sie über das Setzen
        von Cookies informiert werden und Cookies nur im Einzelfall
        erlauben, die Annahme von Cookies für bestimmte Fälle oder
        generell ausschließen sowie das automatische Löschen der Cookies
        beim Schließen des Browsers aktivieren. Bei der Deaktivierung
        von Cookies kann die Funktionalität dieser Website eingeschränkt
        sein.
      </Text>
      <Text>
        Welche Cookies und Dienste auf dieser Website eingesetzt werden,
        können Sie dieser Datenschutzerklärung entnehmen.
      </Text>

      <Space h="xl" />
      <Title order={3}>Server-Log-Dateien</Title>
      <Text>
        Der Provider der Seiten erhebt und speichert automatisch
        Informationen in so genannten Server-Log-Dateien, die Ihr
        Browser automatisch an uns übermittelt. Dies sind:
      </Text>
      <ul>
        <li>Browsertyp und Browserversion</li>
        <li>verwendetes Betriebssystem</li>
        <li>Referrer URL</li>
        <li>Hostname des zugreifenden Rechners</li>
        <li>Uhrzeit der Serveranfrage</li>
        <li>IP-Adresse</li>
      </ul>
      <Text>
        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
        nicht vorgenommen.
      </Text>
      <Text>
        Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs.
        1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes
        Interesse an der technisch fehlerfreien Darstellung und der
        Optimierung seiner Website – hierzu müssen die Server-Log-Files
        erfasst werden.
      </Text>

      <Space h="xl" />
      <Title order={3}>Gravatar</Title>
      <Text>
        Wir haben Gravatar auf dieser Website eingebunden. Anbieter ist
        die Automattic Inc., 60 29th Street #343, San Francisco, CA
        94110, USA (nachfolgend Gravatar).
      </Text>
      <Text>
        Gravatar ist ein Tool, das es ermöglicht, persönliche Bilder
        (Avatare) für die Nutzer unserer Website bereitzustellen. Die
        Avatare dienen als visuelle Repräsentationen der Nutzer und
        werden überall dort angezeigt, wo ein Nutzer mit der Plattform
        interagiert (z. B. in Foren oder Chats). Wenn ein Nutzer mit der
        Plattform interagiert, wird sein Avatar basierend auf der mit
        seiner E-Mail-Adresse verknüpften Auswahl angezeigt. Dies
        verleiht der Online-Präsenz der Nutzer eine persönliche Note und
        erleichtert die Identifizierung, da das gewählte Bild den
        Nutzern zugeordnet wird, wenn sie online aktiv sind.
      </Text>
      <Text>
        Wenn Sie auf unserer Website kommentieren bzw. interagieren und
        dabei Gravatar aktiviert ist, wird der Hash der E-Mail-Adresse
        des Nutzers, der Gravatar nutzt (wird als ID genutzt) von
        Gravatar verarbeitet.
      </Text>
      <Text>
        Die Verwendung von Gravatar erfolgt auf Grundlage von Art. 6
        Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes
        Interesse an einer ansprechenden Darstellung seiner Foren.
        Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt
        die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1
        lit. a DSGVO und § 25 Abs. 1 TDDDG. Die Einwilligung ist
        jederzeit widerrufbar.
      </Text>
      <Text>
        Weitere Details entnehmen Sie der Datenschutzerklärung des
        Anbieters unter{" "}
        <Link
          href="https://automattic.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://automattic.com/privacy/
        </Link>
        .
      </Text>
      <Text>
        Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US
        Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen
        zwischen der Europäischen Union und den USA, der die Einhaltung
        europäischer Datenschutzstandards bei Datenverarbeitungen in den
        USA gewährleisten soll. Jedes nach dem DPF zertifizierte
        Unternehmen verpflichtet sich, diese Datenschutzstandards
        einzuhalten. Weitere Informationen hierzu erhalten Sie vom
        Anbieter unter folgendem Link:{" "}
        <Link
          href="https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt0000000CbqcAAC&status=Active"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt0000000CbqcAAC&status=Active
        </Link>
        .
      </Text>

      <Space h="xl" />
      <Title order={2}>5. Soziale Medien</Title>

      <Space h="xl" />
      <Title order={3}>X (ehemals Twitter)</Title>
      <Text>
        Auf dieser Website sind Funktionen des Dienstes X (ehemals
        Twitter) eingebunden. Diese Funktionen werden angeboten durch
        den Mutterkonzern X Corp., 1355 Market Street, Suite 900, San
        Francisco, CA 94103, USA. Für die Datenverarbeitung von
        außerhalb der USA lebenden Personen ist die Niederlassung
        Twitter International Unlimited Company, One Cumberland Place,
        Fenian Street, Dublin 2, D02 AX07, Irland, verantwortlich.
      </Text>
      <Text>
        Wenn das Social-Media-Element aktiv ist, wird eine direkte
        Verbindung zwischen Ihrem Endgerät und dem X-Server hergestellt.
        X (ehemals Twitter) erhält dadurch Informationen über den Besuch
        dieser Website durch Sie. Durch das Benutzen von X (ehemals
        Twitter) und der Funktion „Re-Tweet“ bzw. „Repost“ werden die
        von Ihnen besuchten Websites mit Ihrem X (ehemals
        Twitter)-Account verknüpft und anderen Nutzern bekannt gegeben.
        Wir weisen darauf hin, dass wir als Anbieter der Seiten keine
        Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung
        durch X (ehemals Twitter) erhalten. Weitere Informationen hierzu
        finden Sie in der Datenschutzerklärung von X (ehemals Twitter)
        unter:
        <Link
          href="https://twitter.com/de/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://twitter.com/de/privacy
        </Link>
        .
      </Text>
      <Text>
        Die Nutzung dieses Dienstes erfolgt auf Grundlage Ihrer
        Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1
        TDDDG. Die Einwilligung ist jederzeit widerrufbar.
      </Text>
      <Text>
        Die Datenübertragung in die USA wird auf die
        Standardvertragsklauseln der EU-Kommission gestützt. Details
        finden Sie hier:
        <Link
          href="https://gdpr.twitter.com/en/controller-to-controller-transfers.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://gdpr.twitter.com/en/controller-to-controller-transfers.html
        </Link>
        .
      </Text>
      <Text>
        Ihre Datenschutzeinstellungen bei X (ehemals Twitter) können Sie
        in den Konto-Einstellungen unter
        <Link
          href="https://twitter.com/account/settings"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://twitter.com/account/settings
        </Link>{" "}
        ändern.
      </Text>

      <Space h="xl" />
      <Title order={3}>Instagram</Title>
      <Text>
        Auf dieser Website sind Funktionen des Dienstes Instagram
        eingebunden. Diese Funktionen werden angeboten durch die Meta
        Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5,
        Irland.
      </Text>
      <Text>
        Wenn das Social-Media-Element aktiv ist, wird eine direkte
        Verbindung zwischen Ihrem Endgerät und dem Instagram-Server
        hergestellt. Instagram erhält dadurch Informationen über den
        Besuch dieser Website durch Sie.
      </Text>
      <Text>
        Wenn Sie in Ihrem Instagram-Account eingeloggt sind, können Sie
        durch Anklicken des Instagram-Buttons die Inhalte dieser Website
        mit Ihrem Instagram-Profil verlinken. Dadurch kann Instagram den
        Besuch dieser Website Ihrem Benutzerkonto zuordnen. Wir weisen
        darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom
        Inhalt der übermittelten Daten sowie deren Nutzung durch
        Instagram erhalten.
      </Text>
      <Text>
        Die Nutzung dieses Dienstes erfolgt auf Grundlage Ihrer
        Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1
        TDDDG. Die Einwilligung ist jederzeit widerrufbar.
      </Text>
      <Text>
        Soweit mit Hilfe des hier beschriebenen Tools personenbezogene
        Daten auf unserer Website erfasst und an Facebook bzw. Instagram
        weitergeleitet werden, sind wir und die Meta Platforms Ireland
        Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2,
        Irland gemeinsam für diese Datenverarbeitung verantwortlich
        (Art. 26 DSGVO). Die gemeinsame Verantwortlichkeit beschränkt
        sich dabei ausschließlich auf die Erfassung der Daten und deren
        Weitergabe an Facebook bzw. Instagram. Die nach der
        Weiterleitung erfolgende Verarbeitung durch Facebook bzw.
        Instagram ist nicht Teil der gemeinsamen Verantwortung. Die uns
        gemeinsam obliegenden Verpflichtungen wurden in einer
        Vereinbarung über gemeinsame Verarbeitung festgehalten. Den
        Wortlaut der Vereinbarung finden Sie unter:
        <Link
          href="https://www.facebook.com/legal/controller_addendum"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.facebook.com/legal/controller_addendum
        </Link>
        . Laut dieser Vereinbarung sind wir für die Erteilung der
        Datenschutzinformationen beim Einsatz des Facebook- bzw.
        Instagram-Tools und für die datenschutzrechtlich sichere
        Implementierung des Tools auf unserer Website verantwortlich.
        Für die Datensicherheit der Facebook bzw. Instagram-Produkte ist
        Facebook verantwortlich. Betroffenenrechte (z. B.
        Auskunftsersuchen) hinsichtlich der bei Facebook bzw. Instagram
        verarbeiteten Daten können Sie direkt bei Facebook geltend
        machen. Wenn Sie die Betroffenenrechte bei uns geltend machen,
        sind wir verpflichtet, diese an Facebook weiterzuleiten.
      </Text>
      <Text>
        Die Datenübertragung in die USA wird auf die
        Standardvertragsklauseln der EU-Kommission gestützt. Details
        finden Sie hier:
        <Link
          href="https://www.facebook.com/legal/EU_data_transfer_addendum"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.facebook.com/legal/EU_data_transfer_addendum
        </Link>
        ,
        <Link
          href="https://privacycenter.instagram.com/policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://privacycenter.instagram.com/policy/
        </Link>{" "}
        und
        <Link
          href="https://de-de.facebook.com/help/566994660333381"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://de-de.facebook.com/help/566994660333381
        </Link>
        .
      </Text>
      <Text>
        Weitere Informationen hierzu finden Sie in der
        Datenschutzerklärung von Instagram:
        <Link
          href="https://privacycenter.instagram.com/policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://privacycenter.instagram.com/policy/
        </Link>
        .
      </Text>
      <Text>
        Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US
        Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen
        zwischen der Europäischen Union und den USA, der die Einhaltung
        europäischer Datenschutzstandards bei Datenverarbeitungen in den
        USA gewährleisten soll. Jedes nach dem DPF zertifizierte
        Unternehmen verpflichtet sich, diese Datenschutzstandards
        einzuhalten. Weitere Informationen hierzu erhalten Sie vom
        Anbieter unter folgendem Link:
        <Link
          href="https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt0000000GnywAAC&status=Active"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt0000000GnywAAC&status=Active
        </Link>
        .
      </Text>

      <Space h="xl" />
      <Title order={2}>6. Newsletter</Title>

      <Space h="xl" />

      <Title order={3}>Newsletter­daten</Title>
      <Text>
        Wenn Sie den auf der Website angebotenen Newsletter beziehen
        möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie
        Informationen, welche uns die Überprüfung gestatten, dass Sie
        der Inhaber der angegebenen E-Mail-Adresse sind und mit dem
        Empfang des Newsletters einverstanden sind. Weitere Daten werden
        nicht bzw. nur auf freiwilliger Basis erhoben. Diese Daten
        verwenden wir ausschließlich für den Versand der angeforderten
        Informationen und geben diese nicht an Dritte weiter.
      </Text>
      <Text>
        Die Verarbeitung der in das Newsletteranmeldeformular
        eingegebenen Daten erfolgt ausschließlich auf Grundlage Ihrer
        Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte
        Einwilligung zur Speicherung der Daten, der E-Mail-Adresse sowie
        deren Nutzung zum Versand des Newsletters können Sie jederzeit
        widerrufen, etwa über den „Austragen“-Link im Newsletter. Die
        Rechtmäßigkeit der bereits erfolgten Datenverarbeitungsvorgänge
        bleibt vom Widerruf unberührt.
      </Text>
      <Text>
        Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns
        hinterlegten Daten werden von uns bis zu Ihrer Austragung aus
        dem Newsletter bei uns bzw. dem Newsletterdiensteanbieter
        gespeichert und nach der Abbestellung des Newsletters oder nach
        Zweckfortfall aus der Newsletterverteilerliste gelöscht. Wir
        behalten uns vor, E-Mail-Adressen aus unserem
        Newsletterverteiler nach eigenem Ermessen im Rahmen unseres
        berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO zu
        löschen oder zu sperren.
      </Text>
      <Text>
        Daten, die zu anderen Zwecken bei uns gespeichert wurden,
        bleiben hiervon unberührt.
      </Text>
      <Text>
        Nach Ihrer Austragung aus der Newsletterverteilerliste wird Ihre
        E-Mail-Adresse bei uns bzw. dem Newsletterdiensteanbieter ggf.
        in einer Blacklist gespeichert, sofern dies zur Verhinderung
        künftiger Mailings erforderlich ist. Die Daten aus der Blacklist
        werden nur für diesen Zweck verwendet und nicht mit anderen
        Daten zusammengeführt. Dies dient sowohl Ihrem Interesse als
        auch unserem Interesse an der Einhaltung der gesetzlichen
        Vorgaben beim Versand von Newslettern (berechtigtes Interesse im
        Sinne des Art. 6 Abs. 1 lit. f DSGVO). Die Speicherung in der
        Blacklist ist zeitlich nicht befristet.{" "}
        <strong>
          Sie können der Speicherung widersprechen, sofern Ihre
          Interessen unser berechtigtes Interesse überwiegen.
        </strong>
      </Text>

      <Space h="xl" />
      <Title order={2}>7. Plugins und Tools</Title>
      <Title order={3}>YouTube mit erweitertem Datenschutz</Title>
      <Text>
        Diese Website bindet Videos der Website YouTube ein. Betreiber
        der Website ist die Google Ireland Limited („Google”), Gordon
        House, Barrow Street, Dublin 4, Irland.
      </Text>
      <Text>
        Wenn Sie eine dieser Website besuchen, auf denen YouTube
        eingebunden ist, wird eine Verbindung zu den Servern von YouTube
        hergestellt. Dabei wird dem YouTube-Server mitgeteilt, welche
        unserer Seiten Sie besucht haben. Wenn Sie in Ihrem
        YouTube-Account eingeloggt sind, ermöglichen Sie YouTube, Ihr
        Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen. Dies
        können Sie verhindern, indem Sie sich aus Ihrem YouTube-Account
        ausloggen.
      </Text>
      <Text>
        Wir nutzen YouTube im erweiterten Datenschutzmodus. Videos, die
        im erweiterten Datenschutzmodus abgespielt werden, werden nach
        Aussage von YouTube nicht zur Personalisierung des Surfens auf
        YouTube eingesetzt. Anzeigen, die im erweiterten
        Datenschutzmodus ausgespielt werden, sind ebenfalls nicht
        personalisiert. Im erweiterten Datenschutzmodus werden keine
        Cookies gesetzt. Stattdessen werden jedoch sogenannte Local
        Storage Elemente im Browser des Users gespeichert, die ähnlich
        wie Cookies personenbezogene Daten beinhalten und zur
        Wiedererkennung eingesetzt werden können. Details zum
        erweiterten Datenschutzmodus finden Sie hier:
        <Link
          href="https://support.google.com/youtube/answer/171780"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://support.google.com/youtube/answer/171780
        </Link>
        .
      </Text>
      <Text>
        Gegebenenfalls können nach der Aktivierung eines YouTube-Videos
        weitere Datenverarbeitungsvorgänge ausgelöst werden, auf die wir
        keinen Einfluss haben.
      </Text>
      <Text>
        Die Nutzung von YouTube erfolgt im Interesse einer ansprechenden
        Darstellung unserer Online-Angebote. Dies stellt ein
        berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO
        dar. Sofern eine entsprechende Einwilligung abgefragt wurde,
        erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6
        Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die
        Einwilligung die Speicherung von Cookies oder den Zugriff auf
        Informationen im Endgerät des Nutzers (z. B.
        Device-Fingerprinting) im Sinne des TDDDG umfasst. Die
        Einwilligung ist jederzeit widerrufbar.
      </Text>
      <Text>
        Weitere Informationen über Datenschutz bei YouTube finden Sie in
        deren Datenschutzerklärung unter:
        <Link
          href="https://policies.google.com/privacy?hl=de"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://policies.google.com/privacy?hl=de
        </Link>
        .
      </Text>
      <Text>
        Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US
        Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen
        zwischen der Europäischen Union und den USA, der die Einhaltung
        europäischer Datenschutzstandards bei Datenverarbeitungen in den
        USA gewährleisten soll. Jedes nach dem DPF zertifizierte
        Unternehmen verpflichtet sich, diese Datenschutzstandards
        einzuhalten. Weitere Informationen hierzu erhalten Sie vom
        Anbieter unter folgendem Link:
        <Link
          href="https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt000000001L5AAI&status=Active"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt000000001L5AAI&status=Active
        </Link>
        .
      </Text>

      <Space h="xl" />
      <Title order={3}>Google Fonts</Title>
      <Text>
        Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten
        so genannte Google Fonts, die von Google bereitgestellt werden.
        Beim Aufruf einer Seite lädt Ihr Browser die benötigten Fonts in
        ihren Browsercache, um Texte und Schriftarten korrekt
        anzuzeigen.
      </Text>
      <Text>
        Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung
        zu den Servern von Google aufnehmen. Hierdurch erlangt Google
        Kenntnis darüber, dass über Ihre IP-Adresse diese Website
        aufgerufen wurde. Die Nutzung von Google Fonts erfolgt auf
        Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber
        hat ein berechtigtes Interesse an der einheitlichen Darstellung
        des Schriftbildes auf seiner Website. Sofern eine entsprechende
        Einwilligung abgefragt wurde, erfolgt die Verarbeitung
        ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und
        § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von
        Cookies oder den Zugriff auf Informationen im Endgerät des
        Nutzers (z. B. Device-Fingerprinting) im Sinne des TDDDG
        umfasst. Die Einwilligung ist jederzeit widerrufbar.
      </Text>
      <Text>
        Wenn Ihr Browser Google Fonts nicht unterstützt, wird eine
        Standardschrift von Ihrem Computer genutzt.
      </Text>
      <Text>
        Weitere Informationen zu Google Fonts finden Sie unter{" "}
        <Link
          href="https://developers.google.com/fonts/faq"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.google.com/fonts/faq
        </Link>{" "}
        und in der Datenschutzerklärung von Google:{" "}
        <Link
          href="https://policies.google.com/privacy?hl=de"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://policies.google.com/privacy?hl=de
        </Link>
        .
      </Text>
      <Text>
        Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US
        Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen
        zwischen der Europäischen Union und den USA, der die Einhaltung
        europäischer Datenschutzstandards bei Datenverarbeitungen in den
        USA gewährleisten soll. Jedes nach dem DPF zertifizierte
        Unternehmen verpflichtet sich, diese Datenschutzstandards
        einzuhalten. Weitere Informationen hierzu erhalten Sie vom
        Anbieter unter folgendem Link:{" "}
        <Link
          href="https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt000000001L5AAI&status=Active"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.dataprivacyframework.gov/s/participant-search/participant-detail?contact=true&id=a2zt000000001L5AAI&status=Active
        </Link>
        .
      </Text>
      <Text>
        Quelle:{" "}
        <Link
          href="https://www.e-recht24.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.e-recht24.de
        </Link>
      </Text>
    </Container>
  );
}

export default Privacy;
