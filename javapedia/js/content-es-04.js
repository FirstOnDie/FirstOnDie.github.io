/**
 * JavaPedia — Spanish Content (Sections 16-20) - DEEP DIVE
 */
const CONTENT_ES_04 = [
    {
        id: 'annotations', num: '16', title: 'Reflection y Proxies Dinámicos',
        body: `
<h2>El Poder Oscuro: Reflection API</h2>
<p>La Reflection es la capacidad de Java de examinar o modificar el comportamiento de métodos, clases e interfaces en tiempo de ejecución. Rompe absolutamente las reglas de encapsulamiento del POO (puedes leer y modificar variables <code>private final</code>).</p>
<p>Arquitectónicamente es <strong>extremadamente costoso en CPU</strong> comparado con la invocación directa, porque la JVM no puede aplicar optimizaciones JIT, "Inlining" de código ni comprobaciones de seguridad eficientes sobre llamadas que no conoce hasta que ocurren dinámicamente.</p>

<h2>La Magia de los Frameworks: Proxies Dinámicos</h2>
<p>¿Alguna vez te has preguntado cómo Spring Boot hace magia con <code>@Transactional</code> o cómo Hibernate carga entidades perezosas (Lazy Loading) desde la base de datos sin que tú escribas el código SQL para ello?</p>
<p>La respuesta son los <strong>Proxies</strong>. A través de Reflection, tu framework lee tus Archivos y Anotaciones al arrancar el Servidor, y genera dinámicamente un código intermediario <em>(Bytecode Generation)</em>. Cuando pides una instancia de tu <code>ServicioDePago</code>, no se te da tu clase real, se te da una clase <strong>"Proxy" Mutante (CGLIB o JDK Proxy)</strong> que envuelve a la tuya.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Lo que tú escribes:
@Transactional
public void transferirDinero() {
    cuenta.restar(100);
    destino.sumar(100);
}

// Lo que un Proxy intermedio (Inyección de Dependencias) inyecta en Bytecode a tus espaldas:
public void transferirDinero_PROXY_INTERCEPTADO() {
    Connection conn = pool.getConnection();
    conn.setAutoCommit(false); // Inicia Tx Base de datos
    try {
        // La llamada a tu método real original
        super.transferirDinero(); 
        
        conn.commit(); // Si todo sale bien
    } catch (Exception e) {
        conn.rollback(); // ¡Magia!
        throw e;
    } finally {
        conn.close();
    }
}</code></pre></div>
`
    },
    {
        id: 'jdbc', num: '17', title: 'JDBC, Pools y Rendimiento DB',
        body: `
<h2>El Anti-Patrón de Conexiones</h2>
<p>Crear una conexión directa <code>DriverManager.getConnection()</code> a una Base de Datos requiere un Handshake TCP, autenticación cifrada, y reserva de memoria en el S.O. de la DB. Toma alrededor de 100 milisegundos. En la web actual, obligar a que 1,000 usuarios distintos sufran este castigo en cada click destrozaría la base de datos.</p>
<p><strong>El Arquitecto usa Connection Pools (HikariCP):</strong> Al arrancar el servidor Java, Hikari (el Pool por defecto en Spring Boot) abre ciegamente estáticas ~10 conexiones hacia la Base de Datos. Cuando un Hilo web necesita hacer un SELECT, pide prestada una conexión de esta Alberca Mágica en 1 nanosegundo. Al terminar, no la cierra nativamente (<code>close()</code>), simplemente la devuelve al pool para que otro Hilo Web la repita. Este es el pilar de rendimiento backend global.</p>

<h2>Data Access Object (DAO) y el N+1 Problem</h2>
<p>Usar JDBC plano hoy en día es brutalmente veloz pero ruidoso de codificar. Por eso se usan <strong>ORMs (Object-Relational Mapping)</strong> como Hibernate/JPA. Este abstrae SQL en Clases Generics.</p>
<p>El error más devastador de un ORM es el problema <strong>N+1</strong>. Si buscas una lista de 50 «Autores» en JPA, se lanza 1 Query. Pero cada Autor está mapeado con una <code>@OneToMany</code> colección de <code>[Libros]</code>. Si en un bucle FOR imprimes <code>autor.getLibros()</code> JPA no es lo inteligente que crees, y por detrás detona mágicamente ¡50 queries a la DB SQL una a una!. El Rendimiento del disco en la VM decae brutalmente.</p>
<p>La solución arquitectónica implica escribir un <code>JOIN FETCH</code> manual para indicarle al ORM que traiga la información pre-cargada masivamente y resuelva el modelo en Memoria.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Antipatrón Mortal (Si hay un Millón de usuarios, estalla el driver DB en Timeout TCP)
List&lt;User&gt; usuarios = repository.findAll(); // 1 QUERY
for(User u : usuarios) {
    System.out.println(u.getAddress().getCity()); // N QUERIES OCULTAS de Network
}

// Arquitectura Óptima: DTO Projections para solo golpear el índice del Servidor SQL.
// Ignoramos Entidades Pesadas y JPA Mapeo sucio. Sólo traemos String.
@Query("SELECT new com.app.CityDTO(a.city) FROM User u JOIN u.address a")
List&lt;CityDTO&gt; recuperarSoloCiudades(); // 1 QUERY EXACTA y rapidísima</code></pre></div>
`
    },
    {
        id: 'design-patterns', num: '18', title: 'Patrones de Diseño GoF (Catálogo Completo)',
        body: `
<h2>Los 22 Patrones de Diseño Gang of Four (GoF)</h2>
<p>Los patrones de diseño son soluciones probadas a problemas de diseño de software recurrentes. Se dividen en 3 familias principales, popularizados en Refactoring Guru. A continuación, el catálogo masivo completo con ejemplos en Java.</p>

<h3>1. Patrones Creacionales</h3>
<p>Ocultan la lógica de creación de la instanciación directa (<code>new</code>), dándole super-flexibilidad al programa.</p>

<h4>1.1 Factory Method (Método Fábrica)</h4>
<p>Proporciona una interfaz para crear objetos en una superclase, pero permite a las subclases alterar el tipo de objetos creados.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">abstract class Logistica { abstract Transporte crearTransporte(); }
class LogisticaMaritima extends Logistica { Transporte crearTransporte() { return new Barco(); } }
class LogisticaTerrestre extends Logistica { Transporte crearTransporte() { return new Camion(); } }</code></pre></div>

<h4>1.2 Abstract Factory (Fábrica Abstracta)</h4>
<p>Permite producir familias enteras de objetos relacionados sin especificar sus clases concretas. Útil para entornos multiplataforma.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface GUIFactory { Boton crearBoton(); Checkbox crearCheckbox(); }
class MacFactory implements GUIFactory { /* Retorna botones de Mac */ }
class WinFactory implements GUIFactory { /* Retorna botones de Windows */ }</code></pre></div>

<h4>1.3 Builder (Constructor)</h4>
<p>Permite construir objetos complejos paso a paso. Facilita la creación con muchos argumentos. (Mayormente reemplazado hoy por la anotación <code>@Builder</code> de Lombok).</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">Pizza pizza = new Pizza.Builder()
    .masa("gruesa")
    .salsa("tomate")
    .queso("mozzarella")
    .build();</code></pre></div>

<h4>1.4 Prototype (Prototipo)</h4>
<p>Permite copiar (clonar) objetos existentes sin hacer que tu código dependa de sus clases tangibles.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface ClonableCoche { Coche clonar(); }
class CocheCarreras implements ClonableCoche {
    public Coche clonar() { return new CocheCarreras(this); } // Llama a constructor copia
}</code></pre></div>

<h4>1.5 Singleton</h4>
<p>Garantiza que una clase tenga solo una instancia y ofrece un punto de acceso global. En entornos Cloud es considerado un Anti-Patrón mortal por bloquear hilos Nativos, siendo sustituido por la Inyección de Dependencias <i>Inversion of Control</i> (IoC) manejada por Spring.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class Database {
    private static Database instance;
    private Database() {} // Constructor privado hermético
    
    public static synchronized Database getInstance() {
        if (instance == null) { instance = new Database(); }
        return instance;
    }
}</code></pre></div>

<h3>2. Patrones Estructurales</h3>
<p>Ensamblan objetos y clases en estructuras más grandes, manteniendo la eficiencia y modularidad global.</p>

<h4>2.1 Adapter (Adaptador)</h4>
<p>Permite que objetos con interfaces incompatibles colaboren, tal como un cargador de pared para diferente país.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface EnchufeEuropeo { void enchufar220V(); }
class EnchufeUsa { void enchufar110V() {} }

class AdaptadorUsaEuropa implements EnchufeEuropeo {
    private EnchufeUsa usa;
    public AdaptadorUsaEuropa(EnchufeUsa u) { this.usa = u; }
    public void enchufar220V() { usa.enchufar110V(); } // Adaptación oculta
}</code></pre></div>

<h4>2.2 Bridge (Puente)</h4>
<p>Divide una clase gigante en dos jerarquías (abstracción e implementación) para desarrollarse iterativamente de forma independiente.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class ControlRemoto { // Abstracción Pura
    protected Dispositivo dispositivo; // El Puente hacia la Implementación (TV o Radio)
    void encender() { dispositivo.turnOn(); }
}</code></pre></div>

<h4>2.3 Composite (Árbol Compuesto)</h4>
<p>Compone objetos en árboles Cíclicos (Parte-Todo). Permite tratar hojas y ramas jerárquicas con el mismo comando exacto.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface Componente { void renderizar(); }
class BotonSimple implements Componente { void renderizar() {} }
class PanelCompuesto implements Componente {
    List&lt;Componente&gt; hijos;
    void renderizar() { hijos.forEach(Componente::renderizar); } // Propaga la orden en el árbol
}</code></pre></div>

<h4>2.4 Decorator (Decorador)</h4>
<p>Añade nuevas y sorprendentes responsabilidades a objetos dinámicamente metiéndolos en envoltorios "Matryoshka". Ej: Criptografía en Archivos.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface Notificador { void enviar(String msg); }
class NotificadorBase implements Notificador { void enviar(String msg) { /* Envio normal SMS */ } }
class NotificadorCifrado implements Notificador {
    Notificador envoltorioBase;
    void enviar(String msg) { envoltorioBase.enviar(cifrarAES(msg)); } // Anade capa extra AES
}</code></pre></div>

<h4>2.5 Facade (Fachada)</h4>
<p>Oculta la inmensa complejidad arquitectónica de una biblioteca o framework enorme brincando una interfaz simple de botoncitos fáciles.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class ConvertidorVideoFacade {
    public File exportar(File video, String format) {
        // Enmascara 50 líneas complejas lidiando con OggCompression y H264Codec
        return new Codec().compress(video, format);
    }
}</code></pre></div>

<h4>2.6 Flyweight (Peso Ligero Compartido)</h4>
<p>Salva servidores enteros reduciendo drásticamente el uso de RAM al reciclar y compartir masivamente el estado en la memoria. Útil para Juegos 3D.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class TipoArbolRoble { String colorForma; } // 1 MB pesado y se crea 1 sola vez en el sistema
class ArbolInstancia { int x, y; TipoArbolRoble tipoFijo; } // Millones de estos pesan solo bytes, reciclando el Tipo.</code></pre></div>

<h4>2.7 Proxy</h4>
<p>Protege o controla el acceso bruto al objeto original (Caché, Lazy Loading, ACL de Seguridad). Spring Boot genera Auténticos Proxies para dominar el <code>@Transactional</code>.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class InternetCorporativoProxy implements Web {
    Web internetReal = new RealInternet();
    public void conectar(String url) {
        if(url.contains("facebook")) throw new BannedException(); // Frena el paso antes de acceder
        internetReal.conectar(url);
    }
}</code></pre></div>

<h3>3. Patrones de Comportamiento</h3>
<p>Gobiernan los algoritmos y la mensajería asíncrona segura entre objetos ajenos aislados.</p>

<h4>3.1 Chain of Responsibility (Cadena de Responsabilidad)</h4>
<p>Traspasa solicitudes saltando a través de una cadena lineal de handlers. (Ej: Filtros de Spring Security).</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class SoporteNivel1 extends Manejador {
    void procesarFallo(Ticket t) { 
        if(!resueltoAqui) nextNivel.procesarFallo(t); // Pasa la barrera al siguiente de la cadena
    }
}</code></pre></div>

<h4>3.2 Command (Comando)</h4>
<p>Encapsula quirúrgicamente un movimiento en un Objeto "Grabable", posibilitando Colas en Background, Historial de Logs o acciones Control-Z "Deshacer".</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface Command { void ejecutar(); void desfaser(); }
class CortarTextoCommand implements Command { /* logica reversible O.O.P */ }</code></pre></div>

<h4>3.3 Iterator (Iterador)</h4>
<p>Extrae y estandariza la ruta violenta de cómo recorrer Colecciones crudas (List, Arboles Binarios, Gráficos) protegiendo e iterando el exterior herméticamente.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">Iterator&lt;String&gt; iter = miListaRara.iterator();
while(iter.hasNext()) { procesar(iter.next()); }</code></pre></div>

<h4>3.4 Mediator (Mediador)</h4>
<p>Detiene las dependencias enredadas espagueti Forzando el flujo de Colaboración mediante un Hub Central Regulador.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class TorreControlAerea { void notificarRadar(Avion emisor, String evento) { /* Distribuye datos al resto sin cruzarse */ } }</code></pre></div>

<h4>3.5 Memento (Recuerdo)</h4>
<p>Genera una Fotografía o Snapshot impenetrable bloqueada internamente para recuperar memoria borrada previamente sin exponer variables de seguridad a entes extraños.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class EditorTexto {
    String bufferOculto;
    Memento sacarFoto() { return new Memento(bufferOculto); } // Entrega un baúl sellado a un cliente
    void restaurarHistorial(Memento m) { this.bufferOculto = m.getEstadoCifrado(); }
}</code></pre></div>

<h4>3.6 Observer (Observador Pub/Sub)</h4>
<p>Mecanismo de Suscripción Pasivo 1:N donde miles de receptores duermen y son despertados en red a través de un Notificador Inyector Maestro de eventos.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class SensorYoutube {
    List&lt;Suscriptor&gt; subs;
    void nuevoVideo() { subs.forEach(Suscriptor::sonarCampanaPush); }
}</code></pre></div>

<h4>3.7 State (Estado)</h4>
<p>Transmuta el Comportamiento algorítmico cuando su flag interno cambia dinámicamente. Extermina para siempre <code>switch/if-else</code> laberínticos infinitos dentro del código maestro.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface EstadoMovil { void clickPowerButton(); }
class PantallaOff implements EstadoMovil { /* Prende el led retroiluminador */ }
class PantallaOn implements EstadoMovil { /* Abre el escritorio al home */ }</code></pre></div>

<h4>3.8 Strategy (Estrategia Hot-Swap)</h4>
<p>Define motores funcionales matemáticos intercambiables que se acoplan al Vuelo Transaccional como Tarjetas Gráficas de PC. (Ej: Spring Cloud Gateway).</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">class GoogleMaps {
    EstrategiaRuta ruteoGps; // Instancia inyectable: Coches, Aviones, Caminando.
    void ir() { ruteoGps.dibujarVertices(); } // Mutabilidad Instantánea en Runtime
}</code></pre></div>

<h4>3.9 Template Method (Método Plantilla)</h4>
<p>Sella la Columna Vertebral Arquitectónica inamovible, obligando y permitiendo que subclases inyecten las extremidades abstractas opcionales ("Hooks") libremente.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">abstract class ConstructorEdificios {
    public final void edificar() { ponerColumnasBasePesada(); pintarColoresVariables(); } // Método Blindado
    abstract void pintarColoresVariables(); // Obliga Inserto Polimórfico Custom
}</code></pre></div>

<h4>3.10 Visitor (Visitante)</h4>
<p>Crea operaciones invasivas matemáticas sobre toda una inmensa familia de árboles lógicos complejos que varían continuamente, evadiendo ensuciar con lógica a todas su nodos.</p>
<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">interface AudicionVisitanteFiscal { void fiscalizar(Hospital h); void fiscalizar(Industria i); }
class EdificioHospital { void aceptar(AudicionVisitanteFiscal v) { v.fiscalizar(this); } }</code></pre></div>
`
    },
    {
        id: 'testing', num: '19', title: 'Testing Enterprise & Antipatrones',
        body: `
<h2>La Fragilidad de Mockito (Mocking Obsession)</h2>
<p>Un error tremendo al usar herramientas como <code>Mockito</code> es el <strong>Test Acoplado a la Implementación Interna</strong>. Si haces un Test Unitario de tu Factura, y escribes reglas pesadas de Mocking como <code>verify(calculadoraImpuestos, times(1)).llamarMetodoA()</code>, no estás testeando el "Qué" hace, sino el "Cómo" lo hace paso a paso. </p>
<p>La semana entrante, un desarrollador optimizará el código base para combinar reglas, y tu Test fallará y te asustará a pesar de que la "Factura" funciona a la perfección en el mundo real. <strong>Regla Dorada: Testea siempre comportamientos (Llamadas a la Interfaz Pública Pública con Entrada/Salida), JAMÁS testes implementaciones Privadas secretas internas.</strong></p>

<h2>La Revolución: Testcontainers (Tests de Integración)</h2>
<p>Las Bases de Datos en Memoria (H2 o Failsafe en SQLite) generaron falsa seguridad por una década. Un Test H2 de Spring que funciona impecable localmente provocará incendios infernales en el despliegue del Lunes por culpa de disparidad de Diablos en Postgres/MySQL nativos en Producción (Tipos de datos únicos de JSONB de Postgres o Locking exclusivo).</p>
<p>Solución corporativa moderna: <strong>Testcontainers</strong>.</p>
<p>Es una biblioteca de Java que conecta con el motor Docker del Sistema del Programador. Antes de arrancar la batería de Tests, Testcontainers "Dinamita y levanta" un Contenedor efímero e idéntico de PostgreSQL versión 15 en RAM, enreda las variables de Servidor en caliente hacia él, lanza el Suite JUnit entero real contra la entidad real de Software, y al terminar, destruye la Base de Datos al infinito en Segundos.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">@Testcontainers
@SpringBootTest
class AltaFiabilidadDatabaseTest {

    // JUnit ordenará al CLI de Docker descargar la imagen de Postgres y abrir el puerto logrando Testing 1:1
    @Container
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;("postgres:15-alpine");

    @DynamicPropertySource
    static void reconfigurarSpring(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
    }

    @Test
    void guardarUsuarioEnAmbienteIdenticoAProduccion() {
        // Tu repositorio atacará al Docker Real Efímero, no perderás fiabilidad de Queries Nativas
        usuarioRepo.save(new User("Frody"));
        assertEquals(1, usuarioRepo.count());
    }
}</code></pre></div>
`
    },
    {
        id: 'best-practices', num: '20', title: 'Domain Driven Design y El Mito DRY',
        body: `
<h2>El Mito Destructivo del D.R.Y al Extremo</h2>
<p>D.R.Y. <em>(Don't Repeat Yourself)</em> es un pilar, pero arquitectos Juniors cometen un pecado: <strong>Acoplamiento Indeseable por Casualidad.</strong></p>
<p>Imagina que tienes una tabla JSON DTO y de casualidad su validación encaja idéntica en 3 Dominios (El Dominio Facturación Comercial, el de Envío Postal y el CRM de Analítica Comercial). En un afán de ahorrar 10 líneas de código duplicado, generas un <code>CommonValidatorUtility.java</code> que todos importan.</p>
<p>Pasan los meses y Facturación te exige añadir un nuevo campo al validador obligatorio. Al hacerlo, como todo cuelga de la misma Utilidad Global Mágica, rompes los testeos Analíticos que no querían esa validación y te obligas a crear parches y condicionales booleanos sucios (<code>if (zonaVieneDeFactura)</code>). La sabiduría es: <strong>Prefiero Duplicación Aislada (W.E.T — Write Everything Twice) a un Acoplamiento Mágico Indeseado en Dominios Separados.</strong></p>

<h2>Domain Driven Design Básico</h2>
<p>Domain Driven Design (DDD) es la técnica reina absoluta para salvar Monolitos Enteros del colapso humano masivo (miles de Java developers trabajando en el mismo branch a la vez). Propone en Java:</p>
<ul>
    <li><strong>Ubiquitous Language:</strong> Si los Contadores Comerciales de la mesa de Negocio te dicen "Una Póliza Madura". Jamás traduzcas su término en base a tu imaginación. Tu Clase en Java debe existir y llamarse explícitamente <code>class PolizaMadura</code> y tu método <code>ejecutarContratoRenovacion()</code>. El Glosario en boca de negocio debe ser un calco fiel y visible del Modelado Orientado a Objetos del IDE.</li>
    <li><strong>Entidades Anémicas (Anti-patrón):</strong> Si usas Java solo para crear clases llenas de puras variables y getters/setters y mueves todas las condicionales y cuentas a una super clase Dios separada <code>UserServiceImpl.java</code>, le has extirpado el cerebro a la Entidad. O.O.P define el juntar el Estado con el Comportamiento Íntimo y Ciego. Deja que la clase Entidad controle su propio encapsulamiento (<code>pago.aplicarDescuentoInamovible()</code>).</li>
</ul>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// MODELOS ANÉMICOS VS RICOS EN DDD
// 🔴 Anémico (Malo)
Cartera c = new Cartera();
c.setSaldo(c.getSaldo() - 50); // El Creador viola la Cartera desde fuera, sin seguridad transaccional

// 🟢 Modelo de Dominio Rico (Excelente O.O.P)
public class Cartera {
    private Moneda saldo;
    
    // El encapsulamiento prohibe los setters
    public void registrarGasto(Moneda monto) {
        if (monto.esMayorQue(this.saldo)) throw new FraudeExcepcion();
        this.saldo = this.saldo.restar(monto);
    }
}
// Uso de API Ricamente Controlada
cartera.registrarGasto(new Moneda(50));</code></pre></div>
`
    }
];
