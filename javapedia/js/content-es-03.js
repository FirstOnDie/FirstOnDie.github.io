/**
 * JavaPedia — Spanish Content (Sections 11-15) - DEEP DIVE
 */
const CONTENT_ES_03 = [
    {
        id: 'streams-lambdas', num: '11', title: 'Streams y Lambdas',
        body: `
<h2>Lambdas en el Bytecode (InvokeDynamic)</h2>
<p>Antes de Java 8, simular funciones de primera clase requería instanciar "Clases Anónimas Internas", lo que generaba montones de archivos <code>.class</code> auxiliares (ej. <code>MiClase$1.class</code>) en el disco, inflando el tamaño de la aplicación y enlenteciendo el ClassLoader.</p>
<p>Con las Lambdas, Java tomó un camino revolucionario usando la instrucción de ensamblador <strong><code>invokedynamic</code></strong> (originalmente pensada para lenguajes dinámicos como JRuby o Groovy). En lugar de crear una clase al compilar, el compilador genera un método estático oculto con el cuerpo de la lambda. En <em>tiempo de ejecución</em>, invoca un CallSite que enlaza esa función delegada bajo demanda, evitando la creación inútil de objetos y liberando a la memoria Heap.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Esto NO genera un .class extra. La JVM lo transforma en un método estático privado.
Runnable moderno = () -> System.out.println("Hola, soy una función pura en bytes");

// El azúcar sintáctico brilla con Interfaces Funcionales (@FunctionalInterface)
Predicate&lt;String&gt; esLargo = str -> str.length() > 10;
Function&lt;String, Integer&gt; parseador = Integer::parseInt; // Method Reference (Aún más optimizado)</code></pre></div>

<h2>Streams: Arquitectura "Lazy Evaluation"</h2>
<p>Un Stream NO es una estructura de datos. Es un <strong>Pipeline de Procesamiento Lazy (Perezoso)</strong>. Modela consultas como si fuera SQL aplicadas a objetos en RAM.</p>
<p><strong>El Secreto:</strong> Las operaciones intermedias (<code>filter</code>, <code>map</code>, <code>sorted</code>) NUNCA se ejecutan cuando las invocas. Simplemente construyen un árbol de ejecución en memoria. Miden y optimizan combinaciones lógicas. Sólo cuando un <em>Operador Terminal</em> (<code>collect</code>, <code>findFirst</code>, <code>count</code>) es ejecutado, el motor del Stream "tira de la cadena" procesando el flujo óptimamente en un solo pase por la colección.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">List&lt;String&gt; baseDeDatos = List.of("A1", "B2", "C3", "A4", "A5", "A6");

String resultado = baseDeDatos.stream()
    .filter(s -> {
        System.out.println("Filtrando: " + s); // Imprime 3 veces, no 6.
        return s.startsWith("A");
    })
    .map(s -> {
        System.out.println("Mapeando: " + s); // Imprime 2 veces.
        return s.toUpperCase();
    })
    .findFirst() // Al ser "Short-Circuiting", en el 2do loop ya encontró lo que buscaba y apaga el Stream.
    .orElse("No encontrado");
    
// La evaluación perezosa ahorra miles de ciclos de CPU ignorando datos irrelevantes
// una vez que la meta terminal se ha cumplido.</code></pre></div>

<h2>El Peligro de get() en Parallel Streams</h2>
<p>Al hacer <code>.parallelStream()</code>, Java particiona la colección y delega los trozos al <strong>Common ForkJoinPool</strong> global de la JVM. Gran idea matemática, pero <strong>catastrófica para la web</strong>. Si haces un parallelStream para consultar una Base de Datos HTTP o tareas asíncronas lentas, bloquearás todos los hilos centrales del sistema, colapsando silenciosamente todos los otros endpoints de tu aplicación Spring Boot que también pretendieran hacer procesamiento de datos en paralelo en el mismo instante. <strong>Reserva <code>parallelStream</code> SOLO para cálculos matemáticos locales de alto costo en CPU (Nº Primos, Encriptación, etc).</strong></p>
`
    },
    {
        id: 'multithreading', num: '12', title: 'Multithreading y Virtual Threads',
        body: `
<h2>El Paradigma de Plataforma (Kernel Threads)</h2>
<p>En Java convencional (antes de Java 21) un hilo en Java (<code>java.lang.Thread</code>) correspondía arquitectónicamente a nivel operativo a un <strong>OS Platform Thread (Hilo del Sistema Operativo)</strong> de forma nativa. Crear un hilo obligaba a reservar obligatoriamente ~1MB a ~2MB de memoria RAM fuera de la Heap sólo como Call-Stack del Kernel.</p>
<p><strong>El Límite del Muro:</strong> Por causa de la RAM y los cambios de contexto del OS, un servidor fuerte apenas podía sostener entre 2,000 a 4,000 hilos concurrentes máximos. En un mundo Cloud moderno donde quieres cientos de miles de conexiones websocket simultáneas (como NodeJS o Go), el diseño clásico del modelo Java ahogaba la escalabilidad ("Un hilo por petición HTTP" era un suicidio arquitectónico a gran escala).</p>

<h2>La Revolución: Project Loom & Virtual Threads (Java 21)</h2>
<p>En el 2023, <strong>Java 21</strong> transformó radicalmente las entrañas del lenguaje. Los <strong>Virtual Threads</strong> rompen la relación 1:1 con el OS.</p>
<p>Son hilos ultra ligeros administrados íntegramente por la JVM. Cuando un Virtual Thread ejecuta una tarea que se bloquea (por ejemplo, esperar medio segundo a que un microservicio conteste vía red API), la JVM automáticamente desplaza el estado del Virtual Thread al HEAP (Memoria global barata), quitándolo del hilo físico (Carrier Thread) en <em>nanosegundos</em>. El hilo físico queda liberado inmediatamente para atender otra de las millones de peticiones entrantes. Al llegar el dato de la API del microservicio, la JVM despierta aquel Virtual Thread de la Heap, lo re-monta sobre un Carrier Thread libre, y sigue su camino.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Un test de tortura que destrozaría un servidor tomcat clásico en 10 segundos
// Java 21+ ejecuta esto sin transpirar, utilizando solo una docena de hilos de Kernel de fondo.
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 5_000_000).forEach(i -> {
        executor.submit(() -> {
            // Dormir suspende el VirtualThread en el Heap, rindiendo la CPU al 100%
            Thread.sleep(Duration.ofSeconds(2)); 
            System.out.println("Tarea terminada número: " + i);
            return i;
        });
    });
} // 5 MILLONES de conexiones concurrentes asíncronas en un servidor modesto.</code></pre></div>

<h2>CompletableFuture vs. Programación Imperativa</h2>
<p>Antes de los Virtual Threads, para alcanzar la hiperconcurrencia de red en Java se usaba Programación Asíncrona Reactiva (WebFlux / CompletableFutures). Estos métodos evitaban el bloqueo de CPU creando espagueti de callbacks (<i>.thenApply().thenAccept()</i>), destrozando enormemente el fácil uso de StackTraces, las lecturas de log o el Debugging clásico paso-por-paso del IDE.</p>
<p>Hoy, <strong>escríbelo como código imperativo, sincrónico clásico</strong> (<i>read from bd</i> -> <i>if null throw</i> -> <i>return</i>), y lánzalo en un Virtual Thread. El código es trivial de leer y testear, rindiendo a la escalabilidad hiper masiva sin callbacks.</p>
`
    },
    {
        id: 'concurrency', num: '13', title: 'Concurrencia Subyacente',
        body: `
<h2>El Java Memory Model (JMM) y Visibilidad</h2>
<p>Modernos CPUs (Intel, AMD, Silicon) poseen múltiples núcleos, donde cada núcleo tiene su propia rapidísima <strong>Caché L1 / L2 Privada</strong> antes de conectarse a la RAM principal de la Motherboard (Heap). Cuando un hilo Java corriendo en el "Núcleo 1" muta un boolean <code>running = false;</code>, modifica su Caché Local L1. Si un hilo en el "Núcleo 4" está en un <code>while(running)</code> leyendo ese mismo booleano en su propia Caché, jamás se detendrá. Acabas de provocar un <em>Visibility Bug</em> o carrera crítica no visible.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class ServidorCritico {
    // La palabra secreta es VOLATILE. 
    // Provoca "Memory Barriers" en ensamblador obligando a flushear todos 
    // las escrituras en la cache del núcleo cruzando Front-Side-BUS hasta la RAM.
    private volatile boolean debeDetenerse = false;

    public void solicitarApagado() {
        this.debeDetenerse = true; // Escritura visible transatlántica garantizada
    }
}</code></pre></div>

<h2>Cerrojos Atómicos Invasivos (CAS - Compare-And-Swap)</h2>
<p>El candado tradicional <code>synchronized</code> tiene un problema: Es excesivamente "pesado" para cambios ridículamente simples como incrementar un número. Usa bloqueos mutex nativos a nivel de Sistema Opearativo. Si el SO asume control y tumba el hilo de CPU para meter en cola, el costo es de miles de ciclos.</p>
<p>Las colecciones del paquete <code>java.util.concurrent.atomic</code> (como <code>AtomicInteger</code>) no usan bloqueos del OS. Usan <strong>Instrucciones Hardware CMPXCHG de la CPU</strong> atómicas y asíncronas (Compare And Swap - CAS). Tratan de escribir el dato de forma optimista. Si colisionan, simplemente reintentan el bucle en el mismo nanosegundo sin liberar o cambiar la identidad del subproceso CPU.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">AtomicLong hitsConcurrentes = new AtomicLong(0);

// Decenas de miles de hilos pueden golpear este método
public void impactoRuta() {
    // Incremento a nivel Hardware, sin bloquear Kernel Threads (Lock-Free Algorithm)
    hitsConcurrentes.incrementAndGet(); 
}</code></pre></div>

<h2>Separación de Estructuras: ConcurrentHashMap</h2>
<p>Usar <code>Collections.synchronizedMap()</code> encierra toda la tabla Hash bajo un solo candado global. Cualquier hilo leyendo frena a un hilo escribiendo. El magistral <code>ConcurrentHashMap</code> aplica <strong>Lock Striping (Bloqueo en Bandas)</strong> arquitectónico.</p>
<p>Divide los Buckets del Array base en "Segmentos". Si un Hilo A inserta un dato en el índice 4, solo bloquea ese índice y los consecuentes por milésimas, permitiendo que un Hilo B modifique simultáneamente el índice 11. Además de esto, <strong>sus operaciones de LECTURA (<code>get</code>) NO TIENEN NINGÚN TIPO DE CANDADO</strong> por utilizar el modificador <code>volatile</code> subyacente de sus Nodos, logrando transferir tasas abismales de lecturas multi-núcleo ilimitadas.</p>
`
    },
    {
        id: 'io-nio', num: '14', title: 'I/O Clásico vs NIO (Network Multiplexing)',
        body: `
<h2>El Bottleneck de java.io (I/O Bloqueante O-I)</h2>
<p>Con las librerías viejas del 1996 de <code>java.io.*</code>, los flujos (Input y Output Streams) están fuertemente acoplados a la manipulación bloqueadora del OS. Cuando llamas a un método <code>inputStream.read()</code> desde un Socket Web, la ejecución del Hilo Java se inyecta en estado <em>WAIT</em> bloqueando brutalmente al Subproceso Sistema hasta que se mueva la aguja por la placa de red y lleguen tramas byte-a-byte desde la IP al otro lado del océano.</p>
<p>Mientras tanto, ese costioso Kernel Thread del servidor (y toda su memoria de contexto ocupada) no sirve para absolutamente nada durante medio segundo. Con conexiones lentas HTTP, podías matar al Servidor Tomcat.</p>

<h2>La Era NIO Submarina: Selectors y Channels</h2>
<p>Java 1.4 introdujo el paquete <code>java.nio</code> (New I/O). Su magia central no recae en usar Bytes sino <strong>Buffers y Channels bidireccionales</strong>. Aún más alucinante en arquitectura, implementa el patrón <strong>Multiplexor (Selector)</strong> basado en eventos (epoll de Linux, kqueue de BSD, u IOCP de Windows).</p>
<p>Un multiplexor es el corazón nativo de C++ sobre el que fueron diseñados NodeJS y NGINX. Un solo Subproceso "Selector" Java es puesto como capataz de vigías en una oficina maestra de hardware, abriendo la asombrosa cantidad de "10,000 conexiones sockets persistentes". El Selector permanece pasivo. Cuando y SOLO CUANDO una trama o ráfaga de red llega mágicamente a un puerto 80 TCP, la placa de red despierta al Selector: "Eh, la conexión 6.452 acaba de mandar los headers de petición post".</p>
<p>El hilo la intercepta, la remite en bloques gigantes (Buffers directos) a un hilo esclavo Worker local para hacer el proceso transaccional.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Zero-Copy Data Transfer nativo de la capa Kernel
// Este es el secreto de Apache Kafka para mover petabytes de archivos directo por red 
// sin tener que instanciar memoria en la Heap Java y volver a la User-Space.

try (FileChannel origen = new FileInputStream("video_terabyte.mp4").getChannel();
     FileChannel destino = new FileOutputStream("video_backupeado.mp4").getChannel()) {
     
    // Exigimos a C++ delegarle las ordenes DMA Controller directamente a Hard Disk a Hard Disk
    // Rendimiento masivo que ignora el ClassLoader. O(1) impacto en JVM Heap.
    origen.transferTo(0, origen.size(), destino); 

}</code></pre></div>
`
    },
    {
        id: 'modern-java', num: '15', title: 'Java Moderno Avanzado (14-21)',
        body: `
<h2>La Filosofía en Diseño Inmutable: Records</h2>
<p>A nivel arquitectónico, <code>record</code> en Java 16+ no es un truco con getters públicos como Project Lombok. Representan de forma estricta un "Tupla Inmutable Portadora de Datos Transparente" en su core.</p>
<p>Es una final class (sellada, no modificable) donde sus propiedades son <code>private final</code> nativas. En serialización (Jackson / GSON), los destructuradores de un Record son brutalmente más veloces y seguros criptográficamente porque la JVM los habilita para esquivar ciertos chequeos opacos históricos del Reflection API estándar. Su uso es mandatorio para entidades DTO's puras sin lógica de negocio sucia ("Anemic Domain Model Data Transfer Objects").</p>

<h2>Seguridad de Modelos Expansivos: Sealed Classes</h2>
<p>La historia de la programación trajo errores críticos por herencias salvajes. Conectándolo a Clean Code, las <strong>Sealed Classes (Java 17)</strong> le dan control autoritario de API restringida a su Arquitecto de Dominios. Si publicas clases sobre roles de tu compañía en un archivo (JAR), podrías sellar el dominio para que NADIE extienda esas clases jamás en otras partes maliciosas de tu código que traten de suplantar tokens de seguridad al inyectar lógicas "Custom".</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Un candado absoluto. Nadie mas en el ecosistema mundial puede implementar AuthStrategy.
public sealed interface AuthStrategy permits BearerJwt, Oauth2, BasicAuth {}

public record BearerJwt(String token) implements AuthStrategy {}
public record Oauth2(String state, String challenge) implements AuthStrategy {}
public record BasicAuth(String user, char[] password) implements AuthStrategy {}
</code></pre></div>

<h2>Pattern Matching como Autómata Finito</h2>
<p>Al conectar Records con Sealed Classes, el compilador del IDE (Switch Expressions de Java 21+) se vuelve milagroso (Exhaustivness Check). Detecta intrincadamente que sólo existen 3 tipos finitos posibles en el Universo para la interfaz <code>AuthStrategy</code>.</p>
<p>Si algún colega de equipo rompe el dominio agregándole un "Token Falso" a la Interfaz, pero olvida implementar la estrategia de cobro o autorización en todos tus archivos Switch Switch de todo tu servidor web empresarial. El programa <strong>frenará rotundamente la compilación en todo punto del globo (COMPILER ERROR)</strong> con el aviso exhaustivo: "Oye, implementaste un cuarto estado cósmico y dejaste huecos ciegos". Erradicamos problemas de "NullPointer" o Polimorfisfo Silencioso, permitiendo el escalado corporativo industrial intachable.</p>
`
    }
];
