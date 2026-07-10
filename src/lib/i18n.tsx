import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de' | 'es' | 'ja';

export interface TranslationDictionary {
  languageName: string;
  systemTime: string;
  preview: string;
  partnerNode: string;
  syncStatus: string;
  heroTag: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  heroDesc: string;
  zeroKnowledge: string;
  zeroKnowledgeDesc: string;
  distStorage: string;
  distStorageDesc: string;
  signInTab: string;
  signUpTab: string;
  keyArmed: string;
  identity: string;
  associatedRelay: string;
  secureDashboard: string;
  smtpBypass: string;
  smtpBypassDesc: string;
  bypassBtn: string;
  bypassing: string;
  dispatchBtn: string;
  enterActivation: string;
  activationSentTo: string;
  verificationCodeLabel: string;
  verificationPlaceholder: string;
  verifyBtn: string;
  resendBtn: string;
  returnBtn: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signInBtn: string;
  signUpBtn: string;
  forgotKey: string;
  faqCategory: string;
  faqTitle: string;
  faqDesc: string;
  faqSecBadge: string;
  faqStatus: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  faq4Q: string;
  faq4A: string;
  faq5Q: string;
  faq5A: string;
  faqSecQ: string;
  faqSecA: string;
  faqSecSymmetric: string;
  faqSecSymmetricDesc: string;
  faqSecDerivation: string;
  faqSecDerivationDesc: string;
  faqSecAsymmetric: string;
  faqSecAsymmetricDesc: string;
  faqSecTransit: string;
  faqSecTransitDesc: string;
  // Dashboard translations
  mailboxTab: string;
  settingsTab: string;
  profileTab: string;
  themeTab: string;
  secLogTab: string;
  liveBadge: string;
  logoutBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    languageName: 'English',
    systemTime: 'SYSTEM TIME',
    preview: 'Preview',
    partnerNode: 'CommandNexus Partner Node',
    syncStatus: 'ACTIVE SYSTEM SYNC: 100% SECURE COMMANDEERING BY COMMANDNEXUS',
    heroTag: 'COMMANDNEXUS NODE ACCELERATED',
    heroTitle1: 'Secure Online',
    heroTitle2: 'Email Server Node',
    heroSub: 'Encrypted Cloud Mailbox Portal',
    heroDesc: 'Experience absolute cryptographic privacy. UTube Mail leverages zero-knowledge asymmetric end-to-end encryption protocols powered by the CommandNexus secure ledger framework, ensuring no third parties can scan or read your personal messages.',
    zeroKnowledge: 'Zero-Knowledge E2EE',
    zeroKnowledgeDesc: 'Your private keys never leave your device.',
    distStorage: 'Distributed Storage',
    distStorageDesc: 'Double-redundant file backups on solid state VPS.',
    signInTab: 'Secure Sign In',
    signUpTab: 'Create Free Node',
    keyArmed: 'Cryptographic Key Armed',
    identity: 'Operator Identity',
    associatedRelay: 'Associated Relay Node',
    secureDashboard: 'Secure Mailbox Dashboard',
    smtpBypass: 'Simulated SMTP Verification Bypass',
    smtpBypassDesc: 'Simulate incoming security activations instantly inside the preview.',
    bypassBtn: 'Bypass SMTP Relay Server',
    bypassing: 'Bypassing public relays...',
    dispatchBtn: 'Dispatch Active Code',
    enterActivation: 'Enter Verification Key',
    activationSentTo: 'Please enter the 6-digit cryptographic activation code sent to',
    verificationCodeLabel: 'Verification Code',
    verificationPlaceholder: 'Enter 6-digit code',
    verifyBtn: 'Verify Node Signal',
    resendBtn: 'Resend Dispatched Passcode',
    returnBtn: 'Return to Connection Hub',
    usernameLabel: 'Node Operator Username',
    usernamePlaceholder: 'Choose a unique operator username',
    emailLabel: 'Cryptographic Node Address',
    emailPlaceholder: 'Enter your node handle or email address',
    passwordLabel: 'Asymmetric Key Signature',
    passwordPlaceholder: 'Input your account key signature (password)',
    signInBtn: 'Authorize Cryptographic Handshake',
    signUpBtn: 'Deploy CommandNexus Node Key',
    forgotKey: 'Forgot your key signature? Contact enclave admins.',
    faqCategory: 'Knowledge Hub',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Unlock granular technical details on how CommandNexus manages keys, routing architectures, and post-quantum zero-knowledge encryption models.',
    faqSecBadge: 'E2EE Protocol Active',
    faqStatus: 'Status: Secure Sandbox',
    faq1Q: 'What is CommandNexus and how does it secure my email?',
    faq1A: 'CommandNexus is our underlying secure ecosystem core. Every email payload, metadata element, and profile setting on utubemail.com is encrypted using AES-GCM-256 and salted pbkdf2 key derivations on the client-side/server edge, preventing unauthenticated routing and zero-knowledge access.',
    faq2Q: 'Where is my data stored and is it private?',
    faq2A: 'Your cryptographic mail and security settings are stored in decentralized zero-knowledge vault nodes. Neither utubemail.com nor third-party network providers hold decrypted raw keys; only your local key can decrypt your mailbox data.',
    faq3Q: 'What is the difference between free and premium encryption tiers?',
    faq3A: 'Standard tier offers post-quantum signature verification and basic end-to-end encryption. Premium tier unlocks 4K-integrated multi-device payload signing, real-time dynamic salt rotation, and fully dedicated secure enclave computing instances on the CommandNexus grid.',
    faq4Q: 'How does the simulated SMTP email bypass work?',
    faq4A: 'For security and testing purposes within our preview, the system bypasses public relays and routes verified activations directly. Authentic production environments route through TLS-hardened, zero-logging transport pipelines.',
    faq5Q: 'Can anyone access my inbox without my cryptographic passkey?',
    faq5A: 'Absolutely not. Even system administrators and node operators see only salted, non-invertible hashes. Without the passkey to compute the matching PBKDF2 hash, your inbox remains cryptographically inaccessible.',
    faqSecQ: 'Security Details: What specific encryption algorithms protect my email data?',
    faqSecA: 'UTube Mail implements a layered, zero-knowledge cryptographic defense architecture to secure user email payloads, metadata, and files at rest and during transmission.',
    faqSecSymmetric: 'Symmetric Encryption',
    faqSecSymmetricDesc: 'Encrypts email payloads and attachments at rest. Every single mail object is sealed with a unique, randomized symmetric AES-GCM-256 key.',
    faqSecDerivation: 'Key Derivation',
    faqSecDerivationDesc: 'Stretches local passkeys with dynamic iterations (up to 750,000 rounds) using PBKDF2 HMAC-SHA256 to form resilient cryptographic hashes.',
    faqSecAsymmetric: 'Asymmetric Exchange',
    faqSecAsymmetricDesc: 'Validates device signatures and performs handshake authorization using ECDH-P384 & Ed25519 in safe isolated enclaves.',
    faqSecTransit: 'Transit Security',
    faqSecTransitDesc: 'Guarantees that session pathways are protected with TLS 1.3 and Perfect Forward Secrecy (PFS), blocking retro-interceptions.',
    // Dashboard translations
    mailboxTab: 'Secure Mailbox',
    settingsTab: 'Security Settings',
    profileTab: 'Operator Profile',
    themeTab: 'UI Theme Customizer',
    secLogTab: 'Security Activity Log',
    liveBadge: 'LIVE',
    logoutBtn: 'Sever Enclave Connection'
  },
  de: {
    languageName: 'Deutsch',
    systemTime: 'SYSTEMZEIT',
    preview: 'Vorschau',
    partnerNode: 'CommandNexus Partnerknoten',
    syncStatus: 'AKTIVE SYSTEM-SYNCHRONISIERUNG: 100% SICHERES NETZWERK DURCH COMMANDNEXUS',
    heroTag: 'COMMANDNEXUS KNOTEN BESCHLEUNIGT',
    heroTitle1: 'Sicherer Online',
    heroTitle2: 'E-Mail-Serverknoten',
    heroSub: 'Verschlüsseltes Cloud-Postfachportal',
    heroDesc: 'Erleben Sie absolute kryptografische Privatsphäre. UTube Mail nutzt Zero-Knowledge-asymmetrische Ende-zu-Ende-Verschlüsselungsprotokolle, die vom sicheren CommandNexus-Hauptbuchrahmen unterstützt werden, um sicherzustellen, dass keine Dritten Ihre persönlichen Nachrichten scannen oder lesen können.',
    zeroKnowledge: 'Zero-Knowledge E2EE',
    zeroKnowledgeDesc: 'Ihre privaten Schlüssel verlassen niemals Ihr Gerät.',
    distStorage: 'Verteilter Speicher',
    distStorageDesc: 'Doppelt redundante Datensicherungen auf Solid State VPS.',
    signInTab: 'Sicherer Login',
    signUpTab: 'Freien Knoten erstellen',
    keyArmed: 'Kryptografischer Schlüssel scharfgeschaltet',
    identity: 'Bedieneridentität',
    associatedRelay: 'Zugeordneter Relaisknoten',
    secureDashboard: 'Sicheres Mailbox-Dashboard',
    smtpBypass: 'Simulierter SMTP-Verifizierungsbypass',
    smtpBypassDesc: 'Simulieren Sie eingehende Sicherheitsaktivierungen sofort innerhalb der Vorschau.',
    bypassBtn: 'SMTP-Relais-Server umgehen',
    bypassing: 'Umgehung öffentlicher Relais...',
    dispatchBtn: 'Aktivierungscode senden',
    enterActivation: 'Verifizierungsschlüssel eingeben',
    activationSentTo: 'Bitte geben Sie den 6-stelligen kryptografischen Aktivierungscode ein, der gesendet wurde an',
    verificationCodeLabel: 'Verifizierungscode',
    verificationPlaceholder: '6-stelligen Code eingeben',
    verifyBtn: 'Knotensignal überprüfen',
    resendBtn: 'Gesendeten Passcode erneut senden',
    returnBtn: 'Zurück zum Verbindungshub',
    usernameLabel: 'Benutzername des Knotenbetreibers',
    usernamePlaceholder: 'Wählen Sie einen eindeutigen Operator-Benutzernamen',
    emailLabel: 'Kryptografische Knotenadresse',
    emailPlaceholder: 'Geben Sie Ihr Knoten-Handle oder Ihre E-Mail-Adresse ein',
    passwordLabel: 'Asymmetrische Schlüsselsignatur',
    passwordPlaceholder: 'Geben Sie Ihre Kontoschlüsselsignatur ein (Passwort)',
    signInBtn: 'Kryptografischen Handshake autorisieren',
    signUpBtn: 'CommandNexus-Knotenschlüssel bereitstellen',
    forgotKey: 'Schlüsselsignatur vergessen? Kontaktieren Sie die Enklaven-Admins.',
    faqCategory: 'Wissensdatenbank',
    faqTitle: 'Häufig gestellte Fragen',
    faqDesc: 'Schalten Sie granulare technische Details darüber frei, wie CommandNexus Schlüssel, Routing-Architekturen und Post-Quanten-Zero-Knowledge-Verschlüsselungsmodelle verwaltet.',
    faqSecBadge: 'E2EE-Protokoll Aktiv',
    faqStatus: 'Status: Sichere Sandbox',
    faq1Q: 'Was ist CommandNexus und wie sichert es meine E-Mails?',
    faq1A: 'CommandNexus ist unser zugrunde liegender sicherer Ökosystemkern. Jede E-Mail-Nutzlast, jedes Metadatenelement und jede Profileinstellung auf utubemail.com wird clientseitig/serverseitig mit AES-GCM-256 und gesalzenen pbkdf2-Schlüsselableitungen verschlüsselt, um unbefugtes Routing und Zero-Knowledge-Zugriff zu verhindern.',
    faq2Q: 'Wo werden meine Daten gespeichert und sind sie privat?',
    faq2A: 'Ihre kryptografischen E-Mails und Sicherheitseinstellungen werden in dezentralen Zero-Knowledge-Tresorknoten gespeichert. Weder utubemail.com noch Drittanbieter verfügen über entschlüsselte Rohschlüssel; nur Ihr lokaler Schlüssel kann Ihre Postfachdaten entschlüsseln.',
    faq3Q: 'Was ist der Unterschied zwischen freien und Premium-Verschlüsselungsstufen?',
    faq3A: 'Die Standardstufe bietet Post-Quanten-Signaturüberprüfung und grundlegende Ende-zu-Ende-Verschlüsselung. Die Premium-Stufe schaltet 4K-integrierte Nutzlastsignierung für mehrere Geräte, Echtzeit-Dynamiksalzrotation und dedizierte Compute-Instanzen in sicheren Enklaven im CommandNexus-Netzwerk frei.',
    faq4Q: 'Wie funktioniert die simulierte SMTP-E-Mail-Umgehung?',
    faq4A: 'Aus Sicherheits- und Testzwecken in unserer Vorschau umgeht das System öffentliche Relais und leitet verifizierte Aktivierungen direkt weiter. Authentische Produktionsumgebungen leiten den Datenverkehr über TLS-gehärtete, protokollfreie Transportpipelines.',
    faq5Q: 'Kann jemand ohne meinen kryptografischen Hauptschlüssel auf meinen Posteingang zugreifen?',
    faq5A: 'Absolut nicht. Sogar Systemadministratoren und Knotenbetreiber sehen nur gesalzene, nicht invertierbare Hashes. Ohne den Hauptschlüssel zur Berechnung des übereinstimmenden PBKDF2-Hashs bleibt Ihr Posteingang kryptografisch unzugänglich.',
    faqSecQ: 'Sicherheitsdetails: Welche spezifischen Verschlüsselungsalgorithmen schützen meine E-Mail-Daten?',
    faqSecA: 'UTube Mail implementiert eine mehrschichtige Zero-Knowledge-Kryptografiearchitektur, um E-Mail-Nutzlasten, Metadaten und Dateien im Ruhezustand und während der Übertragung zu sichern.',
    faqSecSymmetric: 'Symmetrische Verschlüsselung',
    faqSecSymmetricDesc: 'Verschlüsselt E-Mail-Nutzlasten und Anhänge im Ruhezustand. Jedes einzelne E-Mail-Objekt wird mit einem eindeutigen, zufälligen symmetrischen AES-GCM-256-Schlüssel versiegelt.',
    faqSecDerivation: 'Schlüsselableitung',
    faqSecDerivationDesc: 'Dehnt lokale Passkeys mit dynamischen Iterationen (bis zu 750.000 Runden) unter Verwendung von PBKDF2 HMAC-SHA256, um widerstandsfähige kryptografische Hashes zu bilden.',
    faqSecAsymmetric: 'Asymmetrischer Austausch',
    faqSecAsymmetricDesc: 'Validiert Gerätesignaturen und führt Handshake-Autorisierungen mit ECDH-P384 & Ed25519 in sicheren isolierten Enklaven durch.',
    faqSecTransit: 'Transitsicherheit',
    faqSecTransitDesc: 'Garantiert, dass Sitzungspfade mit TLS 1.3 und Perfect Forward Secrecy (PFS) geschützt sind, was nachträgliche Abfänge blockiert.',
    // Dashboard translations
    mailboxTab: 'Sichere Mailbox',
    settingsTab: 'Sicherheitseinstellungen',
    profileTab: 'Betreiberprofil',
    themeTab: 'UI-Thema anpassen',
    secLogTab: 'Sicherheitsaktivitätsprotokoll',
    liveBadge: 'LIVE',
    logoutBtn: 'Enklavenverbindung trennen'
  },
  es: {
    languageName: 'Español',
    systemTime: 'HORA DEL SISTEMA',
    preview: 'Vista previa',
    partnerNode: 'Nodo socio de CommandNexus',
    syncStatus: 'SINCRONIZACIÓN ACTIVA DEL SISTEMA: 100% SEGURO POR COMMANDNEXUS',
    heroTag: 'NODO COMMANDNEXUS ACELERADO',
    heroTitle1: 'Nodo de Servidor',
    heroTitle2: 'de Correo Seguro',
    heroSub: 'Portal de buzón de nube cifrado',
    heroDesc: 'Experimente la privacidad criptográfica absoluta. UTube Mail aprovecha protocolos de cifrado asimétrico de extremo a extremo de conocimiento cero respaldados por el marco de contabilidad seguro CommandNexus, lo que garantiza que ningún tercero pueda escanear o leer sus mensajes personales.',
    zeroKnowledge: 'E2EE de Conocimiento Cero',
    zeroKnowledgeDesc: 'Sus claves privadas nunca salen de su dispositivo.',
    distStorage: 'Almacenamiento distribuido',
    distStorageDesc: 'Copias de seguridad de archivos doblemente redundantes en VPS de estado sólido.',
    signInTab: 'Iniciar sesión seguro',
    signUpTab: 'Crear nodo gratuito',
    keyArmed: 'Clave criptográfica armada',
    identity: 'Identidad del operador',
    associatedRelay: 'Nodo de retransmisión asociado',
    secureDashboard: 'Tablero de buzón seguro',
    smtpBypass: 'Simulación de bypass de SMTP',
    smtpBypassDesc: 'Simule activaciones de seguridad entrantes instantáneamente dentro de la vista previa.',
    bypassBtn: 'Bypassear servidor SMTP',
    bypassing: 'Bypasseando servidores públicos...',
    dispatchBtn: 'Despachar código activo',
    enterActivation: 'Ingresar clave de verificación',
    activationSentTo: 'Por favor, ingrese el código de activación criptográfico de 6 dígitos enviado a',
    verificationCodeLabel: 'Código de verificación',
    verificationPlaceholder: 'Ingrese código de 6 dígitos',
    verifyBtn: 'Verificar señal de nodo',
    resendBtn: 'Reenviar código despachado',
    returnBtn: 'Volver al centro de conexión',
    usernameLabel: 'Usuario del operador del nodo',
    usernamePlaceholder: 'Elija un nombre de usuario de operador único',
    emailLabel: 'Dirección criptográfica del nodo',
    emailPlaceholder: 'Ingrese el alias de su nodo o correo electrónico',
    passwordLabel: 'Firma de clave asimétrica',
    passwordPlaceholder: 'Ingrese la firma de clave de su cuenta (contraseña)',
    signInBtn: 'Autorizar apretón de manos criptográfico',
    signUpBtn: 'Desplegar clave de nodo CommandNexus',
    forgotKey: '¿Olvidó su firma de clave? Contacte a los administradores del enclave.',
    faqCategory: 'Centro de Conocimiento',
    faqTitle: 'Preguntas frecuentes',
    faqDesc: 'Desbloquee detalles técnicos granulares sobre cómo CommandNexus gestiona claves, arquitecturas de enrutamiento y modelos de cifrado de conocimiento cero post-cuánticos.',
    faqSecBadge: 'Protocolo E2EE Activo',
    faqStatus: 'Estado: Sandbox Seguro',
    faq1Q: '¿Qué es CommandNexus y cómo protege mi correo?',
    faq1A: 'CommandNexus es el núcleo de nuestro ecosistema seguro. Cada carga útil de correo, elemento de metadatos y configuración de perfil en utubemail.com se cifra utilizando AES-GCM-256 y derivaciones de claves pbkdf2 saladas en el cliente y servidor, evitando el enrutamiento no autenticado y el acceso de conocimiento cero.',
    faq2Q: '¿Dónde se almacenan mis datos y son privados?',
    faq2A: 'Sus correos criptográficos y configuraciones de seguridad se almacenan en nodos de bóveda de conocimiento cero descentralizados. Ni utubemail.com ni los proveedores de redes externas tienen claves descifradas; solo su clave local puede descifrar sus datos.',
    faq3Q: '¿Cuál es la diferencia entre los niveles de cifrado estándar y premium?',
    faq3A: 'El nivel estándar ofrece verificación de firmas post-cuánticas y cifrado básico de extremo a extremo. El nivel premium desbloquea firmas de carga útil multidispositivo con integración 4K, rotación dinámica de sal en tiempo real e instancias de cómputo en enclaves seguros en la red CommandNexus.',
    faq4Q: '¿Cómo funciona la simulación de bypass de SMTP?',
    faq4A: 'Por motivos de seguridad y pruebas dentro de la vista previa, el sistema omite los relés públicos y enruta las activaciones verificadas directamente. Los entornos de producción reales utilizan canales de transporte TLS reforzados y sin registros.',
    faq5Q: '¿Puede alguien acceder a mi bandeja de entrada sin mi clave criptográfica?',
    faq5A: 'Absolutamente no. Incluso los administradores del sistema y los operadores de nodos solo ven hashes salados y no invertibles. Sin la clave para calcular el hash PBKDF2 coincidente, su buzón permanece inaccesible.',
    faqSecQ: 'Detalles de seguridad: ¿Qué algoritmos de cifrado específicos protegen mis datos de correo electrónico?',
    faqSecA: 'UTube Mail implementa una arquitectura de defensa criptográfica de conocimiento cero y capas para proteger las cargas útiles de correo, metadatos y archivos tanto en reposo como en transmisión.',
    faqSecSymmetric: 'Cifrado Simétrico',
    faqSecSymmetricDesc: 'Cifra las cargas útiles y archivos adjuntos del correo en reposo. Cada objeto de correo individual se sella con una clave simétrica única y aleatoria AES-GCM-256.',
    faqSecDerivation: 'Derivación de Clave',
    faqSecDerivationDesc: 'Estira las claves de paso locales con iteraciones dinámicas (hasta 750,000 rondas) usando PBKDF2 HMAC-SHA256 para formar hashes criptográficos altamente resistentes.',
    faqSecAsymmetric: 'Intercambio Asimétrico',
    faqSecAsymmetricDesc: 'Valida las firmas de los dispositivos y realiza la autorización del apretón de manos usando ECDH-P384 y Ed25519 en enclaves aislados y seguros.',
    faqSecTransit: 'Seguridad en Tránsito',
    faqSecTransitDesc: 'Garantiza que las rutas de las sesiones estén protegidas con TLS 1.3 y Secreto de Transmisión Perfecto (PFS), bloqueando retro-interceptaciones.',
    // Dashboard translations
    mailboxTab: 'Buzón Seguro',
    settingsTab: 'Configuración de seguridad',
    profileTab: 'Perfil del operador',
    themeTab: 'Personalizar tema',
    secLogTab: 'Registro de Actividad de Seguridad',
    liveBadge: 'VIVO',
    logoutBtn: 'Desconectar conexión de enclave'
  },
  ja: {
    languageName: '日本語',
    systemTime: 'システム時間',
    preview: 'プレビュー',
    partnerNode: 'CommandNexus パートナーノード',
    syncStatus: 'アクティブなシステム同期: COMMANDNEXUSによる100%安全な制御',
    heroTag: 'COMMANDNEXUS ノード加速稼働中',
    heroTitle1: '安全なオンライン',
    heroTitle2: 'メールサーバーノード',
    heroSub: '暗号化クラウドメールボックスポータル',
    heroDesc: '絶対的な暗号化プライバシーを体験してください。UTube Mailは、CommandNexusセキュア台帳フレームワークを利用したゼロナレッジ非対称エンドツーエンド暗号化プロトコルを採用しており、第三者が個人メッセージをスキャンしたり読み取ったりすることを完全に防ぎます。',
    zeroKnowledge: 'ゼロナレッジ E2EE',
    zeroKnowledgeDesc: '秘密鍵がデバイスから送信されることはありません。',
    distStorage: '分散ストレージ',
    distStorageDesc: 'ソリッドステートVPS上での二重冗長ファイルバックアップ。',
    signInTab: '安全なサインイン',
    signUpTab: '無料ノード作成',
    keyArmed: '暗号鍵の武装完了',
    identity: 'オペレーター識別子',
    associatedRelay: '関連付けられた中継ノード',
    secureDashboard: 'セキュアメールボックスダッシュボード',
    smtpBypass: '模擬SMTP検証バイパス',
    smtpBypassDesc: 'プレビュー内で即座に受信セキュリティアクティベーションをシミュレートします。',
    bypassBtn: 'SMTPリレーサーバーをバイパス',
    bypassing: 'パブリックリレーをバイパス中...',
    dispatchBtn: 'アクティブコードをディスパッチ',
    enterActivation: '検証キーを入力',
    activationSentTo: 'に送信された6桁の暗号化アクティベーションコードを入力してください',
    verificationCodeLabel: '検証コード',
    verificationPlaceholder: '6桁のコードを入力',
    verifyBtn: 'ノード信号を検証',
    resendBtn: 'ディスパッチされたパスコードを再送信',
    returnBtn: '接続ハブに戻る',
    usernameLabel: 'ノードオペレーター名',
    usernamePlaceholder: '固有のオペレーター名を選択してください',
    emailLabel: '暗号化ノードアドレス',
    emailPlaceholder: 'ノードハンドルまたはメールアドレスを入力してください',
    passwordLabel: '非対称キー署名',
    passwordPlaceholder: 'アカウントキー署名（パスワード）を入力してください',
    signInBtn: '暗号ハンドシェイクを承認',
    signUpBtn: 'CommandNexusノードキーをデプロイ',
    forgotKey: 'キー署名をお忘れですか？エンクレーブ管理者にお問い合わせください。',
    faqCategory: 'ナレッジハブ',
    faqTitle: 'よくある質問 (FAQ)',
    faqDesc: 'CommandNexusが鍵、ルーティングアーキテクチャ、およびポスト量子ゼロナレッジ暗号モデルをどのように管理するかについての詳細な技術仕様をご覧ください。',
    faqSecBadge: 'E2EEプロトコル稼働中',
    faqStatus: 'ステータス: セキュアサンドボックス',
    faq1Q: 'CommandNexusとは何ですか？メールをどのように保護しますか？',
    faq1A: 'CommandNexusは、当社のセキュアなエコシステムコアです。utubemail.com上のすべてのメールペイロード、メタデータ、およびプロファイル設定は、クライアント/サーバー側でAES-GCM-256およびソルト付きpbkdf2キー派生を使用して暗号化され、認証されていないルーティングやゼロナレッジアクセスを防止します。',
    faq2Q: 'データはどこに保存されますか？プライバシーは守られますか？',
    faq2A: '暗号化されたメールとセキュリティ設定は、分散型のゼロナレッジ型保管庫ノードに保存されます。utubemail.comもサードパーティのネットワークプロバイダーも、復号された生鍵を保持しません。ローカルの鍵だけがポストボックスのデータを復号できます。',
    faq3Q: '無料の暗号化層とプレミアム暗号化層の違いは何ですか？',
    faq3A: '標準の暗号化層は、ポスト量子署名検証と基本的なエンドツーエンドの暗号化を提供します。プレミアム層では、4K統合の複数デバイスのペイロード署名、リアルタイムの動的ソルト回転、およびCommandNexusネットワーク上の完全に専用の安全なエンクレーブ計算インスタンスが提供されます。',
    faq4Q: 'シミュレートされたSMTPメールバイパスはどのように動作しますか？',
    faq4A: '当プレビュー内のセキュリティおよびテスト目的のために、システムはパブリックリレーをバイパスし、検証済みのアクティベーションを直接ルーティングします。実際の運用環境では、TLS強化されたログなしの転送パイプラインを介してルーティングされます。',
    faq5Q: '暗号化パスキーがなくてもインボックスにアクセスできますか？',
    faq5A: '絶対にできません。システム管理者やノードオペレーターであっても、ソルト化された不可逆ハッシュのみが可視化されます。一致するPBKDF2ハッシュを計算するためのパスキーがなければ、インボックスは暗号的にアクセス不可能です。',
    faqSecQ: 'セキュリティ詳細：メールデータを保護するためにどのような暗号化アルゴリズムが使用されていますか？',
    faqSecA: 'UTube Mailは、送信中および保存中のユーザーのメールペイロード、メタデータ、およびファイルを保護するために、多層のゼロナレッジ暗号防御アーキテクチャを実装しています。',
    faqSecSymmetric: '対称暗号化',
    faqSecSymmetricDesc: '保存中のメールペイロードと添付ファイルを暗号化します。すべてのメールオブジェクトは、一意でランダムな対称AES-GCM-256キーで封印されます。',
    faqSecDerivation: '鍵派生',
    faqSecDerivationDesc: 'PBKDF2 HMAC-SHA256を使用して、動的な反復（最大750,000ラウンド）でローカルパスキーをストレッチし、復元力のある暗号化ハッシュを形成します。',
    faqSecAsymmetric: '非対称鍵交換',
    faqSecAsymmetricDesc: '安全な隔離されたエンクレーブ内でECDH-P384およびEd25519を使用して、デバイス署名を検証し、ハンドシェイクの承認を行います。',
    faqSecTransit: '通信トランスポートセキュリティ',
    faqSecTransitDesc: 'セッションパスがTLS 1.3およびPerfect Forward Secrecy (PFS)で保護されていることを保証し、遡及的な傍受をブロックします。',
    // Dashboard translations
    mailboxTab: 'セキュアメールボックス',
    settingsTab: 'セキュリティ設定',
    profileTab: 'オペレータープロファイル',
    themeTab: 'UIテーマカスタマイザー',
    secLogTab: 'セキュリティログの監視',
    liveBadge: 'LIVE',
    logoutBtn: 'エンクレーブ接続を切断'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('utubemail_language');
    if (saved === 'en' || saved === 'de' || saved === 'es' || saved === 'ja') {
      return saved as Language;
    }
    return 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('utubemail_language', lang);
  };

  const t = (key: keyof TranslationDictionary): string => {
    return translations[language][key] || translations['en'][key] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
